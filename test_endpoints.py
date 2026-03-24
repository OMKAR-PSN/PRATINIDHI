import requests

print("====================================")
print("Testing Ollama Q&A Endpoint...")
try:
    res = requests.post("http://localhost:8000/ask_text/arjun", data={"question": "What is PM Kisan?"})
    print("Status:", res.status_code)
    if res.status_code == 200:
        print("Response:", res.json()["answer"])
    else:
        print("Error details:", res.text)
except Exception as e:
    print("Q&A Error:", e)

print("\n====================================")
print("Testing TTS Audio Preview Endpoint...")
try:
    res = requests.post(
        "http://localhost:8000/admin/preview_audio", 
        data={"avatar_id": "arjun", "text": "नमस्ते, मैं आपका डिजिटल सहायक अर्जुन हूँ।"}
    )
    print("Status:", res.status_code)
    if res.status_code == 200:
        print("Success! Audio generated successfully. Bytes received:", len(res.content))
    else:
        print("TTS Error:", res.text)
except Exception as e:
    print("TTS Error:", e)
print("====================================")
