import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://ai.liara.ir/api/v1/68258071cba1cb8567601c3d ');
  const [model, setModel] = useState('anthropic/claude-3.7-sonnet');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!apiKey) return alert('API Key is required');
    
    localStorage.setItem('chatConfig', JSON.stringify({ apiKey, baseUrl, model }));
    navigate('/chat');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-primary text-center mb-6">Claude Chat</h2>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
          <input 
            type="password" 
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <input 
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="e.g., anthropic/claude-3-opus"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Common models: anthropic/claude-3-opus, anthropic/claude-3-sonnet, anthropic/claude-3-haiku
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Base URL</label>
          <input 
            type="text" 
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button 
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition-colors"
        >
          Connect
        </button>
      </form>
    </div>
  );
}