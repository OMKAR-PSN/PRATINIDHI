import requests

data = {
    "leader_id": "295e4c48-424a-4db2-a06f-329d2f4d4d0b",
    "receiver_name": "Twilio Test Target",
    "receiver_phone": "+918600504551",
    "receiver_email": "aryandalvi0306@gmail.com",
    "language": "mr",
    "state": "MH",
    "district": "Pune",
    "type": "citizen",
    "has_whatsapp": True,
    "is_app_user": False
}

res = requests.post("http://localhost:8000/api/receivers/", json=data)
if res.ok:
    print("Successfully added receiver via API:", res.json())
else:
    print("API Error:", res.text)
