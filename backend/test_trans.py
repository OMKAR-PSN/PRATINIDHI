import os
from dotenv import load_dotenv
load_dotenv()

from translate import translate_text

try:
    print("Test with 'hi':", translate_text("Hello world", "hi"))
    print("Test with 'Hindi':", translate_text("Hello world", "Hindi"))
except Exception as e:
    print(f"Error: {e}")
