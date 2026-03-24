"""
Translation Module
Uses googletrans for translating government announcements into regional languages.
"""

# from googletrans import Translator

# Language code mapping for Indian languages
LANGUAGE_MAP = {
    "hi": "Hindi",
    "mr": "Marathi",
    "ta": "Tamil",
    "te": "Telugu",
    "or": "Odia",
    "bn": "Bengali",
    "gu": "Gujarati",
    "kn": "Kannada",
    "ml": "Malayalam",
    "pa": "Punjabi",
    "ur": "Urdu",
    "as": "Assamese",
}


def translate_text(text: str, language: str) -> str:
    """
    Translate text to the specified language.

    Args:
        text: The original English text to translate.
        language: Target language code (e.g., 'hi' for Hindi).

    Returns:
        Translated text string.
    """
    try:
        # Reverse map if full name is provided
        language = language.lower()
        for code, name in LANGUAGE_MAP.items():
            if name.lower() == language:
                language = code
                break
                
        import os
        from bhashini_translator import Bhashini
        
        # Ensure credentials are set for the library
        if not os.environ.get("userID"):
            os.environ["userID"] = os.getenv("BHASHINI_USER_ID", "")
        if not os.environ.get("ulcaApiKey"):
            os.environ["ulcaApiKey"] = os.getenv("BHASHINI_API_KEY", "")
        if not os.environ.get("DefaultPipeLineId"):
            os.environ["DefaultPipeLineId"] = os.getenv("BHASHINI_PIPELINE_ID", "64392f96daac500b55c543cd")
            
        b = Bhashini(sourceLanguage="en", targetLanguage=language)
        result = b.translate(text)
        return result
    except Exception as e:
        print(f"Bhashini Translation error: {e}")
        # Secondary Fallback: deep_translator
        try:
            from deep_translator import GoogleTranslator
            return GoogleTranslator(source='auto', target=language).translate(text)
        except Exception as e2:
             print(f"Deep Translator fallback failed: {e2}")
             return f"[Translation pending - {LANGUAGE_MAP.get(language, language)}] {text}"


def get_supported_languages() -> dict:
    """Return the dictionary of supported language codes and names."""
    return LANGUAGE_MAP


if __name__ == "__main__":
    # Quick test
    test_text = "PM Kisan scheme registration is now open."
    for lang_code in ["hi", "mr", "ta", "te"]:
        translated = translate_text(test_text, lang_code)
        print(f"{LANGUAGE_MAP[lang_code]}: {translated}")
