import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Database, Box, Server, PlusCircle } from 'lucide-react';
import './App.css'; 

// --- Component: Block Card ---
const BlockCard = ({ block }) => (
  <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700 shadow-lg">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-green-400 font-bold flex items-center">
        <Box className="mr-2" size={18} /> Block #{block.index}
      </h3>
      <span className="text-gray-500 text-sm">
        {new Date(block.timestamp * 1000).toLocaleTimeString()}
      </span>
    </div>
    <div className="text-xs font-mono text-gray-400 break-all">
      <p><span className="text-gray-500">Hash:</span> {block.previous_hash.substring(0, 20)}...</p>
      <p><span className="text-gray-500">Nonce:</span> {block.nonce}</p>
    </div>
    
    <div className="mt-3 bg-gray-900 p-2 rounded">
      <p className="text-xs text-gray-500 uppercase font-semibold">Transactions (Model Registries)</p>
      {block.transactions.length === 0 ? (
        <p className="text-gray-600 text-sm italic">System Block (Genesis/Mining)</p>
      ) : (
        block.transactions.map((tx, i) => (
          <div key={i} className="mt-1 p-1 border-l-2 border-blue-500 pl-2">
            <p className="text-white text-sm font-bold">{tx.model_name}</p>
            <p className="text-gray-400 text-xs">Auth: {tx.author}</p>
            <p className="text-blue-300 text-xs font-mono truncate">{tx.model_hash}</p>
          </div>
        ))
      )}
    </div>
  </div>
);

function App() {
  const [chain, setChain] = useState([]);
  const [formData, setFormData] = useState({ author: '', model_name: '', file_data: '' });
  const [status, setStatus] = useState('');

  // Fetch Blockchain Data
  const fetchChain = async () => {
    try {
      const res = await axios.get('http://localhost:5600/chain');
      setChain(res.data.chain);
    } catch (err) {
      console.error("Error connecting to backend", err);
    }
  };

  useEffect(() => {
    fetchChain();
  }, []);

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit New Model
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Submit Transaction
      await axios.post('http://localhost:5600/transactions/new', formData);
      setStatus('Model submitted! Mining block...');
      
      // 2. Mine the Block (Automated for demo)
      await axios.get('http://localhost:5600/mine');
      setStatus('Block Mined! Chain updated.');
      
      fetchChain(); // Refresh UI
      setFormData({ author: '', model_name: '', file_data: '' }); // Reset Form
    } catch (err) {
      setStatus('Error submitting transaction.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-10 flex items-center justify-between border-b border-gray-700 pb-4">
          <div className="flex items-center">
            <ShieldCheck size={40} className="text-blue-500 mr-3" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">NeuroChain</h1>
              <p className="text-gray-400 text-sm">Decentralized AI Model Registry & Provenance</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-sm font-mono bg-gray-800 px-4 py-2 rounded">
            <Server size={16} className="text-green-500" />
            <span>Nodes: 1 (Active)</span>
            <Database size={16} className="text-blue-500 ml-2" />
            <span>Blocks: {chain.length}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Register Form */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                <PlusCircle className="mr-2 text-blue-400" /> Register AI Model
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Author / Company</label>
                  <input 
                    name="author" value={formData.author} onChange={handleChange} 
                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 outline-none" 
                    placeholder="e.g. OpenAI, DeepMind" required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Model Name</label>
                  <input 
                    name="model_name" value={formData.model_name} onChange={handleChange} 
                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 outline-none" 
                    placeholder="e.g. GPT-4-Turbo-V2" required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Model Data (Simulated)</label>
                  <textarea 
                    name="file_data" value={formData.file_data} onChange={handleChange} 
                    className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600 focus:border-blue-500 outline-none h-24 font-mono text-xs" 
                    placeholder="Paste dummy model weights or string content here..." required
                  />
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition">
                  Hash & Register on Chain
                </button>
              </form>
              {status && <p className="mt-4 text-center text-sm text-yellow-400 animate-pulse">{status}</p>}
            </div>
          </div>

          {/* Right Column: The Blockchain Display */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center">
              <Database className="mr-2 text-green-400" /> Live Blockchain Ledger
            </h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {chain.slice(0).reverse().map((block) => (
                <BlockCard key={block.index} block={block} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;