# VISCRETE — Frontend

Concrete defect detection frontend for the VISCRETE thesis demo. Built with **Next.js 16 App Router**, **Tailwind CSS v4**, and **shadcn/ui**.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + shadcn/ui (New York, neutral)
- **Icons**: lucide-react
- **Themes**: next-themes (dark / light / system)
- **Language**: TypeScript

## Getting Started

```bash
npm install
npm run dev       # dev server at http://localhost:3000
npm run build     # production build
npm run lint      # ESLint
```

Set `NEXT_PUBLIC_API_URL` to point at the backend (defaults to `http://localhost:8000`).

## Page Flow

Each inspection is a **job** identified by a UUID (`job_id`) carried in the URL.

```
/                         Landing page
/upload                   Create job → upload files → validation results
/preprocess/[job_id]      CLAHE preprocessing pipeline (before/after images)
/detect/[job_id]          YOLOv11 inference results + annotated images
/report/[job_id]          Structured PDF inspection report
```

| Job Status | Resumes at |
|---|---|
| `created` / `validating` / `validated` / `failed` | `/upload` |
| `preprocessing` / `preprocessed` | `/preprocess/[job_id]` |
| `detecting` / `detected` | `/detect/[job_id]` |
| `reporting` / `completed` | `/report/[job_id]` |

## Project Structure

```
app/                  Next.js App Router pages
  page.tsx            Landing
  upload/             Job creation + file upload + validation
  preprocess/[job_id] Preprocessing pipeline view
  detect/[job_id]     Detection results (alias: results/[job_id])
  report/[job_id]     Report generation + PDF viewer
components/           Page-level and UI components
  ui/                 shadcn/ui primitives
lib/
  api.ts              All backend API calls (base: NEXT_PUBLIC_API_URL)
  utils.ts            cn() helper
config/site.ts        Site-wide metadata
```

## API

All backend calls go through `lib/api.ts`. Swagger docs available at `{API_BASE_URL}/docs`.

Key endpoints:

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/jobs` | Create job |
| `GET` | `/api/v1/jobs` | List all jobs |
| `GET` | `/api/v1/jobs/{job_id}` | Job status + per-file list |
| `DELETE` | `/api/v1/jobs/{job_id}` | Delete job |
| `POST` | `/api/v1/jobs/{job_id}/validate` | Upload + validate files |
| `PATCH` | `/api/v1/jobs/{job_id}/location` | Assign GPS to files |
| `PATCH` | `/api/v1/jobs/{job_id}/files/{file_id}/override` | Accept blurry file |
| `PUT` | `/api/v1/jobs/{job_id}/files/{file_id}` | Replace a file |
| `POST` | `/api/v1/jobs/{job_id}/preprocess` | Run preprocessing |
| `POST` | `/api/v1/jobs/{job_id}/detect` | Run YOLOv11 detection |
| `GET` | `/api/v1/jobs/{job_id}/detect` | Get cached detections |
| `POST` | `/api/v1/jobs/{job_id}/report` | Generate PDF report |
| `GET` | `/api/v1/jobs/{job_id}/report` | Get cached report |
