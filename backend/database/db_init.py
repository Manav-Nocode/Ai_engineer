from pymongo import MongoClient
from dotenv import load_dotenv
import os
load_dotenv()
def get_database():

    CONNECTION_STRING = os.getenv("MONGO_URL")


    client = MongoClient(CONNECTION_STRING)

    return client['user_shopping_list']


  
db = get_database()

