from database import db_execute
import uuid

leader_id = "aryandalvi0306@gmail.com"
dummy_phone = "8600504551"

print("Inserting test receiver...")
r_id = str(uuid.uuid4())

try:
    db_execute(
        "INSERT INTO leader_receivers (id, leader_id, receiver_name, receiver_phone, receiver_email, language, has_whatsapp) VALUES (%s, %s, %s, %s, %s, %s, %s)",
        params=(r_id, leader_id, "Twilio Test Target", f"+91{dummy_phone}", "aryandalvi0306@gmail.com", "mr", True),
        commit=True
    )
    print("Inserted test receiver successfully!")
except Exception as e:
    print("Failed:")
    print(e)
