"""
Database connections for Pratinidhi AI.
Connects to Neon PostgreSQL, MongoDB Atlas, and Redis.
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.pool import SimpleConnectionPool
from motor.motor_asyncio import AsyncIOMotorClient
import redis
from dotenv import load_dotenv

load_dotenv()

# ==================== ENVIRONMENT VARIABLES ====================
DATABASE_URL = os.getenv("DATABASE_URL")
MONGO_URL = os.getenv("MONGO_URL")
REDIS_URL = os.getenv("REDIS_URL")

# ==================== CLIENTS ====================

# Neon PostgreSQL Client
try:
    if DATABASE_URL:
        neon_pool = SimpleConnectionPool(1, 10, DATABASE_URL)
        print("Neon PostgreSQL initialized")
    else:
        neon_pool = None
        print("Warning: Neon PostgreSQL URL not set")
except Exception as e:
    neon_pool = None
    print(f"Warning: Neon PostgreSQL init failed: {e}")

# MongoDB Atlas Client
try:
    if MONGO_URL:
        mongo_client = AsyncIOMotorClient(MONGO_URL)
        mongo_db = mongo_client["avatargov"]
        print("MongoDB Atlas initialized")
    else:
        mongo_client = None
        mongo_db = None
        print("Warning: MongoDB URL not set")
except Exception as e:
    mongo_client = None
    mongo_db = None
    print(f"Warning: MongoDB Atlas init failed: {e}")

# Redis Client
try:
    if REDIS_URL:
        redis_client = redis.from_url(REDIS_URL, decode_responses=True)
        print("Redis initialized")
    else:
        redis_client = None
        print("Warning: Redis URL not set")
except Exception as e:
    redis_client = None
    print(f"Warning: Redis init failed: {e}")


# ==================== NEON (POSTGRES) HELPERS ====================

def db_execute(query: str, params: tuple = None, fetchone=False, fetchall=False, commit=False):
    """
    Helper function to safely execute parameterized SQL queries on Neon PostgreSQL.
    Retries once with a fresh connection if the pool returns a stale/closed connection.
    """
    if not neon_pool:
        raise Exception("Neon Database is not configured")

    import psycopg2

    def _run(conn):
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(query, params)
            result = None
            if fetchone:
                result = cur.fetchone()
            elif fetchall:
                result = cur.fetchall()
            if commit:
                conn.commit()
            return result

    conn = neon_pool.getconn()
    returned = False  # track whether we already put the conn back
    try:
        return _run(conn)
    except (psycopg2.OperationalError, psycopg2.InterfaceError) as e:
        # Stale connection — discard it and get a fresh one
        print(f"[DB] Stale connection detected ({e}), retrying with fresh connection...")
        try:
            neon_pool.putconn(conn, close=True)
            returned = True
        except Exception:
            pass
        conn = neon_pool.getconn()
        returned = False
        try:
            result = _run(conn)
            neon_pool.putconn(conn)
            returned = True
            return result
        except Exception as e2:
            try:
                conn.rollback()
            except Exception:
                pass
            print(f"Database error (retry): {e2}")
            raise
    except Exception as e:
        try:
            conn.rollback()
        except Exception:
            pass
        print(f"Database error: {e}")
        raise
    finally:
        if not returned:
            try:
                neon_pool.putconn(conn)
            except Exception:
                pass

def log_audit(leader_id: str, action: str, metadata: dict = None):
    """
    Every write to Neon must also write a row to audit_logs.
    """
    import json
    metadata_json = json.dumps(metadata) if metadata else None
    query = "INSERT INTO audit_logs (leader_id, action, metadata) VALUES (%s, %s, %s)"
    db_execute(query, (leader_id, action, metadata_json), commit=True)


# ==================== MONGODB HELPERS ====================

async def get_chat_session(session_id: str):
    if not mongo_db:
        return None
    return await mongo_db.chat_sessions.find_one({"session_id": session_id})

async def create_chat_session(session_data: dict):
    if not mongo_db:
        return None
    # session_data should have session_id, citizen_phone, language, leader_id, messages, created_at, updated_at
    result = await mongo_db.chat_sessions.insert_one(session_data)
    return result.inserted_id

async def add_chat_message(session_id: str, message: dict, updated_at):
    if not mongo_db:
        return None
    # message: {"role": "...", "text": "...", "timestamp": "..."}
    result = await mongo_db.chat_sessions.update_one(
        {"session_id": session_id},
        {"$push": {"messages": message}, "$set": {"updated_at": updated_at}}
    )
    return result.modified_count

async def get_scheme_doc(scheme_name: str, language: str):
    if not mongo_db:
        return None
    return await mongo_db.scheme_docs.find_one({"scheme_name": scheme_name, "language": language})

async def get_rag_chunks(scheme_name: str, language: str):
    if not mongo_db:
        return []
    cursor = mongo_db.rag_chunks.find({"scheme_name": scheme_name, "language": language}).sort("chunk_index", 1)
    return await cursor.to_list(length=100)


# ==================== REDIS HELPERS ====================

def set_otp_key(leader_id: str, hashed_otp: str):
    """value: SHA-256 hashed OTP string, TTL: 300 seconds (5 minutes)"""
    if redis_client:
        redis_client.setex(f"otp:{leader_id}", 300, hashed_otp)

def get_otp_key(leader_id: str):
    if redis_client:
        return redis_client.get(f"otp:{leader_id}")
    return None

def delete_otp_key(leader_id: str):
    """deleted immediately after successful verification"""
    if redis_client:
        redis_client.delete(f"otp:{leader_id}")

def set_consent_session(consent_token: str, leader_id: str):
    """value: leader_id string, TTL: 86400 seconds (24 hours)"""
    if redis_client:
        redis_client.setex(f"session:{consent_token}", 86400, leader_id)

def get_consent_session(consent_token: str):
    if redis_client:
        return redis_client.get(f"session:{consent_token}")
    return None

def increment_ratelimit(ip_address: str):
    """value: request count integer, TTL: 3600 seconds (1 hour)"""
    if not redis_client:
        return 0
    key = f"ratelimit:{ip_address}"
    count = redis_client.incr(key)
    if count == 1:
        redis_client.expire(key, 3600)
    return count

def set_job_status(job_id: str, status: str):
    """value: pending / processing / done / failed, TTL: 3600 seconds (1 hour)"""
    if redis_client:
        redis_client.setex(f"job:{job_id}", 3600, status)

def get_job_status(job_id: str):
    if redis_client:
        return redis_client.get(f"job:{job_id}")
    return None

def ping_redis():
    if redis_client:
        return redis_client.ping()
    return False

# ==================== STARTUP TESTS ====================

def test_connections():
    """Test all database connections on startup."""
    print("Testing DB connections...")
    
    # 1. Neon Test
    if neon_pool:
        try:
            res = db_execute("SELECT 1 as is_alive", fetchone=True)
            if res and res['is_alive'] == 1:
                print("Neon PostgreSQL connection OK")
            else:
                print("Warning: Neon PostgreSQL connection returned unexpected result")
        except Exception as e:
            print(f"Warning: Neon PostgreSQL connection failed: {e}")
            
    # 2. Redis Test
    if redis_client:
        try:
            if ping_redis():
                print("Redis connection OK")
        except Exception as e:
            print(f"Warning: Redis connection failed: {e}")
            
    # 4. Schema Sync
    try:
        db_execute("""
            CREATE TABLE IF NOT EXISTS citizen_devices (
                device_token TEXT PRIMARY KEY,
                state TEXT,
                pincode TEXT,
                language TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """, commit=True)
        print("✅ citizen_devices table verified")
    except Exception as e:
        print(f"⚠️  Database schema sync failed: {e}")

    print("Database connection check complete")
