import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Students from './StudentTable';
import Trainers from './Trainers';
import Locations from './Location';
import Categories from './Categories';
// Importar los nuevos componentes (aún no creados)
import Movimientos from './Movimiento';
import Servicios from './Servicios';
import TiposMovimiento from './TiposMovimiento';
import TiposRecaudo from './TipoRecaudo';
import Saldos from './Saldos';

const Layout = () => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/trainers" element={<Trainers />} />
          <Route path="/students" element={<Students />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/categories" element={<Categories />} />
          {/* Nuevas rutas para finanzas */}
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