import hashlib
import json
import time
import requests


# helper methods. To save the chain in JSON file
def save_to_disk(self):
    with open('blockchain_data.json', 'w') as f:
        json.dump(self.chain, f, indent=4)

def load_from_disk(self):
    try:
        with open('blockchain_data.json', 'r') as f:
            self.chain = json.load(f)
    except FileNotFoundError:
        pass # Start with Genesis block if no file exists

class Blockchain:
    def __init__(self):
        self.chain = []
        self.pending_transactions = []
        self.create_block(previous_hash='0', nonce=100) # Genesis Block

    def create_block(self, nonce, previous_hash):
        block = {
            'index': len(self.chain) + 1,
            'timestamp': time.time(),
            'transactions': self.pending_transactions,
            'nonce': nonce,
            'previous_hash': previous_hash
        }
        self.pending_transactions = []
        self.chain.append(block)
        return block

    @property
    def last_block(self):
        return self.chain[-1]

    def add_transaction(self, author, model_name, model_hash):
        """Records a new AI Model registration"""
        self.pending_transactions.append({
            'author': author,
            'model_name': model_name,
            'model_hash': model_hash,
            'timestamp': time.time()
        })
        return self.last_block['index'] + 1

    def hash(self, block):
        block_string = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(block_string).hexdigest()

    def proof_of_work(self, last_proof):
        # Simple PoW: Find a number that when hashed with last_proof contains 4 leading zeros
        proof = 0
        while self.valid_proof(last_proof, proof) is False:
            proof += 1
        return proof

    @staticmethod
    def valid_proof(last_proof, proof):
        guess = f'{last_proof}{proof}'.encode()
        guess_hash = hashlib.sha256(guess).hexdigest()
        return guess_hash[:4] == "0000"
    
    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            # 1. Check if the stored previous_hash matches the actual hash of the previous block
            if current_block['previous_hash'] != self.hash(previous_block):
                return False

            # 2. Check if the Proof of Work is valid
            if not self.valid_proof(previous_block['nonce'], current_block['nonce']):
                return False
                
        return True
    
def resolve_conflicts(self):
    neighbors = self.nodes # You would need a list of other node URLs
    new_chain = None
    max_length = len(self.chain)

    for node in neighbors:
        response = requests.get(f'http://{node}/chain')
        if response.status_code == 200:
            length = response.json()['length']
            chain = response.json()['chain']

            # Check if length is longer and chain is valid
            if length > max_length and self.is_chain_valid(chain):
                max_length = length
                new_chain = chain

    if new_chain:
        self.chain = new_chain
        return True
    return False