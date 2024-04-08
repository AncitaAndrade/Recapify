from flask import Flask, request, jsonify
import dbClient
import json
import storage
import Model.SummaryFile
import TxtSummary
import Utility.FileHelper as FileHelper
from flask_cors import CORS
import speech
import secrets
import tempfile

application = Flask(__name__)

client = dbClient.client
db = client['customersData']
users_collection =db['users']

with open('config.json', 'r') as f:
    config = json.load(f)
application.config['AWS_ACCESS_KEY_ID'] = config['aws_access_key_id']
application.config['AWS_SECRET_ACCESS_KEY'] = config['aws_secret_access_key']

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

    # Check if the username and password are valid
    user = users_collection.find_one({"username": username, "password": password})

    if user:
        user['_id'] = str(user['_id'])
        return jsonify({'message': 'Login successful', 'user': user}), 200
    else:
        return jsonify({'error': 'User does not exist. Please sign up.'}), 401
    
@application.route('/allRecaps/<customerId>', methods=['GET'])
def getAllRecapsForTheCustomer(customerId):
    return storage.getAllRecapsForCustomer(customerId)

@application.route('/save_summary', methods=['POST'])
def save_summary():
    # Extract data from the request
    data = request.get_json()
    customer_id = data.get('customerId')
    summary_heading = data.get('summaryHeading')
    summary_content = data.get('summary')

    if not customer_id or not summary_heading:
        return jsonify({'error': 'Invalid input data'}), 400
    
    random_filename = secrets.token_urlsafe(8) + ".txt" 

    summary_file = Model.SummaryFile.SummaryFile(summary_heading, customer_id+"_"+random_filename)

    temp_file_path = FileHelper.write_content_to_temp_file(summary_content)
    response = storage.upload_file_to_s3(temp_file_path,customer_id+"_"+random_filename)

    # Save user summary to MongoDB
    storage.save_user_summary(customer_id, summary_file)

    return jsonify({'message': 'User summary saved successfully'}), 200

@application.route("/getSummary/<summary_fileName>", methods=["GET"])
def getSummaryFileFromS3(summary_fileName):
    print(summary_fileName)
    decoded_string = ""
    if summary_fileName and summary_fileName.strip():
        fileContent = storage.read_file_from_s3(summary_fileName)
        decoded_string = fileContent.decode("utf-8")
    return jsonify(decoded_string)

@application.route("/summarize", methods=["POST"])
def upload_file():
    if request.method == "POST":

        if "file" not in request.files:
            return jsonify({"error": "No file provided"})

        file = request.files["file"]

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
