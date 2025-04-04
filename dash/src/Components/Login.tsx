import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  // Al cargar el componente, asegurarse de que el usuario esté desconectado
  useEffect(() => {
    // Cerrar sesión al entrar a la página de login
    logout();
  }, [logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setError('');
      setLoading(true);
      console.log('Intentando iniciar sesión con:', email);
      await login(email, password);
      console.log('Login exitoso, redirigiendo a dashboard');
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('Error durante el login:', err);
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-left">
          <div className="login-welcome">
            <h1>WELCOME BACK</h1>
            <p>Welcome back! Please enter your details.</p>
            
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>
              
              <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Check 
                  type="checkbox" 
                  label="Remember me" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <a href="#" className="forgot-password">Forgot password</a>
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <div className="d-grid gap-2 mb-3">
                <Button variant="danger" type="submit" disabled={loading} className="login-btn">
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </div>
              
              <div className="d-grid gap-2">
                <Button variant="outline-secondary" className="google-btn">
                  <img src="/images/google-icon.png" alt="Google" className="google-icon" />
                  Sign in with Google
                </Button>
              </div>
              
              <div className="text-center mt-3">
                <p className="signup-text">
                  Don't have an account? <Link to="/register" className="signup-link">Sign up for free!</Link>
                </p>
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

export default Login;