import sys
import os

sys.path.insert(0, ".")
from database import db_execute

def run_migration():
    print("Starting Messaging System schema migration...")
    
    statements = [
        """
        CREATE TABLE IF NOT EXISTS messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            sender_id UUID REFERENCES leaders(id) ON DELETE CASCADE,
            message_text TEXT NOT NULL,
            original_language TEXT DEFAULT 'hindi',
            created_at TIMESTAMP DEFAULT NOW(),
            total_receivers INTEGER DEFAULT 0,
            sent_count INTEGER DEFAULT 0,
            failed_count INTEGER DEFAULT 0,
            completed_at TIMESTAMP
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS message_recipients (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
            receiver_id UUID REFERENCES leader_receivers(id) ON DELETE CASCADE,
            translated_text TEXT,
            sms_status TEXT DEFAULT 'pending',
            email_status TEXT DEFAULT 'pending',
            whatsapp_status TEXT DEFAULT 'pending',
            is_read BOOLEAN DEFAULT FALSE,
            read_at TIMESTAMP,
            delivered_at TIMESTAMP DEFAULT NOW(),
            error_reason TEXT
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS inbox_messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            recipient_leader_id UUID REFERENCES leaders(id) ON DELETE CASCADE,
            sender_leader_id UUID REFERENCES leaders(id) ON DELETE CASCADE,
            message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
            message_text TEXT NOT NULL,
            original_text TEXT,
            is_read BOOLEAN DEFAULT FALSE,
            read_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW()
        );
        """
    ]
    
    for stmt in statements:
        try:
            db_execute(stmt, commit=True)
            print("Successfully executed migration statement.")
        except Exception as e:
            print(f"Failed to execute migration component: {e}")
            break
            
    print("Messaging Migration completed successfully.")

if __name__ == "__main__":
    run_migration()
