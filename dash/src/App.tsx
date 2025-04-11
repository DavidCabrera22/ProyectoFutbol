import React, { useState } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import Login from './Components/Login';
import Register from './Components/Register';
import Unauthorized from './Components/Unauthorized';
import StudentTable from './Components/StudentTable';
import Trainers from './Components/Trainers';
import Location from './Components/Location';
import Categories from './Components/Categories';
import Saldos from './Components/Saldos';
import Servicios from './Components/Servicios';
import Movimientos from './Components/Movimiento';
import TiposMovimiento from './Components/TiposMovimiento';
import TiposRecaudo from './Components/TipoRecaudo';
import MetodosRecaudo from './Components/MetodoRecaudo';
// Eliminamos la importación de SorteosVendedores
import SorteosTalonarios from './Components/SorteosTalonarios';
import SorteosBoletas from './Components/SorteosBoletas';
import SorteosPagos from './Components/SorteosPagos';
import SorteosMovimientos from './Components/SorteosMovimientos';
import TalonarioDigital from './Components/TalonarioDigital';
import { useAuth } from './Components/AuthContext';
import { Button, Container } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Components/global.css';
import ApiTest from './Components/ApiTest';

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
  const [showSorteosMenu, setShowSorteosMenu] = useState(false);
  
  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
      window.location.href = '/login';
    }
  };

  const toggleSorteosMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSorteosMenu(!showSorteosMenu);
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
            <Link className="nav-link text-white rounded hover-effect" to="/categories">
              <i className="bi bi-tag me-2"></i>Categorías
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
          <li className="nav-item mb-2">
            <Link className="nav-link text-white rounded hover-effect" to="/metodos-recaudo">
              <i className="bi bi-collection-fill me-2"></i>Métodos de Recaudo
            </Link>
          </li>
          <li className="nav-item mb-2">
            <a 
              className="nav-link text-white rounded hover-effect" 
              href="#" 
              onClick={toggleSorteosMenu}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <i className="bi bi-ticket-perforated me-2"></i>
                Sorteos y Rifas
              </div>
              <i className={`bi bi-chevron-${showSorteosMenu ? 'up' : 'down'}`}></i>
            </a>
            {showSorteosMenu && (
              <ul style={{ 
                listStyle: 'none', 
                paddingLeft: '5px', 
                marginTop: '5px',
                width: '100%'
              }}>
                {/* Eliminamos la opción de Vendedores */}
                <li className="nav-item mb-2">
                  <Link className="nav-link text-white rounded hover-effect" to="/sorteos/talonarios">
                    <i className="bi bi-journal-bookmark me-2"></i>Talonarios
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link className="nav-link text-white rounded hover-effect" to="/sorteos/boletas">
                    <i className="bi bi-card-list me-2"></i>Boletas
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link className="nav-link text-white rounded hover-effect" to="/sorteos/pagos">
                    <i className="bi bi-cash me-2"></i>Pagos
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link className="nav-link text-white rounded hover-effect" to="/sorteos/movimientos">
                    <i className="bi bi-arrow-down-up me-2"></i>Transacciones
                  </Link>
                </li>
                <li className="nav-item mb-2">
                  <Link className="nav-link text-white rounded hover-effect" to="/talonario-digital">
                    <i className="bi bi-grid-3x3 me-2"></i>Talonario Digital
                  </Link>
                </li>
              </ul>
            )}
          </li>
          
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
      
      {/* Añadir la ruta para ApiTest */}
      <Route path="/api-test" element={<ApiTest />} />
      
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
      
      <Route path="/categories" element={
        <ProtectedRoute>
          <Layout>
            <Categories />
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
      
      <Route path="/metodos-recaudo" element={
        <ProtectedRoute>
          <Layout>
            <MetodosRecaudo />
          </Layout>
        </ProtectedRoute>
      } />
      
      {/* Eliminamos la ruta de Vendedores */}
      
      <Route path="/sorteos/talonarios" element={
        <ProtectedRoute>
          <Layout>
            <SorteosTalonarios />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/sorteos/boletas" element={
        <ProtectedRoute>
          <Layout>
            <SorteosBoletas />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/sorteos/pagos" element={
        <ProtectedRoute>
          <Layout>
            <SorteosPagos />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/sorteos/movimientos" element={
        <ProtectedRoute>
          <Layout>
            <SorteosMovimientos />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/talonario-digital" element={
        <ProtectedRoute>
          <Layout>
            <TalonarioDigital />
          </Layout>
        </ProtectedRoute>
      } />
      
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;