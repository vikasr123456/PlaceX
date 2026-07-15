import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const response = await api.get('/auth/profile/');
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        // Fetch user profile with role
        try {
          const profileResponse = await api.get('/user-profiles/me/');
          setUser(prev => ({ ...prev, role: profileResponse.data.role, resume: profileResponse.data.resume }));
        } catch (profileError) {
          console.error('Profile fetch error:', profileError);
        }
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  };

  const login = async (identifier, password) => {
    try {
      console.log('AuthContext: Attempting login for:', identifier);
      const response = await api.post('/auth/login/', { identifier, password });
      console.log('AuthContext: Login API response:', response.data);
      const { access, refresh, user } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      setUser(user);
      setIsAuthenticated(true);
      
      // Fetch user profile with role
      try {
        console.log('AuthContext: Fetching user profile...');
        const profileResponse = await api.get('/user-profiles/me/');
        console.log('AuthContext: Profile response:', profileResponse.data);
        setUser(prev => ({ ...prev, role: profileResponse.data.role, resume: profileResponse.data.resume }));
      } catch (profileError) {
        console.error('AuthContext: Profile fetch error after login:', profileError);
        // Create profile if it doesn't exist
        try {
          console.log('AuthContext: Creating user profile...');
          await api.post('/user-profiles/', { role: 'student' });
          const profileResponse = await api.get('/user-profiles/me/');
          console.log('AuthContext: Created profile response:', profileResponse.data);
          setUser(prev => ({ ...prev, role: profileResponse.data.role, resume: profileResponse.data.resume }));
        } catch (createError) {
          console.error('AuthContext: Profile creation error:', createError);
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      console.error('AuthContext: Error response:', error.response?.data);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register/', userData);
      const { access, refresh, user } = response.data;
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      
      setUser(user);
      setIsAuthenticated(true);
      
      // Create user profile with default role
      try {
        await api.post('/user-profiles/', { role: 'student' });
      } catch (profileError) {
        console.error('Profile creation error:', profileError);
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.errors 
        ? Object.values(error.response.data.errors).flat().join(', ')
        : error.response?.data?.detail || 'Registration failed. Please try again.';
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await api.post('/auth/logout/', { refresh: refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = async (profileData) => {
    const response = await api.put('/student-profiles/me/', profileData);
    return response.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
        updateProfile,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
