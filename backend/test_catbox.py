"""Test catbox.moe upload with a real TTS audio file"""
import os, sys
sys.path.insert(0, os.path.dirname(__file__))

from tts import text_to_audio
import requests

# Generate a real Marathi audio file
print("Generating TTS audio...")
audio_path = text_to_audio("प्रधान मंत्री आयुष्मान योजना नोंदणी सुरू झाली आहे.", "mr", output_path="outputs/test_catbox.mp3")
print(f"TTS saved: {audio_path}")

# Upload to catbox.moe
print("Uploading to catbox.moe...")
with open(audio_path, "rb") as f:
    r = requests.post(
        "https://catbox.moe/user/api.php",
        data={"reqtype": "fileupload"},
        files={"fileToUpload": ("test.mp3", f, "audio/mpeg")},
        timeout=20
    )

print(f"Status: {r.status_code}")
print(f"Response: {r.text}")
if r.ok and r.text.startswith("https://"):
    print("✅ SUCCESS! Public URL:", r.text.strip())
else:
    print("❌ Upload failed")
