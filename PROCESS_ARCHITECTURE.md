# VISCRETE Process Architecture

A reference for the frontend flowchart. Covers the four main stages of the pipeline: Input, Preprocessing, Detection, and Report Generation.

---

## Stage 1 — Input

**Endpoints:** `POST /jobs` → `POST /jobs/{id}/validate` → (optional) `PATCH /jobs/{id}/location`

### Job Creation
- A new job record is created with a UUID and status `created`.
- State is stored in `app/database/jobs/{job_id}/metadata.json`.

### File Upload & Validation (`POST /jobs/{id}/validate`)
Accepts a batch of image(s) and/or a video + optional paired SRT telemetry file.

For each non-SRT file, the pipeline:

1. **Save to disk** — file is saved to `original/` immediately, regardless of outcome.
2. **Blur check** — Laplacian variance is computed.
   - For images: single Laplacian score on the full image.
   - For videos: 10 evenly-spaced frames are sampled and averaged.
   - If score < 10.0 (threshold), the file is marked `invalid`.
3. **GPS extraction** — EXIF GPS tags are parsed from images (videos get GPS from SRT at detection time).
4. **SRT pairing** — if a `.srt` file was uploaded alongside a video, it is paired by filename stem (or auto-paired if there is only one video + one SRT). The SRT is saved alongside the video for use in detection.
5. **File record written** — each file gets a record in `metadata.json` with its `status`, `laplacian_score`, `original_path`, and GPS fields.

**Job status flow:** `created` → `validating` → `validated` (or `failed` if any file is invalid)

### Location Patch (`PATCH /jobs/{id}/location`) — optional
- If images lack EXIF GPS, coordinates can be assigned manually.
- Batch mode: updates all files with missing GPS.
- Targeted mode: updates specific file IDs.

---

## Stage 2 — Preprocessing

**Endpoint:** `POST /jobs/{id}/preprocess`

The pipeline branches on input type. Both paths produce processed files in `processed/` and persist CLAHE parameters to `metadata.json`.

### Image Pipeline (5 steps)

| Step | Name | What happens |
|---|---|---|
| 1 | Feature Extraction | Per image: brightness, contrast, edge density, green ratio, saturation, algae coverage are computed. |
| 2 | Clustering | Feature vectors are normalized and grouped with K-Means (default K=3). One representative image per cluster is selected (closest to centroid). |
| 3 | MOCS Optimization | Multi-Objective Cat Swarm optimization runs on each representative (downscaled to 640px wide for speed). Finds optimal `clip_limit` and `tile_grid_size` for CLAHE, balancing contrast, edge sharpness, and noise. Tile grid is scaled back to full resolution after. |
| 4 | CLAHE Enhancement | Each image is enhanced using its cluster's CLAHE parameters. Applied in the LAB color space on the L channel. |
| 5 | Bilateral Filter | Edge-preserving noise reduction is applied to every CLAHE-enhanced image. |

Processed images are saved to `processed/` and file records updated to `status: preprocessed`.

### Video Pipeline (5 steps)

| Step | Name | What happens |
|---|---|---|
| 1 | Frame Sampling | 10 frames are sampled evenly across the video duration. |
| 2 | Median Frame Construction | A pixel-wise median frame is computed across all 10 samples — produces a representative "average scene" used for parameter tuning. |
| 3 | MOCS Optimization | MOCS runs once on the median frame (same algorithm as images) to find global CLAHE parameters for the entire video. |
| 4 | Frame Processing | Every frame is processed with CLAHE + Bilateral Filter using the globally-tuned parameters. Frames are processed in parallel (thread pool) or via CUDA if available. Scaled to 75% resolution during processing, then upscaled back. |
| 5 | Save Output | Processed video is written to `processed/` as H.264 MP4. CII (Contrast Improvement Index) is computed and stored on the file record. |

**Job status flow:** `validated` → `preprocessing` → `preprocessed`

---

## Stage 3 — Detection

**Endpoint:** `POST /jobs/{id}/detect`

Runs YOLOv11 on all `preprocessed` files. Branches on file type.

### Image Detection

1. Reads the processed image from `processed/`.
2. Attempts GSD (Ground Sample Distance) calibration using a 3-tier system:
   - **Tier 1 — ArUco marker:** If an ArUco marker is detected in the frame, its physical size provides an exact mm/pixel ratio.
   - **Tier 2 — EXIF/SRT metadata:** Altitude + focal length + sensor size from EXIF (images) or SRT telemetry (video) are used to compute GSD.
   - **Tier 3 — Pixel-ratio fallback:** A default estimate based on image dimensions is used. `crack_width_mm` is suppressed in this tier.
3. YOLO inference runs on the image. Returns bounding boxes with class and confidence.
4. For each detection, severity is classified:
   - **Cracks** (`crack`, `hairline_crack`, `structural_crack`): `min(bbox_w, bbox_h) x mm_per_pixel` -> Low < 1.5 mm, Medium 1.5-6 mm, High > 6 mm.
   - **Other defects** (spalling, peeling, algae, stain): `bbox_w x bbox_h` in pixels -> Low < 5,000 px2, Medium 5,000-25,000 px2, High > 25,000 px2.
5. Annotated image (bounding boxes drawn by YOLO) is saved to `annotated/`.
6. Detection records written to `metadata.json`.

### Video Detection

1. Reads the processed video from `processed/`.
2. Loads paired SRT telemetry if available (used for per-frame GPS + altitude).
3. ArUco calibration is attempted once on the first frame; if Tier 1 is found, it is locked for all frames.
4. YOLO streams every frame, writing a fully annotated video to `annotated/`. Frames with detections are collected.
5. For each defect frame, calibration is resolved (Tier 1 lock or per-frame Tier 2/3), severity is classified, and a location is inferred from the bounding box position and SRT telemetry.
6. **Cross-frame deduplication:** Candidates are grouped by defect type and sorted by confidence. A detection is kept only if its bounding box does not overlap (IoU > 0.4) with any already-kept detection of the same class. This eliminates repeated detections of the same physical defect across consecutive frames.
7. Surviving unique defects are grouped by frame. One annotated snapshot (`.jpg`) is saved per frame with detections.
8. Detection records written to `metadata.json` with `frame_index`, `timestamp_sec`, and `annotated_path`.

**Defect classes detected:** `crack`, `hairline_crack`, `structural_crack`, `spalling`, `peeling`, `algae`/`algae_growth`, `stain`/`staining` — normalized into five frontend categories: `cracks`, `peeling`, `algae`, `spalling`, `stain`.

**Job status flow:** `preprocessed` → `detecting` → `detected`

---

## Stage 4 — Report Generation

**Endpoint:** `POST /jobs/{id}/report`

1. All detection records are loaded from `metadata.json`.
2. Every `DefectDetection` across all files is aggregated into a flat list.
3. **Summary computed:**
   - Total defect counts by class (cracks, peeling, algae, spalling, stain).
   - Severity counts (Low / Medium / High).
   - Dominant severity (whichever count is highest).
   - Unique defect types present.
4. GPS coordinates and annotated image paths are collected from file records.
5. **PDF generated** using ReportLab — includes job metadata, defect summary table, severity breakdown, GPS coordinates, and annotated image snapshots.
6. Report record (with `pdf_path`) is written to `metadata.json`.
7. `GET /jobs/{id}/report` returns the same aggregated data reconstructed from `metadata.json` if already generated — no re-inference.

**Job status flow:** `detected` → `reporting` → `completed`

---

## Status Flow Summary

```
created
  └─► validating ──► validated ──► preprocessing ──► preprocessed
                  └─► failed        └─► failed
                                                   └─► detecting ──► detected ──► reporting ──► completed
                                                                 └─► failed                  └─► failed
```

---

## Storage Layout

```
app/database/jobs/{job_id}/
  metadata.json        <- all job state (status, files[], clusters[], detections[], report)
  original/            <- raw uploads (images, videos, SRT files)
  processed/           <- CLAHE + bilateral filter outputs
  annotated/           <- YOLO bounding box overlays (images) + annotated video + frame snapshots
  {job_id}_report.pdf  <- generated PDF report
```

Static files are served at `/static/jobs/{job_id}/...`.
