import os
import requests
from dotenv import load_dotenv

load_dotenv()

BHASHINI_UDYAT_KEY = os.getenv("BHASHINI_UDYAT_KEY", "")
BHASHINI_USER_ID = os.getenv("BHASHINI_USER_ID", "")

CONFIG_URL = "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline"

payload = {
    "pipelineTasks": [{
        "taskType": "translation",
        "config": {
            "language": {
                "sourceLanguage": "en",
                "targetLanguage": "hi",
            }
        }
    }],
    "pipelineRequestConfig": {
        "pipelineId": "64392f96daac500b55c543cd",
    }
}

headers = {
    "Content-Type": "application/json",
    "ulcaApiKey": os.getenv("BHASHINI_API_KEY", ""),
    "userID": BHASHINI_USER_ID,
}

resp = requests.post(CONFIG_URL, json=payload, headers=headers)
with open("bhashini_debug.txt", "w", encoding="utf-8") as f:
    f.write(f"Status: {resp.status_code}\n")
    f.write(f"Response: {resp.text}\n")
