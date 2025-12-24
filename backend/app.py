import hashlib
from flask import Flask, jsonify, request
from flask_cors import CORS
from blockchain import Blockchain

app = Flask(__name__)
CORS(app) # Allow React to communicate

neuro_chain = Blockchain()

@app.route('/mine', methods=['GET'])
def mine():
    last_block = neuro_chain.last_block
    last_proof = last_block['nonce']
    proof = neuro_chain.proof_of_work(last_proof)

    # Reward for mining (optional concept)
    previous_hash = neuro_chain.hash(last_block)
    block = neuro_chain.create_block(proof, previous_hash)

    response = {
        'message': "New Block Forged",
        'index': block['index'],
        'transactions': block['transactions'],
        'proof': block['nonce'],
        'previous_hash': block['previous_hash'],
    }
    return jsonify(response), 200

@app.route('/transactions/new', methods=['POST'])
def new_transaction():
    values = request.get_json()
    required = ['author', 'model_name', 'file_data'] # We accept file content or simulation
    if not all(k in values for k in required):
        return 'Missing values', 400

    # Create a unique fingerprint of the model file
    model_content = values['file_data'].encode()
    model_hash = hashlib.sha256(model_content).hexdigest()

    index = neuro_chain.add_transaction(values['author'], values['model_name'], model_hash)
    
    return jsonify({'message': f'Model added to pending block. Will be finalized in Block {index}'}), 201

@app.route('/chain', methods=['GET'])
def full_chain():
    response = {
        'chain': neuro_chain.chain,
        'length': len(neuro_chain.chain),
    }
    return jsonify(response), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)