import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './sidebar-new.css'; // Importamos directamente el CSS aquí también

const SidebarNew = () => {
  console.log('SidebarNew component rendering');
  const { logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [showSorteosMenu, setShowSorteosMenu] = useState(false);

  // Añadimos un useEffect para verificar que el componente se monta
  useEffect(() => {
    console.log('SidebarNew component mounted');
    // Podemos añadir un estilo directo para forzar la visualización
    document.querySelector('.sidebar-container')?.setAttribute('style', 'background-color: #470202 !important');
  }, []);

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

  const toggleSorteosMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowSorteosMenu(!showSorteosMenu);
  };

  // El resto del componente permanece igual
  return (
    <div className="sidebar-container">
      <div className="sidebar-logo">
        {/* Corregimos la ruta del logo para asegurarnos que se carga correctamente */}
        <img src="/Futbol.png" alt="TopFutbol Logo" className="logo-image" />
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
        
        {/* Añadimos el menú de Sorteos y Rifas */}
        <div className="nav-item">
          <a 
            href="#" 
            className="nav-link" 
            onClick={toggleSorteosMenu}
          >
            <i className="bi bi-ticket-perforated"></i>
            <span>Sorteos y Rifas</span>
            <i className={`bi bi-chevron-${showSorteosMenu ? 'up' : 'down'} ms-auto`}></i>
          </a>
          
          {showSorteosMenu && (
            <div className="submenu">
              {/* Eliminamos la opción de Vendedores */}
              <NavLink to="/sorteos/talonarios" className={({isActive}) => `nav-item submenu-item ${isActive ? 'active' : ''}`}>
                <i className="bi bi-journal-bookmark"></i>
                <span>Talonarios</span>
              </NavLink>
              
              <NavLink to="/sorteos/boletas" className={({isActive}) => `nav-item submenu-item ${isActive ? 'active' : ''}`}>
                <i className="bi bi-card-list"></i>
                <span>Boletas</span>
              </NavLink>
              
              <NavLink to="/sorteos/pagos" className={({isActive}) => `nav-item submenu-item ${isActive ? 'active' : ''}`}>
                <i className="bi bi-cash"></i>
                <span>Pagos</span>
              </NavLink>
              
              <NavLink to="/sorteos/movimientos" className={({isActive}) => `nav-item submenu-item ${isActive ? 'active' : ''}`}>
                <i className="bi bi-arrow-down-up"></i>
                <span>Transacciones</span>
              </NavLink>
              
              <NavLink to="/talonario-digital" className={({isActive}) => `nav-item submenu-item ${isActive ? 'active' : ''}`}>
                <i className="bi bi-grid-3x3"></i>
                <span>Talonario Digital</span>
              </NavLink>
            </div>
          )}
        </div>
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

export default SidebarNew;