"""
Translation Module
भारत Avatar Platform — India Innovates 2026

Primary: Bhashini NMT (Neural Machine Translation)
Fallback: googletrans
"""

# ─── Bhashini Translation (primary) ────────────────────
try:
    from bhashini import bhashini_translate, detect_language
    BHASHINI_AVAILABLE = True
    print("[TRANSLATE] ✅ Bhashini translation module loaded")
except ImportError:
    BHASHINI_AVAILABLE = False
    print("[TRANSLATE] ⚠️ Bhashini module not found, using googletrans only")


# Language code mapping for Indian languages
LANGUAGE_MAP = {
    "hi": "Hindi",
    "en": "English",
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


def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    """
    Translate text between languages.
    Tries Bhashini NMT first, falls back to googletrans.

    Args:
        text: The text to translate.
        source_lang: Source language code (e.g., 'en').
        target_lang: Target language code (e.g., 'hi').

    Returns:
        Translated text string.
    """
    if source_lang == target_lang:
        return text

    # Try Bhashini first
    if BHASHINI_AVAILABLE:
        try:
            result = bhashini_translate(text, source_lang, target_lang)
            print(f"[TRANSLATE] ✅ Bhashini: {source_lang}→{target_lang}")
            return result
        except Exception as e:
            print(f"[TRANSLATE] ⚠️ Bhashini failed: {e}, falling back to googletrans")

    # Fallback: googletrans
    try:
        from googletrans import Translator
        translator = Translator()
        result = translator.translate(text, src=source_lang, dest=target_lang)
        return result.text
    except Exception as e:
        print(f"[TRANSLATE] ❌ googletrans also failed: {e}")
        return f"[Translation pending - {LANGUAGE_MAP.get(target_lang, target_lang)}] {text}"


def get_supported_languages() -> dict:
    """Return the dictionary of supported language codes and names."""
    return LANGUAGE_MAP


if __name__ == "__main__":
    # Quick test
    test_text = "PM Kisan scheme registration is now open."
    for lang_code in ["hi", "mr", "ta", "bn"]:
        translated = translate_text(test_text, "en", lang_code)
        print(f"{LANGUAGE_MAP[lang_code]}: {translated}")
