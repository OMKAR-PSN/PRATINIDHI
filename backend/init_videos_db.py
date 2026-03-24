import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from database import db_execute

def init_tables():
    print("Creating avatar_videos table...")
    db_execute(
        """
        CREATE TABLE IF NOT EXISTS avatar_videos (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          leader_id UUID REFERENCES leaders(id) ON DELETE CASCADE,
          title TEXT,
          original_language TEXT DEFAULT 'hindi',
          target_language TEXT,
          cloudinary_url TEXT NOT NULL,
          cloudinary_public_id TEXT,
          thumbnail_url TEXT,
          duration_seconds INTEGER,
          file_size_mb FLOAT,
          resolution TEXT DEFAULT '240p',
          video_type TEXT DEFAULT 'avatar',
          is_public BOOLEAN DEFAULT FALSE,
          consent_token TEXT REFERENCES consent_records(consent_token) ON DELETE SET NULL,
          video_hash TEXT,
          signed_token TEXT,
          view_count INTEGER DEFAULT 0,
          status TEXT DEFAULT 'active',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """, commit=True
    )
    
    print("Creating video_views table...")
    db_execute(
        """
        CREATE TABLE IF NOT EXISTS video_views (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          video_id UUID REFERENCES avatar_videos(id) ON DELETE CASCADE,
          viewer_type TEXT,
          viewer_id TEXT,
          viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          device TEXT
        );
        """, commit=True
    )
    print("Tables created successfully.")

if __name__ == "__main__":
    init_tables()
