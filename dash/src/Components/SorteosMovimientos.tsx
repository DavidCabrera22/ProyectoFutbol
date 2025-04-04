import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Row, Col, InputGroup, Badge, Card } from 'react-bootstrap';
import axios from 'axios';

interface Movimiento {
  idMovimiento: number;
  fecha: string;
  concepto: string;
  tipo: string;
  monto: number;
  referencia: string;
  idTalonario?: number;
  idVendedor?: number;
  nombreVendedor?: string;
  descripcionTalonario?: string;
  observaciones: string;
}

interface TipoMovimiento {
  idTipoMovimiento: number;
  nombre: string;
  esIngreso: boolean;
}

interface Talonario {
  idTalonario: number;
  descripcion: string;
}

interface Vendedor {
  idVendedor: number;
  alumno: {
    nombre: string;
    apellido: string;
  };
}

const SorteosMovimientos: React.FC = () => {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [tiposMovimiento, setTiposMovimiento] = useState<TipoMovimiento[]>([]);
  const [talonarios, setTalonarios] = useState<Talonario[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [movimientoEditar, setMovimientoEditar] = useState<Partial<Movimiento>>({
    concepto: '',
    tipo: '',
    monto: 0,
    referencia: '',
    observaciones: ''
  });
  const [esNuevoMovimiento, setEsNuevoMovimiento] = useState<boolean>(false);
  const [filtroFechaInicio, setFiltroFechaInicio] = useState<string>('');
  const [filtroFechaFin, setFiltroFechaFin] = useState<string>('');
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [filtroTalonario, setFiltroTalonario] = useState<string>('');
  const [filtroVendedor, setFiltroVendedor] = useState<string>('');
  const [resumen, setResumen] = useState({
    totalIngresos: 0,
    totalEgresos: 0,
    balance: 0
  });

  useEffect(() => {
    obtenerMovimientos();
    obtenerTiposMovimiento();
    obtenerTalonarios();
    obtenerVendedores();
    
    // Establecer fechas por defecto (último mes)
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate());
    setFiltroFechaInicio(inicioMes.toISOString().split('T')[0]);
    setFiltroFechaFin(hoy.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    calcularResumen();
  }, [movimientos]);

  const obtenerMovimientos = async () => {
    try {
      setLoading(true);
      const respuesta = await axios.get('http://localhost:5180/api/SorteosMovimientos');
      console.log('Datos de movimientos recibidos:', respuesta.data);
      setMovimientos(respuesta.data);
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      alert('Error al cargar los movimientos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const obtenerTiposMovimiento = async () => {
    try {
      const respuesta = await axios.get('http://localhost:5180/api/TiposMovimiento');
      setTiposMovimiento(respuesta.data);
    } catch (error) {
      console.error('Error al obtener tipos de movimiento:', error);
    }
  };

  const obtenerTalonarios = async () => {
    try {
      const respuesta = await axios.get('http://localhost:5180/api/SorteosTalonarios');
      setTalonarios(respuesta.data);
    } catch (error) {
      console.error('Error al obtener talonarios:', error);
    }
  };

  const obtenerVendedores = async () => {
    try {
      const respuesta = await axios.get('http://localhost:5180/api/SorteosVendedores');
      setVendedores(respuesta.data);
    } catch (error) {
      console.error('Error al obtener vendedores:', error);
    }
  };

  const calcularResumen = () => {
    const movimientosFiltrados = filtrarMovimientos();
    
    const ingresos = movimientosFiltrados
      .filter(m => tiposMovimiento.find(t => t.nombre === m.tipo)?.esIngreso)
      .reduce((sum, m) => sum + m.monto, 0);
    
    const egresos = movimientosFiltrados
      .filter(m => !tiposMovimiento.find(t => t.nombre === m.tipo)?.esIngreso)
      .reduce((sum, m) => sum + m.monto, 0);
    
    setResumen({
      totalIngresos: ingresos,
      totalEgresos: egresos,
      balance: ingresos - egresos
    });
  };

  const abrirModalNuevo = () => {
    setMovimientoEditar({
      concepto: '',
      tipo: '',
      monto: 0,
      referencia: '',
      idTalonario: '',
      idVendedor: '',
      observaciones: ''
    });
    setEsNuevoMovimiento(true);
    setMostrarModal(true);
  };

  const abrirModalEditar = (movimiento: Movimiento) => {
    setMovimientoEditar({
      ...movimiento,
      fecha: new Date(movimiento.fecha).toISOString().split('T')[0]
    });
    setEsNuevoMovimiento(false);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const guardarMovimiento = async () => {
    try {
      if (!movimientoEditar.concepto || !movimientoEditar.tipo || !movimientoEditar.monto) {
        alert('Los campos Concepto, Tipo y Monto son obligatorios');
        return;
      }

      if (esNuevoMovimiento) {
        await axios.post('http://localhost:5180/api/SorteosMovimientos', movimientoEditar);
        alert('Movimiento registrado con éxito');
      } else {
        await axios.put(`http://localhost:5180/api/SorteosMovimientos/${movimientoEditar.idMovimiento}`, movimientoEditar);
        alert('Movimiento actualizado con éxito');
      }

      cerrarModal();
      obtenerMovimientos();
    } catch (error) {
      console.error('Error al guardar el movimiento:', error);
      alert('Error al guardar el movimiento. Por favor, intenta de nuevo.');
    }
  };

  const actualizarCampo = (campo: keyof Movimiento, valor: any) => {
    if (movimientoEditar) {
      setMovimientoEditar({
        ...movimientoEditar,
        [campo]: valor
      });
    }
  };

  const filtrarMovimientos = () => {
    return movimientos.filter(movimiento => {
      const fechaMovimiento = new Date(movimiento.fecha);
      const fechaInicio = filtroFechaInicio ? new Date(filtroFechaInicio) : null;
      const fechaFin = filtroFechaFin ? new Date(filtroFechaFin) : null;
      
      return (
        (!fechaInicio || fechaMovimiento >= fechaInicio) &&
        (!fechaFin || fechaMovimiento <= fechaFin) &&
        (filtroTipo === '' || movimiento.tipo === filtroTipo) &&
        (filtroTalonario === '' || movimiento.idTalonario?.toString() === filtroTalonario) &&
        (filtroVendedor === '' || movimiento.idVendedor?.toString() === filtroVendedor)
      );
    });
  };

  const aplicarFiltros = () => {
    calcularResumen();
  };

  const limpiarFiltros = () => {
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate());
    setFiltroFechaInicio(inicioMes.toISOString().split('T')[0]);
    setFiltroFechaFin(hoy.toISOString().split('T')[0]);
    setFiltroTipo('');
    setFiltroTalonario('');
    setFiltroVendedor('');
    calcularResumen();
  };

  const movimientosFiltrados = filtrarMovimientos();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Transacciones de Sorteos</h2>
        <Button variant="primary" onClick={abrirModalNuevo}>
          <i className="bi bi-plus-circle me-2"></i>Registrar Transacción
        </Button>
      </div>

      {/* Tarjetas de resumen */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Ingresos</Card.Title>
              <h3 className="text-success">${resumen.totalIngresos.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Egresos</Card.Title>
              <h3 className="text-danger">${resumen.totalEgresos.toLocaleString()}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title>Balance</Card.Title>
              <h3 className={resumen.balance >= 0 ? "text-primary" : "text-danger"}>
                ${resumen.balance.toLocaleString()}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Filtros</h5>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha Inicio</Form.Label>
                <Form.Control
                  type="date"
                  value={filtroFechaInicio}
                  onChange={(e) => setFiltroFechaInicio(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Fecha Fin</Form.Label>
                <Form.Control
                  type="date"
                  value={filtroFechaFin}
                  onChange={(e) => setFiltroFechaFin(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Tipo</Form.Label>
                <Form.Select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                >
                  <option value="">Todos los tipos</option>
                  {tiposMovimiento.map(tipo => (
                    <option key={tipo.idTipoMovimiento} value={tipo.nombre}>
                      {tipo.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Talonario</Form.Label>
                <Form.Select
                  value={filtroTalonario}
                  onChange={(e) => setFiltroTalonario(e.target.value)}
                >
                  <option value="">Todos los talonarios</option>
                  {talonarios.map(talonario => (
                    <option key={talonario.idTalonario} value={talonario.idTalonario}>
                      {talonario.descripcion}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-3">
                <Form.Label>Vendedor</Form.Label>
                <Form.Select
                  value={filtroVendedor}
                  onChange={(e) => setFiltroVendedor(e.target.value)}
                >
                  <option value="">Todos los vendedores</option>
                  {vendedores.map(vendedor => (
                    <option key={vendedor.idVendedor} value={vendedor.idVendedor}>
                      {vendedor.alumno.nombre} {vendedor.alumno.apellido}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="text-end">
            <Button variant="secondary" className="me-2" onClick={limpiarFiltros}>
              Limpiar Filtros
            </Button>
            <Button variant="primary" onClick={aplicarFiltros}>
              Aplicar Filtros
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Concepto</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th>Referencia</th>
              <th>Talonario</th>
              <th>Vendedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movimientosFiltrados.length > 0 ? (
              movimientosFiltrados.map((movimiento) => (
                <tr key={movimiento.idMovimiento}>
                  <td>{movimiento.idMovimiento}</td>
                  <td>{new Date(movimiento.fecha).toLocaleDateString()}</td>
                  <td>{movimiento.concepto}</td>
                  <td>
                    <Badge bg={tiposMovimiento.find(t => t.nombre === movimiento.tipo)?.esIngreso ? 'success' : 'danger'}>
                      {movimiento.tipo}
                    </Badge>
                  </td>
                  <td className={tiposMovimiento.find(t => t.nombre === movimiento.tipo)?.esIngreso ? 'text-success' : 'text-danger'}>
                    ${movimiento.monto.toLocaleString()}
                  </td>
                  <td>{movimiento.referencia || '-'}</td>
                  <td>{movimiento.descripcionTalonario || '-'}</td>
                  <td>{movimiento.nombreVendedor || '-'}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={() => abrirModalEditar(movimiento)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center">No hay transacciones que coincidan con los filtros</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Modal show={mostrarModal} onHide={cerrarModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {esNuevoMovimiento ? 'Registrar Transacción' : 'Editar Transacción'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Concepto</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Concepto de la transacción"
                    value={movimientoEditar.concepto || ''}
                    onChange={(e) => actualizarCampo('concepto', e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo</Form.Label>
                  <Form.Select
                    value={movimientoEditar.tipo || ''}
                    onChange={(e) => actualizarCampo('tipo', e.target.value)}
                  >
                    <option value="">Seleccione un tipo</option>
                    {tiposMovimiento.map(tipo => (
                      <option key={tipo.idTipoMovimiento} value={tipo.nombre}>
                        {tipo.nombre} ({tipo.esIngreso ? 'Ingreso' : 'Egreso'})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Monto</Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="number"
                  min="1000"
                  step="1000"
                  placeholder="Monto de la transacción"
                  value={movimientoEditar.monto || ''}
                  onChange={(e) => actualizarCampo('monto', parseInt(e.target.value))}
                />
              </InputGroup>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Referencia</Form.Label>
              <Form.Control
                type="text"
                placeholder="Número de referencia o comprobante"
                value={movimientoEditar.referencia || ''}
                onChange={(e) => actualizarCampo('referencia', e.target.value)}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Talonario (Opcional)</Form.Label>
                  <Form.Select
                    value={movimientoEditar.idTalonario || ''}
                    onChange={(e) => actualizarCampo('idTalonario', e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <option value="">Ninguno</option>
                    {talonarios.map(talonario => (
                      <option key={talonario.idTalonario} value={talonario.idTalonario}>
                        {talonario.descripcion}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Vendedor (Opcional)</Form.Label>
                  <Form.Select
                    value={movimientoEditar.idVendedor || ''}
                    onChange={(e) => actualizarCampo('idVendedor', e.target.value ? parseInt(e.target.value) : null)}
                  >
                    <option value="">Ninguno</option>
                    {vendedores.map(vendedor => (
                      <option key={vendedor.idVendedor} value={vendedor.idVendedor}>
                        {vendedor.alumno.nombre} {vendedor.alumno.apellido}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Observaciones</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Observaciones adicionales"
                value={movimientoEditar.observaciones || ''}
                onChange={(e) => actualizarCampo('observaciones', e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarMovimiento}>
            {esNuevoMovimiento ? 'Registrar Transacción' : 'Guardar Cambios'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SorteosMovimientos;