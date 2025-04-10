import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Badge } from 'react-bootstrap';
import { useAuth } from './AuthContext';
const API_URL = import.meta.env.VITE_API_URL;

interface EstudianteAPI {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  idSede: string | number;
  nombreSede: string;
  idFormador: string | number;
  nombreFormador: string;
  idCategoria: string | number;
  nombreCategoria: string;
  activo: boolean;
  recomendadoPor: string;
  fechaInactivacion?: string;
  motivoInactividad?: string;
}

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
  activo: boolean;
  recomendadoPor: string;
  fechaInactivacion?: string;
  motivoInactividad?: string;
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

// Nueva interfaz para el historial de inactivaciones
interface InactivacionHistorial {
  id: number;
  fechaInactivacion: string;
  fechaReactivacion: string | null;
  estadoAnterior: boolean;
  estadoNuevo: boolean;
  motivo: string;
  usuarioModificacion: string;
  fechaRegistro: string;
}

const StudentTable: FC = () => {
  const { user } = useAuth(); // Obtenemos el usuario actual
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [estudiantesFiltrados, setEstudiantesFiltrados] = useState<Estudiante[]>([]);
  const [totalEstudiantes, setTotalEstudiantes] = useState(0);
  const [totalActivos, setTotalActivos] = useState(0);
  const [totalInactivos, setTotalInactivos] = useState(0);
  const [ordenamiento, setOrdenamiento] = useState('reciente');
  const [estudianteEditar, setEstudianteEditar] = useState<Estudiante | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [esNuevoEstudiante, setEsNuevoEstudiante] = useState(false);
  const [formadores, setFormadores] = useState<Formador[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [filtroEstado, setFiltroEstado] = useState('todos'); // 'todos', 'activos', 'inactivos'
  
  // Agregamos estados para paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const alumnosPorPagina = 10;
  
  // Nuevos estados para el modal de cambio de estado
  const [mostrarModalEstado, setMostrarModalEstado] = useState(false);
  const [motivoInactivacion, setMotivoInactivacion] = useState('');
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Estudiante | null>(null);
  
  // Nuevo estado para el modal de historial
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const [historialInactivaciones, setHistorialInactivaciones] = useState<InactivacionHistorial[]>([]);

  useEffect(() => {
    obtenerEstudiantes();
    obtenerDatosIniciales();
  }, []);

  const obtenerDatosIniciales = async () => {
    try {
      const [respFormadores, respCategorias, respSedes] = await Promise.all([
        axios.get(`${API_URL}/api/Formadores`),
        axios.get(`${API_URL}/api/Categorias`),
        axios.get(`${API_URL}/api/Sedes`)
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
    let filtrados = [...estudiantes];
    
    // Aplicamos filtro por estado
    if (filtroEstado !== 'todos') {
      filtrados = filtrados.filter(estudiante => 
        filtroEstado === 'activos' ? estudiante.activo : !estudiante.activo
      );
    }
    
    // Si hay un término de búsqueda, filtramos por él
    if (terminoBusqueda.trim()) {
      filtrados = filtrados.filter(estudiante => {
        const terminoLower = terminoBusqueda.toLowerCase();
        return estudiante.nombre.toLowerCase().includes(terminoLower) ||
          estudiante.apellido.toLowerCase().includes(terminoLower) ||
          estudiante.email.toLowerCase().includes(terminoLower) ||
          estudiante.id.toLowerCase().includes(terminoLower) ||
          (estudiante.nombreCategoria && estudiante.nombreCategoria.toLowerCase().includes(terminoLower)) ||
          (estudiante.recomendadoPor && estudiante.recomendadoPor.toLowerCase().includes(terminoLower));
      });
    }
    
    // Aplicamos el ordenamiento actual
    switch (ordenamiento) {
      case 'a-z':
        filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'z-a':
        filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'reciente':
        filtrados.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'antiguo':
        filtrados.sort((a, b) => a.id.localeCompare(b.id));
        break;
    }
    
    setEstudiantesFiltrados(filtrados);
    // Resetear a la primera página cuando cambia el filtro
    setPaginaActual(1);
  }, [terminoBusqueda, estudiantes, ordenamiento, filtroEstado]);

  const obtenerEstudiantes = async () => {
    try {
      const respuesta = await axios.get(`${API_URL}/api/Alumnos`);
      console.log('Datos de alumnos recibidos:', respuesta.data);
      
      // Aseguramos que todos los campos numéricos sean realmente números
      const estudiantesNormalizados = respuesta.data.map((est: EstudianteAPI) => ({
        ...est,
        idSede: Number(est.idSede),
        idFormador: Number(est.idFormador),
        idCategoria: Number(est.idCategoria),
        activo: est.activo !== undefined ? est.activo : true, // Por defecto activo si no existe el campo
        recomendadoPor: est.recomendadoPor || ''
      }));
      
      setEstudiantes(estudiantesNormalizados);
      setEstudiantesFiltrados(estudiantesNormalizados);
      setTotalEstudiantes(estudiantesNormalizados.length);
      
      // Calculamos totales de activos e inactivos
      const activos = estudiantesNormalizados.filter(e => e.activo).length;
      setTotalActivos(activos);
      setTotalInactivos(estudiantesNormalizados.length - activos);
    } catch (error) {
      console.error('Error al obtener estudiantes:', error);
      alert('Error al cargar los estudiantes. Por favor, intenta de nuevo.');
    }
  };

  // Calculamos los índices de los estudiantes a mostrar en la página actual
  const indexOfLastAlumno = paginaActual * alumnosPorPagina;
  const indexOfFirstAlumno = indexOfLastAlumno - alumnosPorPagina;
  const alumnosActuales = estudiantesFiltrados.slice(indexOfFirstAlumno, indexOfLastAlumno);
  
  // Calculamos el número total de páginas
  const totalPaginas = Math.ceil(estudiantesFiltrados.length / alumnosPorPagina);

  // Función para cambiar de página
  const cambiarPagina = (numeroPagina: number) => {
    setPaginaActual(numeroPagina);
  };

  const manejarBusqueda = (evento: React.ChangeEvent<HTMLInputElement>) => {
    setTerminoBusqueda(evento.target.value);
  };

  // Función para abrir el modal de cambio de estado
  const abrirModalEstado = (estudiante: Estudiante) => {
    setAlumnoSeleccionado(estudiante);
    setMotivoInactivacion('');
    setMostrarModalEstado(true);
  };

  // Función para cambiar el estado de un alumno usando el nuevo endpoint
  // Función para cambiar el estado de un alumno usando el nuevo endpoint
const cambiarEstadoAlumno = async () => {
  if (!alumnoSeleccionado) return;
  
  try {
    const nuevoEstado = {
      activo: !alumnoSeleccionado.activo,
      motivo: motivoInactivacion || (!alumnoSeleccionado.activo ? 'Reactivación de alumno' : 'Inactivación de alumno')
    };
    
    // Corregimos la ruta para que coincida con el controlador en el backend
    await axios.patch(`${API_URL}/api/Alumnos/${alumnoSeleccionado.id}/estado`, {
      Activo: nuevoEstado.activo,
      Motivo: nuevoEstado.motivo
    });
    
    setMostrarModalEstado(false);
    setMotivoInactivacion(''); // Limpiar el motivo después de guardar
    obtenerEstudiantes(); // Recargar la lista de alumnos
    
    alert(nuevoEstado.activo ? 'Alumno activado correctamente' : 'Alumno inactivado correctamente');
  } catch (error) {
    console.error('Error al cambiar estado del alumno:', error);
    
    // Mostrar mensaje de error más detallado
    if (axios.isAxiosError(error)) {
      alert(`Error al cambiar el estado del alumno: ${error.response?.status} ${error.message}`);
      console.log('Detalles del error:', error.response?.data);
    } else {
      alert('Error al cambiar el estado del alumno');
    }
  }
};

  // Función para obtener el historial de inactivaciones
 // Función para obtener el historial de inactivaciones
const obtenerHistorialInactivaciones = async (estudiante) => {
  try {
    setAlumnoSeleccionado(estudiante);
    
    // Corregimos la ruta para que coincida con el controlador en el backend
    const response = await axios.get(`${API_URL}/api/Alumnos/${estudiante.id}/historial-inactivaciones`);
    setHistorialInactivaciones(response.data);
    setMostrarHistorial(true);
  } catch (error) {
    console.error('Error al obtener historial de inactivaciones:', error);
    alert('Error al obtener el historial de inactivaciones');
  }
};

  // Función para formatear fechas
  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleString('es-ES');
  };

  const editarEstudiante = async (id: string) => {
    try {
      const respuesta = await axios.get(`${API_URL}/api/Alumnos/${id}`);
      
      // Normalizamos los campos numéricos
      const estudianteNormalizado = {
        ...respuesta.data,
        idSede: Number(respuesta.data.idSede),
        idFormador: Number(respuesta.data.idFormador),
        idCategoria: Number(respuesta.data.idCategoria),
        activo: respuesta.data.activo !== undefined ? respuesta.data.activo : true,
        recomendadoPor: respuesta.data.recomendadoPor || ''
      };
      
      setEstudianteEditar(estudianteNormalizado);
      setEsNuevoEstudiante(false);
      setMostrarModal(true);
    } catch (error) {
      console.error('Error al obtener datos del estudiante:', error);
    }
  };

  const nuevoEstudiante = () => {
    setEstudianteEditar({
      id: '',
      nombre: '',
      apellido: '',
      telefono: '',
      email: '',
      idSede: 0,
      nombreSede: '',
      idFormador: 0,
      nombreFormador: '',
      idCategoria: 0,
      nombreCategoria: '',
      activo: true, // Por defecto, los nuevos estudiantes están activos
      recomendadoPor: '',
      fechaInactivacion: '',
      motivoInactividad: ''
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
        id: estudianteEditar.id,
        nombre: estudianteEditar.nombre,
        apellido: estudianteEditar.apellido,
        email: estudianteEditar.email,
        telefono: estudianteEditar.telefono,
        idSede: Number(estudianteEditar.idSede),
        idCategoria: Number(estudianteEditar.idCategoria),
        idFormador: Number(estudianteEditar.idFormador),
        activo: estudianteEditar.activo,
        recomendadoPor: estudianteEditar.recomendadoPor,
        fechaInactivacion: estudianteEditar.fechaInactivacion,
        motivoInactividad: estudianteEditar.motivoInactividad
      };
  
      console.log('Datos a enviar:', datosEstudiante);
  
      if (esNuevoEstudiante) {
        const response = await axios.post(`${API_URL}/api/Alumnos`, datosEstudiante);
        console.log('Respuesta del servidor:', response.data);
        alert('Estudiante creado correctamente');
      } else {
        const response = await axios.put(`${API_URL}/api/Alumnos/${estudianteEditar.id}`, datosEstudiante);
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
  
  const actualizarCampo = (campo: keyof Estudiante, valor: string | number | boolean) => {
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
        await axios.delete(`${API_URL}/api/Alumnos/${id}`);
        obtenerEstudiantes();
      } catch (error) {
        console.error('Error al eliminar estudiante:', error);
      }
    }
  };

  const manejarOrdenamiento = (evento: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = evento.target.value;
    setOrdenamiento(valor);
  };

  return (
    <div className="p-4">
      {/* Header y búsqueda */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Hola {user?.nombreUsuario || 'Usuario'} 👋</h1>
        <div className="d-flex gap-3">
          <Button variant="success" onClick={nuevoEstudiante}>
            <i className="bi bi-plus-circle me-2"></i>
            Agregar Estudiante
          </Button>
          <input 
            type="search" 
            className="form-control" 
            placeholder="Buscar por ID, nombre o categoría..." 
            style={{width: '250px'}} 
            value={terminoBusqueda}
            onChange={manejarBusqueda}
          />
        </div>
      </div>

      {/* Cards de estadísticas */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-primary bg-opacity-25 p-3 rounded-circle">
                  <i className="bi bi-people text-primary fs-4"></i>
                </div>
                <div>
                  <small className="text-muted">Total de Alumnos</small>
                  <h2 className="mb-0">{totalEstudiantes}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-success bg-opacity-25 p-3 rounded-circle">
                  <i className="bi bi-person-check text-success fs-4"></i>
                </div>
                <div>
                  <small className="text-muted">Alumnos Activos</small>
                  <h2 className="mb-0">{totalActivos}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex align-items-center gap-3">
                <div className="bg-danger bg-opacity-25 p-3 rounded-circle">
                  <i className="bi bi-person-dash text-danger fs-4"></i>
                </div>
                <div>
                  <small className="text-muted">Alumnos Inactivos</small>
                  <h2 className="mb-0">{totalInactivos}</h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla principal */}
      <div className="mb-4">
        <h2>Todos los Alumnos</h2>
        <p className="text-success mb-4">Gestión de alumnos</p>
        
        <div className="d-flex justify-content-between mb-3">
          <div className="d-flex gap-2" style={{width: '70%'}}>
            <input 
              type="search" 
              className="form-control" 
              placeholder="Buscar por ID, nombre, apellido, email o categoría..." 
              style={{width: '350px'}} 
              value={terminoBusqueda}
              onChange={manejarBusqueda}
            />
            <select 
              className="form-select" 
              style={{width: '200px'}}
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
            >
              <option value="todos">Todos los alumnos</option>
              <option value="activos">Solo activos</option>
              <option value="inactivos">Solo inactivos</option>
            </select>
          </div>
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
                <th>Recomendado por</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {alumnosActuales.length > 0 ? (
                alumnosActuales.map((estudiante) => (
                  <tr key={estudiante.id} className={estudiante.activo ? '' : 'table-secondary'}>
                    <td>{estudiante.id}</td>
                    <td>{estudiante.nombre}</td>
                    <td>{estudiante.apellido}</td>
                    <td>{estudiante.telefono}</td>
                    <td>{estudiante.email}</td>
                    <td>{estudiante.nombreSede || 'No asignado'}</td>
                    <td>{estudiante.nombreFormador || 'No asignado'}</td>
                    <td>{estudiante.nombreCategoria || 'No asignado'}</td>
                    <td>{estudiante.recomendadoPor || 'N/A'}</td>
                    <td>
                      <span className={`badge ${estudiante.activo ? 'bg-success' : 'bg-danger'}`}>
                        {estudiante.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
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
                          className={`btn btn-sm me-1 ${estudiante.activo ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          onClick={() => abrirModalEstado(estudiante)}
                          title={estudiante.activo ? 'Marcar como inactivo' : 'Marcar como activo'}
                        >
                          <i className={`bi ${estudiante.activo ? 'bi-toggle-on' : 'bi-toggle-off'}`}></i>
                        </button>
                        <button 
                          className="btn btn-sm btn-outline-info me-1"
                          onClick={() => obtenerHistorialInactivaciones(estudiante)}
                          title="Ver historial de inactivaciones"
                        >
                          <i className="bi bi-clock-history"></i>
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
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="text-center">
                    No hay estudiantes que coincidan con la búsqueda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <nav>
          <ul className="pagination justify-content-end">
            <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => cambiarPagina(paginaActual - 1)}
                disabled={paginaActual === 1}
              >
                &laquo;
              </button>
            </li>
            
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(numero => (
              <li key={numero} className={`page-item ${paginaActual === numero ? 'active' : ''}`}>
                <button 
                  className="page-link" 
                  onClick={() => cambiarPagina(numero)}
                >
                  {numero}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${paginaActual === totalPaginas || totalPaginas === 0 ? 'disabled' : ''}`}>
              <button 
                className="page-link" 
                onClick={() => cambiarPagina(paginaActual + 1)}
                disabled={paginaActual === totalPaginas || totalPaginas === 0}
              >
                &raquo;
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal de edición/creación */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {esNuevoEstudiante ? 'Agregar Estudiante' : 'Editar Estudiante'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {estudianteEditar && (
            <Form>
              <div className="row">
                <div className="col-md-6">
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
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="switch"
                      id="estado-activo"
                      label="Estudiante activo"
                      checked={estudianteEditar.activo}
                      onChange={(e) => actualizarCampo('activo', e.target.checked)}
                    />
                    <Form.Text className="text-muted">
                      Los estudiantes inactivos son aquellos que ya no asisten a la escuela
                    </Form.Text>
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={estudianteEditar.nombre}
                      onChange={(e) => actualizarCampo('nombre', e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Apellido</Form.Label>
                    <Form.Control
                      type="text"
                      value={estudianteEditar.apellido}
                      onChange={(e) => actualizarCampo('apellido', e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      type="text"
                      value={estudianteEditar.telefono}
                      onChange={(e) => actualizarCampo('telefono', e.target.value)}
                    />
                  </Form.Group>
                </div>
                <div className="col-md-6">
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={estudianteEditar.email}
                      onChange={(e) => actualizarCampo('email', e.target.value)}
                    />
                  </Form.Group>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Sede</Form.Label>
                    <Form.Select
                      value={estudianteEditar.idSede}
                      onChange={(e) => actualizarCampo('idSede', e.target.value)}
                    >
                      <option value="0">Seleccione una sede</option>
                      {sedes.map(sede => (
                        <option key={sede.idSede} value={sede.idSede}>
                          {sede.nombreSede} - {sede.ciudad}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Formador</Form.Label>
                    <Form.Select
                      value={estudianteEditar.idFormador}
                      onChange={(e) => actualizarCampo('idFormador', e.target.value)}
                    >
                      <option value="0">Seleccione un formador</option>
                      {formadores.map(formador => (
                        <option key={formador.idFormador} value={formador.idFormador}>
                          {formador.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
                <div className="col-md-4">
                  <Form.Group className="mb-3">
                    <Form.Label>Categoría</Form.Label>
                    <Form.Select
                      value={estudianteEditar.idCategoria}
                      onChange={(e) => actualizarCampo('idCategoria', e.target.value)}
                    >
                      <option value="0">Seleccione una categoría</option>
                      {categorias.map(categoria => (
                        <option key={categoria.idCategoria} value={categoria.idCategoria}>
                          {categoria.nombre}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </div>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Recomendado por</Form.Label>
                <Form.Control
                  type="text"
                  value={estudianteEditar.recomendadoPor || ''}
                  onChange={(e) => actualizarCampo('recomendadoPor', e.target.value)}
                  placeholder="Opcional: Nombre de quien recomendó al alumno"
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
            {esNuevoEstudiante ? 'Crear Estudiante' : 'Guardar Cambios'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para cambiar estado */}
      <Modal show={mostrarModalEstado} onHide={() => setMostrarModalEstado(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {alumnoSeleccionado?.activo ? 'Inactivar' : 'Activar'} Alumno
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            ¿Está seguro que desea {alumnoSeleccionado?.activo ? 'inactivar' : 'activar'} al alumno{' '}
            <strong>{alumnoSeleccionado?.nombre} {alumnoSeleccionado?.apellido}</strong>?
          </p>
          
          {alumnoSeleccionado?.activo && (
            <Form.Group className="mb-3">
              <Form.Label>Motivo de inactivación</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={motivoInactivacion}
                onChange={(e) => setMotivoInactivacion(e.target.value)}
                placeholder="Ingrese el motivo de la inactivación"
                required
              />
              <Form.Text className="text-muted">
                Es necesario especificar un motivo para inactivar al alumno.
              </Form.Text>
            </Form.Group>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalEstado(false)}>
            Cancelar
          </Button>
          <Button 
            variant={alumnoSeleccionado?.activo ? 'danger' : 'success'} 
            onClick={cambiarEstadoAlumno}
            disabled={alumnoSeleccionado?.activo && !motivoInactivacion.trim()}
          >
            {alumnoSeleccionado?.activo ? 'Inactivar' : 'Activar'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para historial de inactivaciones */}
      <Modal 
        show={mostrarHistorial} 
        onHide={() => setMostrarHistorial(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Historial de Inactivaciones - {alumnoSeleccionado?.nombre} {alumnoSeleccionado?.apellido}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {historialInactivaciones.length === 0 ? (
            <p>No hay registros de inactivaciones para este alumno.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Fecha Inactivación</th>
                    <th>Fecha Reactivación</th>
                    <th>Estado Anterior</th>
                    <th>Estado Nuevo</th>
                    <th>Motivo</th>
                    <th>Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {historialInactivaciones.map(registro => (
                    <tr key={registro.id}>
                      <td>{formatearFecha(registro.fechaInactivacion)}</td>
                      <td>{formatearFecha(registro.fechaReactivacion)}</td>
                      <td>
                        <Badge bg={registro.estadoAnterior ? 'success' : 'danger'}>
                          {registro.estadoAnterior ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td>
                        <Badge bg={registro.estadoNuevo ? 'success' : 'danger'}>
                          {registro.estadoNuevo ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </td>
                      <td>{registro.motivo}</td>
                      <td>{registro.usuarioModificacion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarHistorial(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentTable;