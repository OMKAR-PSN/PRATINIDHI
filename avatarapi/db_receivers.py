import sys
import os

sys.path.insert(0, ".")
from database import db_execute

def run_migration():
    print("Starting Leader Receivers schema migration...")
    
    # Enable pgcrypto locally if not exists to support gen_random_uuid
    db_execute("CREATE EXTENSION IF NOT EXISTS pgcrypto;", commit=True)
    
    statements = [
        """
        CREATE TABLE IF NOT EXISTS leader_receivers (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            leader_id UUID REFERENCES leaders(id) ON DELETE CASCADE,
            receiver_name TEXT NOT NULL,
            receiver_phone TEXT,
            receiver_email TEXT,
            receiver_type TEXT DEFAULT 'citizen',
            language TEXT DEFAULT 'hindi',
            state TEXT,
            district TEXT,
            has_whatsapp BOOLEAN DEFAULT false,
            is_app_user BOOLEAN DEFAULT false,
            app_user_id UUID REFERENCES leaders(id),
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE (leader_id, receiver_phone)
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS leader_sent_messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            sender_leader_id UUID REFERENCES leaders(id) ON DELETE CASCADE,
            message_text TEXT NOT NULL,
            language TEXT DEFAULT 'hindi',
            total_receivers INTEGER DEFAULT 0,
            sent_count INTEGER DEFAULT 0,
            failed_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT NOW(),
            completed_at TIMESTAMP
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS message_delivery_logs (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            message_id UUID REFERENCES leader_sent_messages(id) ON DELETE CASCADE,
            receiver_id UUID REFERENCES leader_receivers(id) ON DELETE CASCADE,
            translated_message TEXT,
            sms_status TEXT DEFAULT 'pending',
            email_status TEXT DEFAULT 'pending',
            whatsapp_status TEXT DEFAULT 'pending',
            app_notification TEXT DEFAULT 'pending',
            error_reason TEXT,
            delivered_at TIMESTAMP DEFAULT NOW()
        );
        """,
        """
        CREATE TABLE IF NOT EXISTS app_notifications (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            receiver_leader_id UUID REFERENCES leaders(id) ON DELETE CASCADE,
            sender_leader_id UUID REFERENCES leaders(id) ON DELETE CASCADE,
            message_text TEXT NOT NULL,
            translated_text TEXT,
            is_read BOOLEAN DEFAULT false,
            read_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT NOW()
        );
        """
    ]
    
    for stmt in statements:
        try:
            db_execute(stmt, commit=True)
            print("Successfully executed statement.")
        except Exception as e:
            print(f"Failed to execute migration component: {e}")
            break
            
    print("Migration completed successfully.")

if __name__ == "__main__":
    run_migration()
