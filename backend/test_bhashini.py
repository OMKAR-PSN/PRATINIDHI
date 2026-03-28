import requests
import json
import os
from dotenv import load_dotenv

load_dotenv()

BHASHINI_API_KEY = os.getenv("BHASHINI_API_KEY", "")
BHASHINI_USER_ID = os.getenv("BHASHINI_USER_ID", "")
CONFIG_URL = "https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline"

payload = {
    "pipelineTasks": [
        {
            "taskType": "translation",
            "config": {
                "language": {
                    "sourceLanguage": "en",
                    "targetLanguage": "mr"
                }
            }
        }
    ],
    "pipelineRequestConfig": {
        "pipelineId": "64392f96daac500b55c543cd"
    }
}

print(f"Key: {BHASHINI_API_KEY[:5]}... User: {BHASHINI_USER_ID}")
res = requests.post(CONFIG_URL, json=payload, headers={
    "Content-Type": "application/json",
    "ulcaApiKey": BHASHINI_API_KEY,
    "userID": BHASHINI_USER_ID
})

print(res.status_code)
print(res.text)
