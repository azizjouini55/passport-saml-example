from flask import Flask, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'super-secret' # replace with your own secret key
jwt = JWTManager(app)

# login  (test) piproute
@app.route('/login', methods=['POST'])
def login():
    # authenticate user and generate JWT
    access_token = create_access_token(identity='username')
    return jsonify(access_token=access_token)

# protected route
@app.route('/protected', methods=['GET'])
@jwt_required
def protected():
    # get current user from JWT
    current_user = get_jwt_identity()
    return f"Hello, {current_user}!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
