"""
bhashini.py — Bhashini API Client for Translation & TTS
भारत Avatar Platform — India Innovates 2026

Bhashini is India's national language AI platform (bhashini.gov.in).
This module provides:
  1. bhashini_translate(text, source_lang, target_lang) — NMT translation
  2. bhashini_tts(text, lang, gender) — Text-to-Speech audio generation
"""

import os
import uuid
import base64
import requests
from dotenv import load_dotenv

load_dotenv()

# ─── Auth ───────────────────────────────────────────
BHASHINI_API_KEY = os.getenv("BHASHINI_API_KEY", "")
BHASHINI_UDYAT_KEY = os.getenv("BHASHINI_UDYAT_KEY", "")
BHASHINI_USER_ID = os.getenv("BHASHINI_USER_ID", "")

# ─── Endpoints ──────────────────────────────────────
CONFIG_URL = "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline"
COMPUTE_URL = "https://dhruva-api.bhashini.gov.in/services/inference/pipeline"

# ─── Bhashini Language Code Mapping ─────────────────
# Bhashini uses ISO-639 codes; our platform uses the same short codes.
BHASHINI_LANG_MAP = {
    "hi": "hi",   # Hindi
    "en": "en",   # English
    "mr": "mr",   # Marathi
    "ta": "ta",   # Tamil
    "bn": "bn",   # Bengali
    "te": "te",   # Telugu
    "gu": "gu",   # Gujarati
    "kn": "kn",   # Kannada
    "ml": "ml",   # Malayalam
    "pa": "pa",   # Punjabi
    "or": "or",   # Odia
    "as": "as",   # Assamese
    "ur": "ur",   # Urdu
}


def _get_auth_headers():
    """Return auth headers for Bhashini config API."""
    return {
        "Content-Type": "application/json",
        "ulcaApiKey": BHASHINI_API_KEY,
        "userID": BHASHINI_USER_ID,
    }


def _get_compute_headers():
    """Return auth headers for Bhashini compute/inference API."""
    return {
        "Content-Type": "application/json",
        "Authorization": BHASHINI_API_KEY,
    }


# ═══════════════════════════════════════════════════════
# PIPELINE CONFIG — get serviceId for a task
# ═══════════════════════════════════════════════════════

def _get_pipeline_config(task_type: str, source_lang: str, target_lang: str = None):
    """
    Call Bhashini pipeline config to get serviceId and inference endpoint.
    
    Args:
        task_type: "translation" or "tts"
        source_lang: source language code
        target_lang: target language code (for translation)
    
    Returns:
        dict with 'serviceId', 'modelId', and 'callbackUrl' (inference endpoint)
    """
    if task_type == "translation":
        pipeline_task = {
            "taskType": "translation",
            "config": {
                "language": {
                    "sourceLanguage": source_lang,
                    "targetLanguage": target_lang,
                }
            }
        }
    elif task_type == "tts":
        pipeline_task = {
            "taskType": "tts",
            "config": {
                "language": {
                    "sourceLanguage": source_lang,
                }
            }
        }
    else:
        raise ValueError(f"Unknown task_type: {task_type}")

    payload = {
        "pipelineTasks": [pipeline_task],
        "pipelineRequestConfig": {
            "pipelineId": "64392f96daac500b55c543cd",
        }
    }

    print(f"[BHASHINI] Config request: task={task_type}, src={source_lang}, tgt={target_lang}")
    
    try:
        resp = requests.post(CONFIG_URL, json=payload, headers=_get_auth_headers(), timeout=15)
        if resp.status_code != 200:
            print(f"[BHASHINI] Config error response: {resp.text}")
        resp.raise_for_status()
        data = resp.json()

        # Extract serviceId from pipelineResponseConfig
        pipeline_response = data.get("pipelineResponseConfig", [])
        if not pipeline_response:
            raise RuntimeError("No pipelineResponseConfig returned from Bhashini config API")

        task_config = pipeline_response[0]
        config_list = task_config.get("config", [])
        if not config_list:
            raise RuntimeError("No config entries in pipelineResponseConfig")

        service_id = config_list[0].get("serviceId", "")
        model_id = config_list[0].get("modelId", "")

        # Extract inference callback URL
        inference_api_endpoint = data.get("pipelineInferenceAPIEndPoint", {})
        callback_url = inference_api_endpoint.get("callbackUrl", COMPUTE_URL)
        inference_key = inference_api_endpoint.get("inferenceApiKey", {}).get("value", BHASHINI_API_KEY)

        print(f"[BHASHINI] Got serviceId={service_id}, endpoint={callback_url}")

        return {
            "serviceId": service_id,
            "modelId": model_id,
            "callbackUrl": callback_url,
            "inferenceKey": inference_key,
        }

    except Exception as e:
        print(f"[BHASHINI] Config API error: {e}")
        raise RuntimeError(f"Bhashini config failed: {e}")


# ═══════════════════════════════════════════════════════
# TRANSLATION
# ═══════════════════════════════════════════════════════

def bhashini_translate(text: str, source_lang: str, target_lang: str) -> str:
    """
    Translate text using Bhashini NMT pipeline.
    
    Args:
        text: text to translate
        source_lang: source language code (e.g. 'en', 'hi')
        target_lang: target language code (e.g. 'hi', 'en')
        
    Returns:
        Translated text string
    """
    if source_lang == target_lang:
        return text

    src = BHASHINI_LANG_MAP.get(source_lang, source_lang)
    tgt = BHASHINI_LANG_MAP.get(target_lang, target_lang)

    # Step 1: Get pipeline config
    config = _get_pipeline_config("translation", src, tgt)

    # Step 2: Compute call
    payload = {
        "pipelineTasks": [
            {
                "taskType": "translation",
                "config": {
                    "language": {
                        "sourceLanguage": src,
                        "targetLanguage": tgt,
                    },
                    "serviceId": config["serviceId"],
                }
            }
        ],
        "inputData": {
            "input": [
                {"source": text}
            ]
        }
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": config.get("inferenceKey", BHASHINI_API_KEY),
    }

    try:
        resp = requests.post(config["callbackUrl"], json=payload, headers=headers, timeout=30)
        resp.raise_for_status()
        data = resp.json()

        output = data.get("pipelineResponse", [])
        if output:
            translated = output[0].get("output", [])
            if translated:
                result = translated[0].get("target", text)
                print(f"[BHASHINI] Translation: '{text[:50]}...' → '{result[:50]}...'")
                return result

        return text
    except Exception as e:
        print(f"[BHASHINI] Translation compute error: {e}")
        raise RuntimeError(f"Bhashini translation failed: {e}")


# ═══════════════════════════════════════════════════════
# TEXT-TO-SPEECH
# ═══════════════════════════════════════════════════════

# Gender mapping for Bhashini TTS
BHASHINI_GENDER_MAP = {
    "male": "male",
    "female": "female",
}

def bhashini_tts(text: str, lang: str, gender: str = "male") -> str:
    """
    Generate speech audio using Bhashini TTS pipeline.
    
    Args:
        text: text to convert to speech
        lang: language code (e.g. 'hi', 'mr', 'ta')
        gender: 'male' or 'female'
        
    Returns:
        Path to the saved audio file (.wav)
    """
    src_lang = BHASHINI_LANG_MAP.get(lang, lang)
    bhashini_gender = BHASHINI_GENDER_MAP.get(gender, "male")

    # Step 1: Get pipeline config
    config = _get_pipeline_config("tts", src_lang)

    # Step 2: Compute call
    payload = {
        "pipelineTasks": [
            {
                "taskType": "tts",
                "config": {
                    "language": {
                        "sourceLanguage": src_lang,
                    },
                    "serviceId": config["serviceId"],
                    "gender": bhashini_gender,
                }
            }
        ],
        "inputData": {
            "input": [
                {"source": text}
            ]
        }
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": config.get("inferenceKey", BHASHINI_API_KEY),
    }

    try:
        resp = requests.post(config["callbackUrl"], json=payload, headers=headers, timeout=60)
        resp.raise_for_status()
        data = resp.json()

        output = data.get("pipelineResponse", [])
        if output:
            audio_list = output[0].get("audio", [])
            if audio_list:
                audio_b64 = audio_list[0].get("audioContent", "")
                if audio_b64:
                    # Decode base64 audio
                    audio_bytes = base64.b64decode(audio_b64)

                    os.makedirs("outputs", exist_ok=True)
                    filename = f"bhashini_tts_{uuid.uuid4().hex[:8]}.wav"
                    filepath = os.path.join("outputs", filename)

                    with open(filepath, "wb") as f:
                        f.write(audio_bytes)

                    print(f"[BHASHINI] TTS saved: {filepath} ({len(audio_bytes)} bytes)")
                    return filepath

        raise RuntimeError("Bhashini TTS returned no audio content")

    except requests.exceptions.RequestException as e:
        print(f"[BHASHINI] TTS compute error: {e}")
        raise RuntimeError(f"Bhashini TTS failed: {e}")


# ═══════════════════════════════════════════════════════
# AUTO-DETECT LANGUAGE (simplified heuristic)
# ═══════════════════════════════════════════════════════

def detect_language(text: str) -> str:
    """
    Simple heuristic to detect if text is English or an Indian language.
    Returns 'en' if mostly ASCII, otherwise 'hi' as default.
    """
    ascii_count = sum(1 for c in text if ord(c) < 128)
    ratio = ascii_count / max(len(text), 1)
    if ratio > 0.8:
        return "en"
    return "hi"  # Default to Hindi for Devanagari/non-ASCII


if __name__ == "__main__":
    # Quick self-test
    print("=== Bhashini Translation Test ===")
    try:
        result = bhashini_translate("Hello, how are you?", "en", "hi")
        print(f"EN→HI: {result}")
    except Exception as e:
        print(f"Translation test failed: {e}")

    print("\n=== Bhashini TTS Test ===")
    try:
        path = bhashini_tts("नमस्ते, मैं अर्जुन हूं", "hi", "male")
        print(f"TTS audio saved to: {path}")
    except Exception as e:
        print(f"TTS test failed: {e}")
