import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import LoginView from './views/LoginView';
import ChatDashboard from './views/ChatDashboard';
import AdminKnowledge from './views/AdminKnowledge';

// Protected Route Component
function ProtectedRoute({ children }) {
  const auth = useContext(AuthContext);
  
  if (auth?.loading) {
    return <div className="w-full h-screen flex items-center justify-center bg-app-bg">Loading...</div>;
  }

  return auth?.isAuthenticated ? children : <Navigate to="/" replace />;
}

// Redirect if already logged in
function PublicRoute({ children }) {
  const auth = useContext(AuthContext);
  
  if (auth?.loading) {
    return <div className="w-full h-screen flex items-center justify-center bg-app-bg">Loading...</div>;
  }

  return auth?.isAuthenticated ? <Navigate to="/chat" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><LoginView /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><AdminKnowledge /></PublicRoute>} />
      <Route 
        path="/chat" 
        element={
          <ProtectedRoute>
            <ChatDashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
