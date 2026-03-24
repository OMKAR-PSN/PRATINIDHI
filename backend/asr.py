import os
import base64
from bhashini_translator import Bhashini

def transcribe_audio_bhashini(audio_path: str, source_language: str = "hi") -> str:
    """
    Transcribes audio using Bhashini ASR.
    """
    if not os.environ.get("userID"):
        os.environ["userID"] = os.getenv("BHASHINI_USER_ID", "")
    if not os.environ.get("ulcaApiKey"):
        os.environ["ulcaApiKey"] = os.getenv("BHASHINI_API_KEY", "")
    if not os.environ.get("DefaultPipeLineId"):
        os.environ["DefaultPipeLineId"] = os.getenv("BHASHINI_PIPELINE_ID", "64392f96daac500b55c543cd")
        
    try:
        b = Bhashini(sourceLanguage=source_language)
        
        with open(audio_path, "rb") as f:
            audio_bytes = f.read()
            
        b64_audio = base64.b64encode(audio_bytes).decode("utf-8")
        
        result = b.asr(b64_audio)
        return result
    except Exception as e:
        print(f"Bhashini ASR error: {e}")
        return ""
