# Frontend Prompt & API Guidelines — Live Preprocessing Progress Stepper + Terminal

---

## Purpose

This document is the complete handoff for the frontend developer to implement the
live progress stepper and real-time terminal log for the VISCRETE preprocessing pipeline.

1. The API contract (endpoints, message shapes, lifecycle)
2. A ready-to-use frontend prompt to build both components

---

## API Endpoint Reference

### 1. Trigger the Pipeline

```
POST /api/v1/jobs/{job_id}/preprocess
```

| Detail | Value |
|---|---|
| Method | `POST` |
| Auth | None |
| Body | None |
| Success response | `202 Accepted` |
| Response body | `{ "job_id": "...", "status": "preprocessing", "message": "..." }` |
| Error — job not found | `404` |
| Error — wrong status | `409` (job must be in `validated` state first) |

Call this **after** the WebSocket connection is open (inside `ws.onopen`).
Do not call it before connecting — you will miss early step events and log lines.

---

### 2. WebSocket Progress + Log Stream

```
WS /api/v1/jobs/{job_id}/preprocess/ws
```

| Detail | Value |
|---|---|
| Protocol | WebSocket (`ws://` local, `wss://` production) |
| Auth | None |
| Direction | Server → Client only (send-only stream) |
| Close code `4004` | Job not found |

**Connection lifecycle:**

```
Client connects
  └─► Server sends pipeline_init immediately (step names + pipeline_type)
  └─► Server replays any buffered events (if pipeline already started)
  └─► Client sends POST /preprocess (inside ws.onopen)
  └─► Server streams step_start / step_done / step_progress / log / error
  └─► Server sends completed → closes connection
      └─► Client fetches GET /jobs/{id} for full results
```

---

### 3. Fetch Full Results

```
GET /api/v1/jobs/{job_id}
```

| Detail | Value |
|---|---|
| Method | `GET` |
| When to call | After receiving the `completed` WebSocket event |
| Returns | Full job metadata including `preprocessing_result` |

The WebSocket `completed` event is intentionally minimal — it only signals that
the pipeline finished. All result data (CII scores, cluster info, step durations)
lives in the job metadata and must be fetched via this endpoint.

---

## WebSocket Message Reference

All messages are JSON. All have a `timestamp` field (ISO-8601 UTC).

### `pipeline_init`

Sent **immediately on connect**, before any step fires.
Use this to initialize the stepper UI with all steps in `"pending"` state.

```json
{
  "type": "pipeline_init",
  "pipeline_type": "image",
  "steps": [
    { "step": 1, "name": "Feature Extraction" },
    { "step": 2, "name": "Clustering" },
    { "step": 3, "name": "IMOCS Optimization" },
    { "step": 4, "name": "CLAHE Enhancement" },
    { "step": 5, "name": "Bilateral Filter" }
  ],
  "timestamp": "2026-04-17T10:00:00Z"
}
```

Video variant uses different step names:

```json
{
  "type": "pipeline_init",
  "pipeline_type": "video",
  "steps": [
    { "step": 1, "name": "Frame Sampling" },
    { "step": 2, "name": "Median Frame Construction" },
    { "step": 3, "name": "IMOCS Optimization" },
    { "step": 4, "name": "Frame Processing" },
    { "step": 5, "name": "Save Output" }
  ],
  "timestamp": "2026-04-17T10:00:00Z"
}
```

---

### `step_start`

A pipeline step has begun. Set that step to `"in_progress"`.
Also append a line to the terminal (`▶ {name} started`).

```json
{
  "type": "step_start",
  "step": 1,
  "name": "Feature Extraction",
  "timestamp": "2026-04-17T10:00:01Z"
}
```

---

### `step_done`

A pipeline step has finished. Set that step to `"completed"` and display duration + detail.
Also append a line to the terminal (`✓ {name} completed in {duration_sec}s — {detail}`).

```json
{
  "type": "step_done",
  "step": 1,
  "name": "Feature Extraction",
  "duration_sec": 0.34,
  "detail": "3 images analyzed",
  "timestamp": "2026-04-17T10:00:01Z"
}
```

---

### `step_progress`

**Video jobs only. Step 4 ("Frame Processing") only.**
Emitted for every completed frame. Use this to drive a progress bar inside step 4.
Do NOT write to the terminal — this fires per-frame and would flood the log.

```json
{
  "type": "step_progress",
  "step": 4,
  "name": "Frame Processing",
  "percent": 42,
  "detail": "42/100 frames",
  "timestamp": "2026-04-17T10:00:05Z"
}
```

---

### `log`

Real-time pipeline internal message. Write to the terminal display.
Includes `step` and `name` so the terminal can show which step emitted the line.
`step` and `name` may be `null` for pre/post-pipeline messages.

```json
{
  "type":      "log",
  "level":     "info",
  "step":      3,
  "name":      "IMOCS Optimization",
  "message":   "Cluster 0: clip_limit=2.4, tile_grid=[8,8], time=1.2s",
  "timestamp": "2026-04-17T10:00:02Z"
}
```

**Log levels and terminal colors:**

| Level | Terminal color | Meaning |
|---|---|---|
| `info` | White / default | Normal progress message |
| `warning` | Yellow | Non-fatal issue — pipeline continues |
| `error` | Red | Fatal error — always paired with an `error` event |

**Terminal line format:**
```
[HH:MM:SS] [STEP N] message text here
[HH:MM:SS] [PIPELINE] message with no step context
```

Example terminal output:
```
[10:00:01] [PIPELINE] Loading 3 image file record(s) for job
[10:00:01] [PIPELINE] Read 3/3 image(s) from disk
[10:00:01] [STEP 1  ] ▶ Feature Extraction started
[10:00:01] [STEP 1  ] Extracting features from 3 image(s)
[10:00:01] [STEP 1  ] Avg brightness=128.40, contrast=0.31, edge_density=0.042
[10:00:01] [STEP 1  ] ✓ Feature Extraction completed in 0.34s — 3 images analyzed
[10:00:01] [STEP 2  ] ▶ Clustering started
[10:00:01] [STEP 2  ] Clustering 3 images into 3 cluster(s)
[10:00:02] [STEP 2  ] Cluster 0: 1 member(s), representative index 0
[10:00:02] [STEP 2  ] Cluster 1: 1 member(s), representative index 1
[10:00:02] [STEP 2  ] Cluster 2: 1 member(s), representative index 2
[10:00:02] [STEP 2  ] ✓ Clustering completed in 0.12s — grouped into 3 cluster(s)
[10:00:02] [STEP 3  ] ▶ IMOCS Optimization started
[10:00:02] [STEP 3  ] Cluster 0: clip_limit=2.40, tile_grid=[8,8], time=1.20s
[10:00:03] [STEP 3  ] Cluster 1: clip_limit=3.10, tile_grid=[8,8], time=1.18s
[10:00:04] [STEP 3  ] Cluster 2: clip_limit=1.80, tile_grid=[8,8], time=1.22s
[10:00:04] [STEP 3  ] 3 CLAHE config(s) optimized
[10:00:04] [STEP 3  ] ✓ IMOCS Optimization completed in 3.60s — 3 config(s) optimized
...
[10:00:09] [PIPELINE] Saving 3 processed image(s) to disk
[10:00:09] [PIPELINE] Saved: abc123.jpg
[10:00:09] [PIPELINE] Saved: def456.jpg
[10:00:09] [PIPELINE] Saved: ghi789.jpg
```

---

### `error`

A step error occurred. `fatal: true` means the pipeline has aborted.
Write a red line to the terminal. Also mark the step as `"failed"` in the stepper.

```json
{
  "type":    "error",
  "step":    3,
  "name":    "IMOCS Optimization",
  "message": "IMOCS failed: numpy broadcast error",
  "fatal":   true,
  "timestamp": "2026-04-17T10:00:03Z"
}
```

---

### `completed`

Pipeline finished successfully. Server closes the WebSocket after sending this.
Follow up with `GET /api/v1/jobs/{job_id}` to load full result data.

```json
{
  "type":            "completed",
  "status":          "preprocessed",
  "pipeline_type":   "image",
  "total_processed": 3,
  "duration_sec":    8.2,
  "timestamp":       "2026-04-17T10:00:09Z"
}
```

---

## Step State Machine

Each step has exactly four states. Transitions are driven by WS events.

```
            ws open
               │
               ▼
           [pending]  ← all steps start here (from pipeline_init)
               │
        step_start
               │
               ▼
         [in_progress] ── step_progress ──► update % bar (video step 4 only)
               │
         step_done ──────────────────────► [completed]
               │
           error (fatal) ────────────────► [failed]
```

| State | WS event that sets it | Stepper display | Terminal |
|---|---|---|---|
| `pending` | `pipeline_init` | Greyed out, dot | — |
| `in_progress` | `step_start` | Spinner | `▶ {name} started` |
| `completed` | `step_done` | Checkmark + duration + detail | `✓ {name} completed in Xs` |
| `failed` | `error` with `fatal: true` | Error icon + message | `✗ {message}` in red |

---

## `GET /api/v1/jobs/{job_id}` — Results Payload Shape

After the `completed` WS event, fetch this endpoint. The relevant fields under
`preprocessing_result` are:

```json
{
  "job_id": "...",
  "status": "preprocessed",
  "preprocessing_result": {
    "pipeline_type": "image",
    "total_processed": 3,
    "pipeline_steps": [
      {
        "step": 1,
        "name": "Feature Extraction",
        "status": "completed",
        "duration_sec": 0.34,
        "detail": "3 images analyzed"
      }
    ],
    "cluster_info": [
      {
        "cluster_id": 0,
        "representative_file_id": "...",
        "member_count": 2,
        "clahe_params": { "clip_limit": 2.4, "tile_grid_size": [8, 8], "source": "imocs" }
      }
    ],
    "cii_scores": [
      {
        "file_id": "...",
        "cii_score": 18.4,
        "original_contrast": 0.31,
        "processed_contrast": 0.37
      }
    ]
  }
}
```

---

## Frontend Prompt

Use this prompt directly with your frontend AI tool or share it with a developer.

---

> You are building a **live preprocessing progress stepper with a real-time terminal log**
> for a concrete inspection web app (VISCRETE). The backend runs a 5-step image/video
> preprocessing pipeline and streams real-time progress and internal logs via WebSocket.
>
> ---
>
> ### What to build
>
> Two components rendered together:
>
> **1. `PreprocessingStepper`** — a 5-step progress stepper above the terminal.
> **2. `PreprocessingTerminal`** — a terminal-style log display below the stepper.
>
> Both are driven by the same WebSocket connection. The stepper shows high-level
> step state; the terminal shows low-level pipeline internals as they happen.
>
> ---
>
> ### Props
>
> ```ts
> interface PreprocessingPanelProps {
>   jobId:      string;           // UUID of the job to process
>   baseUrl:    string;           // e.g. "http://localhost:8000"
>   onComplete: (result: JobResult) => void;
>   onError:    (message: string) => void;
> }
> ```
>
> ---
>
> ### Step state shape
>
> ```ts
> type StepStatus = "pending" | "in_progress" | "completed" | "failed";
>
> interface StepState {
>   step:         number;        // 1–5
>   name:         string;        // e.g. "Feature Extraction"
>   status:       StepStatus;
>   duration_sec: number | null;
>   detail:       string | null;
>   progress:     number | null; // 0–100, only used for video step 4
>   error:        string | null;
> }
> ```
>
> ---
>
> ### Terminal line shape
>
> ```ts
> type LogLevel = "info" | "warning" | "error";
>
> interface TerminalLine {
>   timestamp: string;   // HH:MM:SS
>   step:      number | null;
>   name:      string | null;
>   level:     LogLevel;
>   message:   string;
> }
> ```
>
> Terminal line format: `[HH:MM:SS] [STEP N] message`
> When step is null: `[HH:MM:SS] [PIPELINE] message`
>
> ---
>
> ### WebSocket connection rules
>
> - Base URL for WS: replace `http://` with `ws://`, `https://` with `wss://`
> - Endpoint: `{wsBase}/api/v1/jobs/{jobId}/preprocess/ws`
> - Connect first, POST to trigger pipeline inside `onopen`
>
> Handle each event type:
>
> | Event | Stepper action | Terminal action |
> |---|---|---|
> | `pipeline_init` | Init all steps as `"pending"` from `event.steps` | Print `[PIPELINE] Pipeline ready ({pipeline_type})` |
> | `step_start` | Set step → `"in_progress"` (spinner) | Print `▶ {name} started` |
> | `step_done` | Set step → `"completed"` (checkmark + duration + detail) | Print `✓ {name} completed in {duration_sec}s — {detail}` |
> | `step_progress` | Update step 4 progress bar with `event.percent` | **Do not print** (too frequent for video) |
> | `log` | No stepper change | Print `{event.message}` colored by `event.level` |
> | `error` (fatal) | Set step → `"failed"`, show error message | Print `✗ {event.message}` in red, close WS |
> | `error` (non-fatal) | No stepper change | Print `⚠ {event.message}` in yellow |
> | `completed` | Mark all done, show summary card | Print `Pipeline complete in {duration_sec}s` |
>
> ---
>
> ### Terminal display requirements
>
> - Dark background terminal aesthetic (black or near-black)
> - Monospace font
> - Color by log level: `info` = white, `warning` = yellow (`#FACC15`), `error` = red (`#F87171`)
> - Step transitions (`step_start`, `step_done`) are written as terminal lines too
>   (synthesized by the frontend, not from `log` events — see table above)
> - Max 500 lines — drop oldest lines when exceeded
> - Auto-scroll to bottom on every new line
> - "Copy logs" button — copies all lines as plain text
> - "Clear" button — clears terminal display (does not stop the pipeline)
> - Collapsible — can be hidden/shown without losing log history
> - Show line count badge when collapsed: e.g. `Logs (42)`
>
> ---
>
> ### Stepper display requirements
>
> - Vertical or horizontal stepper — 5 steps, numbered
> - Each step shows: step number, name, status indicator (spinner / checkmark / X / dot)
> - Completed step shows: duration in seconds (e.g. `0.34s`) and detail string below name
> - In-progress step shows: animated spinner
> - Video step 4 in-progress: also show a progress bar with `percent`% and `detail` label
> - Failed step shows: error icon and error message
> - Pending steps: greyed out
> - Disable the "Start Preprocessing" button while any step is `in_progress`
> - Show a final summary card after `completed`: total processed, pipeline type, total duration
>
> ---
>
> ### Polling fallback
>
> If WS fails or closes before `completed` is received, poll
> `GET /api/v1/jobs/{jobId}` every 3 seconds. When `job.status === "preprocessed"`,
> stop polling and call `onComplete`. When `status === "failed"`, stop and call `onError`.
> Append a terminal line: `[PIPELINE] WebSocket unavailable — switched to polling`.
>
> ---
>
> ### Triggering the pipeline
>
> ```ts
> // Inside ws.onopen:
> const res = await fetch(`${baseUrl}/api/v1/jobs/${jobId}/preprocess`, { method: "POST" });
> if (res.status === 409) {
>   onError("Job is not ready for preprocessing.");
>   ws.close();
> }
> ```
>
> ---
>
> ### Fetching full results after completion
>
> ```ts
> // After receiving the "completed" WS event:
> const response = await fetch(`${baseUrl}/api/v1/jobs/${jobId}`);
> const job      = await response.json();
> const result   = job.preprocessing_result;
> // result has: pipeline_steps[], cluster_info[], cii_scores[], pipeline_type, total_processed
> onComplete(result);
> ```
>
> ---
>
> ### Step names by pipeline type
>
> Do NOT hardcode step names. Use `event.steps` from `pipeline_init` to populate the stepper.
>
> **Image:** Feature Extraction → Clustering → IMOCS Optimization → CLAHE Enhancement → Bilateral Filter
>
> **Video:** Frame Sampling → Median Frame Construction → IMOCS Optimization → Frame Processing → Save Output
>
> ---
>
> ### Error states to handle
>
> | Scenario | Stepper | Terminal |
> |---|---|---|
> | `409` on POST | Show "Job not ready" message | Print `[PIPELINE] Error: job not ready for preprocessing` |
> | `error` + `fatal: true` | Mark step as failed, stop | Print `✗ {message}` in red |
> | `error` + `fatal: false` | No change | Print `⚠ {message}` in yellow |
> | WS closes unexpectedly | Silently switch to polling | Print `[PIPELINE] WebSocket unavailable — switched to polling` |
> | `GET /jobs/{id}` fails after `completed` | Show "Pipeline done, results unavailable" | Print `[PIPELINE] Warning: could not load result data` |
>
> ---
>
> ### Technology
>
> Use React with hooks (`useState`, `useEffect`, `useRef`). Style with Tailwind CSS or
> your project's existing component library. Do not use any WebSocket libraries —
> the native browser `WebSocket` API is sufficient. Use `useRef` for the terminal scroll
> container and call `scrollIntoView` on every new line append.

---

## Connection Sequence (Visual)

```
Frontend                              Backend
   │                                    │
   │── WS connect ─────────────────────►│
   │◄─ { type: "pipeline_init" } ────────│  stepper: 5 pending steps
   │                                    │  terminal: [PIPELINE] Pipeline ready (image)
   │── POST /preprocess ───────────────►│  202 — pipeline starts
   │                                    │
   │◄─ { type: "log", step:null, ... } ──│  terminal: [PIPELINE] Loading 3 image file record(s)
   │◄─ { type: "log", step:null, ... } ──│  terminal: [PIPELINE] Read 3/3 image(s) from disk
   │                                    │
   │◄─ { type: "step_start", step:1 } ───│  stepper: step 1 → spinner
   │                                    │  terminal: [STEP 1] ▶ Feature Extraction started
   │◄─ { type: "log", step:1, ... } ─────│  terminal: [STEP 1] Extracting features from 3 image(s)
   │◄─ { type: "log", step:1, ... } ─────│  terminal: [STEP 1] Avg brightness=128.40, ...
   │◄─ { type: "step_done", step:1 } ────│  stepper: step 1 → ✓ 0.34s
   │                                    │  terminal: [STEP 1] ✓ Feature Extraction completed in 0.34s
   │                                    │
   │◄─ { type: "step_start", step:2 } ───│  stepper: step 2 → spinner
   │◄─ { type: "log", step:2, ... } ─────│  terminal: [STEP 2] Clustering 3 images into 3 cluster(s)
   │◄─ { type: "log", step:2, ... } ─────│  terminal: [STEP 2] Cluster 0: 1 member(s), ...
   │◄─ { type: "step_done", step:2 } ────│  stepper: step 2 → ✓
   │                                    │
   │◄─ { type: "step_start", step:3 } ───│  stepper: step 3 → spinner
   │◄─ { type: "log", step:3, ... } ─────│  terminal: [STEP 3] Cluster 0: clip_limit=2.40, ...
   │◄─ { type: "log", step:3, ... } ─────│  terminal: [STEP 3] Cluster 1: clip_limit=3.10, ...
   │◄─ { type: "step_done", step:3 } ────│  stepper: step 3 → ✓
   │                                    │
   │◄─ { type: "step_start", step:4 } ───│  stepper: step 4 → spinner
   │◄─ { type: "log", step:4, ... } ─────│  terminal: [STEP 4] Applying CLAHE to 3 image(s)
   │◄─ { type: "step_done", step:4 } ────│  stepper: step 4 → ✓
   │◄─ { type: "step_start", step:5 } ───│  stepper: step 5 → spinner
   │◄─ { type: "step_done", step:5 } ────│  stepper: step 5 → ✓
   │                                    │
   │◄─ { type: "log", step:null, ... } ──│  terminal: [PIPELINE] Saving 3 processed image(s)
   │◄─ { type: "log", step:null, ... } ──│  terminal: [PIPELINE] Saved: abc123.jpg
   │◄─ { type: "completed" } ────────────│  stepper: all done → summary card
   │                                    │  terminal: [PIPELINE] Pipeline complete in 8.2s
   │── GET /jobs/{id} ─────────────────►│
   │◄─ { preprocessing_result: {...} } ──│  render results panel
```

---

## Quick Reference

| What you need | Source |
|---|---|
| Step names and count | `pipeline_init.steps[]` |
| Pipeline type (image/video) | `pipeline_init.pipeline_type` |
| When to show spinner | `step_start` event |
| When to show checkmark | `step_done` event |
| Step duration label | `step_done.duration_sec` |
| Step detail text | `step_done.detail` |
| Video frame % bar | `step_progress.percent` (step 4 only) |
| Terminal line text | `log.message` |
| Terminal line color | `log.level` → `info`=white, `warning`=yellow, `error`=red |
| Terminal step prefix | `log.step` (null = `[PIPELINE]`, 1–5 = `[STEP N]`) |
| Step transition lines in terminal | Synthesized by frontend from `step_start` / `step_done` |
| Do NOT print to terminal | `step_progress` (too frequent) |
| CII scores, cluster info | `GET /jobs/{id}` after `completed` |
| Job failed | `error.fatal === true` |
| WS server base URL | Replace `http` → `ws`, `https` → `wss` |
