import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, removeToken, getToken, isAuthenticated as checkAuth } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    if (checkAuth()) {
      loadUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserProfile = async () => {
    try {
      const data = await authAPI.getProfile();
      setUser(data.data);
    } catch (error) {
      console.error('Failed to load profile:', error);
      removeToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    const data = await authAPI.login(credentials);
    setUser(data.data);
    return data;
  };

  const register = async (userData) => {
    const data = await authAPI.register(userData);
    setUser(data.data);
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
        isAuthenticated: !!user,
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
