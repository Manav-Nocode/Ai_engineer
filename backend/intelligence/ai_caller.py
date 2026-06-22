from google import genai
from dotenv import load_dotenv

import os
load_dotenv()
key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=key)

