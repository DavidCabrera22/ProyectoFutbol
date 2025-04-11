import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'https://topfutbol-api-production.up.railway.app';
interface User {
  idUsuario: number;
  nombreUsuario: string;
  email: string;
  rol: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar la aplicación
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // ... código existente ...

const login = async (email: string, password: string) => {
  try {
    console.log('URL de API utilizada:', import.meta.env.VITE_API_URL);
    console.log('Intentando login con URL:', `${import.meta.env.VITE_API_URL}/api/Auth/login`);
    
    const response = await axios.post(`${API_URL}/api/Auth/login`, { email, password });
    
    console.log('Respuesta de login:', response);
    
    // ... resto del código de login ...
  } catch (error) {
    console.error('Error detallado de login:', error);
    if (axios.isAxiosError(error)) {
      console.error('Detalles de error Axios:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
    throw error;
  }
};

const register = async (username: string, email: string, password: string) => {
  try {
    console.log('URL de API utilizada para registro:', import.meta.env.VITE_API_URL);
    console.log('Intentando registro con URL:', `${import.meta.env.VITE_API_URL}/api/Auth/registro`);
    
    const response = await axios.post(`${API_URL}/api/Auth/registro`, { 
      username, 
      email, 
      password 
    });
    
    console.log('Respuesta de registro:', response);
    
    // ... resto del código de registro ...
  } catch (error) {
    console.error('Error detallado de registro:', error);
    if (axios.isAxiosError(error)) {
      console.error('Detalles de error Axios:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
    }
    throw error;
  }
};

// ... resto del código ...

  // Modificar la función logout para asegurarnos de que se limpie correctamente
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    console.log('Sesión cerrada correctamente');
  };
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login,
      register, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};