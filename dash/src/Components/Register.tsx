import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './login.css'; // Reutilizamos el mismo CSS del login
import axios from 'axios';

const Register: React.FC = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener y mostrar la URL de la API para depuración
    const url = import.meta.env.VITE_API_URL;
    setApiUrl(url);
    console.log('URL de API configurada en Register:', url);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    try {
      setError('');
      setLoading(true);
      console.log('Intentando registro con datos:', { nombreUsuario, email });
      console.log('URL de API utilizada:', apiUrl);
      console.log('URL completa:', `${apiUrl}/api/Auth/registro`);
      
      await register(nombreUsuario, email, password);
      console.log('Registro exitoso, redirigiendo a dashboard');
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Error detallado durante el registro:', err);
      
      // Mostrar información detallada del error para depuración
      if (axios.isAxiosError(err)) {
        console.error('Detalles del error Axios:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
          headers: err.response?.headers,
          config: err.config
        });
        
        if (err.response) {
          setError(`Error ${err.response.status}: ${err.response.data || err.message}`);
        } else if (err.request) {
          setError('No se recibió respuesta del servidor. Verifica tu conexión.');
        } else {
          setError(`Error de configuración: ${err.message}`);
        }
      } else {
        setError('Error al registrar usuario. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-left">
          <div className="login-welcome">
            <h1>CREAR CUENTA</h1>
            <p>Completa tus datos para registrarte en TopFutbol.</p>
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre de Usuario</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingresa tu nombre de usuario"
                  value={nombreUsuario}
                  onChange={(e) => setNombreUsuario(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingresa tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <div className="d-grid gap-2 mb-3">
                <Button variant="danger" type="submit" disabled={loading} className="login-btn">
                  {loading ? 'Registrando...' : 'Registrarse'}
                </Button>
              </div>
              
              <div className="text-center signup-text">
                ¿Ya tienes una cuenta? <Link to="/login" className="signup-link">Iniciar sesión</Link>
              </div>
            </Form>
          </div>
        </div>
        
        <div className="login-right">
          <div className="player-image"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;