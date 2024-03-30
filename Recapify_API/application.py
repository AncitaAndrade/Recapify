from flask import Flask, request, jsonify
from pymongo import MongoClient
import TxtSummary
import Utility.FileHelper as FileHelper
import certifi

application = Flask(__name__)

client =MongoClient('mongodb+srv://akashku95:gomongodb@customersdata.5pnb9iq.mongodb.net/?retryWrites=true&w=majority')
#client= MongoClient('mongodb+srv://akashku95:gomongodb@customersdata.5pnb9iq.mongodb.net/?retryWrites=true&w=majority',tlsCAFile=certifi.where())
db = client['customersData']
users_collection =db['users']

@application.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    is_student = data.get('isStudent', False)  # Default value is False

    # Check if the username already exists
    if users_collection.count_documents({'username': username}) > 0:
        return jsonify({'error': 'Username already exists'}), 400

    # Insert the new user into the database
    user = {'username': username, 'password': password, 'isStudent': is_student}
    users_collection.insert_one(user)

    return jsonify({'message': 'User registered successfully'}), 201

@application.route('/users/<username>', methods=['GET'])
def get_user(username):
    user = users_collection.find_one({'username': username})
    if user:
        # Remove the password field before returning the user data
        user.pop('password', None)
        user.pop('_id', None)

        return jsonify(user), 200
    else:
        return jsonify({'error': 'User not found'}), 404
    
@application.route('/users/<username>/isStudent', methods=['GET'])
def is_user_student(username):
    user = users_collection.find_one({'username': username})

    if user:
        is_student = user.get('isStudent', False)
        return jsonify({'isStudent': is_student}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

@application.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Check if the username and password are valid
    user = users_collection.find_one({'username': username, 'password': password})

    if user:
        # Remove the password field before returning the user data
        # user.pop('password', None)
        # user.pop('_id', None)
        
        # Convert the ObjectId to a string
        user['_id'] = str(user['_id'])
        return jsonify({'message': 'Login successful', 'user': user}), 200
    else:
        return jsonify({'error': 'User does not exist. Please sign up.'}), 401
    

@application.route('/summarize', methods=['POST'])
def upload_file():
    if request.method == 'POST':
        print(request.files)
        # Check if a file was uploaded
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'})
       
        file = request.files['file']
        print(file)
        # Check if the file is empty
        if file.filename == '':
            return jsonify({'No file Provided'})
        
        if not FileHelper.allowed_file(file.filename):
            # Invoke Speechmatics API
            return jsonify({'Result'})

        summaries = TxtSummary.getTextFileSummary(file)
        
        return jsonify(summaries)

if __name__ == '__main__':
    application.run()

