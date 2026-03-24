"""
tts.py — Text-to-Speech Integration
भारत Avatar Platform — India Innovates 2026

Primary: Bhashini TTS (regional Indian languages)
Fallback: Edge-TTS (Microsoft Azure neural voices)
"""

import os
import uuid
import asyncio
import edge_tts

# ─── Bhashini TTS (primary) ────────────────────────────
try:
    from bhashini import bhashini_tts
    BHASHINI_AVAILABLE = True
    print("[TTS] ✅ Bhashini TTS module loaded")
except ImportError:
    BHASHINI_AVAILABLE = False
    print("[TTS] ⚠️ Bhashini module not found, using Edge-TTS only")


# ─── Edge-TTS Voice Map (fallback) ─────────────────────
VOICE_MAP = {
    "hi": {
        "male": "hi-IN-MadhurNeural",
        "female": "hi-IN-SwaraNeural",
    },
    "mr": {
        "male": "mr-IN-ManoharNeural",
        "female": "mr-IN-AarohiNeural",
    },
    "ta": {
        "male": "ta-IN-ValluvarNeural",
        "female": "ta-IN-PallaviNeural",
    },
    "bn": {
        "male": "bn-IN-BashkarNeural",
        "female": "bn-IN-TanishaaNeural",
    },
    "or": {
        "male": "or-IN-AiyanaNeural",
        "female": "or-IN-AiyanaNeural",
    },
    "pa": {
        "male": "pa-IN-AanadNeural",
        "female": "pa-IN-AanadNeural",
    },
    "en": {
        "male": "en-IN-PrabhatNeural",
        "female": "en-IN-NeerjaNeural",
    }
}


def text_to_audio(text: str, lang: str, gender: str = "male") -> str:
    """
    Convert text to speech. Tries Bhashini first, falls back to Edge-TTS.
    
    Returns:
        Path to the saved audio file.
    """
    # Try Bhashini TTS first
    if BHASHINI_AVAILABLE:
        try:
            filepath = bhashini_tts(text, lang, gender)
            print(f"[TTS] ✅ Bhashini TTS success: {filepath}")
            return filepath
        except Exception as e:
            print(f"[TTS] ⚠️ Bhashini TTS failed: {e}, falling back to Edge-TTS")

    # Fallback: Edge-TTS
    return asyncio.run(_async_text_to_audio(text, lang, gender))


async def _async_text_to_audio(text: str, lang: str, gender: str) -> str:
    """
    Convert text to speech using edge-tts asynchronously (fallback).
    
    Args:
        text: The text to convert to speech.
        lang: Language short code (hi, mr, ta, bn).
        gender: Speaker gender (male/female).
        
    Returns:
        Path to the saved .mp3 file.
    """
    lang_voices = VOICE_MAP.get(lang, VOICE_MAP["hi"])
    voice = lang_voices.get(gender, lang_voices["male"])
    print(f"[TTS] Edge-TTS: lang='{lang}', gender='{gender}' → '{voice}'")
    
    os.makedirs("outputs", exist_ok=True)
    filename = f"tts_{uuid.uuid4().hex[:8]}.mp3"
    filepath = os.path.join("outputs", filename)

    try:
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(filepath)
        return filepath
    except Exception as e:
        raise RuntimeError(f"Edge-TTS failed: {str(e)}")
