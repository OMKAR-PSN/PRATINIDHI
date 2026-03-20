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
        from googletrans import Translator
        translator = Translator()
        result = translator.translate(text, dest=language)
        return result.text
    except Exception as e:
        print(f"Translation error: {e}")
        # Fallback: return original text with a note
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
