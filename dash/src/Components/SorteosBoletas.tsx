import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Badge, Spinner, Alert, Form, Row, Col, Modal, InputGroup } from 'react-bootstrap';

interface Talonario {
  idTalonario: number;
  numeroInicial: number;
  numeroFinal: number;
  descripcion: string;
  valorBoleta: number;
}

interface Boleta {
  idBoleta: number;
  idTalonario: number;
  numeroBoleta: number;
  valorBoleta: number;
  estado: string;
  fechaVenta?: string;
  idVendedor?: number;
  nombreVendedor?: string;
  nombreComprador?: string;
  telefonoComprador?: string;
}

interface Vendedor {
  idVendedor: number;
  idAlumno?: string;
  alumno?: {
    nombre?: string;
    apellido?: string;
  };
  nombreAlumno?: string;
  apellido?: string;
}

const SorteosBoletas: React.FC = () => {
  const [boletas, setBoletas] = useState<Boleta[]>([]);
  const [talonarios, setTalonarios] = useState<Talonario[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [mostrarModalDetalles, setMostrarModalDetalles] = useState<boolean>(false);
  const [boletaEditar, setBoletaEditar] = useState<Partial<Boleta>>({});
  const [boletaDetalles, setBoletaDetalles] = useState<Partial<Boleta>>({});
  
  // Filtros
  const [filtroTalonario, setFiltroTalonario] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [filtroVendedor, setFiltroVendedor] = useState<string>('');
  const [filtroBoleta, setFiltroBoleta] = useState<string>('');
  
  // Paginación
  const [paginaActual, setPaginaActual] = useState<number>(1);
  const boletasPorPagina = 20;

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError(null);
        // Cargar datos en paralelo para mejorar el rendimiento
        await Promise.all([
          obtenerTalonarios(),
          obtenerVendedores(),
          obtenerBoletas()
        ]);
      } catch (err) {
        console.error('Error al cargar datos iniciales:', err);
        setError('Hubo un problema al cargar los datos. Por favor, recarga la página.');
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  const obtenerBoletas = async () => {
    try {
      const respuesta = await axios.get('http://localhost:5180/api/SorteosBoletas');
      console.log('Datos de boletas recibidos:', respuesta.data);
      
      // Verificar que los datos sean un array
      if (Array.isArray(respuesta.data)) {
        // Asegurarse de que cada boleta tenga los campos necesarios
        const boletasFormateadas = respuesta.data.map((b: any) => {
          if (!b) return null;
          return {
            idBoleta: b.idBoleta || 0,
            idTalonario: b.idTalonario || 0,
            numeroBoleta: b.numeroBoleta || 0,
            valorBoleta: b.valorBoleta || 0,
            estado: b.estado || 'Desconocido',
            fechaVenta: b.fechaVenta,
            idVendedor: b.idVendedor,
            nombreVendedor: b.nombreVendedor,
            nombreComprador: b.nombreComprador,
            telefonoComprador: b.telefonoComprador
          };
        }).filter(Boolean);
        
        setBoletas(boletasFormateadas);
      } else {
        console.error('Los datos recibidos no son un array:', respuesta.data);
        setBoletas([]);
        setError('Error en el formato de datos recibidos');
      }
    } catch (err) {
      console.error('Error al obtener boletas:', err);
      setBoletas([]);
      setError('Error al cargar las boletas. Por favor, intenta de nuevo.');
    }
  };

  const obtenerTalonarios = async () => {
    try {
      const respuesta = await axios.get('http://localhost:5180/api/SorteosTalonarios');
      if (Array.isArray(respuesta.data)) {
        // Asegurarse de que cada talonario tenga los campos necesarios
        const talonariosFormateados = respuesta.data.map((t: any) => {
          if (!t) return null;
          return {
            idTalonario: t.idTalonario || 0,
            numeroInicial: t.numeroInicial || 0,
            numeroFinal: t.numeroFinal || 0,
            descripcion: t.descripcion || 'Sin descripción',
            valorBoleta: t.valorBoleta || 0
          };
        }).filter(Boolean);
        
        setTalonarios(talonariosFormateados);
      } else {
        console.error('Los datos de talonarios recibidos no son un array:', respuesta.data);
        setTalonarios([]);
      }
    } catch (err) {
      console.error('Error al obtener talonarios:', err);
      setTalonarios([]);
    }
  };

  const obtenerVendedores = async () => {
    try {
      // Obtenemos directamente los alumnos que serán nuestros vendedores
      const respuesta = await axios.get('http://localhost:5180/api/Alumnos');
      console.log('Datos de alumnos/vendedores recibidos:', respuesta.data);
      
      // Verificar que los datos sean un array
      if (Array.isArray(respuesta.data)) {
        // Transformamos los datos de alumnos al formato de vendedores
        const vendedoresFormateados = respuesta.data.map((a: any) => {
          if (!a) return null;
          
          return {
            idVendedor: a.id, // Usamos el ID del alumno como ID del vendedor
            idAlumno: a.id,
            // Estructura anidada para alumno
            alumno: {
              nombre: a.nombre || '',
              apellido: a.apellido || ''
            },
            // También guardamos los campos planos para compatibilidad
            nombreAlumno: a.nombre || '',
            apellido: a.apellido || ''
          };
        }).filter(Boolean);
        
        console.log('Alumnos formateados como vendedores:', vendedoresFormateados);
        setVendedores(vendedoresFormateados);
      } else {
        console.error('Los datos de alumnos recibidos no son un array:', respuesta.data);
        setVendedores([]);
      }
    } catch (err) {
      console.error('Error al obtener alumnos/vendedores:', err);
      setVendedores([]);
    }
  };

  const abrirModalAsignar = (boleta: Boleta) => {
    // Buscar el talonario para obtener el valor correcto
    const talonario = talonarios.find(t => t.idTalonario === boleta.idTalonario);
    
    // Crear una copia de la boleta con el valor correcto del talonario
    const boletaConValor = {
      ...boleta,
      valorBoleta: boleta.valorBoleta || (talonario ? talonario.valorBoleta : 0)
    };
    
    setBoletaEditar({
      ...boletaConValor,
      nombreComprador: '',
      telefonoComprador: ''
    });
    setMostrarModal(true);
  };

  const abrirModalDetalles = (boleta: Boleta) => {
    // Buscar el talonario para obtener el valor correcto
    const talonario = talonarios.find(t => t.idTalonario === boleta.idTalonario);
    
    // Crear una copia de la boleta con el valor correcto del talonario
    const boletaConValor = {
      ...boleta,
      valorBoleta: boleta.valorBoleta || (talonario ? talonario.valorBoleta : 0)
    };
    
    setBoletaDetalles(boletaConValor);
    setMostrarModalDetalles(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const cerrarModalDetalles = () => {
    setMostrarModalDetalles(false);
  };

  const asignarBoleta = async () => {
    try {
      if (!boletaEditar.idVendedor) {
        alert('Debe seleccionar un vendedor');
        return;
      }

      await axios.put(`http://localhost:5180/api/SorteosBoletas/${boletaEditar.idBoleta}/asignar`, {
        idVendedor: boletaEditar.idVendedor
      });
      
      alert('Boleta asignada con éxito');
      cerrarModal();
      obtenerBoletas();
    } catch (err) {
      console.error('Error al asignar la boleta:', err);
      alert('Error al asignar la boleta. Por favor, intenta de nuevo.');
    }
  };

  const registrarVenta = async () => {
    try {
      if (!boletaEditar.nombreComprador || !boletaEditar.telefonoComprador) {
        alert('Debe ingresar el nombre y teléfono del comprador');
        return;
      }

      await axios.put(`http://localhost:5180/api/SorteosBoletas/${boletaEditar.idBoleta}/vender`, {
        nombreComprador: boletaEditar.nombreComprador,
        telefonoComprador: boletaEditar.telefonoComprador,
        observaciones: ""
      });
      
      alert('Venta registrada con éxito');
      cerrarModal();
      obtenerBoletas();
    } catch (err) {
      console.error('Error al registrar la venta:', err);
      alert('Error al registrar la venta. Por favor, intenta de nuevo.');
    }
  };

  const imprimirBoleta = (boleta: Boleta) => {
    // Crear una ventana de impresión
    const ventanaImpresion = window.open('', '_blank');
    if (!ventanaImpresion) {
      alert('Por favor, permite las ventanas emergentes para imprimir la boleta');
      return;
    }

    // Buscar el talonario para obtener el valor correcto
    const talonario = talonarios.find(t => t.idTalonario === boleta.idTalonario);
    const valorBoleta = boleta.valorBoleta || (talonario ? talonario.valorBoleta : 0);
    
    // Obtener información del vendedor
    let nombreVendedor = boleta.nombreVendedor || '';
    if (!nombreVendedor && boleta.idVendedor) {
      const vendedor = vendedores.find(v => v && v.idVendedor === boleta.idVendedor);
      if (vendedor) {
        nombreVendedor = getNombreVendedor(vendedor);
        console.log('Nombre del vendedor encontrado:', nombreVendedor, 'para boleta:', boleta.numeroBoleta);
      } else {
        console.log('No se encontró vendedor con ID:', boleta.idVendedor, 'para boleta:', boleta.numeroBoleta);
      }
    }
    
    // Contenido HTML para la impresión
    ventanaImpresion.document.write(`
      <html>
        <head>
          <title>Boleta #${boleta.numeroBoleta}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .boleta { border: 1px solid #000; padding: 15px; max-width: 400px; margin: 0 auto; }
            .titulo { text-align: center; font-size: 18px; font-weight: bold; margin-bottom: 15px; }
            .info { margin-bottom: 10px; }
            .footer { margin-top: 20px; text-align: center; font-size: 12px; }
            .valor { font-size: 24px; text-align: center; margin: 15px 0; font-weight: bold; }
            .estado { text-align: center; margin: 10px 0; padding: 5px; font-weight: bold; }
            .vendida { background-color: #d4edda; color: #155724; }
            .asignada { background-color: #fff3cd; color: #856404; }
            .disponible { background-color: #cce5ff; color: #004085; }
          </style>
        </head>
        <body>
          <div class="boleta">
            <div class="titulo">BOLETA DE SORTEO</div>
            <div class="info"><strong>Número:</strong> ${boleta.numeroBoleta}</div>
            <div class="info"><strong>Talonario:</strong> ${boleta.idTalonario}</div>
            <div class="valor">$${valorBoleta.toLocaleString()}</div>
            <div class="estado ${boleta.estado.toLowerCase()}">${boleta.estado}</div>
            ${nombreVendedor ? `<div class="info"><strong>Vendedor:</strong> ${nombreVendedor}</div>` : ''}
            ${boleta.nombreComprador ? `<div class="info"><strong>Comprador:</strong> ${boleta.nombreComprador}</div>` : ''}
            ${boleta.telefonoComprador ? `<div class="info"><strong>Teléfono:</strong> ${boleta.telefonoComprador}</div>` : ''}
            ${boleta.fechaVenta ? `<div class="info"><strong>Fecha de venta:</strong> ${new Date(boleta.fechaVenta).toLocaleDateString()}</div>` : ''}
            <div class="footer">Esta boleta participa en el sorteo según las condiciones establecidas.</div>
          </div>
        </body>
      </html>
    `);
    
    // Imprimir y cerrar
    ventanaImpresion.document.close();
    setTimeout(() => {
      ventanaImpresion.print();
      ventanaImpresion.close();
    }, 500);
  };

  const actualizarCampo = (campo: keyof Boleta, valor: any) => {
    if (boletaEditar) {
      setBoletaEditar({
        ...boletaEditar,
        [campo]: valor
      });
    }
  };

  const boletasFiltradas = boletas.filter(boleta => {
    return (
      (filtroTalonario === '' || (boleta.idTalonario && boleta.idTalonario.toString() === filtroTalonario)) &&
      (filtroEstado === '' || boleta.estado === filtroEstado) &&
      (filtroVendedor === '' || (boleta.idVendedor && boleta.idVendedor.toString() === filtroVendedor)) &&
      (filtroBoleta === '' || (boleta.numeroBoleta && boleta.numeroBoleta.toString().includes(filtroBoleta)))
    );
  });

  // Paginación
  const indexUltimaBoleta = paginaActual * boletasPorPagina;
  const indexPrimeraBoleta = indexUltimaBoleta - boletasPorPagina;
  const boletasActuales = boletasFiltradas.slice(indexPrimeraBoleta, indexUltimaBoleta);
  const totalPaginas = Math.ceil(boletasFiltradas.length / boletasPorPagina);

  const cambiarPagina = (numeroPagina: number) => {
    setPaginaActual(numeroPagina);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'Disponible':
        return <Badge bg="success">Disponible</Badge>;
      case 'Asignada':
        return <Badge bg="warning">Asignada</Badge>;
      case 'Vendida':
        return <Badge bg="primary">Vendida</Badge>;
      case 'Anulada':
        return <Badge bg="danger">Anulada</Badge>;
      default:
        return <Badge bg="secondary">{estado}</Badge>;
    }
  };

  // Función para obtener el nombre del vendedor de forma segura
  const getNombreVendedor = (vendedor: Vendedor | undefined) => {
    if (!vendedor) return '-';
    
    // Intentamos obtener el nombre completo de diferentes formas posibles
    const nombre = vendedor.alumno?.nombre || vendedor.nombreAlumno || '';
    const apellido = vendedor.alumno?.apellido || vendedor.apellido || '';
    
    if (nombre || apellido) {
      return `${nombre} ${apellido}`.trim();
    }
    
    return `Vendedor #${vendedor.idVendedor}`;
  };
  
  const recargarDatos = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      obtenerTalonarios(),
      obtenerVendedores(),
      obtenerBoletas()
    ]).finally(() => setLoading(false));
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Boletas de Sorteos</h2>
        <Button variant="outline-primary" onClick={recargarDatos}>
          <i className="bi bi-arrow-clockwise"></i> Recargar
        </Button>
      </div>

      {/* Mensaje de error si ocurre algún problema */}
      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <Button 
            variant="outline-danger" 
            size="sm" 
            className="ms-3"
            onClick={recargarDatos}
          >
            Intentar de nuevo
          </Button>
        </Alert>
      )}

      {/* Filtros */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">Filtros</h5>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Talonario</Form.Label>
                <Form.Select
                  value={filtroTalonario}
                  onChange={(e) => setFiltroTalonario(e.target.value)}
                >
                  <option value="">Todos los talonarios</option>
                  {talonarios && talonarios.length > 0 ? talonarios.map(talonario => (
                    <option key={talonario.idTalonario} value={talonario.idTalonario}>
                      {talonario.descripcion} ({talonario.numeroInicial}-{talonario.numeroFinal})
                    </option>
                  )) : (
                    <option value="" disabled>No hay talonarios disponibles</option>
                  )}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                >
                  <option value="">Todos los estados</option>
                  <option value="Disponible">Disponible</option>
                  <option value="Asignada">Asignada</option>
                  <option value="Vendida">Vendida</option>
                  <option value="Anulada">Anulada</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Vendedor</Form.Label>
                <Form.Select
                  value={filtroVendedor}
                  onChange={(e) => setFiltroVendedor(e.target.value)}
                >
                  <option value="">Todos los vendedores</option>
                  {vendedores && vendedores.length > 0 ? vendedores.map(vendedor => (
                    <option key={vendedor.idVendedor || 'unknown'} value={vendedor.idVendedor}>
                      {getNombreVendedor(vendedor)}
                    </option>
                  )) : (
                    <option value="" disabled>No hay vendedores disponibles</option>
                  )}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>Número de Boleta</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Buscar por número"
                  value={filtroBoleta}
                  onChange={(e) => setFiltroBoleta(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="text-end">
            <Button variant="secondary" onClick={() => {
              setFiltroTalonario('');
              setFiltroEstado('');
              setFiltroVendedor('');
              setFiltroBoleta('');
            }}>
              Limpiar Filtros
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
          </Spinner>
          <p className="mt-2">Cargando datos, por favor espere...</p>
        </div>
      ) : (
        <>
          <div className="mb-3">
            <span className="text-muted">Mostrando {boletasActuales.length} de {boletasFiltradas.length} boletas</span>
          </div>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Talonario</th>
                <th>Número</th>
                <th>Valor</th>
                <th>Estado</th>
                <th>Vendedor</th>
                <th>Comprador</th>
                <th>Fecha Venta</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {boletasActuales && boletasActuales.length > 0 ? (
                boletasActuales.map((boleta) => {
                  // Find the talonario to get the correct value if boleta value is 0
                  const talonario = talonarios.find(t => t.idTalonario === boleta.idTalonario);
                  const boletaValor = boleta.valorBoleta || (talonario ? talonario.valorBoleta : 0);
                  
                  // Get vendor name
                  let nombreVendedor = boleta.nombreVendedor || '';
                  if (!nombreVendedor && boleta.idVendedor) {
                    const vendedor = vendedores.find(v => v && v.idVendedor === boleta.idVendedor);
                    if (vendedor) {
                      nombreVendedor = getNombreVendedor(vendedor);
                    }
                  }
                  
                  return (
                    <tr key={boleta.idBoleta}>
                      <td>{boleta.idBoleta}</td>
                      <td>{boleta.idTalonario}</td>
                      <td>{boleta.numeroBoleta}</td>
                      <td>${boletaValor.toLocaleString()}</td>
                      <td>{getEstadoBadge(boleta.estado || 'Desconocido')}</td>
                      <td>{nombreVendedor || '-'}</td>
                      <td>{boleta.nombreComprador || '-'}</td>
                      <td>{boleta.fechaVenta ? new Date(boleta.fechaVenta).toLocaleDateString() : '-'}</td>
                      <td>
                        {boleta.estado === 'Disponible' && (
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            onClick={() => abrirModalAsignar(boleta)}
                            className="me-1 mb-1"
                          >
                            <i className="bi bi-person-plus"></i> Asignar
                          </Button>
                        )}
                        {boleta.estado === 'Asignada' && (
                          <Button 
                            variant="outline-success" 
                            size="sm" 
                            onClick={() => abrirModalAsignar(boleta)}
                            className="me-1 mb-1"
                          >
                            <i className="bi bi-cash"></i> Vender
                          </Button>
                        )}
                        {boleta.estado === 'Vendida' && (
                          <Button 
                            variant="outline-info" 
                            size="sm"
                            className="me-1 mb-1"
                            onClick={() => abrirModalDetalles(boleta)}
                          >
                            <i className="bi bi-info-circle"></i> Detalles
                          </Button>
                        )}
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          className="mb-1"
                          onClick={() => imprimirBoleta(boleta)}
                        >
                          <i className="bi bi-printer"></i> Imprimir
                        </Button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="text-center">No hay boletas que coincidan con los filtros</td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <ul className="pagination">
                <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => cambiarPagina(paginaActual - 1)}>
                    Anterior
                  </button>
                </li>
                {[...Array(totalPaginas)].map((_, i) => (
                  <li key={i} className={`page-item ${paginaActual === i + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => cambiarPagina(i + 1)}>
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => cambiarPagina(paginaActual + 1)}>
                    Siguiente
                  </button>
                </li>
              </ul>
            </div>
          )}
        </>
      )}

      {/* Modal para asignar o vender boleta */}
      <Modal show={mostrarModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {boletaEditar.estado === 'Disponible' ? 'Asignar Boleta' : 'Registrar Venta'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Número de Boleta</Form.Label>
              <Form.Control
                type="text"
                value={boletaEditar.numeroBoleta || ''}
                readOnly
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valor</Form.Label>
              <InputGroup>
                <InputGroup.Text>$</InputGroup.Text>
                <Form.Control
                  type="text"
                  value={(() => {
                    // Find the talonario to get the correct value if boleta value is 0
                    if (boletaEditar.valorBoleta && boletaEditar.valorBoleta > 0) {
                      return boletaEditar.valorBoleta.toLocaleString();
                    }
                    const talonario = talonarios.find(t => t.idTalonario === boletaEditar.idTalonario);
                    return (talonario ? talonario.valorBoleta : 0).toLocaleString();
                  })()}
                  readOnly
                />
              </InputGroup>
            </Form.Group>

            {boletaEditar.estado === 'Disponible' && (
              <Form.Group className="mb-3">
                <Form.Label>Vendedor</Form.Label>
                <Form.Select
                  value={boletaEditar.idVendedor || ''}
                  onChange={(e) => actualizarCampo('idVendedor', e.target.value)}
                >
                  <option value="">Seleccione un vendedor</option>
                  {vendedores && vendedores.length > 0 ? vendedores.map(vendedor => (
                    <option key={vendedor.idVendedor || 'unknown'} value={vendedor.idVendedor}>
                      {getNombreVendedor(vendedor)}
                    </option>
                  )) : (
                    <option value="" disabled>No hay vendedores disponibles</option>
                  )}
                </Form.Select>
              </Form.Group>
            )}

            {boletaEditar.estado === 'Asignada' && (
              <>
                                <Form.Group className="mb-3">
                  <Form.Label>Vendedor</Form.Label>
                  <Form.Control
                    type="text"
                    value={(() => {
                      if (boletaEditar.idVendedor) {
                        const vendedor = vendedores.find(v => v.idVendedor === boletaEditar.idVendedor);
                        return vendedor ? getNombreVendedor(vendedor) : 'Vendedor no encontrado';
                      }
                      return '';
                    })()}
                    readOnly
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Comprador</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el nombre del comprador"
                    value={boletaEditar.nombreComprador || ''}
                    onChange={(e) => actualizarCampo('nombreComprador', e.target.value)}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Teléfono del Comprador</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese el teléfono del comprador"
                    value={boletaEditar.telefonoComprador || ''}
                    onChange={(e) => actualizarCampo('telefonoComprador', e.target.value)}
                    required
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          {boletaEditar.estado === 'Disponible' ? (
            <Button variant="primary" onClick={asignarBoleta}>
              Asignar Boleta
            </Button>
          ) : (
            <Button variant="success" onClick={registrarVenta}>
              Registrar Venta
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Modal para ver detalles de boleta vendida */}
      <Modal show={mostrarModalDetalles} onHide={cerrarModalDetalles}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-info-circle me-2"></i>
            Detalles de Boleta #{boletaDetalles.numeroBoleta}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="p-3 bg-light rounded mb-3">
            <h5 className="mb-3">Información de la Boleta</h5>
            <p className="mb-2"><strong>ID:</strong> {boletaDetalles.idBoleta}</p>
            <p className="mb-2"><strong>Talonario:</strong> {boletaDetalles.idTalonario}</p>
            <p className="mb-2"><strong>Número:</strong> {boletaDetalles.numeroBoleta}</p>
            <p className="mb-2">
              <strong>Valor:</strong> ${boletaDetalles.valorBoleta?.toLocaleString() || '0'}
            </p>
            <p className="mb-2">
              <strong>Estado:</strong> {boletaDetalles.estado && (
                <Badge bg={
                  boletaDetalles.estado === 'Disponible' ? 'success' :
                  boletaDetalles.estado === 'Asignada' ? 'warning' :
                  boletaDetalles.estado === 'Vendida' ? 'primary' :
                  boletaDetalles.estado === 'Anulada' ? 'danger' : 'secondary'
                }>
                  {boletaDetalles.estado}
                </Badge>
              )}
            </p>
          </div>

          {(boletaDetalles.nombreVendedor || boletaDetalles.idVendedor) && (
            <div className="p-3 bg-light rounded mb-3">
              <h5 className="mb-3">Información del Vendedor</h5>
              <p className="mb-2">
                <strong>Nombre:</strong> {
                  boletaDetalles.nombreVendedor || (() => {
                    if (boletaDetalles.idVendedor) {
                      const vendedor = vendedores.find(v => v && v.idVendedor === boletaDetalles.idVendedor);
                      return vendedor ? getNombreVendedor(vendedor) : 'No especificado';
                    }
                    return 'No especificado';
                  })()
                }
              </p>
              {boletaDetalles.idVendedor && (
                <p className="mb-2"><strong>ID Vendedor:</strong> {boletaDetalles.idVendedor}</p>
              )}
            </div>
          )}

          {boletaDetalles.nombreComprador && (
            <div className="p-3 bg-light rounded mb-3">
              <h5 className="mb-3">Información del Comprador</h5>
              <p className="mb-2"><strong>Nombre:</strong> {boletaDetalles.nombreComprador}</p>
              <p className="mb-2"><strong>Teléfono:</strong> {boletaDetalles.telefonoComprador || 'No registrado'}</p>
              <p className="mb-2">
                <strong>Fecha de Venta:</strong> {boletaDetalles.fechaVenta ? new Date(boletaDetalles.fechaVenta).toLocaleDateString() : 'No registrada'}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModalDetalles}>
            Cerrar
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              cerrarModalDetalles();
              if (boletaDetalles.idBoleta) {
                imprimirBoleta(boletaDetalles as Boleta);
              }
            }}
          >
            <i className="bi bi-printer me-2"></i>
            Imprimir Boleta
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SorteosBoletas;