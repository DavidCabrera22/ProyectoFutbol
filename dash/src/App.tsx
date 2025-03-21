import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import Register from './Components/Register';
import Unauthorized from './Components/Unauthorized';
import StudentTable from './Components/StudentTable';
import Trainers from './Components/Trainers';
import Location from './Components/Location';
import Saldos from './Components/Saldos';
import Servicios from './Components/Servicios';
import Movimientos from './Components/Movimiento';
import TiposMovimiento from './Components/TiposMovimiento';
import TiposRecaudo from './Components/TipoRecaudo';
import { useAuth } from './Components/AuthContext';
import { Button, Container } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Components/global.css';

// Componente para proteger rutas
const ProtectedRoute: React.FC<{ 
  children: React.ReactNode, 
  requiredRole?: string 
}> = ({ children, requiredRole }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Verificar el rol si se especifica
  if (requiredRole && user?.rol !== requiredRole) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

// Componente Layout que incluye la barra de navegación y el botón de logout
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, user } = useAuth();
  
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
      window.location.href = '/login';
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar de navegación */}
      <div className="bg-dark text-white" style={{ width: '250px', minHeight: '100vh', position: 'sticky', top: 0 }}>
        <div className="p-3 border-bottom border-dark">
          <h4>TopFutbol</h4>
          <div className="small">
            <span>Bienvenido, {user?.nombreUsuario || 'Usuario'}</span>
          </div>
        </div>
        <ul className="nav flex-column p-3">
          <li className="nav-item mb-2">
            <Link className="nav-link text-white rounded hover-effect" to="/dashboard">
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white rounded hover-effect" to="/students">
              <i className="bi bi-people me-2"></i>Estudiantes
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white rounded hover-effect" to="/trainers">
              <i className="bi bi-person-badge me-2"></i>Formadores
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white rounded hover-effect" to="/locations">
              <i className="bi bi-geo-alt me-2"></i>Sedes
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white rounded hover-effect" to="/servicios">
              <i className="bi bi-list-check me-2"></i>Servicios
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white rounded hover-effect" to="/movimientos">
              <i className="bi bi-cash-coin me-2"></i>Movimientos
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white rounded hover-effect" to="/tipos-movimiento">
              <i className="bi bi-arrow-left-right me-2"></i>Tipos de Movimiento
            </Link>
          </li>
          <li className="nav-item mb-2">
            <Link className="nav-link text-white rounded hover-effect" to="/tipos-recaudo">
              <i className="bi bi-collection me-2"></i>Tipos de Recaudo
            </Link>
          </li>
          {user?.rol === 'Admin' && (
            <li className="nav-item mb-2">
              <Link className="nav-link text-white rounded hover-effect" to="/saldos">
                <i className="bi bi-wallet2 me-2"></i>Saldos
              </Link>
            </li>
          )}
          <li className="nav-item mt-5">
            <Button variant="outline-danger" size="sm" onClick={handleLogout} className="w-100">
              <i className="bi bi-box-arrow-right me-2"></i>Cerrar Sesión
            </Button>
          </li>
        </ul>
      </div>
      
      {/* Contenido principal */}
      <div style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        <Container fluid className="p-4">
          <div className="content-wrapper">
            {children}
          </div>
        </Container>
      </div>
    </div>
  );
};

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={
        isAuthenticated ? <Navigate to="/dashboard" /> : <Login />
      } />
      
      <Route path="/register" element={
        isAuthenticated ? <Navigate to="/dashboard" /> : <Register />
      } />
      
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout>
            <Dashboard />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/students" element={
        <ProtectedRoute>
          <Layout>
            <StudentTable />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/trainers" element={
        <ProtectedRoute>
          <Layout>
            <Trainers />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/locations" element={
        <ProtectedRoute>
          <Layout>
            <Location />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/saldos" element={
        <ProtectedRoute requiredRole="Admin">
          <Layout>
            <Saldos />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/servicios" element={
        <ProtectedRoute>
          <Layout>
            <Servicios />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/movimientos" element={
        <ProtectedRoute>
          <Layout>
            <Movimientos />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/tipos-movimiento" element={
        <ProtectedRoute>
          <Layout>
            <TiposMovimiento />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/tipos-recaudo" element={
        <ProtectedRoute>
          <Layout>
            <TiposRecaudo />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;