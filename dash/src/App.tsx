import { BrowserRouter as Router } from 'react-router-dom';
import Layout from './Components/Layaout';
import 'bootstrap/dist/css/bootstrap.min.css';  

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;