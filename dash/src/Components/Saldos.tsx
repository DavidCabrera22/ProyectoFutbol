import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Card } from 'react-bootstrap';

interface Saldo {
  idSaldo: number;
  fecha: string;
  valor: number;
  idSede: number;
  nombreSede?: string;
}

interface Sede {
  idSede: number;
  nombreSede: string;
  ciudad: string;
}

// Nuevas interfaces para la funcionalidad de alumnos
interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  idSede: number;
}

interface Servicio {
  idServicio: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

interface Movimiento {
  idMovimiento: number;
  idAlumno: string;
  idTipoMovimiento: number;
  idServicio: number;
  fecha: string;
  monto: number;
  nombreServicio?: string;
  tipoMovimiento?: string;
}

const Saldos: FC = () => {
  const [saldos, setSaldos] = useState<Saldo[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [saldoEditar, setSaldoEditar] = useState<Partial<Saldo> | null>(null);
  const [esNuevoSaldo, setEsNuevoSaldo] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  
  // Nuevos estados para la búsqueda de alumnos
  const [busquedaAlumno, setBusquedaAlumno] = useState('');
  const [alumnosEncontrados, setAlumnosEncontrados] = useState<Alumno[]>([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Alumno | null>(null);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [resumenDeuda, setResumenDeuda] = useState<{[key: string]: number}>({});
  const [loadingAlumno, setLoadingAlumno] = useState(false);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true);
        
        // Primero obtenemos las sedes
        const respSedes = await axios.get('http://localhost:5180/api/Sedes');
        console.log('Datos de sedes recibidos:', respSedes.data);
        setSedes(respSedes.data);
        
        // Luego obtenemos los saldos
        const respSaldos = await axios.get('http://localhost:5180/api/Saldos');
        console.log('Datos de saldos recibidos:', respSaldos.data);
        
        // Combinar datos para mostrar nombres de sedes
        const saldosConSedes = respSaldos.data.map((saldo: Saldo) => {
          const sede = respSedes.data.find((s: Sede) => s.idSede === saldo.idSede);
          return {
            ...saldo,
            nombreSede: sede ? sede.nombreSede : 'Desconocida'
          };
        });
        
        setSaldos(saldosConSedes);
        
        // Obtenemos los servicios de la escuela de fútbol
        const respServicios = await axios.get('http://localhost:5180/api/Servicios');
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
  const buscarAlumno = async () => {
    if (!busquedaAlumno.trim()) return;
    
    try {
      setLoadingAlumno(true);
      const respuesta = await axios.get(`http://localhost:5180/api/Alumnos/buscar?termino=${busquedaAlumno}`);
      setAlumnosEncontrados(respuesta.data);
    } catch (error) {
      console.error('Error al buscar alumno:', error);
      alert('Error al buscar alumno. Por favor, intenta de nuevo.');
    } finally {
      setLoadingAlumno(false);
    }
  };

  // Nueva función para seleccionar un alumno y calcular su deuda
  const seleccionarAlumno = async (alumno: Alumno) => {
    setAlumnoSeleccionado(alumno);
    setAlumnosEncontrados([]);
    
    try {
      setLoadingAlumno(true);
      
      // Obtener movimientos del alumno
      const respMovimientos = await axios.get(`http://localhost:5180/api/Movimientos/alumno/${alumno.id}`);
      
      // Obtener tipos de movimiento para enriquecer los datos
      const respTiposMovimiento = await axios.get('http://localhost:5180/api/TiposMovimiento');
      
      // Combinar datos
           // Combinar datos
      const movimientosEnriquecidos = respMovimientos.data.map((mov: Movimiento) => {
        const servicio = servicios.find(s => s.idServicio === mov.idServicio);
        const tipoMovimiento = respTiposMovimiento.data.find((t: {idTipo: number}) => t.idTipo === mov.idTipoMovimiento);
        
        return {
          ...mov,
          nombreServicio: servicio ? servicio.nombre : 'Desconocido',
          tipoMovimiento: tipoMovimiento ? tipoMovimiento.nombre : 'Desconocido'
        };
      });
      
      setMovimientos(movimientosEnriquecidos);
      
      // Calcular resumen de deuda por servicio
      const resumen: {[key: string]: number} = {};
      
      // Inicializar todos los servicios en 0
      servicios.forEach(servicio => {
        resumen[servicio.nombre] = 0;
      });
      
      // Sumar o restar según el tipo de movimiento (asumiendo que 1 es cargo y 2 es abono)
      movimientosEnriquecidos.forEach((mov: Movimiento) => {
        if (mov.nombreServicio) {
          if (mov.idTipoMovimiento === 1) { // Cargo
            resumen[mov.nombreServicio] += mov.monto;
          } else if (mov.idTipoMovimiento === 2) { // Abono
            resumen[mov.nombreServicio] -= mov.monto;
          }
        }
      });
      
      setResumenDeuda(resumen);
      
    } catch (error) {
      console.error('Error al obtener datos del alumno:', error);
      alert('Error al obtener datos del alumno. Por favor, intenta de nuevo.');
    } finally {
      setLoadingAlumno(false);
    }
  };

    const abrirModalNuevo = () => {
    setSaldoEditar({
      fecha: new Date().toISOString().split('T')[0],
      valor: 0,
      idSede: 0
    });
    setEsNuevoSaldo(true);
    setMostrarModal(true);
  };

  const abrirModalEditar = (saldo: Saldo) => {
    setSaldoEditar({
      ...saldo,
      fecha: new Date(saldo.fecha).toISOString().split('T')[0]
    });
    setEsNuevoSaldo(false);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setSaldoEditar(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (saldoEditar) {
      setSaldoEditar({
        ...saldoEditar,
        [name]: name === 'valor' || name === 'idSede' ? parseFloat(value) : value
      });
    }
  };

  const guardarSaldo = async () => {
    if (!saldoEditar) return;
    
    try {
      if (esNuevoSaldo) {
        await axios.post('http://localhost:5180/api/Saldos', saldoEditar);
      } else {
        await axios.put(`http://localhost:5180/api/Saldos/${saldoEditar.idSaldo}`, saldoEditar);
      }
      
      // Recargar datos
      window.location.reload();
    } catch (error) {
      console.error('Error al guardar saldo:', error);
      alert('Error al guardar el saldo. Por favor, intenta de nuevo.');
    }
  };

  const eliminarSaldo = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este saldo?')) {
      try {
        await axios.delete(`http://localhost:5180/api/Saldos/${id}`);
        // Recargar datos
        window.location.reload();
      } catch (error) {
        console.error('Error al eliminar saldo:', error);
        alert('Error al eliminar el saldo. Por favor, intenta de nuevo.');
      }
    }
  };

  const saldosFiltrados = saldos.filter(saldo => 
    saldo.nombreSede?.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
    new Date(saldo.fecha).toLocaleDateString().includes(terminoBusqueda)
  );

  return (
    <div className="p-4">
      {/* Nueva sección de búsqueda de alumnos */}
      <Card className="mb-4">
        <Card.Header>
          <h4>Consulta de Deuda por Alumno</h4>
        </Card.Header>
        <Card.Body>
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar alumno por nombre o apellido..."
                  value={busquedaAlumno}
                  onChange={(e) => setBusquedaAlumno(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && buscarAlumno()}
                />
                <button 
                  className="btn btn-primary" 
                  onClick={buscarAlumno}
                  disabled={loadingAlumno}
                >
                  {loadingAlumno ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <i className="bi bi-search"></i>
                  )}
                  {' '}Buscar
                </button>
              </div>
              
              {/* Resultados de búsqueda */}
              {alumnosEncontrados.length > 0 && (
                <div className="list-group mt-2">
                  {alumnosEncontrados.map(alumno => (
                    <button
                      key={alumno.id}
                      className="list-group-item list-group-item-action"
                      onClick={() => seleccionarAlumno(alumno)}
                    >
                      {alumno.nombre} {alumno.apellido}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Información del alumno seleccionado */}
          {alumnoSeleccionado && (
            <div>
              <h5 className="mb-3">Alumno: {alumnoSeleccionado.nombre} {alumnoSeleccionado.apellido}</h5>
              
              <h6 className="mb-2">Resumen de Deuda por Servicio:</h6>
              <div className="table-responsive mb-4">
                <table className="table table-bordered">
                  <thead className="table-light">
                    <tr>
                      <th>Servicio</th>
                      <th>Monto Pendiente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(resumenDeuda).map(([servicio, monto]) => (
                      <tr key={servicio}>
                        <td>{servicio}</td>
                        <td className={monto > 0 ? 'text-danger' : 'text-success'}>
                          ${Math.abs(monto).toLocaleString()}
                          {monto > 0 ? ' (Debe)' : monto < 0 ? ' (A favor)' : ''}
                        </td>
                      </tr>
                    ))}
                    <tr className="table-secondary">
                      <th>Total</th>
                      <th className={Object.values(resumenDeuda).reduce((a, b) => a + b, 0) > 0 ? 'text-danger' : 'text-success'}>
                        ${Math.abs(Object.values(resumenDeuda).reduce((a, b) => a + b, 0)).toLocaleString()}
                        {Object.values(resumenDeuda).reduce((a, b) => a + b, 0) > 0 ? ' (Debe)' : ' (A favor)'}
                      </th>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <h6 className="mb-2">Historial de Movimientos:</h6>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Servicio</th>
                      <th>Tipo</th>
                      <th>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movimientos.length > 0 ? (
                      movimientos.map(mov => (
                        <tr key={mov.idMovimiento}>
                          <td>{new Date(mov.fecha).toLocaleDateString()}</td>
                          <td>{mov.nombreServicio}</td>
                          <td>{mov.tipoMovimiento}</td>
                          <td>${mov.monto.toLocaleString()}</td>
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
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Sección existente de saldos por sede */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Saldos por Sede</h2>
        <button className="btn btn-primary" onClick={abrirModalNuevo}>
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Saldo
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
                  placeholder="Buscar por sede o fecha..."
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
                    <th>Sede</th>
                    <th>Fecha</th>
                    <th>Valor</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {saldosFiltrados.length > 0 ? (
                    saldosFiltrados.map(saldo => (
                      <tr key={saldo.idSaldo}>
                        <td>{saldo.idSaldo}</td>
                        <td>{saldo.nombreSede}</td>
                        <td>{new Date(saldo.fecha).toLocaleDateString()}</td>
                        <td>${saldo.valor.toLocaleString()}</td>
                        <td>
                          <button 
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => abrirModalEditar(saldo)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => eliminarSaldo(saldo.idSaldo)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center">No hay saldos registrados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal para crear/editar saldo */}
      <Modal show={mostrarModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>{esNuevoSaldo ? 'Nuevo Saldo' : 'Editar Saldo'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Sede</Form.Label>
              <Form.Select
                name="idSede"
                value={saldoEditar?.idSede || 0}
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
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="date"
                name="fecha"
                value={saldoEditar?.fecha || ''}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Valor</Form.Label>
              <Form.Control
                type="number"
                name="valor"
                value={saldoEditar?.valor || 0}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarSaldo}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Saldos;