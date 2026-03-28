from database import db_execute

try:
    cols = db_execute("SELECT id, message_id, receiver_id, whatsapp_status, sms_status, error_reason FROM message_recipients ORDER BY id DESC LIMIT 5", fetchall=True)
    with open("error_dump_msg_ids.txt", "w", encoding="utf-8") as f:
        for c in cols:
            f.write(f"MSG_ID: {c.get('message_id')} - REC: {c.get('receiver_id')} - WA: {c.get('whatsapp_status')} - SMS: {c.get('sms_status')} - ERR: {c.get('error_reason')}\n")
    print("Dumped to error_dump_msg_ids.txt")
except Exception as e:
    print(e)
