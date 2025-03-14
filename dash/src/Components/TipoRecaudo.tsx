import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

interface TipoRecaudo {
  idTipoRecaudo: number;
  nombre: string;
}

const TiposRecaudo: FC = () => {
  const [tiposRecaudo, setTiposRecaudo] = useState<TipoRecaudo[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoEditar, setTipoEditar] = useState<Partial<TipoRecaudo> | null>(null);
  const [esNuevoTipo, setEsNuevoTipo] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  useEffect(() => {
    const obtenerTiposRecaudo = async () => {
      try {
        setLoading(true);
        const respuesta = await axios.get('http://localhost:5180/api/TiposRecaudo');
        console.log('Datos de tipos de recaudo recibidos:', respuesta.data);
        setTiposRecaudo(respuesta.data);
      } catch (error) {
        console.error('Error al obtener tipos de recaudo:', error);
        alert('Error al cargar los tipos de recaudo. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    obtenerTiposRecaudo();
  }, []);

  const abrirModalNuevo = () => {
    setTipoEditar({
      nombre: ''
    });
    setEsNuevoTipo(true);
    setMostrarModal(true);
  };

  const abrirModalEditar = (tipo: TipoRecaudo) => {
    setTipoEditar({
      ...tipo
    });
    setEsNuevoTipo(false);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setTipoEditar(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (tipoEditar) {
      setTipoEditar({
        ...tipoEditar,
        [name]: value
      });
    }
  };

  const guardarTipo = async () => {
    if (!tipoEditar) return;
    
    try {
      if (esNuevoTipo) {
        await axios.post('http://localhost:5180/api/TiposRecaudo', tipoEditar);
      } else {
        await axios.put(`http://localhost:5180/api/TiposRecaudo/${tipoEditar.idTipoRecaudo}`, tipoEditar);
      }
      
      // Recargar datos
      window.location.reload();
    } catch (error) {
      console.error('Error al guardar tipo de recaudo:', error);
      alert('Error al guardar el tipo de recaudo. Por favor, intenta de nuevo.');
    }
  };

  const eliminarTipo = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este tipo de recaudo?')) {
      try {
        await axios.delete(`http://localhost:5180/api/TiposRecaudo/${id}`);
        // Recargar datos
        window.location.reload();
      } catch (error) {
        console.error('Error al eliminar tipo de recaudo:', error);
        alert('Error al eliminar el tipo de recaudo. Por favor, intenta de nuevo.');
      }
    }
  };

  const tiposFiltrados = tiposRecaudo.filter(tipo => 
    tipo.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tipos de Recaudo</h2>
        <button className="btn btn-primary" onClick={abrirModalNuevo}>
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Tipo de Recaudo
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
                  {tiposFiltrados.length > 0 ? (
                    tiposFiltrados.map(tipo => (
                      <tr key={tipo.idTipoRecaudo}>
                        <td>{tipo.idTipoRecaudo}</td>
                        <td>{tipo.nombre}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => abrirModalEditar(tipo)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarTipo(tipo.idTipoRecaudo)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center">No hay tipos de recaudo registrados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear/editar tipo de recaudo */}
      <Modal show={mostrarModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{esNuevoTipo ? 'Nuevo Tipo de Recaudo' : 'Editar Tipo de Recaudo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={tipoEditar?.nombre || ''}
                onChange={handleInputChange}
                placeholder="Nombre del tipo de recaudo"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarTipo}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default TiposRecaudo;