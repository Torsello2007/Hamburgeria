from flask import Flask, jsonify, request
from flask_cors import CORS
from database import DatabaseWrapper

app = Flask(__name__)
CORS(app)
db = DatabaseWrapper()

@app.route('/prodotti', methods=['GET', 'POST'])
def handle_prodotti():
    if request.method == 'POST':
        db.add_prodotto(request.json)
        return jsonify({"status": "ok"})
    return jsonify(db.get_prodotti())

@app.route('/prodotti/<int:id>', methods=['DELETE'])
def del_prodotto(id):
    db.delete_prodotto(id)
    return jsonify({"status": "deleted"})

@app.route('/ordini', methods=['GET', 'POST'])
def handle_ordini():
    if request.method == 'POST':
        return jsonify(db.crea_ordine(request.json['totale'], request.json['prodotti']))
    return jsonify(db.get_ordini())

@app.route('/ordini/<int:id>', methods=['PUT'])
def edit_ordine(id):
    db.update_ordine(id, request.json['stato'])
    return jsonify({"status": "updated"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
