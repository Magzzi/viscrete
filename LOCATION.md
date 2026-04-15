Implement location updating with three modes: batch, select-toggle, and single-image edit, using PATCH /jobs/{job_id}/location with LocationUpdateRequest (latitude?, longitude?, altitude?, location_label?, file_ids?). If the user does not provide GPS coordinates, they can enter a generic text location (e.g. “Basement 1 near the corner of the house”) via the location_label field instead. Batch and select-toggle modes apply updates to multiple images via file_ids, while single mode allows clicking an image marked “no location” to open a popup card for editing and updating its location individually.

> **Note:** The backend distinguishes modes by the presence of `file_ids`:
> - **Batch** — omit `file_ids` entirely; the backend automatically updates all files that have no location (no GPS and no label).
> - **Select-toggle** — pass the chosen `file_ids` array; only those files are updated.
> - **Single** — same as select-toggle but with one file ID: `file_ids: [“<id>”]`.
>
> Do not send all file IDs explicitly for batch mode — use the omit path so the backend handles the filtering.
>
> **Location input rules (validated server-side):**
> - Provide GPS (`latitude` + `longitude`) **or** `location_label` — at least one is required.
> - `latitude` and `longitude` must always be sent together (not one without the other).
> - `altitude` and `location_label` are always optional.
> - The UI should offer two input modes: a GPS coordinate form and a free-text label field; only one needs to be filled.
>
> **Eligibility — only files without GPS should be actionable:**
> - Only show location update access for files where `gps_data.latitude` and `gps_data.longitude` are both `null` in the validation response.
> - Files that already have GPS from EXIF extraction should be displayed as read-only with their coordinates — no edit affordance.
> - The batch apply button should be disabled entirely if all files already have GPS data.