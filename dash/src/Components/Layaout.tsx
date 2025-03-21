import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Students from './StudentTable';
import Trainers from './Trainers';
import Locations from './Location';
import Categories from './Categories';
// Importar los nuevos componentes
import Movimientos from './Movimiento';
import Servicios from './Servicios';
import TiposMovimiento from './TiposMovimiento';
import TiposRecaudo from './TipoRecaudo';
import Saldos from './Saldos';
// Cambiamos el orden de importación para que sidebar.css tenga prioridad
import './global.css';
import './sidebar.css';
import './sidebar-new.css';

// Define content style for better spacing and layout
const contentStyle = {
  marginLeft: '250px',
  width: 'calc(100% - 250px)',
  minHeight: '100vh',
  padding: '20px',
  backgroundColor: '#f9fafb'
};

const Layout = () => {
  return (
    <div className="d-flex">
      <Sidebar />
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