from pymongo import MongoClient
from dotenv import load_dotenv
import os
load_dotenv()
def get_database():

    CONNECTION_STRING = os.getenv("MONGO_URL")

    client = MongoClient(CONNECTION_STRING)

    return client['ai_swe']


  
db = get_database()

