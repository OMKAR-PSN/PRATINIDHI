from fastapi import APIRouter
from database import supabase, redis_client
from datetime import datetime

router = APIRouter()

@router.get("/ping")
async def ping():
    # Update the health_check table so Supabase stays awake
    if supabase:
        try:
            supabase.table("health_check").update({
                "last_ping": datetime.now().isoformat()
            }).eq("id", 1).execute()
        except:
            pass # ignore if table isn't created yet
    
    # Check cache
    cache_ok = True
    try:
        redis_client.ping()
    except:
        cache_ok = False
        
    return {
        "status": "alive", 
        "time": datetime.now().isoformat(),
        "database": "connected" if supabase else "mocked",
        "cache": "connected" if cache_ok else "failed"
    }
