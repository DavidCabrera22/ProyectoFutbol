import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Form, Button, Spinner, Alert, Modal, Table, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import './TalonarioDigital.css';

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
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');

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
      const respuesta = await axios.get('http://localhost:5180/api/Categorias');
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
      const respuesta = await axios.get('http://localhost:5180/api/Alumnos');
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
      const respuesta = await axios.get(`http://localhost:5180/api/Sorteos`);
      
      console.log('Respuesta de sorteos (todos):', respuesta.data);
      
      // Filtramos los sorteos por categoría
      const sorteosFiltrados = respuesta.data.filter(
        (sorteo: Sorteo) => sorteo.idCategoria === idCategoria
      );
      
      console.log('Sorteos filtrados por categoría:', sorteosFiltrados);
      setSorteos(sorteosFiltrados);
      setVistaActual('sorteos');
    } catch (error: any) {
      console.error('Error al obtener sorteos por categoría:', error);
      
      // Mostrar información más detallada sobre el error
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango 2xx
        setError(`Error ${error.response.status}: ${error.response.data?.message || 'Error al cargar los sorteos'}`);
        console.log('Datos de respuesta de error:', error.response.data);
      } else if (error.request) {
        // La solicitud se realizó pero no se recibió respuesta
        setError('No se recibió respuesta del servidor. Verifica la conexión.');
      } else {
        // Algo ocurrió al configurar la solicitud
        setError(`Error al cargar los sorteos: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const obtenerTalonariosPorSorteo = async (idSorteo: number) => {
    try {
      setLoadingTalonarios(true);
      const respuesta = await axios.get(`http://localhost:5180/api/SorteosTalonarios/sorteo/${idSorteo}`);
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
      const respuesta = await axios.get(`http://localhost:5180/api/SorteosBoletas/talonario/${idTalonario}`);
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

  const seleccionarAlumno = (idAlumno: string) => {
    setAlumnoSeleccionado(idAlumno);
    setMostrarModalAsignacion(true);
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
        `http://localhost:5180/api/SorteosBoletas/${boletaSeleccionada.idBoleta}/vender`, 
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
    } catch (error: any) {
      console.error('Error al vender boleta:', error);
      
      // Manejo mejorado de errores
      if (error.response) {
        // Extraer el mensaje de error del objeto de respuesta
        let mensajeError = 'Error desconocido al vender la boleta';
        
        if (typeof error.response.data === 'object') {
          if (error.response.data.title) {
            mensajeError = error.response.data.title;
          } else if (error.response.data.errors) {
            // Si hay errores de validación, mostrarlos de forma legible
            const errores = error.response.data.errors;
            const mensajesError = [];
            
            for (const campo in errores) {
              if (Array.isArray(errores[campo])) {
                mensajesError.push(...errores[campo]);
              }
            }
            
            mensajeError = mensajesError.join(', ');
          } else if (error.response.data.message) {
            mensajeError = error.response.data.message;
          } else {
            // Si no podemos extraer un mensaje específico, mostramos el objeto completo
            mensajeError = JSON.stringify(error.response.data);
          }
        } else if (typeof error.response.data === 'string') {
          mensajeError = error.response.data;
        }
        
        setError(`Error al vender la boleta: ${mensajeError}`);
      } else if (error.request) {
        setError('No se recibió respuesta del servidor. Verifica la conexión.');
      } else {
        setError(`Error al vender la boleta: ${error.message}`);
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
      
      await axios.post('http://localhost:5180/api/SorteosBoletas/asignar-lote', datosAsignacion);
      
      setMensaje(`${cantidadBoletas} boletas asignadas con éxito al alumno`);
      cerrarModalAsignacion();
      
      // Actualizar la lista de boletas
      obtenerBoletasPorTalonario(talonarioSeleccionado);
    } catch (error: any) {
      console.error('Error al asignar boletas:', error);
      
      // Mostrar mensaje de error más específico
      if (error.response) {
        setError(`Error al asignar las boletas: ${error.response.data || 'Por favor, intente de nuevo.'}`);
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
          <Modal.Title>
            <i className="bi bi-tag me-2"></i>
            Vender Boleta #{boletaSeleccionada?.numeroBoleta}
          </Modal.Title>
        </Modal.Header>
        
        {error && (
          <Alert variant="danger" className="m-3" dismissible onClose={() => setError('')}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}
        
        <Modal.Body>
          <div className="mb-3 p-3 bg-light rounded">
            <p className="mb-1"><strong>Alumno:</strong> {boletaSeleccionada?.nombreAlumno || 'No asignado'}</p>
            <p className="mb-1"><strong>Valor:</strong> ${boletaSeleccionada?.valorBoleta?.toLocaleString() || '0'}</p>
          </div>
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre del Comprador <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ingrese el nombre del comprador"
                value={datosComprador.nombre}
                onChange={(e) => setDatosComprador({...datosComprador, nombre: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Teléfono del Comprador <span className="text-danger">*</span></Form.Label>
              <InputGroup>
                <InputGroup.Text><i className="bi bi-telephone"></i></InputGroup.Text>
                <Form.Control 
                  type="text" 
                  placeholder="Ingrese el teléfono del comprador"
                  value={datosComprador.telefono}
                  onChange={(e) => setDatosComprador({...datosComprador, telefono: e.target.value})}
                />
              </InputGroup>
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
                <Spinner animation="border" size="sm" className="me-2" />
                Registrando Venta...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Registrar Venta
              </>
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
          <Modal.Title>
            <i className="bi bi-person-plus-fill me-2"></i>
            Asignar Boletas a Alumno
          </Modal.Title>
        </Modal.Header>
        
        {error && (
          <Alert variant="danger" className="m-3" dismissible onClose={() => setError('')}>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}
        
        <Modal.Body>
          <p>
            ¿Está seguro que desea asignar <strong>{cantidadBoletas}</strong> boleta(s) al alumno seleccionado?
          </p>
          
          <div className="mb-3 p-3 bg-light rounded">
            <p className="mb-1"><strong>Alumno:</strong> {alumnosFiltrados.find(a => a.id === alumnoSeleccionado)?.nombre} {alumnosFiltrados.find(a => a.id === alumnoSeleccionado)?.apellido}</p>
            <p className="mb-1"><strong>ID:</strong> {alumnoSeleccionado}</p>
            <p className="mb-0"><strong>Cantidad de boletas:</strong> {cantidadBoletas}</p>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModalAsignacion}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={asignarBoletasAlumno}
            disabled={guardando}
          >
            {guardando ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Asignando...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Confirmar Asignación
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  // Mostrar mensaje de éxito
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => {
        setMensaje('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  return (
    <Container fluid>
      {mensaje && (
        <Alert 
          variant="success" 
          className="mt-3 position-fixed top-0 start-50 translate-middle-x" 
          style={{ zIndex: 1050, maxWidth: '90%', width: '500px' }}
          dismissible 
          onClose={() => setMensaje('')}
        >
          <i className="bi bi-check-circle-fill me-2"></i>
          {mensaje}
        </Alert>
      )}
      
      <h1 className="my-4">Talonario Digital</h1>
      
      {error && !mostrarModalVenta && !mostrarModalAsignacion && (
        <Alert variant="danger" className="mb-4" dismissible onClose={() => setError('')}>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}
      
      {vistaActual === 'categorias' && renderCategorias()}
      {vistaActual === 'sorteos' && renderSorteos()}
      {vistaActual === 'talonarios' && renderTalonarios()}
      {vistaActual === 'boletas' && renderBoletas()}
      
      {renderModalVenta()}
      {renderModalAsignacion()}
    </Container>
  );
};

export default TalonarioDigital;