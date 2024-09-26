from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

mongo_uri = os.getenv("DB_URI")
client = MongoClient(mongo_uri)
db = client["ShareWhere"]