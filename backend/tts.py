"""
Text-to-Speech Module
Uses edge-tts to generate high-quality speech audio from translated text.
"""

import asyncio
import edge_tts
import os

# Voice map for Indian languages
VOICE_MAP = {
    "hi": "hi-IN-SwaraNeural",
    "mr": "hi-IN-SwaraNeural", # Fallback to Hindi if Marathi neural isn't available/stable
    "ta": "ta-IN-PallaviNeural",
    "te": "te-IN-ShrutiNeural",
    "ml": "ml-IN-SobhanaNeural",
    "kn": "kn-IN-SapnaNeural",
    "gu": "gu-IN-DhwaniNeural",
    "bn": "bn-IN-TanishaaNeural",
    "as": "bn-IN-TanishaaNeural", # Fallback for Assamese
    "en": "en-IN-NeerjaNeural",
}

def generate_speech(text: str, language: str, output_path: str = None) -> str:
    """
    Generate speech audio from text. 
    Uses Bhashini as primary for high-quality Indian accents, 
    with edge-tts as a robust fallback.
    """
    if output_path is None:
        output_path = os.path.join("..", "output", "audio", "speech.mp3")

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Normalize language code if it's a full name
    language = language.lower()
    from translate import LANGUAGE_MAP
    for code, name in LANGUAGE_MAP.items():
        if name.lower() == language:
            language = code
            break

    # 1. Try Bhashini
    try:
        from bhashini_translator import Bhashini
        import base64
        
        # Ensure credentials
        if not os.environ.get("userID"):
            os.environ["userID"] = os.getenv("BHASHINI_USER_ID", "")
        if not os.environ.get("ulcaApiKey"):
            os.environ["ulcaApiKey"] = os.getenv("BHASHINI_API_KEY", "")
        if not os.environ.get("DefaultPipeLineId"):
            os.environ["DefaultPipeLineId"] = os.getenv("BHASHINI_PIPELINE_ID", "64392f96daac500b55c543cd")
            
        b = Bhashini(sourceLanguage=language) # Bhashini TTS uses sourceLanguage for the voice
        audio_content = b.tts(text)
        
        with open(output_path, "wb") as f:
            f.write(base64.b64decode(audio_content))
            
        print(f"Bhashini Speech audio saved to: {output_path}")
        return output_path
        
    except Exception as e:
        print(f"Bhashini TTS error: {e}. Falling back to edge-tts...")
        
        # 2. Fallback to Edge-TTS
        voice = VOICE_MAP.get(language, "hi-IN-SwaraNeural")

        async def _save_edge():
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(output_path)

        try:
            asyncio.run(_save_edge())
            print(f"Edge-TTS audio saved to: {output_path}")
            return output_path
        except Exception as e2:
            print(f"Edge-TTS error: {e2}")
            # Final Fallback for Marathi if not in map or failing
            if language == "mr" and voice != "hi-IN-SwaraNeural":
                 return generate_speech(text, "hi", output_path)
            raise RuntimeError(f"Speech generation failed: {str(e2)}")


if __name__ == "__main__":
    # Quick test
    test_text = "पंजीकरण शुरू हो गया है"
    path = generate_speech(test_text, "hi", "../output/audio/test_speech.mp3")
    print(f"Audio generated at: {path}")
