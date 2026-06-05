import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext'; // Integrated the persistent context provider layer
import { env } from './config/env';
import LoginView from './views/LoginView';
import RegisterView from './views/Registerview';
import DashboardLayout from './components/Layout/DashboardLayout';
import ChatPanel from './views/ChatPanel';
import ProfileView from './views/ProfileView';
import SettingView from './views/SettingView';
import HistoryView from './views/HistoryView';
import PlaceholderPanel from './views/PlaceholderPanel';
import { motion } from 'framer-motion';

function AuthLoading() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-app-bg text-secondary"
    >
      {/* Brand Spinner */}
      <div className="relative w-16 h-16 mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[10px] font-black text-primary tracking-widest uppercase">
            ASK
          </span>
        </div>
      </div>

      {/* Pulsing Status Text */}
      <motion.p 
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-xs font-bold tracking-[0.2em] uppercase text-heading"
      >
        loading...
      </motion.p>
    </motion.div>
  );
}

function ProtectedRoute({ children }) {
  const auth = useContext(AuthContext);

  if (auth?.loading) return <AuthLoading />;

  return auth?.isAuthenticated ? children : <Navigate to={env.routes.login} replace />;
}

function PublicRoute({ children }) {
  const auth = useContext(AuthContext);

  if (auth?.loading) return <AuthLoading />;

  if (auth?.isAuthenticated && env.autoRedirectAuthenticated) {
    return <Navigate to={env.routes.chat} replace />;
  }

  return children;
}

export default function App() {
  const { login, register, chat } = env.routes;

  return (
    <AuthProvider>
      {/* ==========================================================================
         UI INFRASTRUCTURE WRAPPER: ChatProvider
         Placed right inside AuthProvider so the shared global chat context 
         stays completely alive across DashboardLayout, SettingsView, and ChatPanel,
         preventing your chat states from unmounting when navigating routes.
         ========================================================================== 
      */}
      <ChatProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path={login}
              element={
                <PublicRoute>
                  <LoginView />
                </PublicRoute>
              }
            />
            <Route
              path={register}
              element={
                <PublicRoute>
                  <RegisterView />
                </PublicRoute>
              }
            />

            {/* Dashboard Routing Matrix Shell */}
            <Route
              path={chat}
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ChatPanel />} />
              <Route path="profile" element={<ProfileView />} />
              <Route path="settings" element={<SettingView />} />
              <Route
                path="upload"
                element={
                  <PlaceholderPanel
                    title="Upload Data"
                    description="Document upload will connect to the knowledge base API in a later milestone."
                  />
                }
              />
              <Route path="history" element={<HistoryView />} />
            </Route>

            {/* Legacy paths → nested dashboard routes */}
            <Route path="/profile" element={<Navigate to={`${chat}/profile`} replace />} />
            <Route path="/settings" element={<Navigate to={`${chat}/settings`} replace />} />

            {/* Universal Fallback Route Redirection */}
            <Route path="*" element={<Navigate to={login} replace />} />
          </Routes>
        </BrowserRouter>
      </ChatProvider>
    </AuthProvider>
  );
}