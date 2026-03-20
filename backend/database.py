"""
Database connections for Pratinidhi AI.
Connects to Supabase (PostgreSQL) and Redis (OTP/session cache).
Falls back to in-memory storage if Redis is not configured.
"""

import os
from dotenv import load_dotenv

load_dotenv()

# ==================== Supabase ====================
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")

supabase = None
if SUPABASE_URL and "your-project" not in SUPABASE_URL:
    try:
        from supabase import create_client
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase client initialized")
    except Exception as e:
        print(f"⚠️  Supabase init failed ({e}) — using mock mode")
else:
    print("⚠️  Supabase not configured — using mock mode")


# ==================== Redis ====================
REDIS_URL = os.getenv("REDIS_URL", "")

redis_client = None
if REDIS_URL:
    import redis
    redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    print("✅ Redis client initialized")
else:
    print("⚠️  Redis not configured — using in-memory fallback")


class InMemoryCache:
    """Simple dict-based cache that mimics Redis setex/get/delete/ping."""
    def __init__(self):
        self._store = {}

    def setex(self, key, ttl, value):
        self._store[key] = value

    def get(self, key):
        return self._store.get(key)

    def delete(self, key):
        self._store.pop(key, None)

    def ping(self):
        return True


# Use in-memory fallback if Redis is not available
if redis_client is None:
    redis_client = InMemoryCache()


def test_connections():
    """Test all database connections on startup."""
    try:
        redis_client.ping()
        print("✅ Cache connection OK")
    except Exception as e:
        print(f"⚠️  Cache ping failed: {e}")

    if supabase:
        try:
            supabase.table("health_check").select("*").execute()
            print("✅ Supabase connection OK")
        except Exception as e:
            print(f"⚠️  Supabase query failed: {e}")
    
    print("🚀 Database connections checked")
