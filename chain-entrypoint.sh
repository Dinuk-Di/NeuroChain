#!/bin/sh

# Install global dependencies if needed or just use local
npm install

# Start Hardhat Node in background
echo "Starting Hardhat Node..."
npx hardhat node &
NODE_PID=$!

# Wait for the node to be ready (dumb sleep for simplicity, or loop check)
echo "Waiting for Hardhat Node to be ready..."
sleep 10

# Deploy the contract
echo "Deploying Smart Contract..."
npx hardhat run scripts/deploy.js --network localhost

# Keep the container running by waiting for the background process
wait $NODE_PID
