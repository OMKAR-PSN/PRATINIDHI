from fastapi import APIRouter
from database import db_execute, redis_client
from datetime import datetime

router = APIRouter(prefix="/health", tags=["health"])

@router.get("/ping")
async def ping():
    # Update the health_check table so Neon stays awake
    db_ok = True
    try:
        db_execute("UPDATE health_check SET last_ping = CURRENT_TIMESTAMP WHERE id = 1", commit=True)
    except Exception as e:
        print(f"Health check update failed: {e}")
        db_ok = False
    
    # Check cache
    cache_ok = True
    try:
        redis_client.ping()
    except:
        cache_ok = False
        
    return {
        "status": "alive", 
        "time": datetime.now().isoformat(),
        "database": "connected" if db_ok else "failed",
        "cache": "connected" if cache_ok else "failed"
    }
