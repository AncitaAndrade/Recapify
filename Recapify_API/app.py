
from flask import Flask, request, jsonify
from pymongo import MongoClient

app = Flask(__name__)

client =MongoClient('mongodb+srv://akashku95:gomongodb@customersdata.5pnb9iq.mongodb.net/?retryWrites=true&w=majority')
db = client['customersData']
users_collection =db['users']

@app.route('/register', methods=['POST'])
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

@app.route('/users/<username>', methods=['GET'])
def get_user(username):
    user = users_collection.find_one({'username': username})
    if user:
        # Remove the password field before returning the user data
        user.pop('password', None)
        user.pop('_id', None)

        return jsonify(user), 200
    else:
        return jsonify({'error': 'User not found'}), 404
    
@app.route('/users/<username>/isStudent', methods=['GET'])
def is_user_student(username):
    user = users_collection.find_one({'username': username})

    if user:
        is_student = user.get('isStudent', False)
        return jsonify({'isStudent': is_student}), 200
    else:
        return jsonify({'error': 'User not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
                     
