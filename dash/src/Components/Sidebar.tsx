import { NavLink } from 'react-router-dom';
import { useState } from 'react';

const Sidebar = () => {
  const [showConfigMenu, setShowConfigMenu] = useState(false);

  const toggleConfigMenu = () => {
    setShowConfigMenu(!showConfigMenu);
  };

  return (
    <div className="sidebar bg-white p-3" style={{width: '250px', height: '100vh', overflowY: 'auto'}}>
      <div className="logo mb-4">
        <h4>Dashboard v.01</h4>
      </div>
      <ul className="nav flex-column">
        <li className="nav-item mb-3">
          <NavLink to="/" className={({isActive}) => 
            `nav-link ${isActive ? 'active bg-primary text-white rounded' : 'text-dark'}`
          }>
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item mb-3">
          <NavLink to="/trainers" className={({isActive}) => 
            `nav-link ${isActive ? 'active bg-primary text-white rounded' : 'text-dark'}`
          }>
            <i className="bi bi-people me-2"></i>
            Formadores
          </NavLink>
        </li>
        <li className="nav-item mb-3">
          <NavLink to="/students" className={({isActive}) => 
            `nav-link ${isActive ? 'active bg-primary text-white rounded' : 'text-dark'}`
          }>
            <i className="bi bi-person me-2"></i>
            Alumnos
          </NavLink>
        </li>
        <li className="nav-item mb-3">
          <NavLink to="/locations" className={({isActive}) => 
            `nav-link ${isActive ? 'active bg-primary text-white rounded' : 'text-dark'}`
          }>
            <i className="bi bi-geo-alt me-2"></i>
            Sedes
          </NavLink>
        </li>
        <li className="nav-item mb-3">
          <NavLink to="/categories" className={({isActive}) => 
            `nav-link ${isActive ? 'active bg-primary text-white rounded' : 'text-dark'}`
          }>
            <i className="bi bi-tags me-2"></i>
            Categorías
          </NavLink>
        </li>
        
        {/* Menú desplegable de Configuración (antes Finanzas) */}
        <li className="nav-item mb-3 dropdown">
          <div 
            className="nav-link text-dark d-flex justify-content-between align-items-center"
            onClick={toggleConfigMenu}
            style={{cursor: 'pointer'}}
          >
            <div>
              <i className="bi bi-gear me-2"></i>
              Configuración
            </div>
            <i className={`bi bi-chevron-${showConfigMenu ? 'up' : 'down'}`}></i>
          </div>
          
          {showConfigMenu && (
            <ul className="dropdown-menu show" style={{position: 'static', width: '100%', border: 'none', boxShadow: 'none', padding: '0 0 0 1.5rem'}}>
              <li>
                <NavLink to="/movimientos" className={({isActive}) => 
                  `nav-link ${isActive ? 'active bg-primary text-white rounded' : 'text-dark'}`
                }>
                  <i className="bi bi-arrow-left-right me-2"></i>
                  Movimientos
                </NavLink>
              </li>
              <li>
                <NavLink to="/servicios" className={({isActive}) => 
                  `nav-link ${isActive ? 'active bg-primary text-white rounded' : 'text-dark'}`
                }>
                  <i className="bi bi-bag me-2"></i>
                  Servicios
                </NavLink>
              </li>
              <li>
                <NavLink to="/tipos-movimiento" className={({isActive}) => 
                  `nav-link ${isActive ? 'active bg-primary text-white rounded' : 'text-dark'}`
                }>
                  <i className="bi bi-list-check me-2"></i>
                  Tipos de Movimiento
                </NavLink>
              </li>
              <li>
                <NavLink to="/tipos-recaudo" className={({isActive}) => 
                  `nav-link ${isActive ? 'active bg-primary text-white rounded' : 'text-dark'}`
                }>
                  <i className="bi bi-collection me-2"></i>
                  Tipos de Recaudo
                </NavLink>
              </li>
              <li>
                <NavLink to="/saldos" className={({isActive}) => 
                  `nav-link ${isActive ? 'active bg-primary text-white rounded' : 'text-dark'}`
                }>
                  <i className="bi bi-wallet2 me-2"></i>
                  Saldos
                </NavLink>
              </li>
            </ul>
          )}
        </li>
        
        <li className="nav-item">
          <NavLink to="/help" className={({isActive}) => 
            `nav-link ${isActive ? 'active bg-primary text-white rounded' : 'text-dark'}`
          }>
            <i className="bi bi-question-circle me-2"></i>
            Help
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;