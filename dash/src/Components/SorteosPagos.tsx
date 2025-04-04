import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Modal, Form, Spinner, Row, Col, InputGroup, Badge, Image } from 'react-bootstrap';
import axios from 'axios';

interface Pago {
  idPago: number;
  idAlumno: string;
  idBoleta?: number;
  nombreVendedor: string;
  monto: number;
  fechaPago: string;
  metodoPago: string;
  referencia: string;
  observaciones: string;
  estado: string;
  imagenSoporte?: string;
}

interface Vendedor {
  idVendedor?: number;
  idAlumno: string;
  alumno?: {
    nombre: string;
    apellido: string;
  };
  nombre?: string;
  apellido?: string;
}

interface MetodoRecaudo {
  idMetodoRecaudo: number;
  nombre: string;
}

interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  email?: string;
}

// Nueva interfaz para boletas
interface Boleta {
  idBoleta: number;
  numeroBoleta: string;
  estado: string;
  precio: number;
}

const SorteosPagos: React.FC = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [metodosRecaudo, setMetodosRecaudo] = useState<MetodoRecaudo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState<boolean>(false);
  const [pagoEditar, setPagoEditar] = useState<Partial<Pago>>({
    monto: 0,
    metodoPago: '',
    referencia: '',
    observaciones: '',
    estado: 'Registrado'
  });
  const [pagoDetalles, setPagoDetalles] = useState<Pago | null>(null);
  const [esNuevoPago, setEsNuevoPago] = useState<boolean>(false);
  const [boletasVendedor, setBoletasVendedor] = useState<{
    total: number;
    vendidas: number;
    valorTotal: number;
    pagado: number;
    pendiente: number;
  }>({
    total: 0,
    vendidas: 0,
    valorTotal: 0,
    pagado: 0,
    pendiente: 0
  });
  // Nuevo estado para almacenar las boletas del alumno
  const [boletasAlumno, setBoletasAlumno] = useState<Boleta[]>([]);
  const [imagenSoporte, setImagenSoporte] = useState<File | null>(null);
  const [previewImagen, setPreviewImagen] = useState<string | null>(null);
  const [subiendoImagen, setSubiendoImagen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados para la búsqueda de alumnos
  const [terminoBusqueda, setTerminoBusqueda] = useState<string>('');
  const [alumnosFiltrados, setAlumnosFiltrados] = useState<Alumno[]>([]);
  
  // Estado para controlar la sección de boletas
  const [mostrarSeccionBoletas, setMostrarSeccionBoletas] = useState<boolean>(false);

  // Configurar interceptores para depuración
  useEffect(() => {
    axios.interceptors.request.use(request => {
      console.log('Request:', request);
      return request;
    });
    
    axios.interceptors.response.use(
      response => {
        console.log('Response:', response);
        return response;
      },
      error => {
        console.error('Error en respuesta:', error);
        return Promise.reject(error);
      }
    );
    
    obtenerPagos();
    obtenerVendedores();
    obtenerAlumnos(); // Obtener todos los alumnos
    obtenerMetodosRecaudo();
  }, []);

  // Efecto para filtrar alumnos cuando cambia el término de búsqueda
  useEffect(() => {
    if (terminoBusqueda.trim() === '') {
      setAlumnosFiltrados([]);
      return;
    }
    
    const termino = terminoBusqueda.toLowerCase();
    const resultados = alumnos.filter(alumno => {
      const nombreCompleto = `${alumno.nombre || ''} ${alumno.apellido || ''}`.toLowerCase();
      const idAlumno = alumno.id?.toLowerCase() || '';
      
      return nombreCompleto.includes(termino) || idAlumno.includes(termino);
    });
    
    setAlumnosFiltrados(resultados);
  }, [terminoBusqueda, alumnos]);

  const obtenerPagos = async () => {
    try {
      setLoading(true);
      const respuesta = await axios.get('http://localhost:5180/api/SorteosPagos');
      console.log('Datos de pagos recibidos:', respuesta.data);
      
      // Verificar que los datos son un array antes de asignarlos
      if (Array.isArray(respuesta.data)) {
        setPagos(respuesta.data);
      } else {
        console.error('La respuesta no es un array:', respuesta.data);
        setPagos([]);
      }
    } catch (error) {
      console.error('Error al obtener pagos:', error);
      alert('Error al cargar los pagos. Por favor, intenta de nuevo.');
      setPagos([]);
    } finally {
      setLoading(false);
    }
  };

  const obtenerVendedores = async () => {
    try {
      // Obtener directamente los alumnos como vendedores
      const respuestaAlumnos = await axios.get('http://localhost:5180/api/Alumnos');
      console.log('Alumnos recibidos como vendedores:', respuestaAlumnos.data);
      
      if (Array.isArray(respuestaAlumnos.data)) {
        // Transformar alumnos al formato de vendedores
        const vendedoresDeAlumnos = respuestaAlumnos.data.map((a: any) => ({
          idVendedor: a.id,
          idAlumno: a.id,
          nombre: a.nombre,
          apellido: a.apellido || '',
          alumno: {
            nombre: a.nombre,
            apellido: a.apellido || ''
          }
        }));
        
        console.log('Alumnos formateados como vendedores:', vendedoresDeAlumnos);
        setVendedores(vendedoresDeAlumnos);
      } else {
        console.error('La respuesta de alumnos no es un array:', respuestaAlumnos.data);
        setVendedores([]);
      }
    } catch (error) {
      console.error('Error al obtener alumnos como vendedores:', error);
      setVendedores([]);
    }
  };

  const obtenerAlumnos = async () => {
    try {
      const respuesta = await axios.get('http://localhost:5180/api/Alumnos');
      console.log('Alumnos recibidos:', respuesta.data);
      
      if (Array.isArray(respuesta.data)) {
        setAlumnos(respuesta.data);
      } else {
        console.error('La respuesta de alumnos no es un array:', respuesta.data);
        setAlumnos([]);
      }
    } catch (error) {
      console.error('Error al obtener alumnos:', error);
      setAlumnos([]);
    }
  };

  const obtenerMetodosRecaudo = async () => {
    try {
      const respuesta = await axios.get('http://localhost:5180/api/MetodosRecaudo');
      console.log('Métodos de recaudo recibidos:', respuesta.data);
      
      // Asegurarse de que los datos tienen el formato correcto
      if (Array.isArray(respuesta.data)) {
        setMetodosRecaudo(respuesta.data.map(item => ({
          idMetodoRecaudo: item.idTipoRecaudo,
          nombre: item.nombre
        })));
      } else {
        console.error('La respuesta de métodos de recaudo no es un array:', respuesta.data);
        setMetodosRecaudo([
          { idMetodoRecaudo: 1, nombre: 'Efectivo' },
          { idMetodoRecaudo: 2, nombre: 'Transferencia' }
        ]);
      }
    } catch (error) {
      console.error('Error al obtener métodos de recaudo:', error);
      // Si falla la API, usar métodos predeterminados
      setMetodosRecaudo([
        { idMetodoRecaudo: 1, nombre: 'Efectivo' },
        { idMetodoRecaudo: 2, nombre: 'Transferencia' }
      ]);
    }
  };

  // Nueva función para obtener boletas de un alumno
  const obtenerBoletasAlumno = async (idAlumno: string) => {
    try {
      setLoading(true);
      const respuesta = await axios.get(`http://localhost:5180/api/SorteosBoletas/alumno/${idAlumno}`);
      console.log('Boletas del alumno recibidas:', respuesta.data);
      
      if (Array.isArray(respuesta.data)) {
        setBoletasAlumno(respuesta.data);
      } else {
        console.error('La respuesta de boletas no es un array:', respuesta.data);
        setBoletasAlumno([]);
      }
    } catch (error) {
      console.error('Error al obtener boletas del alumno:', error);
      setBoletasAlumno([]);
    } finally {
      setLoading(false);
    }
  };

  const obtenerEstadisticasVendedor = async (idAlumno: string) => {
    try {
      setLoading(true);
      // Obtener estadísticas directamente desde SorteosBoletas
      const respuesta = await axios.get(`http://localhost:5180/api/SorteosBoletas/estadisticas/alumno/${idAlumno}`);
      console.log('Estadísticas del alumno recibidas:', respuesta.data);
      
      // Verificar que la respuesta contiene datos
      if (respuesta.data) {
        // Asegurarse de que todos los valores sean números válidos
        const estadisticas = respuesta.data;
        setBoletasVendedor({
          total: Number(estadisticas.boletasAsignadas) || 0,
          vendidas: Number(estadisticas.boletasVendidas) || 0,
          valorTotal: Number(estadisticas.valorTotal) || 0,
          pagado: Number(estadisticas.pagado) || 0,
          pendiente: Number(estadisticas.pendiente) || 0
        });
      } else {
        // Si no hay datos, establecer valores predeterminados
        setBoletasVendedor({
          total: 0,
          vendidas: 0,
          valorTotal: 0,
          pagado: 0,
          pendiente: 0
        });
      }
    } catch (error) {
      console.error('Error al obtener estadísticas del alumno:', error);
      // En caso de error, establecer valores predeterminados
      setBoletasVendedor({
        total: 0,
        vendidas: 0,
        valorTotal: 0,
        pagado: 0,
        pendiente: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setPagoEditar({
      idAlumno: '',
      idBoleta: 0,
      monto: 0,
      metodoPago: '',
      referencia: '',
      observaciones: '',
      estado: 'Registrado'
    });
    setBoletasVendedor({
      total: 0,
      vendidas: 0,
      valorTotal: 0,
      pagado: 0,
      pendiente: 0
    });
    setBoletasAlumno([]);
    setImagenSoporte(null);
    setPreviewImagen(null);
    setEsNuevoPago(true);
    setMostrarModal(true);
    setMostrarSeccionBoletas(false);
    // Limpiar el término de búsqueda al abrir el modal
    setTerminoBusqueda('');
    setAlumnosFiltrados([]);
  };

  const abrirModalEditar = (pago: Pago) => {
    setPagoEditar({
      ...pago,
      fechaPago: new Date(pago.fechaPago).toISOString().split('T')[0]
    });
    obtenerEstadisticasVendedor(pago.idAlumno);
    obtenerBoletasAlumno(pago.idAlumno);
    setPreviewImagen(pago.imagenSoporte || null);
    setImagenSoporte(null);
    setEsNuevoPago(false);
    setMostrarModal(true);
    setMostrarSeccionBoletas(false);
  };

  const abrirModalDetalles = (pago: Pago) => {
    setPagoDetalles(pago);
    setMostrarModalDetalles(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setPagoEditar({
      monto: 0,
      metodoPago: '',
      referencia: '',
      observaciones: '',
      estado: 'Registrado'
    });
    setImagenSoporte(null);
    setPreviewImagen(null);
    setMostrarSeccionBoletas(false);
  };

  const cerrarModalDetalles = () => {
    setMostrarModalDetalles(false);
    setPagoDetalles(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Manejo especial para el campo monto
    if (name === 'monto') {
      // Convertir a número y asegurarse de que no sea negativo
      const montoNumerico = Math.max(0, parseFloat(value) || 0);
      setPagoEditar(prev => ({ ...prev, [name]: montoNumerico }));
    } else {
      setPagoEditar(prev => ({ ...prev, [name]: value }));
    }
  };

  // Nuevo manejador para seleccionar boleta
  const handleSeleccionarBoleta = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const idBoleta = parseInt(e.target.value);
    setPagoEditar(prev => ({ ...prev, idBoleta }));
    
    // Opcionalmente, establecer el monto automáticamente según el precio de la boleta
    if (idBoleta) {
      const boletaSeleccionada = boletasAlumno.find(b => b.idBoleta === idBoleta);
      if (boletaSeleccionada) {
        setPagoEditar(prev => ({ ...prev, monto: boletaSeleccionada.precio }));
      }
    }
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagenSoporte(file);
      
      // Crear URL para previsualización
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagen(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSeleccionarAlumno = (alumno: Alumno) => {
    try {
      setPagoEditar(prev => ({
        ...prev,
        idAlumno: alumno.id,
        nombreVendedor: `${alumno.nombre} ${alumno.apellido || ''}`
      }));
      
      // Set the search term first to avoid UI issues
      setTerminoBusqueda(`${alumno.nombre} ${alumno.apellido || ''}`);
      setAlumnosFiltrados([]);
      
      // Then fetch the data
      obtenerEstadisticasVendedor(alumno.id);
      obtenerBoletasAlumno(alumno.id);
    } catch (error) {
      console.error('Error al seleccionar alumno:', error);
      alert('Hubo un problema al seleccionar el alumno. Por favor, intente nuevamente.');
    }
  };

  const subirImagen = async (idPago: number): Promise<void> => {
    if (!imagenSoporte) return;
    
    try {
      setSubiendoImagen(true);
      const formData = new FormData();
      // Cambiar el nombre del campo para que coincida con lo que espera el backend
      formData.append('file', imagenSoporte);
      
      console.log('Enviando imagen:', imagenSoporte.name, imagenSoporte.type, imagenSoporte.size);
      
      // Usar el endpoint correcto para subir imágenes
      await axios.post(
        `http://localhost:5180/api/SorteosPagos/${idPago}/imagen`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      console.log('Imagen subida correctamente');
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error; // Propagar el error para manejarlo en guardarPago
    } finally {
      setSubiendoImagen(false);
    }
  };

  const guardarPago = async () => {
    // Validaciones (mantener las existentes)
    if (!pagoEditar.idAlumno) {
      alert('Debe seleccionar un alumno');
      return;
    }
    
    if (!pagoEditar.monto || pagoEditar.monto <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }
    
    if (!pagoEditar.metodoPago) {
      alert('Debe seleccionar un método de pago');
      return;
    }
    
    try {
      setLoading(true);
      
      // Preparar datos para enviar - estructura exacta que espera el backend
      const datosPago = {
        idBoleta: pagoEditar.idBoleta || 0, // Asegurarse de enviar idBoleta aunque sea 0
        idAlumno: pagoEditar.idAlumno,
        monto: pagoEditar.monto,
        metodoPago: pagoEditar.metodoPago,
        referencia: pagoEditar.referencia || '',
        observaciones: pagoEditar.observaciones || '',
        estado: pagoEditar.estado || 'Registrado',
        fechaPago: pagoEditar.fechaPago || new Date().toISOString().split('T')[0]
      };
      
      console.log('Datos a enviar:', datosPago); // Para depuración
      
      let respuesta;
      
      if (esNuevoPago) {
        // Crear nuevo pago
        respuesta = await axios.post('http://localhost:5180/api/SorteosPagos', datosPago);
        console.log('Pago creado:', respuesta.data);
        
        // Si hay imagen, subirla después de crear el pago
        if (imagenSoporte) {
          try {
            await subirImagen(respuesta.data.idPago);
          } catch (errorImagen) {
            console.error('Error al subir imagen:', errorImagen);
            // Continuar aunque falle la imagen
          }
        }
        
        alert('Pago registrado con éxito');
      } else {
        // Actualizar pago existente
        const idPago = pagoEditar.idPago;
        respuesta = await axios.put(`http://localhost:5180/api/SorteosPagos/${idPago}`, datosPago);
        console.log('Pago actualizado:', respuesta.data);
        
        // Si hay nueva imagen, subirla
        if (imagenSoporte) {
          try {
            await subirImagen(idPago!);
          } catch (errorImagen) {
            console.error('Error al subir imagen:', errorImagen);
            // Continuar aunque falle la imagen
          }
        }
        
        alert('Pago actualizado con éxito');
      }
      
      // Recargar datos
      obtenerPagos();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar pago:', error);
      
      // Mostrar mensaje de error más específico si está disponible
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = typeof error.response.data === 'string' 
          ? error.response.data 
          : JSON.stringify(error.response.data);
        alert(`Error al guardar el pago: ${errorMessage}`);
      } else {
        alert('Error al guardar el pago. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const eliminarPago = async (idPago: number) => {
    if (!window.confirm('¿Está seguro que desea eliminar este pago?')) {
      return;
    }
    
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5180/api/SorteosPagos/${idPago}`);
      alert('Pago eliminado con éxito');
      obtenerPagos();
    } catch (error) {
      console.error('Error al eliminar pago:', error);
      alert('Error al eliminar el pago. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fechaStr: string) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return fechaStr;
    }
  };

  const getNombreVendedor = (idAlumno: string) => {
    const vendedor = vendedores.find(v => v.idAlumno === idAlumno);
    if (vendedor) {
      if (vendedor.alumno) {
        return `${vendedor.alumno.nombre} ${vendedor.alumno.apellido || ''}`;
      } else {
        return `${vendedor.nombre || ''} ${vendedor.apellido || ''}`;
      }
    }
    return 'Vendedor no encontrado';
  };

  const getNombreMetodoPago = (metodoPago: string) => {
    const metodo = metodosRecaudo.find(m => m.nombre === metodoPago);
    return metodo ? metodo.nombre : metodoPago;
  };

  const getBadgeVariant = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'registrado':
        return 'primary';
      case 'verificado':
        return 'success';
      case 'rechazado':
        return 'danger';
      case 'pendiente':
        return 'warning';
      default:
        return 'secondary';
    }
  };

  // Función para formatear números de forma segura
  const formatearNumero = (valor: number | undefined | null) => {
    if (valor === undefined || valor === null) return '0';
    return valor.toLocaleString();
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestión de Pagos</h1>
        <Button variant="primary" onClick={abrirModalNuevo}>
          <i className="bi bi-plus-circle me-2"></i>
          Registrar Nuevo Pago
        </Button>
      </div>
      
      {loading && !mostrarModal ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando pagos...</p>
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Alumno</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Método</th>
                <th>Referencia</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pagos.length > 0 ? (
                pagos.map(pago => (
                  <tr key={pago.idPago}>
                    <td>{pago.idPago}</td>
                    <td>{pago.nombreVendedor || getNombreVendedor(pago.idAlumno)}</td>
                    <td>${formatearNumero(pago.monto)}</td>
                    <td>{formatearFecha(pago.fechaPago)}</td>
                    <td>{getNombreMetodoPago(pago.metodoPago)}</td>
                    <td>{pago.referencia || '-'}</td>
                    <td>
                      <Badge bg={getBadgeVariant(pago.estado)}>
                        {pago.estado}
                      </Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button 
                          variant="info" 
                          size="sm"
                          onClick={() => abrirModalDetalles(pago)}
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button 
                          variant="warning" 
                          size="sm"
                          onClick={() => abrirModalEditar(pago)}
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => eliminarPago(pago.idPago)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center">
                    No hay pagos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      )}
      
      {/* Modal para crear/editar pago */}
      <Modal show={mostrarModal} onHide={cerrarModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {esNuevoPago ? 'Registrar Nuevo Pago' : 'Editar Pago'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Alumno</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Buscar alumno..."
                      value={terminoBusqueda}
                      onChange={(e) => setTerminoBusqueda(e.target.value)}
                      disabled={!esNuevoPago}
                    />
                    {pagoEditar.idAlumno && (
                      <Button 
                        variant="outline-secondary" 
                        onClick={() => {
                          if (esNuevoPago) {
                            setPagoEditar(prev => ({ ...prev, idAlumno: '', nombreVendedor: '' }));
                            setTerminoBusqueda('');
                          }
                        }}
                        disabled={!esNuevoPago}
                      >
                        <i className="bi bi-x"></i>
                      </Button>
                    )}
                  </InputGroup>
                  
                  {/* Resultados de búsqueda */}
                  {alumnosFiltrados.length > 0 && !pagoEditar.idAlumno && (
                    <div className="search-results">
                      {alumnosFiltrados.map(alumno => (
                        <div 
                          key={alumno.id} 
                          className="search-result-item"
                          onClick={() => handleSeleccionarAlumno(alumno)}
                        >
                          <div className="d-flex align-items-center">
                            <i className="bi bi-person me-2"></i>
                            <div>
                              <div><strong>{alumno.nombre} {alumno.apellido || ''}</strong></div>
                              <small className="text-muted">ID: {alumno.id}</small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Pago</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaPago"
                    value={pagoEditar.fechaPago || new Date().toISOString().split('T')[0]}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            {pagoEditar.idAlumno && (
              <div className="mb-4 p-3 bg-light rounded">
                <h5>Información del Alumno</h5>
                <Row>
                  <Col md={6}>
                  <p className="mb-1"><strong>Nombre:</strong> {getNombreVendedor(pagoEditar.idAlumno)}</p>
                    <p className="mb-1"><strong>ID:</strong> {pagoEditar.idAlumno}</p>
                  </Col>
                  <Col md={6}>
                  <p className="mb-1"><strong>Nombre:</strong> {getNombreVendedor(pagoEditar.idAlumno)}</p>
                    <p className="mb-1"><strong>ID:</strong> {pagoEditar.idAlumno}</p>
                  </Col>
                  <Col md={6}>
                    <p className="mb-0"><strong>Total Boletas:</strong> {boletasVendedor.total}</p>
                    <p className="mb-0"><strong>Vendidas:</strong> {boletasVendedor.vendidas}</p>
                    <p className="mb-0"><strong>Valor Total:</strong> ${formatearNumero(boletasVendedor.valorTotal)}</p>
                    <p className="mb-0"><strong>Pagado:</strong> ${formatearNumero(boletasVendedor.pagado)}</p>
                    <p className="mb-0"><strong>Pendiente:</strong> ${formatearNumero(boletasVendedor.pendiente)}</p>
                  </Col>
                </Row>
              </div>
            )}
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Monto</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>$</InputGroup.Text>
                    <Form.Control
                      type="number"
                      name="monto"
                      value={pagoEditar.monto || ''}
                      onChange={handleInputChange}
                      min="0"
                      step="1000"
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Método de Pago</Form.Label>
                  <Form.Select
                    name="metodoPago"
                    value={pagoEditar.metodoPago || ''}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar método</option>
                    {metodosRecaudo.map(metodo => (
                      <option key={metodo.idMetodoRecaudo} value={metodo.nombre}>
                        {metodo.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Referencia</Form.Label>
                  <Form.Control
                    type="text"
                    name="referencia"
                    value={pagoEditar.referencia || ''}
                    onChange={handleInputChange}
                    placeholder="Número de referencia o comprobante"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="estado"
                    value={pagoEditar.estado || 'Registrado'}
                    onChange={handleInputChange}
                  >
                    <option value="Registrado">Registrado</option>
                    <option value="Verificado">Verificado</option>
                    <option value="Rechazado">Rechazado</option>
                    <option value="Pendiente">Pendiente</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                name="observaciones"
                value={pagoEditar.observaciones || ''}
                onChange={handleInputChange}
                rows={3}
                placeholder="Observaciones adicionales"
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Comprobante de Pago</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                ref={fileInputRef}
              />
              <Form.Text className="text-muted">
                Sube una imagen del comprobante de pago (opcional).
              </Form.Text>
            </Form.Group>
            
            {previewImagen && (
              <div className="mb-3">
                <p className="mb-2">Vista previa:</p>
                <div className="preview-container">
                  <Image 
                    src={previewImagen} 
                    alt="Vista previa del comprobante" 
                    thumbnail 
                    style={{ maxHeight: '200px' }}
                  />
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className="position-absolute top-0 end-0 m-1"
                    onClick={() => {
                      setPreviewImagen(null);
                      setImagenSoporte(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                  >
                    <i className="bi bi-x"></i>
                  </Button>
                </div>
              </div>
            )}
            
            {/* Sección de boletas - Separada como solicitado */}
            <Button 
              variant="outline-primary" 
              className="mb-3 w-100"
              onClick={() => setMostrarSeccionBoletas(!mostrarSeccionBoletas)}
            >
              {mostrarSeccionBoletas ? 'Ocultar selección de boleta' : 'Mostrar selección de boleta'}
            </Button>
            
            {mostrarSeccionBoletas && (
              <div className="mb-4 p-3 bg-light rounded">
                <h5>Selección de Boleta (Opcional)</h5>
                <Form.Group className="mb-3">
                  <Form.Label>Boleta</Form.Label>
                  <Form.Select 
                    name="idBoleta"
                    value={pagoEditar.idBoleta || ''}
                    onChange={handleSeleccionarBoleta}
                  >
                    <option value="">Seleccionar boleta</option>
                    {boletasAlumno.map(boleta => (
                      <option key={boleta.idBoleta} value={boleta.idBoleta}>
                        {boleta.numeroBoleta} - ${boleta.precio ? boleta.precio.toLocaleString() : '0'}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Seleccionar una boleta establecerá automáticamente el monto.
                  </Form.Text>
                </Form.Group>
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={guardarPago}
            disabled={loading || subiendoImagen}
          >
            {loading || subiendoImagen ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Guardando...
              </>
            ) : (
              'Guardar Pago'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Modal para ver detalles del pago */}
      <Modal show={mostrarModalDetalles} onHide={cerrarModalDetalles}>
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pagoDetalles && (
            <div>
              <div className="mb-4">
                <h5>Información General</h5>
                <Row>
                  <Col md={6}>
                    <p><strong>ID:</strong> {pagoDetalles.idPago}</p>
                    <p><strong>Monto:</strong> ${formatearNumero(pagoDetalles.monto)}</p>
                    <p><strong>Fecha:</strong> {formatearFecha(pagoDetalles.fechaPago)}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Alumno:</strong> {pagoDetalles.nombreVendedor || getNombreVendedor(pagoDetalles.idAlumno)}</p>
                    <p><strong>Método:</strong> {getNombreMetodoPago(pagoDetalles.metodoPago)}</p>
                    <p>
                      <strong>Estado:</strong>{' '}
                      <Badge bg={getBadgeVariant(pagoDetalles.estado)}>
                        {pagoDetalles.estado}
                      </Badge>
                    </p>
                  </Col>
                </Row>
              </div>
              
              {pagoDetalles.referencia && (
                <div className="mb-4">
                  <h5>Referencia</h5>
                  <p>{pagoDetalles.referencia}</p>
                </div>
              )}
              
              {pagoDetalles.observaciones && (
                <div className="mb-4">
                  <h5>Observaciones</h5>
                  <p>{pagoDetalles.observaciones}</p>
                </div>
              )}
              
              {pagoDetalles.imagenSoporte && (
                <div className="mb-4">
                  <h5>Comprobante</h5>
                  <div className="text-center">
                    <Image 
                      src={pagoDetalles.imagenSoporte} 
                      alt="Comprobante de pago" 
                      thumbnail 
                      style={{ maxHeight: '300px' }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModalDetalles}>
            Cerrar
          </Button>
          <Button 
            variant="warning" 
            onClick={() => {
              cerrarModalDetalles();
              if (pagoDetalles) {
                abrirModalEditar(pagoDetalles);
              }
            }}
          >
            Editar
          </Button>
        </Modal.Footer>
      </Modal>
      
      <style jsx>{`
        .search-results {
          position: absolute;
          z-index: 1000;
          width: 100%;
          max-height: 300px;
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
        
        .preview-container {
          position: relative;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default SorteosPagos;