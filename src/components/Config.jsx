import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Config() {
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('anthropic/claude-3.7-sonnet');
  const [baseUrl, setBaseUrl] = useState('https://ai.liara.ir/api/v1/68258071cba1cb8567601c3d');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const config = { apiKey, model, baseUrl };
    localStorage.setItem('chatConfig', JSON.stringify(config));
    navigate('/chat');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Claude Chat Configuration</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Model</label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g., anthropic/claude-3-opus"
              className="mt-1 w-full p-2 border rounded"
              required
            />
            <p className="mt-1 text-sm text-gray-500">
              Common models: anthropic/claude-3-opus, anthropic/claude-3-sonnet, anthropic/claude-3-haiku
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">API Base URL</label>
            <input
              type="url"
              value={baseUrl}
              onChange={(e) => setBaseUrl(e.target.value)}
              className="mt-1 w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary text-white p-2 rounded hover:bg-opacity-90"
          >
            Connect
          </button>
        </div>
      </form>
    </div>
  );
}
