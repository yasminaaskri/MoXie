import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('auth');
    return raw ? JSON.parse(raw).user : null;
  });
  const [token, setToken] = useState(() => {
    const raw = localStorage.getItem('auth');
    return raw ? JSON.parse(raw).token : null;
  });

  useEffect(() => {
    if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete api.defaults.headers.common['Authorization'];
    localStorage.setItem('auth', JSON.stringify({ token, user }));
  }, [token, user]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res;
  };
  const register = async (payload) => {
    const res = await api.post('/auth/register', payload);
    setToken(res.data.token);
    setUser(res.data.user);
    return res;
  };
  const logout = () => {
    setToken(null); setUser(null); localStorage.removeItem('auth');
  };

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>;
};
