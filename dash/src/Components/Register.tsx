import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './login.css'; // Reutilizamos el mismo CSS del login

const Register: React.FC = () => {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

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
    
      // ... existing code ...
  try {
    setError('');
    setLoading(true);
    await register(nombreUsuario, email, password);
    navigate('/dashboard');
  } catch (err: unknown) {
    console.error('Error durante el registro:', err);
    if (err && typeof err === 'object' && 'response' in err && 
        err.response && typeof err.response === 'object' && 'data' in err.response) {
      setError(err.response.data as string);
    } else {
      setError('Error al registrar usuario. Por favor, intenta de nuevo.');
    }
  } finally {
    setLoading(false);
  }
  // ... existing code ...
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