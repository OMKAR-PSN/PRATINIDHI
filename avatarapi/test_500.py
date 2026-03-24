import urllib.request, json, cv2, base64, os, sys
sys.path.insert(0, ".")
from database import db_execute

# 1. Fetch any existing user with a face_image
rows = db_execute("SELECT id, email FROM leaders", fetchall=True)
if not rows:
    print("No users found.")
    exit(1)

leader_id = rows[0]["id"]
print(f"Testing with leader_id: {leader_id}")

face_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "avatars", "faces"))
stored_path = os.path.join(face_dir, f"{leader_id}.jpg")

import numpy as np
dummy_img = np.zeros((200, 200, 3), dtype=np.uint8)
os.makedirs(face_dir, exist_ok=True)
cv2.imwrite(stored_path, dummy_img)
print(f"Created dummy image at {stored_path}")

_, buffer = cv2.imencode('.jpg', dummy_img)
base64_str = base64.b64encode(buffer).decode('utf-8')

payload = json.dumps({
    'leader_id': str(leader_id),
    'face_image': f'data:image/jpeg;base64,{base64_str}'
}).encode()

print("Sending request to trigger backend Consent calculation...")
try:
    req = urllib.request.Request('http://127.0.0.1:8000/api/consent/verify-face', data=payload, headers={'Content-Type':'application/json'})
    res = urllib.request.urlopen(req)
    print("Success. Status 200")
    print(res.read())
except urllib.error.HTTPError as e:
    print(f"FAILED with HTTP {e.code}:")
    print(e.read().decode('utf-8'))
except Exception as e:
    import traceback
    traceback.print_exc()
