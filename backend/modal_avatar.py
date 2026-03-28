import modal
import os
import uuid
import asyncio
import subprocess
import nest_asyncio

nest_asyncio.apply()

app = modal.App("pratinidhi-avatar")

image = (
    modal.Image.debian_slim(python_version="3.10")
    .apt_install([
        "git",
        "wget",
        "ffmpeg",
        "libsm6",
        "libxext6",
        "libgl1-mesa-glx"
    ])
    .pip_install([
        "torch==2.0.1",
        "torchvision==0.15.2",
        "torchaudio==2.0.2",
        "flask",
        "flask-cors",
        "fastapi",
        "pydantic",
        "edge-tts",
        "opencv-python-headless",
        "librosa==0.9.2",
        "numpy==1.23.5",
        "face-alignment==1.3.5",
        "gdown",
        "requests",
        "nest-asyncio"
    ])
    .run_commands([
        "git clone https://github.com/Rudrabha/Wav2Lip.git /root/Wav2Lip",
        "mkdir -p /root/Wav2Lip/checkpoints",
        'wget -q "https://github.com/justinjohn0306/Wav2Lip/releases/download/models/wav2lip_gan.pth" -O /root/Wav2Lip/checkpoints/wav2lip_gan.pth',
        "mkdir -p /root/Wav2Lip/face_detection/detection/sfd",
        'wget -q "https://www.adrianbulat.com/downloads/python-fan/s3fd-619a316812.pth" -O /root/Wav2Lip/face_detection/detection/sfd/s3fd.pth',
        "mkdir -p /root/avatars"
    ])
    .add_local_dir("./avatars", remote_path="/root/avatars")
)



AVATAR_GENDER = {
    "arjun": "male",
    "priya": "female",
    "murugan": "male",
    "asha": "female"
}

VOICE_MAP = {
    ("hi", "male"):   "hi-IN-MadhurNeural",
    ("hi", "female"): "hi-IN-SwaraNeural",
    ("mr", "male"):   "mr-IN-ManoharNeural",
    ("mr", "female"): "mr-IN-AarohiNeural",
    ("ta", "male"):   "ta-IN-ValluvarNeural",
    ("ta", "female"): "ta-IN-PallaviNeural",
    ("bn", "male"):   "bn-IN-BashkarNeural",
    ("bn", "female"): "bn-IN-TanishaaNeural",
    ("te", "male"):   "te-IN-MohanNeural",
    ("te", "female"): "te-IN-ShrutiNeural",
    ("kn", "male"):   "kn-IN-GaganNeural",
    ("kn", "female"): "kn-IN-SapnaNeural",
    ("en", "male"):   "en-IN-PrabhatNeural",
    ("en", "female"): "en-IN-NeerjaNeural",
    ("gu", "male"):   "gu-IN-NiranjanNeural",
    ("gu", "female"): "gu-IN-DhwaniNeural",
    ("pa", "male"):   "pa-IN-OjaswanthNeural",
    ("pa", "female"): "pa-IN-VaaniNeural",
}

@app.function(
    image=image,
    gpu="T4",
    timeout=300
)
@modal.fastapi_endpoint(method="GET")
async def health():
    return {
        "status": "ok",
        "avatars": list(AVATAR_GENDER.keys()),
        "model": "wav2lip_gan"
    }

@app.function(
    image=image,
    gpu="T4",
    timeout=300
)
@modal.fastapi_endpoint(method="POST")
async def generate(item: dict):
    import edge_tts
    import base64

    text = item.get("text", "")
    avatar = item.get("avatar", "arjun").lower()
    language = item.get("language", "hi")
    voice_override = item.get("voice", "")

    if not text:
        return {"error": "text is required"}

    if avatar not in AVATAR_GENDER:
        return {"error": f"Avatar must be one of: {list(AVATAR_GENDER.keys())}"}

    gender = AVATAR_GENDER[avatar]
    image_path = f"/root/avatars/{avatar}.png"

    if not os.path.exists(image_path):
        return {"error": f"Avatar image not found: {image_path}"}

    # Select voice based on language and gender
    voice = voice_override if voice_override else VOICE_MAP.get(
        (language, gender),
        "hi-IN-MadhurNeural"
    )

    # Generate TTS audio
    audio_path = f"/tmp/{uuid.uuid4().hex[:8]}.wav"
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(audio_path)

    # Run Wav2Lip
    output_path = f"/tmp/{uuid.uuid4().hex[:8]}.mp4"
    result = subprocess.run([
        "python", "inference.py",
        "--checkpoint_path", "checkpoints/wav2lip_gan.pth",
        "--face", image_path,
        "--audio", audio_path,
        "--outfile", output_path,
        "--nosmooth"
    ], capture_output=True, text=True, cwd="/root/Wav2Lip")

    if result.returncode != 0:
        return {"error": result.stderr[-500:]}

    if not os.path.exists(output_path):
        return {"error": "Video not generated"}

    # Return as base64
    with open(output_path, "rb") as f:
        video_data = base64.b64encode(f.read()).decode()

    os.remove(audio_path)
    os.remove(output_path)

    return {
        "status": "ok",
        "video_base64": video_data,
        "avatar": avatar,
        "language": language,
        "voice": voice
    }