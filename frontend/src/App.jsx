import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import NeuroChainABI from './abi/NeuroChain.json';

// Contract Address (Update after deployment)
const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function App() {
  const [account, setAccount] = useState(null);
  const [models, setModels] = useState([]);
  const [formData, setFormData] = useState({ name: '', author: '', file: null });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkWallet();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          loadModels(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
    return () => {
        if (window.ethereum && window.ethereum.removeListener) {
            window.ethereum.removeListener('accountsChanged', () => {});
        }
    };
  }, []);

  const checkWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        loadModels(accounts[0]);
      }
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Please install MetaMask!");
    try {
      // Force account selection
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      loadModels(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  const loadModels = async (acc) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, NeuroChainABI.abi, provider);
      const data = await contract.getModels();
      setModels(data);
    } catch (error) {
      console.error("Error loading models:", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Mock Hash calculation (In real app, use crypto.subtle)
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      setFormData({ ...formData, file, modelHash: hashHex });
    }
  };

  const registerModel = async () => {
    if (!formData.name || !formData.author || !formData.modelHash) return alert("Fill all fields!");
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, NeuroChainABI.abi, signer);
      
      const tx = await contract.registerModel(formData.name, formData.author, formData.modelHash);
      await tx.wait();
      
      alert("Model Registered!");
      loadModels(account);
      setFormData({ name: '', author: '', file: null, modelHash: '' });
    } catch (error) {
      console.error(error);
      alert("Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          NeuroChain 🧠⛓️
        </h1>
        {account ? (
          <div className="flex items-center gap-4">
            <span className="bg-gray-800 px-4 py-2 rounded-full text-sm font-mono text-green-400">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <button 
              onClick={disconnectWallet}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm font-semibold transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <button onClick={connectWallet} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition">
            Connect Wallet
          </button>
        )}
      </header>

      <main className="grid md:grid-cols-2 gap-12">
        <section className="bg-gray-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            🆕 Register Model
          </h2>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Model Name" 
              className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Author Name" 
              className="w-full bg-gray-700 p-3 rounded-lg border border-gray-600 focus:border-blue-500 outline-none"
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
            />
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 transition cursor-pointer relative">
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={handleFileChange}
              />
              <p className="text-gray-400">
                {formData.file ? formData.file.name : "Click to upload model file (.onnx, .pth)"}
              </p>
            </div>
            {formData.modelHash && (
               <div className="text-xs font-mono bg-black p-2 rounded text-gray-500 break-all">
                 Hash: {formData.modelHash}
               </div>
            )}
            <button 
              onClick={registerModel} 
              disabled={loading || !account}
              className={`w-full py-3 rounded-lg font-bold text-lg transition ${loading ? 'bg-gray-600' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-[1.02]'}`}
            >
              {loading ? "Registering..." : "Register on Blockchain"}
            </button>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4">🔗 Verified Models</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {models.length === 0 ? (
              <p className="text-gray-500 italic">No models registered yet.</p>
            ) : (
              models.map((m, i) => (
                <div key={i} className="bg-gray-800 p-5 rounded-xl border-l-4 border-purple-500 hover:bg-gray-750 transition">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold">{m.name}</h3>
                    <span className="text-xs text-gray-400">{new Date(Number(m.timestamp) * 1000).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-400 mb-2">by <span className="text-white">{m.author}</span></p>
                  <div className="bg-black/50 p-2 rounded text-xs font-mono text-gray-500 truncate">
                    {m.modelHash}
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    Signer: {m.sender}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
