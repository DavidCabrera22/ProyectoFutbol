// Asegúrate de que la importación sea correcta
import SidebarNew from './SidebarNew';
import Dashboard from './Dashboard';
import Trainers from './Trainers';
import Students from './StudentTable';
import Locations from './Location';
import Categories from './Categories';
import Movimientos from './Movimiento';
import Servicios from './Servicios';
import TiposMovimiento from './TiposMovimiento';
import TiposRecaudo from './TipoRecaudo';
import Saldos from './Saldos';
import { Routes, Route } from 'react-router-dom';
import './dropdown-fix.css'; // Importamos un nuevo archivo CSS para arreglar los dropdowns

const contentStyle = {
  marginLeft: '250px', // Asegúrate de que haya espacio para el sidebar
  padding: '20px',
  backgroundColor: '#f9fafb'
};

const Layout = () => {
  return (
    <div className="d-flex">
      <SidebarNew />
      <div className="flex-grow-1 content-area" style={contentStyle}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/students" element={<Students />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/categories" element={<Categories />} />
          {/* Rutas para finanzas */}
          <Route path="/movimientos" element={<Movimientos />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/tipos-movimiento" element={<TiposMovimiento />} />
          <Route path="/tipos-recaudo" element={<TiposRecaudo />} />
          <Route path="/saldos" element={<Saldos />} />
        </Routes>
      </div>
    </div>
  );
};

export default Layout;