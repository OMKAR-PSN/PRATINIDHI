from database import db_execute
import json

try:
    # Check messages table columns
    cols = db_execute("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'messages'", fetchall=True)
    print("Messages columns:", json.dumps(cols, indent=2))
    
    # Check if avatar_sessions exists
    res = db_execute("SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'avatar_sessions')", fetchone=True)
    print("Avatar sessions exists:", res)
    
except Exception as e:
    print("Database check failed:", e)
