import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
const API_URL = import.meta.env.VITE_API_URL;


interface Location {
  idSede: number;
  ciudad: string;
  nombreSede: string;
}

const Locations: FC = () => {
  // Estados para manejar los datos y la UI
  const [sedes, setSedes] = useState<Location[]>([]);
  const [sedesFiltradas, setSedesFiltradas] = useState<Location[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('reciente');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [sedeEditar, setSedeEditar] = useState<Location | null>(null);
  const [esNuevaSede, setEsNuevaSede] = useState(false);

  // Efecto para cargar las sedes al montar el componente
  useEffect(() => {
    obtenerSedes();
  }, []);

  // Función para obtener las sedes desde la API
  const obtenerSedes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/Sedes`);
      setSedes(response.data);
      setSedesFiltradas(response.data);
    } catch (error) {
      console.error('Error al obtener sedes:', error);
    }
  };

  // Función para manejar la búsqueda de sedes
  const manejarBusqueda = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const termino = evento.target.value;
    setTerminoBusqueda(termino);
    
    if (termino.trim() === '') {
      setSedesFiltradas(sedes);
    } else {
      const filtradas = sedes.filter(sede => 
        sede.nombreSede.toLowerCase().includes(termino.toLowerCase()) ||
        sede.ciudad.toLowerCase().includes(termino.toLowerCase())
      );
      setSedesFiltradas(filtradas);
    }
  };

  // Función para manejar el ordenamiento de sedes
  const manejarOrdenamiento = (evento: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = evento.target.value;
    setOrdenamiento(valor);
    const sedesOrdenadas = [...sedesFiltradas];
    
    switch (valor) {
      case 'a-z':
        sedesOrdenadas.sort((a, b) => a.nombreSede.localeCompare(b.nombreSede));
        break;
      case 'z-a':
        sedesOrdenadas.sort((a, b) => b.nombreSede.localeCompare(a.nombreSede));
        break;
      case 'ciudad-asc':
        sedesOrdenadas.sort((a, b) => a.ciudad.localeCompare(b.ciudad));
        break;
      case 'ciudad-desc':
        sedesOrdenadas.sort((a, b) => b.ciudad.localeCompare(a.ciudad));
        break;
      case 'reciente':
        sedesOrdenadas.sort((a, b) => b.idSede - a.idSede);
        break;
      case 'antiguo':
        sedesOrdenadas.sort((a, b) => a.idSede - b.idSede);
        break;
    }
    
    setSedesFiltradas(sedesOrdenadas);
  };

  // Función para iniciar la creación de una nueva sede
  const nuevaSede = () => {
    setEsNuevaSede(true);
    setSedeEditar({
      idSede: 0,
      ciudad: '',
      nombreSede: ''
    });
    setMostrarModal(true);
  };

  // Función para iniciar la edición de una sede existente
  const editarSede = (id: number) => {
    const sede = sedes.find(s => s.idSede === id);
    if (sede) {
      setEsNuevaSede(false);
      setSedeEditar({ ...sede });
      setMostrarModal(true);
    }
  };

  // Función para eliminar una sede
  const eliminarSede = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta sede?')) {
      try {
        await axios.delete(`${API_URL}/api/Sedes/${id}`);
        obtenerSedes();
      } catch (error) {
        console.error('Error al eliminar sede:', error);
      }
    }
  };

  // Función para actualizar un campo de la sede en edición
  const actualizarCampo = (campo: keyof Location, valor: string) => {
    if (sedeEditar) {
      setSedeEditar({
        ...sedeEditar,
        [campo]: valor
      });
    }
  };

  // Función para guardar los cambios (crear o actualizar sede)
  const guardarCambios = async () => {
    if (!sedeEditar) return;

    try {
      if (esNuevaSede) {
        await axios.post(`${API_URL}/api/Sedes`, sedeEditar);
        alert('Sede creada con éxito');
      } else {
        await axios.put(`${API_URL}/api/Sedes/${sedeEditar.idSede}`, sedeEditar);
        alert('Sede actualizada con éxito');
      }
      
      setMostrarModal(false);
      obtenerSedes();
    } catch (error) {
      console.error('Error al guardar sede:', error);
      alert('Error al guardar la sede');
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Hola Jorge 👋</h1>
        <div className="d-flex gap-3">
          <Button variant="success" onClick={nuevaSede}>
            <i className="bi bi-plus-circle me-2"></i>
            Agregar Sede
          </Button>
          <input 
            type="search" 
            className="form-control" 
            placeholder="Buscar sede..." 
            style={{width: '200px'}} 
            value={terminoBusqueda}
            onChange={manejarBusqueda}
          />
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-success bg-opacity-25 p-3 rounded-circle">
              <i className="bi bi-building text-success fs-4"></i>
            </div>
            <div>
              <small className="text-muted">Total de Sedes</small>
              <h2 className="mb-0">{sedes.length}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2>Todas las Sedes</h2>
        <p className="text-success mb-4">Sedes activas</p>
        
        <div className="d-flex justify-content-between mb-3">
          <input 
            type="search" 
            className="form-control" 
            placeholder="Buscar por nombre o ciudad..." 
            style={{width: '300px'}} 
            value={terminoBusqueda}
            onChange={manejarBusqueda}
          />
          <select 
            className="form-select" 
            style={{width: '200px'}}
            value={ordenamiento}
            onChange={manejarOrdenamiento}
          >
            <option value="reciente">Más reciente</option>
            <option value="antiguo">Más antiguo</option>
            <option value="a-z">A-Z (Nombre)</option>
            <option value="z-a">Z-A (Nombre)</option>
            <option value="ciudad-asc">A-Z (Ciudad)</option>
            <option value="ciudad-desc">Z-A (Ciudad)</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID Sede</th>
                <th>Ciudad</th>
                <th>Nombre de la Sede</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sedesFiltradas.map((sede) => (
                <tr key={sede.idSede}>
                  <td>{sede.idSede}</td>
                  <td>{sede.ciudad}</td>
                  <td>{sede.nombreSede}</td>
                  <td>
                    <div className="btn-group">
                      <button 
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => editarSede(sede.idSede)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarSede(sede.idSede)}
                        title="Eliminar"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <nav>
          <ul className="pagination justify-content-end">
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li className="page-item active"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
            <li className="page-item"><a className="page-link" href="#">4</a></li>
            <li className="page-item"><a className="page-link" href="#">40</a></li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal de edición/creación */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {esNuevaSede ? 'Agregar Sede' : 'Editar Sede'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {sedeEditar && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre de la Sede</Form.Label>
                <Form.Control
                  type="text"
                  value={sedeEditar.nombreSede}
                  onChange={(e) => actualizarCampo('nombreSede', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control
                  type="text"
                  value={sedeEditar.ciudad}
                  onChange={(e) => actualizarCampo('ciudad', e.target.value)}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarCambios}>
            {esNuevaSede ? 'Crear Sede' : 'Guardar Cambios'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Locations;