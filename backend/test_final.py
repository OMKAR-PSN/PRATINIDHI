import requests

BASE_URL = "http://localhost:8000/api"

def test_preview_endpoint():
    print("Testing /preview/translate...")
    try:
        payload = {"text": "Hello world", "language": "hi"}
        print(f"  URL: {BASE_URL}/preview/translate")
        res = requests.post(f"{BASE_URL}/preview/translate", json=payload, timeout=10)
        print(f"  Status: {res.status_code}")
        if res.status_code == 200:
            print("  Preview success!")
            print(f"  Result: {res.json()}")
        else:
            print(f"  Preview failed: {res.text}")
    except Exception as e:
        print(f"Error testing preview: {e}")

def test_broadcast_logic():
    # Since I don't want to actually send SMS/WhatsApp to real people, 
    # I'll just check if the endpoint is reachable and returns the expected error for invalid leader.
    print("\nTesting /messages/send (invalid leader check)...")
    try:
        preview_data = {
            "text": "Registration for medical waste management is now open.",
            "language": "hi"
        }
        
        broadcast_data = {
            "leader_id": "00000000-0000-0000-0000-000000000000",
            "message": "Registration for medical waste management is now open.",
            "translated_text": "चिकित्सा अपशिष्ट प्रबंधन के लिए पंजीकरण अब खुला है।",
            "language": "hi"
        }
        res = requests.post(f"{BASE_URL}/messages/send", json=broadcast_data)
        # Should return 400 or 401
        print(f"Status: {res.status_code}")
        print(res.json())
    except Exception as e:
        print(f"Error testing broadcast: {e}")

if __name__ == "__main__":
    test_preview_endpoint()
    test_broadcast_logic()
