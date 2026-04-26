from flask import Flask, jsonify, request
from flask_cors import CORS
from database import DatabaseWrapper

app = Flask(__name__)
CORS(app)
db = DatabaseWrapper()

@app.route('/prodotti', methods=['GET'])
def list_prodotti():
    return jsonify(db.get_prodotti())

# AGGIORNATO: Ora accetta sia GET (per vedere) che POST (per creare)
@app.route('/ordini', methods=['GET', 'POST'])
def handle_ordini():
    if request.method == 'GET':
        return jsonify(db.get_ordini())
    
    if request.method == 'POST':
        data = request.json
        res = db.crea_ordine(data['totale'], data['prodotti'])
        return jsonify({"status": "success", "id": res})

# Rotta per cambiare lo stato (richiesta da Angular)
@app.route('/ordini/<int:id>', methods=['PUT'])
def update_ordine(id):
    # Logica opzionale se vuoi gestire il cambio stato nel DB
    return jsonify({"status": "updated"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
