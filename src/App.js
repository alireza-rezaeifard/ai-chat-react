import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Chat from './components/Chat';
import Config from './components/Config';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <main className="App-main">
          <Routes>
            <Route path="/" element={<Config />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;