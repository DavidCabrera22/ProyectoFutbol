import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar bg-white p-3" style={{width: '250px', height: '100vh'}}>
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