from pymongo import MongoClient
from dotenv import load_dotenv
import os
load_dotenv()
def get_database():

    CONNECTION_STRING = os.getenv("MONGO_URL")


    client = MongoClient(CONNECTION_STRING)

    return client['user_shopping_list']

if __name__ == "__main__":   
  
   dbname = get_database()

#to create a collect in mongodb and push some harddata
collection_name = dbname["user_1_items"]
item_1 = {
  "_id" : "U1IT00001",
  "item_name" : "Blender",
  "max_discount" : "10%",
  "batch_number" : "RR450020FRG",
  "price" : 340,
  "category" : "kitchen appliance"
}

item_2 = {
  "_id" : "U1IT00002",
  "item_name" : "Egg",
  "category" : "food",
  "quantity" : 12,
  "price" : 36,
  "item_description" : "brown country eggs"
}
collection_name.insert_many([item_1,item_2])