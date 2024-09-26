from flask import Flask
from db.db import db
from flask_migrate import Migrate

from routes.users import users_bp

app = Flask(__name__)
app.register_blueprint(users_bp)

@app.route("/")
def home():
    return "<h1>Hello!</h1>"

if __name__ == "__main__":
    app.run(debug=True)