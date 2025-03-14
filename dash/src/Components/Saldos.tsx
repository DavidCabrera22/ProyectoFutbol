import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';

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

const Saldos: FC = () => {
  const [saldos, setSaldos] = useState<Saldo[]>([]);
  const [sedes, setSedes] = useState<Sede[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [saldoEditar, setSaldoEditar] = useState<Partial<Saldo> | null>(null);
  const [esNuevoSaldo, setEsNuevoSaldo] = useState(false);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

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
      } catch (error) {
        console.error('Error al obtener datos:', error);
        alert('Error al cargar los datos. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    obtenerDatos();
  }, []);

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