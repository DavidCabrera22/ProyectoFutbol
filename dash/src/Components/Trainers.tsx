// Importaciones necesarias para el componente
import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
const API_URL = import.meta.env.VITE_API_URL;

// Definición de la interfaz para el tipo de datos de Formador
interface Formador {
  idFormador: number;
  nombre: string;
  telefono: string;
}

const Trainers: FC = () => {
  // Estados para manejar los datos y la UI
  const [formadores, setFormadores] = useState<Formador[]>([]); // Almacena todos los formadores
  const [formadoresFiltrados, setFormadoresFiltrados] = useState<Formador[]>([]); // Almacena los formadores filtrados por búsqueda
  const [terminoBusqueda, setTerminoBusqueda] = useState(''); // Almacena el término de búsqueda
  const [ordenamiento, setOrdenamiento] = useState('reciente'); // Controla el tipo de ordenamiento
  const [mostrarModal, setMostrarModal] = useState(false); // Controla la visibilidad del modal
  const [formadorEditar, setFormadorEditar] = useState<Formador | null>(null); // Almacena el formador que se está editando
  const [esNuevoFormador, setEsNuevoFormador] = useState(false); // Indica si se está creando un nuevo formador

  // Efecto para cargar los formadores al montar el componente
  useEffect(() => {
    obtenerFormadores();
  }, []);

  // Función para obtener los formadores desde la API
  const obtenerFormadores = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/Formadores`);
      setFormadores(response.data);
      setFormadoresFiltrados(response.data);
    } catch (error) {
      console.error('Error al obtener formadores:', error);
    }
  };

  // Función para manejar la búsqueda de formadores
  const manejarBusqueda = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const termino = evento.target.value;
    setTerminoBusqueda(termino);
    
    // Filtra los formadores según el término de búsqueda
    if (termino.trim() === '') {
      setFormadoresFiltrados(formadores);
    } else {
      const filtrados = formadores.filter(formador => 
        formador.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        formador.telefono.includes(termino)
      );
      setFormadoresFiltrados(filtrados);
    }
  };

  // Función para manejar el ordenamiento de formadores
  const manejarOrdenamiento = (evento: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = evento.target.value;
    setOrdenamiento(valor);
    const formadoresOrdenados = [...formadoresFiltrados];
    
    // Ordena los formadores según el criterio seleccionado
    switch (valor) {
      case 'a-z':
        formadoresOrdenados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'z-a':
        formadoresOrdenados.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'reciente':
        formadoresOrdenados.sort((a, b) => b.idFormador - a.idFormador);
        break;
      case 'antiguo':
        formadoresOrdenados.sort((a, b) => a.idFormador - b.idFormador);
        break;
    }
    
    setFormadoresFiltrados(formadoresOrdenados);
  };

  // Función para iniciar la creación de un nuevo formador
  const nuevoFormador = () => {
    setEsNuevoFormador(true);
    setFormadorEditar({
      idFormador: 0,
      nombre: '',
      telefono: ''
    });
    setMostrarModal(true);
  };

  // Función para iniciar la edición de un formador existente
  const editarFormador = (id: number) => {
    const formador = formadores.find(f => f.idFormador === id);
    if (formador) {
      setEsNuevoFormador(false);
      setFormadorEditar({ ...formador });
      setMostrarModal(true);
    }
  };

  // Función para eliminar un formador
  const eliminarFormador = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este formador?')) {
      try {
        await axios.delete(`${API_URL}/api/Formadores/${id}`);
        obtenerFormadores(); // Recarga la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar formador:', error);
      }
    }
  };

  // Función para actualizar un campo del formador en edición
  const actualizarCampo = (campo: keyof Formador, valor: string) => {
    if (formadorEditar) {
      setFormadorEditar({
        ...formadorEditar,
        [campo]: valor
      });
    }
  };

   // Función para guardar los cambios (crear o actualizar formador)
   const guardarCambios = async () => {
    if (!formadorEditar) return;

    try {
      if (esNuevoFormador) {
        // Crea un nuevo formador
        await axios.post(`${API_URL}/api/Formadores`, formadorEditar);
        alert('Formador creado con éxito');
      } else {
        // Actualiza un formador existente
        await axios.put(`${API_URL}/api/Formadores/${formadorEditar.idFormador}`, formadorEditar);
        alert('Formador actualizado con éxito');
      }
      
      setMostrarModal(false);
      obtenerFormadores(); // Recarga la lista después de guardar
    } catch (error) {
      console.error('Error al guardar formador:', error);
      alert('Error al guardar el formador');
    }
  };

  // Renderizado del componente
  return (
    <div className="p-4">
      {/* Encabezado con título y barra de búsqueda */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Hola Jorge 👋</h1>
        <div className="d-flex gap-3">
          <Button variant="success" onClick={nuevoFormador}>
            <i className="bi bi-plus-circle me-2"></i>
            Agregar Formador
          </Button>
          <input 
            type="search" 
            className="form-control" 
            placeholder="Buscar formador..." 
            style={{width: '200px'}} 
            value={terminoBusqueda}
            onChange={manejarBusqueda}
          />
        </div>
      </div>

      {/* Tarjeta con el total de formadores */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-success bg-opacity-25 p-3 rounded-circle">
              <i className="bi bi-people text-success fs-4"></i>
            </div>
            <div>
              <small className="text-muted">Total de Formadores</small>
              <h2 className="mb-0">{formadores.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Sección principal con la tabla de formadores */}
      <div className="mb-4">
        <h2>Todos los Formadores</h2>
        <p className="text-success mb-4">Formadores activos</p>
        
        {/* Controles de búsqueda y ordenamiento */}
        <div className="d-flex justify-content-between mb-3">
          <input 
            type="search" 
            className="form-control" 
            placeholder="Buscar por nombre o teléfono..." 
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
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
        </div>

        {/* Tabla de formadores */}
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID Formador</th>
                <th>Nombre</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {formadoresFiltrados.map((formador) => (
                <tr key={formador.idFormador}>
                  <td>{formador.idFormador}</td>
                  <td>{formador.nombre}</td>
                  <td>{formador.telefono}</td>
                  <td>
                    <div className="btn-group">
                      <button 
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => editarFormador(formador.idFormador)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarFormador(formador.idFormador)}
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

        {/* Paginación */}
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

      {/* Modal para crear o editar formadores */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {esNuevoFormador ? 'Agregar Formador' : 'Editar Formador'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formadorEditar && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  value={formadorEditar.nombre}
                  onChange={(e) => actualizarCampo('nombre', e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  value={formadorEditar.telefono}
                  onChange={(e) => actualizarCampo('telefono', e.target.value)}
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
            {esNuevoFormador ? 'Crear Formador' : 'Guardar Cambios'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Trainers;