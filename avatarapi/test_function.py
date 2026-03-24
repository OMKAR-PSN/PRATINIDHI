import sys, os, asyncio, base64, cv2, numpy as np
sys.path.insert(0, ".")
from database import db_execute
from routes.consent import verify_face, FaceVerifyRequest

async def main():
    rows = db_execute("SELECT id FROM leaders", fetchall=True)
    if not rows:
        return
    leader_id = rows[0]["id"]
    
    face_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "avatars", "faces"))
    stored_path = os.path.join(face_dir, f"{leader_id}.jpg")
    
    dummy_img = np.zeros((200, 200, 3), dtype=np.uint8)
    os.makedirs(face_dir, exist_ok=True)
    cv2.imwrite(stored_path, dummy_img)
    
    _, buffer = cv2.imencode('.jpg', dummy_img)
    base64_str = base64.b64encode(buffer).decode('utf-8')
    req = FaceVerifyRequest(leader_id=str(leader_id), face_image=f'data:image/jpeg;base64,{base64_str}')
    
    try:
        res = await verify_face(req)
        with open("error.txt", "w", encoding="utf-8") as f:
            f.write("Success")
    except Exception as e:
        import traceback
        with open("error.txt", "w", encoding="utf-8") as f:
            f.write("EXCEPTION:\n")
            f.write(traceback.format_exc())

if __name__ == "__main__":
    asyncio.run(main())
