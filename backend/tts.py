"""
Text-to-Speech Module
Uses gTTS (Google Text-to-Speech) to generate speech audio from translated text.
"""

from gtts import gTTS
import os


def generate_speech(text: str, language: str, output_path: str = None) -> str:
    """
    Generate speech audio from text.

    Args:
        text: The text to convert to speech.
        language: Language code for speech (e.g., 'hi' for Hindi).
        output_path: Optional custom output path. Defaults to output/audio/speech.mp3.

    Returns:
        Path to the generated audio file.
    """
    if output_path is None:
        output_path = os.path.join("..", "output", "audio", "speech.mp3")

    # Ensure output directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    try:
        speech = gTTS(text=text, lang=language, slow=False)
        speech.save(output_path)
        print(f"Speech audio saved to: {output_path}")
        return output_path
    except Exception as e:
        print(f"TTS error: {e}")
        raise RuntimeError(f"Speech generation failed: {str(e)}")


if __name__ == "__main__":
    # Quick test
    test_text = "पीएम किसान योजना पंजीकरण अब खुला है।"
    path = generate_speech(test_text, "hi", "../output/audio/test_speech.mp3")
    print(f"Audio generated at: {path}")
