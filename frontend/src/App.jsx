import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import { env } from './config/env';
import LoginView from './views/LoginView';
import RegisterView from './views/Registerview';
import DashboardLayout from './components/Layout/DashboardLayout';
import ChatPanel from './views/ChatPanel';
import ProfileView from './views/ProfileView';
import SettingView from './views/SettingView';
import HistoryView from './views/HistoryView';
import PlaceholderPanel from './views/PlaceholderPanel';

function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400 font-medium tracking-wide">
      Loading...
    </div>
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

          <Route path="*" element={<Navigate to={login} replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
