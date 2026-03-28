from database import db_execute
import json

cols = db_execute("SELECT id, receiver_phone, receiver_name FROM leader_receivers", fetchall=True)
with open("test_phones.txt", "w") as f:
    for c in cols:
        f.write(f"{c.get('id')} - {c.get('receiver_name')} - {c.get('receiver_phone')}\n")
    print("Dumped to test_phones.txt")
