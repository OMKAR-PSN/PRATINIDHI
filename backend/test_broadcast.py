import requests

data = {
    "leader_id": "295e4c48-424a-4db2-a06f-329d2f4d4d0b",
    "message": "Pradhan Mantri Ayushman Yojana registration has been started.",
    "language": "en",
    "translated_text": "Pradhan Mantri Ayushman Yojana registration has been started."
}

res = requests.post("http://localhost:8000/api/messages/send", json=data)

if res.ok:
    print("Broadcast triggered successfully!")
    print(res.json())
else:
    print("API Error:", res.text)
