import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

function readStoredSession() {
  const storedUser = localStorage.getItem('user');
  const storedToken = localStorage.getItem('token');

  if (!storedUser && !storedToken) {
    return { user: null, token: null };
  }

  if (!storedUser || !storedToken) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return { user: null, token: null };
  }

  try {
    return { user: JSON.parse(storedUser), token: storedToken };
  } catch {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return { user: null, token: null };
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const session = readStoredSession();
    setUser(session.user);
    setToken(session.token);
    setLoading(false);
  }, []);

  const login = (userData, authToken, { persist = true } = {}) => {
    setUser(userData);
    setToken(authToken);
    if (persist) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        setUser,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
