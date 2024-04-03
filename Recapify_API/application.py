from flask import Flask, request, jsonify
from pymongo import MongoClient
import TxtSummary
import Utility.FileHelper as FileHelper
from flask_cors import CORS
import certifi
import speech
import tempfile

application = Flask(__name__)

client = MongoClient(
    "mongodb+srv://akashku95:gomongodb@customersdata.5pnb9iq.mongodb.net/?retryWrites=true&w=majority"
)
# client= MongoClient('mongodb+srv://akashku95:gomongodb@customersdata.5pnb9iq.mongodb.net/?retryWrites=true&w=majority',tlsCAFile=certifi.where())
db = client["customersData"]
users_collection = db["users"]

CORS(application)


@application.route("/", methods=["GET"])
def sample():
    return jsonify("Hello World")


@application.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    is_student = data.get("isStudent", False)  # Default value is False

    # Check if the username already exists
    if users_collection.count_documents({"username": username}) > 0:
        return jsonify({"error": "Username already exists"}), 400

    # Insert the new user into the database
    user = {"username": username, "password": password, "isStudent": is_student}
    users_collection.insert_one(user)

    return jsonify({"message": "User registered successfully"}), 201


@application.route("/users/<username>", methods=["GET"])
def get_user(username):
    user = users_collection.find_one({"username": username})
    if user:

        user.pop("password", None)
        user.pop("_id", None)

        return jsonify(user), 200
    else:
        return jsonify({"error": "User not found"}), 404


@application.route("/users/<username>/isStudent", methods=["GET"])
def is_user_student(username):
    user = users_collection.find_one({"username": username})

    if user:
        is_student = user.get("isStudent", False)
        return jsonify({"isStudent": is_student}), 200
    else:
        return jsonify({"error": "User not found"}), 404


@application.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    user = users_collection.find_one({"username": username, "password": password})

    if user:

        user["_id"] = str(user["_id"])
        return jsonify({"message": "Login successful", "user": user}), 200
    else:
        return jsonify({"error": "User does not exist. Please sign up."}), 401


@application.route("/summarize", methods=["POST"])
def upload_file():
    if request.method == "POST":
        print(request.files)

        if "file" not in request.files:
            return jsonify({"error": "No file provided"})

        file = request.files["file"]
        print(file)

        if file.filename == "":
            return jsonify({"error": "No file Provided"})

        if not FileHelper.allowed_file(file.filename):

            temp_file = tempfile.NamedTemporaryFile(delete=False)
            file.save(temp_file.name)
            summ = speech.s_client(temp_file.name)
            temp_file.close()

            return jsonify(summ)

        summaries = TxtSummary.getTextFileSummary(file)

        return jsonify(summaries)


if __name__ == "__main__":
    application.run()
