import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, removeToken, getToken, isAuthenticated as checkAuth } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUserProfile = useCallback(async () => {
    try {
      const data = await authAPI.getProfile();
      setUser(data.data);
    } catch (error) {
      console.error('Failed to load profile:', error);
      if (error.status === 401) {
        removeToken();
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const data = await authAPI.getProfile();
    setUser(data.data);
    return data.data;
  }, []);

  useEffect(() => {
    if (checkAuth()) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, [loadUserProfile]);

  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    await loadUserProfile();
    return data;
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    await loadUserProfile();
    return data;
  };

  const logout = () => {
    authAPI.logout();
    setUser(null);
  };

  const updateProfile = async (userData) => {
    const data = await authAPI.updateProfile(userData);
    setUser(data.data);
    return data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
        isAuthenticated: !!user || (!!getToken() && loading),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
