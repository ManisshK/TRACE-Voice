import os
from dotenv import load_dotenv

# Explicitly load .env
load_dotenv()

def get_api_key() -> str:
    api_key = os.getenv("VAKYAGUARD_API_KEY")
    if not api_key:
        raise RuntimeError(
            "VAKYAGUARD_API_KEY is not set. Check backend/.env"
        )
    return api_key
