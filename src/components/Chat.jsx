import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [attachments, setAttachments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedConfig = localStorage.getItem('chatConfig');
    if (!savedConfig) {
      navigate('/');
      return;
    }
    
    try {
      const parsedConfig = JSON.parse(savedConfig);
      setConfig(parsedConfig);
      setMessages([{ role: 'assistant', content: 'Hello! How can I help you today?' }]);
    } catch (error) {
      console.error('Invalid config:', error);
      navigate('/');
    }
  }, [navigate]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatMessage = (content) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.slice(lastIndex, match.index)
        });
      }

      parts.push({
        type: 'code',
        language: match[1] || 'plaintext',
        content: match[2]
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.slice(lastIndex)
      });
    }

    return parts;
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const renderMessageContent = (message) => {
    const parts = formatMessage(message.content);
    
    return parts.map((part, index) => {
      if (part.type === 'code') {
        return (
          <div key={index} className="relative mt-2 mb-2">
            <div className="flex justify-between items-center bg-gray-800 text-gray-200 px-4 py-2 text-sm rounded-t-lg">
              <span>{part.language}</span>
              <button
                onClick={() => navigator.clipboard.writeText(part.content)}
                className="text-gray-400 hover:text-white"
              >
                Copy code
              </button>
            </div>
            <SyntaxHighlighter
              language={part.language}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
              }}
            >
              {part.content}
            </SyntaxHighlighter>
          </div>
        );
      }
      return <p key={index} className="whitespace-pre-wrap">{part.content}</p>;
    });
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${config.baseUrl}/chat/completions`,
        {
          model: config.model,
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            ...messages,
            userMessage
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`
          }
        }
      );

      const assistantMessage = response.data.choices[0].message;
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('API Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, an error occurred. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="bg-primary text-white p-4 flex justify-between items-center">
        <div className="font-bold">Claude Chat</div>
        <div className="text-sm">{config?.model}</div>
        <button 
          onClick={() => navigate('/')}
          className="px-3 py-1 bg-red-500 rounded hover:bg-red-600 transition-colors"
        >
          Disconnect
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div 
            key={i}
            className={`max-w-[70%] p-3 rounded-lg ${
              msg.role === 'user' 
                ? 'ml-auto bg-primary text-white rounded-br-none' 
                : 'bg-white rounded-bl-none'
            }`}
          >
            {renderMessageContent(msg)}
          </div>
        ))}
        {isLoading && (
          <div className="bg-white p-3 rounded-lg animate-pulse">
            Processing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white p-4 border-t">
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center bg-gray-100 rounded-lg p-2">
                <span className="text-sm truncate max-w-xs">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex space-x-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
            </svg>
          </button>
          <input
            type="file"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}