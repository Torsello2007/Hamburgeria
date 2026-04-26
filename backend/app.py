from flask import Flask, jsonify, request
from flask_cors import CORS
from database import DatabaseWrapper

app = Flask(__name__)
CORS(app)
db = DatabaseWrapper()

@app.route('/prodotti', methods=['GET'])
def list_prodotti():
    return jsonify(db.get_prodotti())

@app.route('/ordini', methods=['POST'])
def add_ordine():
    data = request.json
    res = db.crea_ordine(data['totale'], data['prodotti'])
    return jsonify({"status": "success", "id": res})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
