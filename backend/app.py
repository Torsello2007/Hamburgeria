from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from database import DatabaseWrapper

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
db = DatabaseWrapper()

@app.after_request
def after(resp):
    resp.headers.add('Access-Control-Allow-Origin', '*')
    resp.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    resp.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return resp

@app.route('/prodotti', methods=['GET', 'POST'])
def handle_p():
    if request.method == 'POST': return jsonify(db.add_prodotto(request.json))
    return jsonify(db.get_prodotti())

@app.route('/prodotti/<int:id>', methods=['PUT', 'DELETE'])
def edit_p(id):
    if request.method == 'PUT': return jsonify(db.update_prodotto(id, request.json))
    return jsonify(db.delete_prodotto(id))

@app.route('/ordini', methods=['GET', 'POST', 'OPTIONS'])
def handle_o():
    if request.method == 'OPTIONS': return make_response("", 200)
    if request.method == 'POST':
        res = db.crea_ordine(request.json['totale'], request.json['prodotti'])
        return jsonify({"status": "success", "id": res})
    return jsonify(db.get_ordini())

@app.route('/ordini/<int:id>', methods=['PUT'])
def edit_o(id): return jsonify(db.update_ordine(id, request.json['stato']))

if __name__ == '__main__': app.run(debug=True, host='0.0.0.0', port=5000)
