from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import os
import uuid
import cloudinary
import cloudinary.uploader
from database import db_execute

router = APIRouter()

@router.post("/videos/upload")
async def upload_video(
    video: UploadFile = File(...),
    title: str = Form(...),
    original_language: str = Form(default="hindi"),
    target_language: str = Form(default="hindi"),
    video_type: str = Form(default="avatar"),
    is_public: bool = Form(default=False),
    leader_id: str = Form(...)
):
    if not video.content_type.startswith("video/"):
        raise HTTPException(400, "File must be a video")

    # Save temporarily
    file_ext = os.path.splitext(video.filename)[1] or ".mp4"
    temp_filename = f"temp_{uuid.uuid4().hex}{file_ext}"
    temp_filepath = os.path.join("..", "output", "videos", temp_filename)
    os.makedirs(os.path.dirname(temp_filepath), exist_ok=True)
    
    try:
        with open(temp_filepath, "wb") as f:
            f.write(await video.read())
            
        # fileSizeMb from temp file
        file_size_mb = os.path.getsize(temp_filepath) / (1024 * 1024)
        
        # Upload to Cloudinary with eager transformation to 240p
        res = cloudinary.uploader.upload(
            temp_filepath,
            resource_type="video",
            folder="pratinidhi/avatars/original",
            eager=[
                {"width": 426, "height": 240, "crop": "scale", "format": "mp4"}
            ]
        )
        
        # Original URL
        cloudinary_url = res.get("secure_url")
        cloudinary_public_id = res.get("public_id")
        duration = int(res.get("duration", 0))
        
        # The 240p eager URL
        compressed_url = cloudinary_url
        if "eager" in res and len(res["eager"]) > 0:
            compressed_url = res["eager"][0].get("secure_url")
            
        # Thumbnail is just the jpg extension of the original video URL
        thumbnail_url = cloudinary_url.rsplit(".", 1)[0] + ".jpg"
        
        # Insert to DB
        new_video = db_execute(
            """
            INSERT INTO avatar_videos 
            (leader_id, title, original_language, target_language, cloudinary_url, 
            cloudinary_public_id, thumbnail_url, duration_seconds, file_size_mb, 
            resolution, video_type, is_public) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id
            """,
            (leader_id, title, original_language, target_language, compressed_url,
             cloudinary_public_id, thumbnail_url, duration, file_size_mb, 
             "240p", video_type, is_public),
            fetchone=True,
            commit=True
        )
        
        return {
            "success": True, 
            "video_id": new_video["id"],
            "url": compressed_url,
            "thumbnail": thumbnail_url
        }
    finally:
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)

@router.get("/videos/my-videos")
async def get_my_videos(leader_id: str):
    videos = db_execute(
        "SELECT * FROM avatar_videos WHERE leader_id = %s AND status = 'active' ORDER BY created_at DESC", 
        (leader_id,), fetchall=True
    )
    return {"videos": videos or []}

@router.get("/videos/public")
async def get_public_videos():
    videos = db_execute(
        "SELECT * FROM avatar_videos WHERE is_public = TRUE AND status = 'active' ORDER BY created_at DESC", 
        fetchall=True
    )
    return {"videos": videos or []}

@router.get("/videos/{video_id}")
async def get_video(video_id: str, viewer_type: str = "citizen", viewer_id: str = "anonymous"):
    # Log the view
    db_execute(
        "INSERT INTO video_views (video_id, viewer_type, viewer_id) VALUES (%s, %s, %s)",
        (video_id, viewer_type, viewer_id), commit=True
    )
    # Increment view count
    db_execute("UPDATE avatar_videos SET view_count = view_count + 1 WHERE id = %s", (video_id,), commit=True)
    
    video = db_execute("SELECT * FROM avatar_videos WHERE id = %s AND status = 'active'", (video_id,), fetchone=True)
    if not video:
        raise HTTPException(404, "Video not found")
        
    return video

@router.get("/videos/admin/all")
async def get_all_videos(leader_id: str):
    # Quick check if leader is admin
    leader = db_execute("SELECT role FROM leaders WHERE id = %s", (leader_id,), fetchone=True)
    if not leader or leader["role"] != "admin":
        raise HTTPException(403, "Admin access required")
        
    videos = db_execute("SELECT * FROM avatar_videos ORDER BY created_at DESC", fetchall=True)
    return {"videos": videos or []}

@router.delete("/videos/{video_id}")
async def delete_video(video_id: str, leader_id: str):
    video = db_execute("SELECT * FROM avatar_videos WHERE id = %s", (video_id,), fetchone=True)
    if not video:
        raise HTTPException(404, "Video not found")
        
    leader = db_execute("SELECT role FROM leaders WHERE id = %s", (leader_id,), fetchone=True)
    if not leader:
        raise HTTPException(403, "Unauthorized")
        
    if video["leader_id"] != leader_id and leader["role"] != "admin":
        raise HTTPException(403, "Cannot delete someone else's video")
        
    # Delete from cloudinary
    if video.get("cloudinary_public_id"):
        cloudinary.uploader.destroy(video["cloudinary_public_id"], resource_type="video")
        
    db_execute("UPDATE avatar_videos SET status = 'deleted' WHERE id = %s", (video_id,), commit=True)
    return {"success": True}

@router.patch("/videos/{video_id}/toggle-public")
async def toggle_public(video_id: str, leader_id: str, is_public: bool):
    video = db_execute("SELECT leader_id FROM avatar_videos WHERE id = %s", (video_id,), fetchone=True)
    if not video:
        raise HTTPException(404, "Video not found")
        
    if str(video["leader_id"]) != leader_id:
        raise HTTPException(403, "You can only toggle your own videos")
        
    db_execute("UPDATE avatar_videos SET is_public = %s WHERE id = %s", (is_public, video_id), commit=True)
    return {"success": True, "is_public": is_public}

@router.get("/videos/{video_id}/analytics")
async def get_video_analytics(video_id: str, leader_id: str):
    video = db_execute("SELECT leader_id, view_count FROM avatar_videos WHERE id = %s", (video_id,), fetchone=True)
    if not video:
        raise HTTPException(404, "Video not found")
        
    leader = db_execute("SELECT role FROM leaders WHERE id = %s", (leader_id,), fetchone=True)
    if str(video["leader_id"]) != leader_id and (not leader or leader["role"] != "admin"):
        raise HTTPException(403, "Unauthorized")
        
    views = db_execute("SELECT viewer_type, COUNT(*) as count FROM video_views WHERE video_id = %s GROUP BY viewer_type", (video_id,), fetchall=True)
    return {
        "total_views": video["view_count"],
        "breakdown": views or []
    }
