import { Routes, Route } from 'react-router-dom';
// Cambiamos la importación para ser más explícitos
import SidebarNew from './SidebarNew';
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
// Simplificar las importaciones de CSS
import './global.css';
// Usar solo un archivo CSS para el sidebar
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
      {/* Cambiamos el nombre del componente para que coincida con la importación */}
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