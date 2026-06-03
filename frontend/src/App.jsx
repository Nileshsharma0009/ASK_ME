import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginView from './views/LoginView';
import ChatDashboard from './views/ChatDashboard';
import AdminKnowledge from './views/AdminKnowledge';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginView/>} />
        <Route path="/chat" element={<ChatDashboard/>} />
        <Route path="/admin" element={<AdminKnowledge/>} />
      </Routes>
    </BrowserRouter>
  );
}
