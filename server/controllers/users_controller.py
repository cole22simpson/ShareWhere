from flask import request

def serialize_user(user):
    return {
        "id": user.id,
        "first_name": user.firstName,
        "last_name": user.lastName,
        "username": user.username,
        "email": user.email,
        "password": user.password
        # "profile_pic": user.profilePic,
        # "account_created": user.timestamp
    }

def get_users():
    users = User

def create_user():
    payload = request.json

    first_name = payload