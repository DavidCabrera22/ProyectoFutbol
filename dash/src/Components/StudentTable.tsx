import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

interface Estudiante {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  idSede: number;
  nombreSede: string;
  idFormador: number;
  nombreFormador: string;
  idCategoria: number;
  nombreCategoria: string;
}


interface Sede {
  idSede: number;
  nombreSede: string;
  ciudad: string;
}

interface Formador {
  idFormador: number;
  nombre: string;
  telefono: string;
}

interface Categoria {
  idCategoria: number;
  nombre: string;
}

const StudentTable: FC = () => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState<Estudiante[]>([]);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [ordenamiento, setOrdenamiento] = useState('reciente');
  const [estudianteEditar, setEstudianteEditar] = useState<Estudiante | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [esNuevoEstudiante, setEsNuevoEstudiante] = useState(false);
  const [formadores, setFormadores] = useState<Formador[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);

  useEffect(() => {
    obtenerEstudiantes();
    obtenerDatosIniciales();
  }, []);

  const obtenerDatosIniciales = async () => {
    try {
      const [respFormadores, respCategorias, respSedes] = await Promise.all([
        axios.get('http://localhost:5180/api/Formadores'),
        axios.get('http://localhost:5180/api/Categorias'),
        axios.get('http://localhost:5180/api/Sedes')
      ]);
      
      console.log('Sedes:', respSedes.data);
      console.log('Formadores:', respFormadores.data);
      console.log('Categorías:', respCategorias.data);
      
      setFormadores(respFormadores.data);
      setCategorias(respCategorias.data);
      setSedes(respSedes.data);
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  };


  useEffect(() => {
    const filtrados = estudiantes.filter(estudiante => 
      estudiante.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      estudiante.apellido.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      estudiante.email.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      estudiante.id.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );
    setEstudiantesFiltrados(filtrados);
  }, [terminoBusqueda, estudiantes]);

  const obtenerEstudiantes = async () => {
    try {
      const respuesta = await axios.get('http://localhost:5180/api/Alumnos');
      console.log('Datos de alumnos recibidos:', respuesta.data);
      setEstudiantes(respuesta.data);
      setEstudiantesFiltrados(respuesta.data);
      setTotalEstudiantes(respuesta.data.length);
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
      alert('Error al cargar los estudiantes. Por favor, intenta de nuevo.');
    }
  };
  

  const manejarBusqueda = (evento: React.ChangeEvent<HTMLInputElement>) => {
    setTerminoBusqueda(evento.target.value);
  };

  const editarEstudiante = async (id: string) => {
    try {
      const respuesta = await axios.get(`http://localhost:5180/api/Alumnos/${id}`);
      setEstudianteEditar(respuesta.data);
      setEsNuevoEstudiante(false);
      setMostrarModal(true);
    } catch (error) {
      console.error('Error al obtener datos del estudiante:', error);
    }
  };

  const nuevoEstudiante = () => {
    setEstudianteEditar({
      id: '',  // Cambiado a string vacío
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      idSede: 0,
      nombreSede: '',
      idFormador: 0,
      nombreFormador: '',
      idCategoria: 0,
      nombreCategoria: ''
    });
    setEsNuevoEstudiante(true);
    setMostrarModal(true);
  };
  
  
  
  const guardarCambios = async () => {
    if (!estudianteEditar) return;
    
    try {
      // Validaciones
      if (!estudianteEditar.nombre.trim()) {
        alert('Por favor ingrese un nombre');
        return;
      }
      
      if (!estudianteEditar.apellido.trim()) {
        alert('Por favor ingrese un apellido');
        return;
      }
      
      if (!estudianteEditar.idCategoria) {
        alert('Por favor seleccione una categoría');
        return;
      }
  
      if (!estudianteEditar.idSede) {
        alert('Por favor seleccione una sede');
        return;
      }
  
      if (!estudianteEditar.idFormador) {
        alert('Por favor seleccione un formador');
        return;
      }
  
      const datosEstudiante = {
        id: estudianteEditar.id,  // Incluir ID para actualizaciones
        nombre: estudianteEditar.nombre,
        apellido: estudianteEditar.apellido,
        email: estudianteEditar.email,
        telefono: estudianteEditar.telefono,
        idSede: Number(estudianteEditar.idSede),
        idCategoria: Number(estudianteEditar.idCategoria),
        idFormador: Number(estudianteEditar.idFormador)
      };
  
      console.log('Datos a enviar:', datosEstudiante);
  
      if (esNuevoEstudiante) {
        const response = await axios.post('http://localhost:5180/api/Alumnos', datosEstudiante);
        console.log('Respuesta del servidor:', response.data);
        alert('Estudiante creado correctamente');
      } else {
        const response = await axios.put(`http://localhost:5180/api/Alumnos/${estudianteEditar.id}`, datosEstudiante);
        console.log('Respuesta del servidor:', response.data);
        alert('Estudiante actualizado correctamente');
      }
  
      setMostrarModal(false);
      obtenerEstudiantes();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error detallado:', error.response?.data);
        alert(`Error: ${error.response?.data || 'Error al guardar el estudiante'}`);
      } else {
        console.error('Error desconocido:', error);
        alert('Error al guardar el estudiante');
      }
    }
  };
  
  const actualizarCampo = (campo: keyof Estudiante, valor: string | number) => {
    if (estudianteEditar) {
      console.log(`Actualizando ${campo} con valor:`, valor, 'tipo:', typeof valor);
      
      setEstudianteEditar(prevState => {
        if (!prevState) return prevState;
        
        // Handle ID fields
        if (campo === 'idSede' || campo === 'idFormador' || campo === 'idCategoria') {
          // Ensure we have a valid number
          const valorNumerico = Number(valor) || 0;
          console.log('Valor numérico convertido:', valorNumerico);
  
          switch(campo) {
            case 'idSede': {
              const sede = sedes.find(s => s.idSede === valorNumerico);
              console.log('Sede encontrada:', sede);
              return {
                ...prevState,
                idSede: valorNumerico,
                nombreSede: sede ? `${sede.nombreSede} - ${sede.ciudad}` : ''
              };
            }
            case 'idFormador': {
              const formador = formadores.find(f => f.idFormador === valorNumerico);
              console.log('Formador encontrado:', formador);
              return {
                ...prevState,
                idFormador: valorNumerico,
                nombreFormador: formador ? formador.nombre : ''
              };
            }
            case 'idCategoria': {
              const categoria = categorias.find(c => c.idCategoria === valorNumerico);
              console.log('Categoría encontrada:', categoria);
              return {
                ...prevState,
                idCategoria: valorNumerico,
                nombreCategoria: categoria ? categoria.nombre : ''
              };
            }
            default:
              return prevState;
          }
        }
        
        // Handle other fields
        return {
          ...prevState,
          [campo]: valor
        };
      });
    }
  };

  const eliminarEstudiante = async (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      try {
        await axios.delete(`http://localhost:5180/api/Alumnos/${id}`);
        obtenerEstudiantes();
      } catch (error) {
        console.error('Error al eliminar estudiante:', error);
      }
    }
  };

  const manejarOrdenamiento = (evento: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = evento.target.value;
    setOrdenamiento(valor);
    const estudiantes = [...estudiantesFiltrados];
    
    switch (valor) {
      case 'a-z':
        estudiantes.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'z-a':
        estudiantes.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'reciente':
        // Use string comparison or convert to dates if these are date-based IDs
        estudiantes.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'antiguo':
        estudiantes.sort((a, b) => a.id.localeCompare(b.id));
        break;
    }
    
    setEstudiantesFiltrados(estudiantes);
  };

  return (
    <div className="p-4">
      {/* Header y búsqueda */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Hola Jorge 👋</h1>
        <div className="d-flex gap-3">
          <Button variant="success" onClick={nuevoEstudiante}>
            <i className="bi bi-plus-circle me-2"></i>
            Agregar Estudiante
          </Button>
          <input 
            type="search" 
            className="form-control" 
            placeholder="Buscar por ID o nombre..." 
            style={{width: '200px'}} 
            value={terminoBusqueda}
            onChange={manejarBusqueda}
          />
        </div>
      </div>

      {/* Card de total de alumnos */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-success bg-opacity-25 p-3 rounded-circle">
              <i className="bi bi-people text-success fs-4"></i>
            </div>
            <div>
              <small className="text-muted">Total de Alumnos</small>
              <h2 className="mb-0">{totalEstudiantes}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla principal */}
      <div className="mb-4">
        <h2>Todos los Alumnos</h2>
        <p className="text-success mb-4">Alumnos activos</p>
        
        <div className="d-flex justify-content-between mb-3">
          <input 
            type="search" 
            className="form-control" 
            placeholder="Buscar por ID, nombre, apellido o email..." 
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

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Sede</th>
                <th>Formador</th>
                <th>Categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estudiantesFiltrados.map((estudiante) => (
                <tr key={estudiante.id}>
                  <td>{estudiante.id}</td>
                  <td>{estudiante.nombre}</td>
                  <td>{estudiante.apellido}</td>
                  <td>{estudiante.telefono}</td>
                  <td>{estudiante.email}</td>
                  <td>{estudiante.nombreSede || 'No asignado'}</td>
                  <td>{estudiante.nombreFormador || 'No asignado'}</td>
                  <td>{estudiante.nombreCategoria || 'No asignado'}</td>
                  <td>
                    <div className="btn-group">
                      <button 
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => editarEstudiante(estudiante.id)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarEstudiante(estudiante.id)}
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

      {/* Modal de edición/creación */}
<Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>
      {esNuevoEstudiante ? 'Agregar Estudiante' : 'Editar Estudiante'}
    </Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {estudianteEditar && (
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>ID</Form.Label>
          <Form.Control
            type="text"
            value={estudianteEditar.id}
            onChange={(e) => actualizarCampo('id', e.target.value)}
            placeholder="Ingrese un ID único"
            readOnly={!esNuevoEstudiante}
          />
          <Form.Text className="text-muted">
            {esNuevoEstudiante 
              ? "Este ID debe ser único para cada estudiante" 
              : "El ID no se puede modificar una vez creado"}
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            value={estudianteEditar.nombre}
            onChange={(e) => actualizarCampo('nombre', e.target.value)}
          />
        </Form.Group>
        
        {/* El resto del formulario permanece igual */}
        <Form.Group className="mb-3">
          <Form.Label>Apellido</Form.Label>
          <Form.Control
            type="text"
            value={estudianteEditar.apellido}
            onChange={(e) => actualizarCampo('apellido', e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            value={estudianteEditar.telefono}
            onChange={(e) => actualizarCampo('telefono', e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={estudianteEditar.email}
            onChange={(e) => actualizarCampo('email', e.target.value)}
          />
        </Form.Group>
 
              
             
              
              <Form.Group className="mb-3">
  <Form.Label>Sede</Form.Label>
  <Form.Select
    value={estudianteEditar.idSede || 0}
    onChange={(e) => actualizarCampo('idSede', Number(e.target.value))}
  >
    <option value={0}>Seleccione una sede</option>
    {sedes.map((sede) => (
      <option key={sede.idSede} value={sede.idSede}>
        {sede.nombreSede} - {sede.ciudad}
      </option>
    ))}
  </Form.Select>
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label>Formador</Form.Label>
  <Form.Select
    value={estudianteEditar.idFormador || 0}
    onChange={(e) => actualizarCampo('idFormador', Number(e.target.value))}
  >
    <option value={0}>Seleccione un formador</option>
    {formadores?.map((formador) => (
      <option key={formador.idFormador} value={formador.idFormador}>
        {formador.nombre}
      </option>
    ))}
  </Form.Select>
</Form.Group>

<Form.Group className="mb-3">
  <Form.Label>Categoría</Form.Label>
  <Form.Select
    value={estudianteEditar.idCategoria || 0}
    onChange={(e) => actualizarCampo('idCategoria', Number(e.target.value))}
  >
    <option value={0}>Seleccione una categoría</option>
    {categorias?.map((categoria) => (
      <option key={categoria.idCategoria} value={categoria.idCategoria}>
        {categoria.nombre}
      </option>
    ))}
  </Form.Select>
</Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarCambios}>
            {esNuevoEstudiante ? 'Crear Estudiante' : 'Guardar Cambios'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentTable;