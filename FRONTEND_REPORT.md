                                                                                                                                                 
  ---                                                                                                                                            
  Report API Contract                                                                                                                            
                                                                                                                                                 
  POST /api/v1/jobs/{job_id}/report                                                                                                              
                                                                                                                                                 
  Generates the PDF. This takes time (image embedding makes it slow for large jobs). The frontend should show a loading state for the full       
  duration of this request.                                                                                                                      
                                                                                                                                                 
  ┌─────────────────┬─────────────────────────────────────────────────────────────┐                                                              
  │    Response     │                           Meaning                           │                                                              
  ├─────────────────┼─────────────────────────────────────────────────────────────┤                                                              
  │ 201 + JSON body │ PDF created. Body includes pdf_path. Show "View It."        │                                                              
  ├─────────────────┼─────────────────────────────────────────────────────────────┤                                                              
  │ 409             │ PDF already exists. Treat same as success — show "View It." │                                                              
  ├─────────────────┼─────────────────────────────────────────────────────────────┤
  │ 5xx             │ Generation failed. Show error.                              │
  └─────────────────┴─────────────────────────────────────────────────────────────┘

  GET /api/v1/jobs/{job_id}/report

  Returns the PDF binary directly (application/pdf). Opening this URL in a new browser tab will display the PDF natively — no download prompt.

  ---
  Recommended Frontend Flow

  User clicks "Generate Report"
          │
          ▼
  Show spinner: "Creating PDF Report..."
  POST /jobs/{id}/report
          │
          ├── 201 ──────────────────────────────────┐
          │                                          ▼
          └── 409 ──────────────────► Show: "PDF Report Already Generated."
                                      Button: "View It →"  (opens new tab)
                                      onClick: window.open(`{BASE_URL}/api/v1/jobs/{id}/report`)

  On page load / job status check — if job status === "completed", show the "View It" button immediately without POSTing.

  ---
  View It — URL to open in new tab

  GET {BASE_URL}/api/v1/jobs/{job_id}/report

  The browser renders the PDF inline in a new tab. No extra logic needed on the frontend.