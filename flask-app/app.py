from flask import Flask, jsonify


app = Flask(__name__)

@app.route('/', methods=['GET'])
def test():
    return "hello user"
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081)
