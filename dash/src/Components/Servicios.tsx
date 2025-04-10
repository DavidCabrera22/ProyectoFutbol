import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
const API_URL = import.meta.env.VITE_API_URL || 'https://topfutbol-production.up.railway.app';


interface Servicio {
  idServicio: number;
  nombre: string;
}

const Servicios: FC = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [servicioEditar, setServicioEditar] = useState<Partial<Servicio> | null>(null);
  const [esNuevoServicio, setEsNuevoServicio] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true);
        const respServicios =   await axios.get(`${API_URL}/api/Servicios`);
        
        setServicios(respServicios.data);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        alert('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

  const abrirModalNuevo = () => {
    setServicioEditar({
      nombre: ''
    });
    setEsNuevoServicio(true);
    setMostrarModal(true);
  };

  const abrirModalEditar = (servicio: Servicio) => {
    setServicioEditar({
      ...servicio
    });
    setEsNuevoServicio(false);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setServicioEditar(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (servicioEditar) {
      setServicioEditar({
        ...servicioEditar,
        [name]: value
      });
    }
  };

  const guardarServicio = async () => {
    if (!servicioEditar) return;
    
    try {
      if (esNuevoServicio) {
        await axios.post(`${API_URL}/api/Servicios`, servicioEditar);
      } else {
        await axios.put(`${API_URL}/api/Servicios/${servicioEditar.idServicio}`, servicioEditar);
      }
      
      // Recargar datos
      window.location.reload();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      alert('Error al guardar el servicio. Por favor, intenta de nuevo.');
    }
  };

  const eliminarServicio = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      try {
        await axios.delete(`${API_URL}/api/Servicios/${id}`);
        // Recargar datos
        window.location.reload();
      } catch (error) {
        console.error('Error al eliminar servicio:', error);
        alert('Error al eliminar el servicio. Por favor, intenta de nuevo.');
      }
    }
  };

  const serviciosFiltrados = servicios.filter(servicio => 
    servicio.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Servicios</h2>
        <button className="btn btn-primary" onClick={abrirModalNuevo}>
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Servicio
        </button>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre..."
                  value={terminoBusqueda}
                  onChange={(e) => setTerminoBusqueda(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {serviciosFiltrados.length > 0 ? (
                    serviciosFiltrados.map(servicio => (
                      <tr key={servicio.idServicio}>
                        <td>{servicio.idServicio}</td>
                        <td>{servicio.nombre}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => abrirModalEditar(servicio)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarServicio(servicio.idServicio)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">No hay servicios registrados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear/editar servicio */}
      <Modal show={mostrarModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{esNuevoServicio ? 'Nuevo Servicio' : 'Editar Servicio'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={servicioEditar?.nombre || ''}
                onChange={handleInputChange}
                placeholder="Nombre del servicio"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarServicio}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Servicios;