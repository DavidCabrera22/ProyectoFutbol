import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Form, Button, Spinner, Alert, Modal, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import './TalonarioDigital.css';
const API_URL = import.meta.env.VITE_API_URL;

interface Boleta {
  idBoleta: number;
  idSorteo: number;
  idTalonario: number;
  idAlumno: string;
  nombreAlumno: string;
  numeroBoleta: string;
  estado: string;
  nombreComprador: string;
  telefonoComprador: string;
  fechaVenta: string;
  valorBoleta: number;
  observaciones: string;
}

interface Sorteo {
  idSorteo: number;
  nombre: string;
  descripcion: string;
  valorBoleta: number;
  fechaSorteo: string;
  estado: string;
  totalBoletas: number;
  boletasVendidas: number;
  boletasDisponibles: number;
  idCategoria: number;
}

interface Talonario {
  idTalonario: number;
  idSorteo: number;
  numeroInicial: number;
  numeroFinal: number;
  cantidadBoletas: number;
  valorBoleta: number;
  fechaSorteo: string;
  descripcion: string;
}

interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  telefono: string;
  email: string;
  direccion: string;
  activo: boolean;
  curso?: string;
  idCategoria?: number;
}

interface Categoria {
  idCategoria: number;
  nombre: string;
  descripcion: string;
}

interface AsignacionBoletas {
  idTalonario: number;
  idAlumno: string;
  cantidad: number;
}

interface ApiError {
  response?: {
    status?: number;
    data?: {
      title?: string;
      message?: string;
      errors?: Record<string, string[]>;
    } | string;
  };
  request?: unknown;
  message?: string;
}

const TalonarioDigital: React.FC = () => {
  const [sorteos, setSorteos] = useState<Sorteo[]>([]);
  const [sorteoSeleccionado, setSorteoSeleccionado] = useState<number | null>(null);
  const [talonarios, setTalonarios] = useState<Talonario[]>([]);
  const [talonarioSeleccionado, setTalonarioSeleccionado] = useState<number | null>(null);
  const [boletas, setBoletas] = useState<Boleta[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<string>('');
  const [alumnosFiltrados, setAlumnosFiltrados] = useState<Alumno[]>([]);
  const [alumnosBuscados, setAlumnosBuscados] = useState<Alumno[]>([]);
  const [terminoBusquedaAlumno, setTerminoBusquedaAlumno] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingBoletas, setLoadingBoletas] = useState<boolean>(false);
  const [loadingTalonarios, setLoadingTalonarios] = useState<boolean>(false);
  const [boletaSeleccionada, setBoletaSeleccionada] = useState<Boleta | null>(null);
  const [mostrarModalVenta, setMostrarModalVenta] = useState<boolean>(false);
  const [mostrarModalAsignacion, setMostrarModalAsignacion] = useState<boolean>(false);
  const [datosComprador, setDatosComprador] = useState({
    nombre: '',
    telefono: ''
  });
  const [cantidadBoletas, setCantidadBoletas] = useState<number>(1);
  const [guardando, setGuardando] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');
  
  // Estados para categorías
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<number | null>(null);
  const [vistaActual, setVistaActual] = useState<'categorias' | 'sorteos' | 'talonarios' | 'boletas'>('categorias');

  useEffect(() => {
    obtenerCategorias();
    obtenerAlumnos();
  }, []);

  useEffect(() => {
    if (categoriaSeleccionada) {
      obtenerSorteosPorCategoria(categoriaSeleccionada);
      filtrarAlumnosPorCategoria(categoriaSeleccionada);
    }
  }, [categoriaSeleccionada, alumnos]);

  useEffect(() => {
    if (sorteoSeleccionado) {
      obtenerTalonariosPorSorteo(sorteoSeleccionado);
    }
  }, [sorteoSeleccionado]);

  useEffect(() => {
    if (talonarioSeleccionado) {
      obtenerBoletasPorTalonario(talonarioSeleccionado);
    }
  }, [talonarioSeleccionado]);

  const obtenerCategorias = async () => {
    try {
      setLoading(true);
      const respuesta = await axios.get(`${API_URL}/api/Categorias`);
      setCategorias(respuesta.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      setError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const obtenerAlumnos = async () => {
    try {
      const respuesta = await axios.get(`${API_URL}/api/Alumnos`);
      console.log('Datos de alumnos recibidos:', respuesta.data);
      setAlumnos(respuesta.data);
      
      // Si ya hay una categoría seleccionada, filtramos los alumnos
      if (categoriaSeleccionada) {
        filtrarAlumnosPorCategoria(categoriaSeleccionada);
      }
    } catch (error) {
      console.error('Error al obtener alumnos:', error);
      setError('Error al cargar los alumnos');
    }
  };

  const filtrarAlumnosPorCategoria = (idCategoria: number) => {
    // Versión mejorada para filtrar alumnos por categoría en una escuela de fútbol
    console.log('Filtrando alumnos para categoría ID:', idCategoria);
    console.log('Total de alumnos disponibles:', alumnos.length);
    
    // Filtramos los alumnos que pertenecen a la categoría seleccionada
    const alumnosFiltrados = alumnos.filter(alumno => {
      // Verificamos si el alumno tiene idCategoria directamente
      const perteneceCategoria = alumno.idCategoria === idCategoria;
      
      // Mostramos información de depuración en la consola
      console.log(`Alumno: ${alumno.nombre}, idCategoria: ${alumno.idCategoria}, Categoría seleccionada: ${idCategoria}, Pertenece: ${perteneceCategoria}`);
      
      return perteneceCategoria;
    });
    
    console.log('Alumnos filtrados por categoría:', alumnosFiltrados);
    
    // Si no hay alumnos filtrados, mostramos todos los alumnos como fallback
    if (alumnosFiltrados.length === 0) {
      console.log('No se encontraron alumnos para esta categoría. Mostrando todos los alumnos.');
      setAlumnosFiltrados(alumnos);
    } else {
      setAlumnosFiltrados(alumnosFiltrados);
    }
  };

  const buscarAlumnos = (termino: string) => {
    setTerminoBusquedaAlumno(termino);
    
    if (!termino.trim()) {
      setAlumnosBuscados([]);
      return;
    }
    
    const terminoLower = termino.toLowerCase();
    const resultados = alumnosFiltrados.filter(alumno => 
      alumno.nombre.toLowerCase().includes(terminoLower) || 
      alumno.apellido.toLowerCase().includes(terminoLower) || 
      alumno.id.toLowerCase().includes(terminoLower)
    );
    
    setAlumnosBuscados(resultados);
  };

  const seleccionarAlumnoBuscado = (alumno: Alumno) => {
    setAlumnoSeleccionado(alumno.id);
    setTerminoBusquedaAlumno(`${alumno.nombre} ${alumno.apellido}`);
    setAlumnosBuscados([]);
  };

  const obtenerSorteosPorCategoria = async (idCategoria: number) => {
    try {
      setLoading(true);
      setError(''); // Limpiar errores anteriores
      console.log(`Obteniendo sorteos para la categoría ID: ${idCategoria}`);
      
      // Obtenemos todos los sorteos
      const respuesta = await axios.get(`${API_URL}/api/Sorteos`);
      
      console.log('Respuesta de sorteos (todos):', respuesta.data);
      
      // Filtramos los sorteos por categoría
      const sorteosFiltrados = respuesta.data.filter(
        (sorteo: Sorteo) => sorteo.idCategoria === idCategoria
      );
      
      console.log('Sorteos filtrados por categoría:', sorteosFiltrados);
      setSorteos(sorteosFiltrados);
      setVistaActual('sorteos');
    } catch (error: unknown) {
      console.error('Error al obtener sorteos por categoría:', error);
      
      // Mostrar información más detallada sobre el error
            // Mostrar información más detallada sobre el error
            const err = error as ApiError;
            if (err.response) {
              // El servidor respondió con un código de estado fuera del rango 2xx
              let errorMessage = 'Error al cargar los sorteos';
              
              if (typeof err.response.data === 'object' && err.response.data !== null) {
                errorMessage = err.response.data.message || errorMessage;
              } else if (typeof err.response.data === 'string') {
                errorMessage = err.response.data;
              }
              
              setError(`Error ${err.response.status}: ${errorMessage}`);
              console.log('Datos de respuesta de error:', err.response.data);
            } else if (err.request) {
              // La solicitud se realizó pero no se recibió respuesta
              setError('No se recibió respuesta del servidor. Verifica la conexión.');
            } else {
              // Algo ocurrió al configurar la solicitud
              setError(`Error al cargar los sorteos: ${err.message}`);
            }
    } finally {
      setLoading(false);
    }
  };


  const obtenerTalonariosPorSorteo = async (idSorteo: number) => {
    try {
      setLoadingTalonarios(true);
      const respuesta =await axios.get(`${API_URL}/api/SorteosTalonarios/sorteo/${idSorteo}`);
      setTalonarios(respuesta.data);
      setVistaActual('talonarios');
    } catch (error) {
      console.error('Error al obtener talonarios:', error);
      setError('Error al cargar los talonarios');
    } finally {
      setLoadingTalonarios(false);
    }
  };

  const obtenerBoletasPorTalonario = async (idTalonario: number) => {
    try {
      setLoadingBoletas(true);
      const respuesta = await axios.get(`${API_URL}/api/SorteosBoletas/talonario/${idTalonario}`);
      setBoletas(respuesta.data);
      setVistaActual('boletas');
    } catch (error) {
      console.error('Error al obtener boletas:', error);
      setError('Error al cargar las boletas');
    } finally {
      setLoadingBoletas(false);
    }
  };

  const seleccionarCategoria = (idCategoria: number) => {
    setCategoriaSeleccionada(idCategoria);
  };

  const seleccionarSorteo = (idSorteo: number) => {
    setSorteoSeleccionado(idSorteo);
  };

  const seleccionarTalonario = (idTalonario: number) => {
    setTalonarioSeleccionado(idTalonario);
  };

  const seleccionarBoleta = (boleta: Boleta) => {
    // Buscamos el talonario correspondiente para obtener el valor correcto
    const talonarioActual = talonarios.find(t => t.idTalonario === boleta.idTalonario);
    
    // Creamos una copia de la boleta con el valor correcto del talonario
    const boletaConValor = {
      ...boleta,
      valorBoleta: talonarioActual?.valorBoleta || 2000 // Usamos el valor del talonario o 2000 como valor predeterminado
    };
    
    setBoletaSeleccionada(boletaConValor);
    setDatosComprador({
      nombre: '',
      telefono: ''
    });
    setError(''); // Limpiar errores previos
    setMostrarModalVenta(true);
  };

  const volverACategorias = () => {
    setVistaActual('categorias');
    setSorteoSeleccionado(null);
  };

  const volverASorteos = () => {
    setVistaActual('sorteos');
    setTalonarioSeleccionado(null);
  };

  const volverATalonarios = () => {
    setVistaActual('talonarios');
    setBoletas([]);
  };

  const cerrarModalVenta = () => {
    setMostrarModalVenta(false);
    setBoletaSeleccionada(null);
    setError('');
    setDatosComprador({
      nombre: '',
      telefono: ''
    });
  };

  const cerrarModalAsignacion = () => {
    setMostrarModalAsignacion(false);
    setCantidadBoletas(1);
    setError('');
  };

   // ... código existente ...

   const venderBoleta = async () => {
    // Validaciones existentes...
    if (!datosComprador.nombre || !datosComprador.nombre.trim()) {
      setError('Error al vender la boleta. Por favor, ingrese el nombre del comprador.');
      return;
    }
    
    if (!datosComprador.telefono || !datosComprador.telefono.trim()) {
      setError('Error al vender la boleta. Por favor, ingrese el teléfono del comprador.');
      return;
    }
  
    if (!boletaSeleccionada || !boletaSeleccionada.idBoleta) {
      setError('Error al vender la boleta. Información de boleta no válida.');
      return;
    }
  
    try {
      setGuardando(true);
      setError(''); // Limpiar errores previos
      
      // Modificamos el formato de los datos para que coincida exactamente con lo que espera el backend
      const datosVenta = {
        nombreComprador: datosComprador.nombre.trim(),
        telefonoComprador: datosComprador.telefono.trim(),
        observaciones: "" // Añadimos el campo observaciones que espera el backend
      };
      
      console.log('Enviando datos de venta:', datosVenta);
      
      const respuesta = await axios.put(
        `${API_URL}/api/SorteosBoletas/${boletaSeleccionada.idBoleta}/vender` , 
        datosVenta
      );
  
      if (respuesta.status === 200) {
        setMensaje('Boleta vendida con éxito');
        cerrarModalVenta();
        
        // Actualizar la lista de boletas
        if (talonarioSeleccionado) {
          obtenerBoletasPorTalonario(talonarioSeleccionado);
        }
      } else {
        throw new Error('Error al procesar la venta');
      }
    } catch (error: unknown) {
      console.error('Error al vender boleta:', error);
      
      // Manejo mejorado de errores
      const err = error as ApiError;
      if (err.response) {
        // Extraer el mensaje de error del objeto de respuesta
        let mensajeError = 'Error desconocido al vender la boleta';
        
        if (typeof err.response.data === 'object' && err.response.data !== null) {
          const data = err.response.data as {
            title?: string;
            message?: string;
            errors?: Record<string, string[]>;
          };
          
          if (data.title) {
            mensajeError = data.title;
          } else if (data.errors) {
            // Si hay errores de validación, mostrarlos de forma legible
            const errores = data.errors;
            const mensajesError = [];
            
            for (const campo in errores) {
              if (Array.isArray(errores[campo])) {
                mensajesError.push(...errores[campo]);
              }
            }
            
            mensajeError = mensajesError.join(', ');
          } else if (data.message) {
            mensajeError = data.message;
          } else {
            // Si no podemos extraer un mensaje específico, mostramos el objeto completo
            mensajeError = JSON.stringify(err.response.data);
          }
        } else if (typeof err.response.data === 'string') {
          mensajeError = err.response.data;
        }
        
        setError(`Error al vender la boleta: ${mensajeError}`);
      } else if (err.request) {
        setError('No se recibió respuesta del servidor. Verifica la conexión.');
      } else {
        setError(`Error al vender la boleta: ${err.message}`);
      }
    } finally {
      setGuardando(false);
    }
  };

  const asignarBoletasAlumno = async () => {
    if (!alumnoSeleccionado || !talonarioSeleccionado) {
      setError('Debe seleccionar un alumno y un talonario');
      return;
    }

    if (cantidadBoletas <= 0) {
      setError('La cantidad de boletas debe ser mayor a 0');
      return;
    }

    try {
      setGuardando(true);
      setError(''); // Limpiar errores previos
      
      const datosAsignacion: AsignacionBoletas = {
        idTalonario: talonarioSeleccionado,
        idAlumno: alumnoSeleccionado,
        cantidad: cantidadBoletas
      };
      
       await axios.post(`${API_URL}/api/SorteosBoletas/asignar-lote`, datosAsignacion);
      
      setMensaje(`${cantidadBoletas} boletas asignadas con éxito al alumno`);
      cerrarModalAsignacion();
      
      // Actualizar la lista de boletas
      obtenerBoletasPorTalonario(talonarioSeleccionado);
    } catch (error: unknown) {
      console.error('Error al asignar boletas:', error);
      
      // Mostrar mensaje de error más específico
      const err = error as ApiError;
      if (err.response) {
        setError(`Error al asignar las boletas: ${err.response.data || 'Por favor, intente de nuevo.'}`);
      } else {
        setError('Error al asignar las boletas. Por favor, intente de nuevo.');
      }
    } finally {
      setGuardando(false);
    }
  };

  const renderCategorias = () => {
    return (
      <div>
        <h2 className="mb-4">Seleccione una Categoría</h2>
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando categorías...</p>
          </div>
        ) : (
          <Row>
            {categorias.map(categoria => (
              <Col md={4} key={categoria.idCategoria} className="mb-4">
                <Card 
                  className="h-100 categoria-card" 
                  onClick={() => seleccionarCategoria(categoria.idCategoria)}
                >
                  <Card.Body>
                    <Card.Title>{categoria.nombre}</Card.Title>
                    <Card.Text>{categoria.descripcion}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    );
  };

  const renderSorteos = () => {
    const categoriaActual = categorias.find(c => c.idCategoria === categoriaSeleccionada);
    
    return (
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button variant="outline-secondary" onClick={volverACategorias}>
            <i className="bi bi-arrow-left"></i> Volver a Categorías
          </Button>
          <h3>{categoriaActual?.nombre}</h3>
        </div>
        
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando sorteos...</p>
          </div>
        ) : sorteos.length > 0 ? (
          <Row>
            {sorteos.map(sorteo => (
              <Col md={4} key={sorteo.idSorteo} className="mb-4">
                <Card 
                  className="h-100 sorteo-card" 
                  onClick={() => seleccionarSorteo(sorteo.idSorteo)}
                >
                  <Card.Body>
                    <Card.Title>{sorteo.nombre}</Card.Title>
                    <Card.Text>{sorteo.descripcion}</Card.Text>
                    <div className="mb-2">
                      <Badge bg="info">Valor: ${sorteo.valorBoleta.toLocaleString()}</Badge>
                      <Badge bg="secondary" className="ms-2">Fecha: {new Date(sorteo.fechaSorteo).toLocaleDateString()}</Badge>
                    </div>
                    <div>
                      <Badge bg="success">Disponibles: {sorteo.boletasDisponibles}</Badge>
                      <Badge bg="danger" className="ms-2">Vendidas: {sorteo.boletasVendidas}</Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info">No hay sorteos disponibles para esta categoría</Alert>
        )}
      </div>
    );
  };

  const renderTalonarios = () => {
    const sorteoActual = sorteos.find(s => s.idSorteo === sorteoSeleccionado);
    
    return (
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button variant="outline-secondary" onClick={volverASorteos}>
            <i className="bi bi-arrow-left"></i> Volver a Sorteos
          </Button>
          <h3>{sorteoActual?.nombre}</h3>
        </div>
        
        {loadingTalonarios ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando talonarios...</p>
          </div>
        ) : talonarios.length > 0 ? (
          <Row>
            {talonarios.map(talonario => (
              <Col md={4} key={talonario.idTalonario} className="mb-4">
                <Card className="h-100 talonario-card">
                  <Card.Body>
                    <Card.Title>Talonario #{talonario.idTalonario}</Card.Title>
                    <Card.Text>{talonario.descripcion}</Card.Text>
                    <div className="mb-2">
                      <Badge bg="info">Valor: ${talonario.valorBoleta.toLocaleString()}</Badge>
                      <Badge bg="secondary" className="ms-2">Boletas: {talonario.cantidadBoletas}</Badge>
                    </div>
                    <Button 
                      variant="primary" 
                      className="w-100"
                      onClick={() => seleccionarTalonario(talonario.idTalonario)}
                    >
                      Ver Boletas
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info">No hay talonarios disponibles para este sorteo</Alert>
        )}
      </div>
    );
  };

  const renderBoletas = () => {
    const talonarioActual = talonarios.find(t => t.idTalonario === talonarioSeleccionado);
    
    return (
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <Button variant="outline-secondary" onClick={volverATalonarios}>
            <i className="bi bi-arrow-left"></i> Volver a Talonarios
          </Button>
          <h3>Talonario #{talonarioActual?.idTalonario}</h3>
        </div>
        
        <Card className="mb-4">
          <Card.Body>
            <Card.Title>Asignar Boletas a Alumno</Card.Title>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Buscar Alumno</Form.Label>
                    <InputGroup>
                      <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                      <Form.Control 
                        type="text" 
                        value={terminoBusquedaAlumno}
                        onChange={(e) => buscarAlumnos(e.target.value)}
                        placeholder="Buscar por nombre, apellido o ID"
                        autoComplete="off"
                      />
                      {alumnoSeleccionado && (
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => {
                            setAlumnoSeleccionado('');
                            setTerminoBusquedaAlumno('');
                          }}
                        >
                          <i className="bi bi-x"></i>
                        </Button>
                      )}
                    </InputGroup>
                    
                    {/* Resultados de búsqueda */}
                    {alumnosBuscados.length > 0 && !alumnoSeleccionado && (
                      <div className="search-results">
                        {alumnosBuscados.map(alumno => (
                          <div 
                            key={alumno.id} 
                            className="search-result-item"
                            onClick={() => seleccionarAlumnoBuscado(alumno)}
                          >
                            <div className="d-flex align-items-center">
                              <i className="bi bi-person me-2"></i>
                              <div>
                                <div><strong>{alumno.nombre} {alumno.apellido}</strong></div>
                                <small className="text-muted">ID: {alumno.id}</small>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {terminoBusquedaAlumno && alumnosBuscados.length === 0 && !alumnoSeleccionado && (
                      <div className="text-danger mt-1">
                        <small>No se encontraron alumnos con ese criterio</small>
                      </div>
                    )}
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group className="mb-3">
                    <Form.Label>Cantidad de Boletas</Form.Label>
                    <Form.Control 
                      type="number" 
                      min="1"
                      value={cantidadBoletas}
                      onChange={(e) => setCantidadBoletas(parseInt(e.target.value) || 1)}
                    />
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex align-items-end">
                  <Button 
                    variant="success" 
                    className="w-100 mb-3"
                    disabled={!alumnoSeleccionado}
                    onClick={() => setMostrarModalAsignacion(true)}
                  >
                    <i className="bi bi-plus-circle me-2"></i> Asignar Boletas
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
        
        {loadingBoletas ? (
          <div className="text-center my-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando boletas...</p>
          </div>
        ) : (
          <div>
            <h4 className="mb-3">Boletas del Talonario</h4>
            <div className="boletas-grid">
              {boletas.map(boleta => (
                <div 
                  key={boleta.idBoleta} 
                  className={`boleta-item ${boleta.estado.toLowerCase()}`}
                  onClick={() => boleta.estado === 'Asignada' ? seleccionarBoleta(boleta) : null}
                  title={`Boleta #${boleta.numeroBoleta} - ${boleta.estado}`}
                >
                  <div className="numero-boleta">{boleta.numeroBoleta}</div>
                  <div className="estado-boleta">
                    {boleta.estado === 'Vendida' ? (
                      <i className="bi bi-check-circle-fill text-success"></i>
                    ) : boleta.estado === 'Asignada' ? (
                      <i className="bi bi-person-fill text-primary"></i>
                    ) : (
                      <i className="bi bi-circle text-secondary"></i>
                    )}
                  </div>
                  {/* Solo mostrar el nombre del alumno si existe y no es "Jorge" */}
                  {boleta.nombreAlumno && boleta.nombreAlumno !== 'Jorge' && (
                    <div className="alumno-boleta">{boleta.nombreAlumno}</div>
                  )}
                                    {boleta.estado === 'Vendida' && (
                    <div className="comprador-boleta">{boleta.nombreComprador}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderModalVenta = () => {
    return (
      <Modal show={mostrarModalVenta} onHide={cerrarModalVenta}>
        <Modal.Header closeButton>
          <Modal.Title>Vender Boleta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          {boletaSeleccionada && (
            <div className="mb-4">
              <h5>Información de la Boleta</h5>
              <p><strong>Número:</strong> {boletaSeleccionada.numeroBoleta}</p>
              <p><strong>Valor:</strong> ${boletaSeleccionada.valorBoleta.toLocaleString()}</p>
              <p><strong>Asignada a:</strong> {boletaSeleccionada.nombreAlumno}</p>
            </div>
          )}
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Comprador</Form.Label>
              <Form.Control 
                type="text" 
                value={datosComprador.nombre}
                onChange={(e) => setDatosComprador({...datosComprador, nombre: e.target.value})}
                placeholder="Ingrese el nombre completo"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Teléfono del Comprador</Form.Label>
              <Form.Control 
                type="text" 
                value={datosComprador.telefono}
                onChange={(e) => setDatosComprador({...datosComprador, telefono: e.target.value})}
                placeholder="Ingrese el número de teléfono"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModalVenta}>
            Cancelar
          </Button>
          <Button 
            variant="success" 
            onClick={venderBoleta}
            disabled={guardando}
          >
            {guardando ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Procesando...
              </>
            ) : (
              'Confirmar Venta'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderModalAsignacion = () => {
    return (
      <Modal show={mostrarModalAsignacion} onHide={cerrarModalAsignacion}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Asignación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <p>¿Está seguro que desea asignar <strong>{cantidadBoletas}</strong> boletas al alumno?</p>
          
          {alumnoSeleccionado && (
            <div className="mb-3 p-3 bg-light rounded">
              <h6>Alumno seleccionado:</h6>
              <p className="mb-1">
                <strong>Nombre:</strong> {
                  alumnos.find(a => a.id === alumnoSeleccionado)?.nombre || ''
                } {
                  alumnos.find(a => a.id === alumnoSeleccionado)?.apellido || ''
                }
              </p>
              <p className="mb-0">
                <strong>ID:</strong> {alumnoSeleccionado}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModalAsignacion}>
            Cancelar
          </Button>
          <Button 
            variant="success" 
            onClick={asignarBoletasAlumno}
            disabled={guardando}
          >
            {guardando ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Procesando...
              </>
            ) : (
              'Confirmar Asignación'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <Container fluid className="py-4">
      {mensaje && (
        <Alert 
          variant="success" 
          dismissible 
          onClose={() => setMensaje('')}
          className="mb-4"
        >
          {mensaje}
        </Alert>
      )}
      
      {error && vistaActual !== 'boletas' && (
        <Alert 
          variant="danger" 
          dismissible 
          onClose={() => setError('')}
          className="mb-4"
        >
          {error}
        </Alert>
      )}
      
      {vistaActual === 'categorias' && renderCategorias()}
      {vistaActual === 'sorteos' && renderSorteos()}
      {vistaActual === 'talonarios' && renderTalonarios()}
      {vistaActual === 'boletas' && renderBoletas()}
      
      {renderModalVenta()}
      {renderModalAsignacion()}
      
      <style dangerouslySetInnerHTML={{
        __html: `
          .categoria-card, .sorteo-card, .talonario-card {
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
            border: 1px solid #dee2e6;
          }
          
          .categoria-card:hover, .sorteo-card:hover, .talonario-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
          }
          
          .boletas-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
            gap: 10px;
          }
          
          .boleta-item {
            border: 1px solid #dee2e6;
            border-radius: 5px;
            padding: 10px;
            text-align: center;
            position: relative;
            min-height: 80px;
            display: flex;
            flex-direction: column;
            justify-content: center;
          }
          
          .boleta-item.asignada {
            background-color: #e8f4ff;
            cursor: pointer;
          }
          
          .boleta-item.vendida {
            background-color: #d4edda;
          }
          
          .boleta-item.disponible {
            background-color: #f8f9fa;
          }
          
          .numero-boleta {
            font-weight: bold;
            font-size: 1.1rem;
          }
          
          .estado-boleta {
            position: absolute;
            top: 5px;
            right: 5px;
          }
          
          .alumno-boleta, .comprador-boleta {
            font-size: 0.8rem;
            margin-top: 5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .search-results {
            position: absolute;
            z-index: 1000;
            width: 100%;
            max-height: 200px;
            overflow-y: auto;
            background-color: white;
            border: 1px solid #ced4da;
            border-radius: 0.25rem;
            margin-top: 5px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          .search-result-item {
            padding: 10px 15px;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
          }
          
          .search-result-item:hover {
            background-color: #f8f9fa;
          }
          
          .search-result-item:last-child {
            border-bottom: none;
          }
        `
      }} />
    </Container>
  );
};

export default TalonarioDigital;