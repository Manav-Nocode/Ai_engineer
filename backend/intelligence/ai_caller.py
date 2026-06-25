import os

from app.config import settings
from dotenv import load_dotenv
from google import genai

load_dotenv()
key = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=key)
