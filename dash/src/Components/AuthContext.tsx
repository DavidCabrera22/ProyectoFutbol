import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

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

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5180/api/Auth/login', {
        email,
        password
      });
      
      const userData = response.data;
      setUser(userData);
      
      // Guardar el usuario y token en localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Configurar el token para futuras solicitudes
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      throw error;
    }
  };

  // Nueva función para registrar usuarios
  const register = async (nombreUsuario: string, email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:5180/api/Auth/registro', {
        nombreUsuario,
        email,
        password
      });
      
      const userData = response.data;
      setUser(userData);
      
      // Guardar el usuario y token en localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Configurar el token para futuras solicitudes
      axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
    } catch (error) {
      console.error('Error de registro:', error);
      throw error;
    }
  };

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