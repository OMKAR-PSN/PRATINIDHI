from database import db_execute

queries = [
    # 1. Add columns to messages
    "ALTER TABLE messages ADD COLUMN IF NOT EXISTS avatar_id TEXT",
    "ALTER TABLE messages ADD COLUMN IF NOT EXISTS video_path TEXT",
    "ALTER TABLE messages ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending'",
    
    # 2. Create avatar_sessions
    """
    CREATE TABLE IF NOT EXISTS avatar_sessions (
        id TEXT PRIMARY KEY,
        avatar_id TEXT NOT NULL,
        text_input TEXT NOT NULL,
        language TEXT NOT NULL,
        video_path TEXT,
        content_hash TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """,
    
    # 3. Create qa_sessions
    """
    CREATE TABLE IF NOT EXISTS qa_sessions (
        id TEXT PRIMARY KEY,
        avatar_id TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT,
        language TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """,
    
    # 4. Create consent_logs (for phone-based OTP)
    """
    CREATE TABLE IF NOT EXISTS consent_logs (
        id TEXT PRIMARY KEY,
        phone TEXT NOT NULL,
        otp TEXT NOT NULL,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """
]

for q in queries:
    try:
        db_execute(q, commit=True)
        print(f"✅ Executed: {q[:50]}...")
    except Exception as e:
        print(f"❌ Failed: {q[:50]}... Error: {e}")

print("🚀 Migration complete")
