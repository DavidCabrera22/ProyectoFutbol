import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
const API_URL = import.meta.env.VITE_API_URL || 'https://topfutbol-production.up.railway.app';

interface Movimiento {
  idMovimiento: number;
  fecha: string;
  hora: string;
  valor: number;
  idTipo: number;
  nombreTipo?: string;
  idSede: number;
  nombreSede?: string;
  idTipoRecaudo: number;
  nombreTipoRecaudo?: string;
  idAlumno: string;
  nombreAlumno?: string;
  idServicio: number;
  nombreServicio?: string;
  caja: string;
  soporte: string;
}

interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
}

interface Sede {
  idSede: number;
  nombreSede: string;
}

interface TipoMovimiento {
  idTipo: number;
  nombre: string;
}

interface TipoRecaudo {
  idTipoRecaudo: number;
  nombre: string;
}

interface Servicio {
  idServicio: number;
  nombre: string;
}

interface EstadoCuenta {
  idServicio: number;
  nombreServicio: string;
  valorTotal: number;
  abonado: number;
  saldo: number;
  estaAlDia: boolean;
  ultimoPago: string;
  metodoPago: string;
  numeroSoporte: string;
}

const Movimientos: FC = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [tiposMovimiento, setTiposMovimiento] = useState<TipoMovimiento[]>([]);
  const [tiposRecaudo, setTiposRecaudo] = useState<TipoRecaudo[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [movimientoEditar, setMovimientoEditar] = useState<Partial<Movimiento>>({
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
    valor: 0,
    idTipo: 0,
    idSede: 0,
    idTipoRecaudo: 0,
    idAlumno: '',
    idServicio: 0,
    caja: '',
    soporte: ''
  });
  const [esNuevoMovimiento, setEsNuevoMovimiento] = useState(true);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [guardando, setGuardando] = useState(false);
  
  // Estados para el estado de cuenta
  const [estadoCuentaVisible, setEstadoCuentaVisible] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null);
  const [estadoCuenta, setEstadoCuenta] = useState<EstadoCuenta[]>([]);
  const [movimientosAlumno, setMovimientosAlumno] = useState<Movimiento[]>([]);
  const [loadingEstadoCuenta, setLoadingEstadoCuenta] = useState(false);
  
  // Nuevos estados para la búsqueda de alumnos
  const [terminoBusquedaAlumno, setTerminoBusquedaAlumno] = useState('');
  const [alumnosBuscados, setAlumnosBuscados] = useState<Alumno[]>([]);
  const [mostrarResultadosBusqueda, setMostrarResultadosBusqueda] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true);
        const [
          respMovimientos, 
          respAlumnos, 
          respSedes, 
          respTiposMovimiento, 
          respTiposRecaudo, 
          respServicios
        ] = await Promise.all([
          axios.get(`${API_URL}/api/Movimientos`),
          axios.get(`${API_URL}/api/Alumnos`),
          axios.get(`${API_URL}/api/Sedes`),
          axios.get(`${API_URL}/api/TiposMovimiento`),
          axios.get(`${API_URL}/api/TiposRecaudo`),
          axios.get(`${API_URL}/api/Servicios`)
        ]);
        
        console.log('Datos recibidos:', {
          movimientos: respMovimientos.data,
          alumnos: respAlumnos.data,
          sedes: respSedes.data,
          tiposMovimiento: respTiposMovimiento.data,
          tiposRecaudo: respTiposRecaudo.data,
          servicios: respServicios.data
        });
        
        // Combinar datos para mostrar nombres en lugar de IDs
        const movimientosCompletos = respMovimientos.data.map((mov: Movimiento) => {
          const alumno = respAlumnos.data.find((a: Alumno) => a.id === mov.idAlumno);
          const sede = respSedes.data.find((s: Sede) => s.idSede === mov.idSede);
          const tipo = respTiposMovimiento.data.find((t: TipoMovimiento) => t.idTipo === mov.idTipo);
          const tipoRecaudo = respTiposRecaudo.data.find((tr: TipoRecaudo) => tr.idTipoRecaudo === mov.idTipoRecaudo);
          const servicio = respServicios.data.find((s: Servicio) => s.idServicio === mov.idServicio);
          
          // Ensure valor is a number
          const valor = typeof mov.valor === 'number' ? mov.valor : 0;
          
          return {
            ...mov,
            valor: valor,
            nombreAlumno: alumno ? `${alumno.nombre} ${alumno.apellido}` : 'Desconocido',
            nombreSede: sede ? sede.nombreSede : 'Desconocida',
            nombreTipo: tipo ? tipo.nombre : 'Desconocido',
            nombreTipoRecaudo: tipoRecaudo ? tipoRecaudo.nombre : 'Desconocido',
            nombreServicio: servicio ? servicio.nombre : 'Desconocido'
          };
        });
        
        setMovimientos(movimientosCompletos);
        setAlumnos(respAlumnos.data);
        setSedes(respSedes.data);
        setTiposMovimiento(respTiposMovimiento.data);
        setTiposRecaudo(respTiposRecaudo.data);
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

  // Nueva función para buscar alumnos
  const buscarAlumnos = (termino: string) => {
    setTerminoBusquedaAlumno(termino);
    
    if (!termino.trim()) {
      setAlumnosBuscados([]);
      setMostrarResultadosBusqueda(false);
      return;
    }
    
    const terminoLower = termino.toLowerCase();
    const resultados = alumnos.filter(alumno => 
      alumno.nombre.toLowerCase().includes(terminoLower) || 
      alumno.apellido.toLowerCase().includes(terminoLower) ||
      alumno.id.toLowerCase().includes(terminoLower)
    ).slice(0, 5); // Limitamos a 5 resultados para no sobrecargar la UI
    
    setAlumnosBuscados(resultados);
    setMostrarResultadosBusqueda(true);
  };

  // Nueva función para seleccionar un alumno de los resultados
  const seleccionarAlumno = (alumno: Alumno) => {
    setMovimientoEditar(prev => ({
      ...prev,
      idAlumno: alumno.id
    }));
    setTerminoBusquedaAlumno(`${alumno.nombre} ${alumno.apellido}`);
    setAlumnosBuscados([]);
    setMostrarResultadosBusqueda(false);
  };

  const abrirModalNuevo = () => {
    setMovimientoEditar({
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().split(' ')[0].substring(0, 5),
      valor: 0,
      idTipo: 0,
      idSede: 0,
      idTipoRecaudo: 0,
      idAlumno: '',
      idServicio: 0,
      caja: '',
      soporte: ''
    });
    setTerminoBusquedaAlumno('');
    setEsNuevoMovimiento(true);
  };

  const abrirModalEditar = (movimiento: Movimiento) => {
    const alumno = alumnos.find(a => a.id === movimiento.idAlumno);
    setMovimientoEditar({
      ...movimiento,
      fecha: new Date(movimiento.fecha).toISOString().split('T')[0]
    });
    setTerminoBusquedaAlumno(alumno ? `${alumno.nombre} ${alumno.apellido}` : '');
    setEsNuevoMovimiento(false);
    setMostrarModalEdicion(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let parsedValue: string | number = value;
    
    // Convertir a número para campos numéricos
    if (name === 'valor') {
      parsedValue = parseFloat(value) || 0;
    } else if (['idTipo', 'idSede', 'idTipoRecaudo', 'idServicio'].includes(name)) {
      parsedValue = parseInt(value, 10) || 0;
    }
    
    setMovimientoEditar(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const guardarMovimiento = async () => {
    if (!movimientoEditar) return;
    
    try {
      setGuardando(true);
      if (esNuevoMovimiento) {
        await axios.post(`${API_URL}/api/Movimientos`, movimientoEditar);
      } else {
        await axios.put(`${API_URL}/api/Movimientos/${movimientoEditar.idMovimiento}`, movimientoEditar);
      }
      
      // Recargar datos
      window.location.reload();
    } catch (error) {
      console.error('Error al guardar movimiento:', error);
      alert('Error al guardar el movimiento. Por favor, intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const eliminarMovimiento = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este movimiento?')) {
      try {
        await axios.delete(`${API_URL}/api/Movimientos/${id}`);
        // Recargar datos
        window.location.reload();
      } catch (error) {
        console.error('Error al eliminar movimiento:', error);
        alert('Error al eliminar el movimiento. Por favor, intenta de nuevo.');
      }
    }
  };

  const verEstadoCuentaAlumno = async (idAlumno: string) => {
    try {
      setLoadingEstadoCuenta(true);
      setEstadoCuentaVisible(true);
      
      // Obtener datos del alumno
      const alumnoResp = await axios.get(`${API_URL}/api/Alumnos/${idAlumno}`);
      setAlumnoSeleccionado(alumnoResp.data);
      
      // Obtener estado de cuenta del alumno
      const estadoCuentaResp = await axios.get(`${API_URL}/api/Movimientos/estadoCuenta/${idAlumno}`);
      setEstadoCuenta(estadoCuentaResp.data);
      
      // Obtener movimientos del alumno
      const movimientosResp = await axios.get(`${API_URL}/api/Movimientos/alumno/${idAlumno}`);
      const movimientosOrdenados = movimientosResp.data.sort((a: Movimiento, b: Movimiento) => 
        new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
      );
      setMovimientosAlumno(movimientosOrdenados.slice(0, 5)); // Mostrar solo los 5 más recientes
    } catch (error) {
      console.error('Error al obtener estado de cuenta:', error);
      alert('Error al cargar el estado de cuenta. Por favor, intenta de nuevo.');
    } finally {
      setLoadingEstadoCuenta(false);
    }
  };

  const movimientosFiltrados = movimientos.filter(mov => 
    mov.nombreAlumno?.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    mov.nombreSede?.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    mov.nombreTipo?.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    mov.nombreServicio?.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Movimientos</h2>
        <div>
          <Button variant="success" className="me-2" onClick={abrirModalNuevo}>
            <i className="bi bi-plus-circle me-1"></i> Nuevo Movimiento
          </Button>
          <Button variant="primary" onClick={() => setMostrarModal(true)}>
            <i className="bi bi-list me-2"></i> Ver Movimientos
          </Button>
        </div>
      </div>

      {/* Formulario de creación/edición de movimiento (ahora en la pantalla principal) */}
      <div className="card">
        <div className="card-body">
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha"
                    value={movimientoEditar?.fecha || new Date().toISOString().split('T')[0]}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Hora</Form.Label>
                  <Form.Control
                    type="time"
                    name="hora"
                    value={movimientoEditar?.hora || new Date().toTimeString().split(' ')[0].substring(0, 5)}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Alumno</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type="text"
                      placeholder="Buscar alumno por nombre o ID..."
                      value={terminoBusquedaAlumno}
                      onChange={(e) => buscarAlumnos(e.target.value)}
                      onFocus={() => {
                        if (alumnosBuscados.length > 0) {
                          setMostrarResultadosBusqueda(true);
                        }
                      }}
                      onBlur={() => {
                        // Pequeño retraso para permitir que el clic en un resultado funcione
                        setTimeout(() => setMostrarResultadosBusqueda(false), 200);
                      }}
                    />
                    
                    {mostrarResultadosBusqueda && alumnosBuscados.length > 0 && (
                      <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm" style={{ zIndex: 1050 }}>
                        {alumnosBuscados.map(alumno => (
                          <div 
                            key={alumno.id}
                            className="p-2 border-bottom"
                            style={{ cursor: 'pointer' }}
                            onMouseDown={() => seleccionarAlumno(alumno)}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                          >
                            <strong>{alumno.nombre} {alumno.apellido}</strong>
                            <br />
                            <small className="text-muted">ID: {alumno.id}</small>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Sede</Form.Label>
                  <Form.Select
                    name="idSede"
                    value={movimientoEditar?.idSede || 0}
                    onChange={handleInputChange}
                  >
                    <option value={0}>Seleccione una sede</option>
                    {sedes.map(sede => (
                      <option key={sede.idSede} value={sede.idSede}>
                        {sede.nombreSede}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Movimiento</Form.Label>
                  <Form.Select
                    name="idTipo"
                    value={movimientoEditar?.idTipo || 0}
                    onChange={handleInputChange}
                  >
                    <option value={0}>Seleccione un tipo</option>
                    {tiposMovimiento.map(tipo => (
                      <option key={tipo.idTipo} value={tipo.idTipo}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Servicio</Form.Label>
                  <Form.Select
                    name="idServicio"
                    value={movimientoEditar?.idServicio || 0}
                    onChange={handleInputChange}
                  >
                    <option value={0}>Seleccione un servicio</option>
                    {servicios.map(servicio => (
                      <option key={servicio.idServicio} value={servicio.idServicio}>
                        {servicio.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de Recaudo</Form.Label>
                  <Form.Select
                    name="idTipoRecaudo"
                    value={movimientoEditar?.idTipoRecaudo || 0}
                    onChange={handleInputChange}
                  >
                    <option value={0}>Seleccione un tipo de recaudo</option>
                    {tiposRecaudo.map(tipo => (
                      <option key={tipo.idTipoRecaudo} value={tipo.idTipoRecaudo}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Valor</Form.Label>
                  <Form.Control
                    type="number"
                    name="valor"
                    value={movimientoEditar?.valor || 0}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Caja</Form.Label>
                  <Form.Control
                    type="text"
                    name="caja"
                    value={movimientoEditar?.caja || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Soporte</Form.Label>
                  <Form.Control
                    type="text"
                    name="soporte"
                    value={movimientoEditar?.soporte || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>

            {/* Botón para ver estado de cuenta */}
            {movimientoEditar?.idAlumno && (
              <div className="mb-3 d-flex justify-content-end">
                <Button 
                  variant="info" 
                  onClick={() => verEstadoCuentaAlumno(movimientoEditar.idAlumno!)}
                  disabled={loadingEstadoCuenta}
                  className="me-2"
                >
                  {loadingEstadoCuenta ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Cargando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-wallet2 me-1"></i> Ver Estado de Cuenta
                    </>
                  )}
                </Button>
                <Button variant="primary" onClick={guardarMovimiento} disabled={guardando}>
                  {guardando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                      Guardando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-1"></i> Guardar Movimiento
                    </>
                  )}
                </Button>
              </div>
            )}
          </Form>
          
          {/* Sección para mostrar el estado de cuenta */}
          {estadoCuentaVisible && alumnoSeleccionado && (
            <div className="mt-4">
              <h5>Estado de Cuenta: {alumnoSeleccionado.nombre} {alumnoSeleccionado.apellido}</h5>
              <div className="row">
                {estadoCuenta.map((item, idx) => (
                  <div className="col-md-4 mb-3" key={idx}>
                    <div className="card h-100">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">{item.nombreServicio}</h6>
                        <span className={`badge ${item.estaAlDia ? 'bg-success' : 'bg-danger'}`}>
                          {item.estaAlDia ? 'Al día' : 'Pendiente'}
                        </span>
                      </div>
                      <div className="card-body">
                        <div className="row">
                          <div className="col-6">
                            <p className="mb-1"><strong>Valor Total:</strong></p>
                            <p className="mb-1"><strong>Abonado:</strong></p>
                            <p className="mb-1"><strong>Saldo:</strong></p>
                            <p className="mb-1"><strong>Último Pago:</strong></p>
                            {item.metodoPago && <p className="mb-1"><strong>Método de Pago:</strong></p>}
                            {item.numeroSoporte && <p className="mb-1"><strong>Soporte:</strong></p>}
                          </div>
                          <div className="col-6 text-end">
                            <p className="mb-1">${item.valorTotal.toLocaleString()}</p>
                            <p className="mb-1">${item.abonado.toLocaleString()}</p>
                            <p className={`mb-1 ${item.saldo > 0 ? 'text-danger' : 'text-success'}`}>
                              ${item.saldo.toLocaleString()}
                            </p>
                            <p className="mb-1">{item.ultimoPago}</p>
                            {item.metodoPago && <p className="mb-1">{item.metodoPago}</p>}
                            {item.numeroSoporte && <p className="mb-1">{item.numeroSoporte}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <h6>Últimos Movimientos</h6>
              <div className="table-responsive">
                <table className="table table-sm table-hover">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Servicio</th>
                      <th>Tipo</th>
                      <th className="text-end">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientosAlumno.length > 0 ? (
                      movimientosAlumno.map((mov, idx) => (
                        <tr key={idx}>
                          <td>{new Date(mov.fecha).toLocaleDateString()}</td>
                          <td>{mov.nombreServicio}</td>
                          <td>
                            <span className={`badge ${mov.idTipo === 1 ? 'bg-success' : 'bg-danger'}`}>
                              {mov.nombreTipo}
                            </span>
                          </td>
                          <td className="text-end">${mov.valor.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center">No hay movimientos registrados</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-end mt-3">
                <Button variant="secondary" onClick={() => setEstadoCuentaVisible(false)}>
                  Cerrar Estado de Cuenta
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal para ver la lista de movimientos */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Lista de Movimientos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por alumno, sede, tipo o servicio..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Alumno</th>
                    <th>Sede</th>
                    <th>Tipo</th>
                    <th>Servicio</th>
                    <th>Valor</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientosFiltrados.length > 0 ? (
                    movimientosFiltrados.map(movimiento => (
                      <tr key={movimiento.idMovimiento}>
                        <td>{movimiento.idMovimiento}</td>
                        <td>{new Date(movimiento.fecha).toLocaleDateString()}</td>
                        <td>{movimiento.hora}</td>
                        <td>{movimiento.nombreAlumno}</td>
                        <td>{movimiento.nombreSede}</td>
                        <td>{movimiento.nombreTipo}</td>
                        <td>{movimiento.nombreServicio}</td>
                        <td>${movimiento.valor ? movimiento.valor.toLocaleString() : '0'}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => abrirModalEditar(movimiento)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarMovimiento(movimiento.idMovimiento)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="text-center">No hay movimientos registrados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para editar movimiento */}
      <Modal show={mostrarModalEdicion} onHide={() => setMostrarModalEdicion(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{esNuevoMovimiento ? 'Nuevo Movimiento' : 'Editar Movimiento'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="fecha"
                value={movimientoEditar?.fecha || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Hora</Form.Label>
              <Form.Control
                type="time"
                name="hora"
                value={movimientoEditar?.hora || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Alumno</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Buscar alumno por nombre o ID..."
                  value={terminoBusquedaAlumno}
                  onChange={(e) => buscarAlumnos(e.target.value)}
                  onFocus={() => {
                    if (alumnosBuscados.length > 0) {
                      setMostrarResultadosBusqueda(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setMostrarResultadosBusqueda(false), 200);
                  }}
                />
                
                {mostrarResultadosBusqueda && alumnosBuscados.length > 0 && (
                  <div className="position-absolute w-100 mt-1 bg-white border rounded shadow-sm" style={{ zIndex: 1050 }}>
                    {alumnosBuscados.map(alumno => (
                      <div 
                        key={alumno.id}
                        className="p-2 border-bottom"
                        style={{ cursor: 'pointer' }}
                        onMouseDown={() => seleccionarAlumno(alumno)}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f8f9fa')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                      >
                        <strong>{alumno.nombre} {alumno.apellido}</strong>
                        <br />
                        <small className="text-muted">ID: {alumno.id}</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Sede</Form.Label>
              <Form.Select
                name="idSede"
                value={movimientoEditar?.idSede || 0}
                onChange={handleInputChange}
              >
                <option value={0}>Seleccione una sede</option>
                {sedes.map(sede => (
                  <option key={sede.idSede} value={sede.idSede}>
                    {sede.nombreSede}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Movimiento</Form.Label>
              <Form.Select
                name="idTipo"
                value={movimientoEditar?.idTipo || 0}
                onChange={handleInputChange}
              >
                <option value={0}>Seleccione un tipo</option>
                {tiposMovimiento.map(tipo => (
                  <option key={tipo.idTipo} value={tipo.idTipo}>
                    {tipo.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Servicio</Form.Label>
              <Form.Select
                name="idServicio"
                value={movimientoEditar?.idServicio || 0}
                onChange={handleInputChange}
              >
                <option value={0}>Seleccione un servicio</option>
                {servicios.map(servicio => (
                  <option key={servicio.idServicio} value={servicio.idServicio}>
                    {servicio.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tipo de Recaudo</Form.Label>
              <Form.Select
                name="idTipoRecaudo"
                value={movimientoEditar?.idTipoRecaudo || 0}
                onChange={handleInputChange}
              >
                <option value={0}>Seleccione un tipo de recaudo</option>
                {tiposRecaudo.map(tipo => (
                  <option key={tipo.idTipoRecaudo} value={tipo.idTipoRecaudo}>
                    {tipo.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valor</Form.Label>
              <Form.Control
                type="number"
                name="valor"
                value={movimientoEditar?.valor || 0}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Caja</Form.Label>
              <Form.Control
                type="text"
                name="caja"
                value={movimientoEditar?.caja || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Soporte</Form.Label>
              <Form.Control
                type="text"
                name="soporte"
                value={movimientoEditar?.soporte || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModalEdicion(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarMovimiento} disabled={guardando}>
            {guardando ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Movimientos;