# NeuroChain 🧠⛓️

**NeuroChain** is a blockchain-based system designed for the secure registration and provenance tracking of AI models. It utilizes a custom repository blockchain implementation to verify the integrity of AI models by hashing their content and storing the records in an immutable ledger.

## 🚀 Features

- **Blockchain Core**: Custom Python implementation of a blockchain with Proof-of-Work (PoW) consensus.
- **Model Registration**: Securely register AI models by storing their cryptographic hash (SHA-256), author, and model name.
- **Tamper-Proof Ledger**: Ensures that registered models cannot be altered without invalidating the chain.
- **Modern UI**: A React-based frontend to interact with the blockchain, view the chain, and register new models.
- **Dockerized**: Fully containerized setup for easy deployment using Docker Compose.

## 🛠️ Tech Stack

### Backend

- **Language**: Python 3.9+
- **Framework**: Flask
- **Cryptography**: `hashlib` for SHA-256 hashing
- **Networking**: REST API for node interaction

### Frontend

- **Framework**: React.js
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Infrastructure

- **Containerization**: Docker & Docker Compose

## 📦 Installation & Setup

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your machine.

### Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd NeuroChain
   ```

2. **Start the application**
   Run the following command to build and start the services:

   ```bash
   docker-compose up --build
   ```

3. **Access the Application**
   - **Frontend**: Open `http://localhost:3000` in your browser.
   - **Backend API**: Accessible at `http://localhost:5600`.

## 🔌 API Endpoints

The backend provides the following RESTful endpoints:

- **`GET /mine`**

  - Triggers the mining process to create a new block and confirm pending transactions.

- **`POST /transactions/new`**

  - Registers a new AI model.
  - **Body**:
    ```json
    {
      "author": "Author Name",
      "model_name": "Model v1.0",
      "file_data": "raw_file_content_string"
    }
    ```

- **`GET /chain`**
  - Returns the full blockchain data.

## 📂 Project Structure

```
NeuroChain/
├── backend/               # Flask Backend
│   ├── app.py             # API Entry point
│   ├── blockchain.py      # Core Blockchain Logic
│   └── Dockerfile         # Backend Docker config
├── frontend/              # React Frontend
│   ├── src/               # Source code
│   ├── public/            # Static assets
│   └── Dockerfile         # Frontend Docker config
├── docker-compose.yml     # Service Orchestration
└── README.md              # Project Documentation
```

## 🛡️ License

This project is open-source and available under the [MIT License](LICENSE).
