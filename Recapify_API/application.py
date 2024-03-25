from flask import Flask, request, jsonify
import dbClient
import json
import storage
import Model.SummaryFile

application = Flask(__name__)

client = dbClient.client
db = client['customersData']
users_collection =db['users']

with open('config.json', 'r') as f:
    config = json.load(f)
access_key_id = config['aws_access_key_id']
secret_access_key = config['aws_secret_access_key']

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
    
@application.route('/allRecaps/<customerId>', methods=['GET'])
def getAllRecapsForTheCustomer(customerId):
    return storage.getAllRecapsForCustomer(customerId)

@application.route('/save_summary', methods=['POST'])
def save_summary():
    # Extract data from the request
    data = request.get_json()
    customer_id = data.get('customerId')
    summary_heading = data.get('summaryHeading')
    summary_filename = data.get('summaryFilename')

    # Validate input data
    if not customer_id or not summary_heading or not summary_filename:
        return jsonify({'error': 'Invalid input data'}), 400

    # Create a SummaryFile object
    summary_file = Model.SummaryFile.SummaryFile(summary_heading, summary_filename)

    # Save user summary to MongoDB
    storage.save_user_summary(customer_id, summary_file)

    return jsonify({'message': 'User summary saved successfully'}), 200

if __name__ == '__main__':
    application.run()