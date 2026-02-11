from fastapi import APIRouter, HTTPException, Query, Response
from pathlib import Path
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Jobs storage path
JOBS_PATH = Path("storage/jobs")

@router.get("/get_image")
async def fetch_image(job_id: str = Query(..., description="Job ID to process"), image_name: str = Query(..., description="Name of the image to fetch")):
    image_path = JOBS_PATH / f"Project_{job_id}" / "original" / image_name
    if not image_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    
    image_bytes: bytes = image_path.read_bytes()
    return Response(content=image_bytes, media_type="image/jpeg")