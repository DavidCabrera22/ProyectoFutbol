import { Routes, Route } from 'react-router-dom';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import Students from './StudentTable';
import Trainers from './Trainers';  // Asegúrate de que esta importación sea correcta
import Locations from './Location';
import Categories from './Categories';

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
        </Routes>
      </div>
    </div>
  );
};

export default Layout;