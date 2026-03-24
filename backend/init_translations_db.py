import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from database import db_execute

def init_tables():
    print("Creating message_translations table...")
    db_execute(
        """
        CREATE TABLE IF NOT EXISTS message_translations (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
          language TEXT NOT NULL,
          translated_text TEXT,
          audio_url TEXT,
          video_url TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(message_id, language)
        );
        """, commit=True
    )
    print("Table message_translations created successfully.")

if __name__ == "__main__":
    init_tables()
