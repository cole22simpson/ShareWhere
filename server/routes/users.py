from flask import request, Blueprint
from controllers.users_controller import *

users_bp = Blueprint("users", __name__)

@users_bp.route("/users", methods=["GET", "POST"])
def user_request():
    if request.method == "GET":
        return get_users()
    else:
        return create_user()