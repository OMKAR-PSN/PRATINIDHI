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
    print("[TTS] Bhashini TTS module loaded")
except ImportError:
    BHASHINI_AVAILABLE = False
    print("[TTS] Warning: Bhashini module not found, using Edge-TTS only")


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


def text_to_audio(text: str, lang: str, output_path: str = None, gender: str = "male") -> str:
    """
    Convert text to speech. Tries Bhashini first, falls back to Edge-TTS.
    
    Args:
        text: Text to convert
        lang: Language code
        output_path: Optional specific path to save the audio
        gender: Speaker gender
        
    Returns:
        Path to the saved audio file.
    """
    # Normalize language codes from full names to short codes (e.g. "marathi" -> "mr")
    lang = lang.lower().strip()
    from translate import LANGUAGE_MAP
    reverse_map = {v.lower(): k for k, v in LANGUAGE_MAP.items()}
    if lang in reverse_map:
        lang = reverse_map[lang]
        
    # Try Bhashini TTS first
    if BHASHINI_AVAILABLE:
        try:
            # Note: bhashini_tts implementation might not support custom path, 
            # so we'd need to move the file after if output_path is provided.
            filepath = bhashini_tts(text, lang, gender)
            if output_path:
                import shutil
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
                shutil.move(filepath, output_path)
                filepath = output_path
            print(f"[TTS] Bhashini TTS success: {filepath}")
            return filepath
        except Exception as e:
            print(f"[TTS] Warning: Bhashini TTS failed: {e}, falling back to Edge-TTS")

    # Fallback: Edge-TTS
    return asyncio.run(_async_text_to_audio(text=text, lang=lang, output_path=output_path, gender=gender))


async def _async_text_to_audio(text: str, lang: str, output_path: str = None, gender: str = "male") -> str:
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
    
    if output_path:
        filepath = output_path
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
    else:
        os.makedirs("outputs", exist_ok=True)
        filename = f"tts_{uuid.uuid4().hex[:8]}.mp3"
        filepath = os.path.join("outputs", filename)

    import tempfile
    import shutil
    
    # Create a temporary file to write to first
    with tempfile.NamedTemporaryFile(suffix=".mp3", delete=False) as tmp_file:
        temp_path = tmp_file.name
        
    try:
        print(f"[TTS] Saving to temp file: '{temp_path}'")
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(temp_path)
        
        # Now move it to the final destination
        print(f"[TTS] Moving to final filepath: '{filepath}'")
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        shutil.move(temp_path, filepath)
        return filepath
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        raise RuntimeError(f"Edge-TTS failed: {str(e)}")
