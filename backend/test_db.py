from database import db_execute
import json

cols = db_execute("SELECT id, message_id, receiver_id, whatsapp_status, sms_status, error_reason FROM message_recipients ORDER BY id DESC LIMIT 4", fetchall=True)
with open("test_db.txt", "w", encoding="utf-8") as f:
    for c in cols:
        f.write(f"MSG_ID: {c.get('message_id')} - REC: {c.get('receiver_id')} - WA: {c.get('whatsapp_status')} - SMS: {c.get('sms_status')} - ERR: {c.get('error_reason')}\n")
    print("Dumped to test_db.txt")
