import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from './AuthContext';

const Sidebar = () => {
  const { logout, user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro que deseas cerrar sesión?')) {
      logout();
      window.location.href = '/login';
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Here you would implement actual dark mode functionality
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        <img src="/images/Futbol.png" alt="TopFutbol Logo" className="logo-image" />
        <span className="logo-text">TopFutbol</span>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <i className="bi bi-house-door"></i>
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/students" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <i className="bi bi-people"></i>
          <span>Estudiantes</span>
        </NavLink>
        
        <NavLink to="/trainers" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <i className="bi bi-person-badge"></i>
          <span>Formadores</span>
        </NavLink>
        
        <NavLink to="/locations" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <i className="bi bi-geo-alt"></i>
          <span>Sedes</span>
        </NavLink>
        
        <NavLink to="/categories" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <i className="bi bi-tags"></i>
          <span>Categorías</span>
        </NavLink>
        
        <NavLink to="/servicios" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <i className="bi bi-list-check"></i>
          <span>Servicios</span>
        </NavLink>
        
        <NavLink to="/movimientos" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <i className="bi bi-arrow-left-right"></i>
          <span>Movimientos</span>
        </NavLink>
        
        <NavLink to="/tipos-movimiento" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <i className="bi bi-diagram-3"></i>
          <span>Tipos de Movimiento</span>
        </NavLink>
        
        <NavLink to="/tipos-recaudo" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <i className="bi bi-cash-stack"></i>
          <span>Tipos de Recaudo</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <div className="dark-mode-toggle">
          <span>Dark Mode</span>
          <label className="toggle-switch">
            <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
            <span className="toggle-slider"></span>
          </label>
        </div>
        
        <button className="logout-button" onClick={handleLogout}>
          <i className="bi bi-box-arrow-right"></i>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;