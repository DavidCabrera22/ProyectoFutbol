import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner, Badge, Alert } from 'react-bootstrap';
import axios from 'axios';

interface Sorteo {
  idSorteo: number;
  nombre: string;
  descripcion: string;
  idCategoria: number;
  nombreCategoria: string;
  valorBoleta: number;
  fechaInicio: string;
  fechaSorteo: string;
  premio: string;
  estado: string;
  totalBoletas: number;
  boletasVendidas: number;
  boletasDisponibles: number;
}

interface Categoria {
  idCategoria: number;
  nombre: string;
}

interface Talonario {
  idSorteo: number;
  numeroInicial: number;
  numeroFinal: number;
  cantidadBoletas: number;
  valorBoleta: number;
  fechaSorteo: string;
  descripcion: string;
  activo: boolean;
}

interface TalonarioDto {
  idTalonario: number;
  numeroInicial: number;
  numeroFinal: number;
  cantidadBoletas: number;
  valorBoleta: number;
  fechaCreacion: string;
  fechaSorteo: string;
  descripcion: string;
  activo: boolean;
  boletasGeneradas: number;
}

const SorteosTalonarios: React.FC = () => {
  const [sorteos, setSorteos] = useState<Sorteo[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [mostrarModalTalonario, setMostrarModalTalonario] = useState<boolean>(false);
  const [mostrarModalVerTalonarios, setMostrarModalVerTalonarios] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');
  const [sorteoEditar, setSorteoEditar] = useState<Partial<Sorteo>>({
    nombre: '',
    descripcion: '',
    idCategoria: 0,
    valorBoleta: 5000,
    fechaInicio: new Date().toISOString().split('T')[0],
    fechaSorteo: '',
    premio: '',
    estado: 'Activo'
  });
  const [talonarioActual, setTalonarioActual] = useState<Talonario>({
    idSorteo: 0,
    numeroInicial: 1,
    numeroFinal: 100,
    cantidadBoletas: 100,
    valorBoleta: 5000,
    fechaSorteo: new Date().toISOString().split('T')[0],
    descripcion: '',
    activo: true
  });
  const [talonariosDelSorteo, setTalonariosDelSorteo] = useState<TalonarioDto[]>([]);
  const [sorteoSeleccionado, setSorteoSeleccionado] = useState<Sorteo | null>(null);
  const [esNuevoSorteo, setEsNuevoSorteo] = useState<boolean>(false);

  useEffect(() => {
    obtenerSorteos();
    obtenerCategorias();
  }, []);

  const obtenerSorteos = async () => {
    try {
      setLoading(true);
      const respuesta = await axios.get('http://localhost:5180/api/Sorteos');
      setSorteos(respuesta.data);
    } catch (error) {
      console.error('Error al obtener sorteos:', error);
      setError('Error al cargar los sorteos. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const respuesta = await axios.get('http://localhost:5180/api/Categorias');
      setCategorias(respuesta.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      setError('Error al obtener categorías. Por favor, intenta de nuevo.');
    }
  };

  const obtenerTalonariosPorSorteo = async (idSorteo: number) => {
    try {
      setLoading(true);
      const respuesta = await axios.get(`http://localhost:5180/api/SorteosTalonarios/sorteo/${idSorteo}`);
      setTalonariosDelSorteo(respuesta.data);
    } catch (error) {
      console.error('Error al obtener talonarios:', error);
      setError('Error al cargar los talonarios. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    const fechaSorteo = new Date();
    fechaSorteo.setMonth(fechaSorteo.getMonth() + 1);
    
    setSorteoEditar({
      nombre: '',
      descripcion: '',
      idCategoria: categorias.length > 0 ? categorias[0].idCategoria : 0,
      valorBoleta: 5000,
      fechaInicio: new Date().toISOString().split('T')[0],
      fechaSorteo: fechaSorteo.toISOString().split('T')[0],
      premio: '',
      estado: 'Activo'
    });
    setEsNuevoSorteo(true);
    setMostrarModal(true);
  };

  const abrirModalEditar = (sorteo: Sorteo) => {
    setSorteoEditar({
      ...sorteo,
      fechaInicio: new Date(sorteo.fechaInicio).toISOString().split('T')[0],
      fechaSorteo: new Date(sorteo.fechaSorteo).toISOString().split('T')[0]
    });
    setEsNuevoSorteo(false);
    setMostrarModal(true);
  };

  const abrirModalTalonario = (sorteo: Sorteo) => {
    // Format the date correctly
    const fechaSorteoFormateada = new Date(sorteo.fechaSorteo).toISOString().split('T')[0];
    
    // Create talonario with the correct sorteo ID
    setTalonarioActual({
      idSorteo: sorteo.idSorteo,
      numeroInicial: 1,
      numeroFinal: 100,
      cantidadBoletas: 100,
      valorBoleta: sorteo.valorBoleta,
      fechaSorteo: fechaSorteoFormateada,
      descripcion: `Talonario para ${sorteo.nombre}`,
      activo: true
    });
    
    console.log('Abriendo modal con sorteo:', sorteo);
    setMostrarModalTalonario(true);
  };

  const abrirModalVerTalonarios = async (sorteo: Sorteo) => {
    setSorteoSeleccionado(sorteo);
    await obtenerTalonariosPorSorteo(sorteo.idSorteo);
    setMostrarModalVerTalonarios(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setError('');
  };

  const cerrarModalTalonario = () => {
    setMostrarModalTalonario(false);
    setError('');
  };

  const cerrarModalVerTalonarios = () => {
    setMostrarModalVerTalonarios(false);
    setSorteoSeleccionado(null);
    setTalonariosDelSorteo([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSorteoEditar(prev => ({
      ...prev,
      [name]: name === 'idCategoria' || name === 'valorBoleta' ? Number(value) : value
    }));
  };

  const handleTalonarioChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' 
      ? (e.target as HTMLInputElement).checked 
      : (type === 'number' ? Number(value) : value);
    
    setTalonarioActual(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Actualizar automáticamente la cantidad de boletas
    if (name === 'numeroInicial' || name === 'numeroFinal') {
      const inicio = name === 'numeroInicial' ? Number(value) : talonarioActual.numeroInicial;
      const fin = name === 'numeroFinal' ? Number(value) : talonarioActual.numeroFinal;
      
      if (fin >= inicio) {
        setTalonarioActual(prev => ({
          ...prev,
          cantidadBoletas: fin - inicio + 1
        }));
      }
    }
  };

  const guardarSorteo = async () => {
    try {
      if (!sorteoEditar.nombre || !sorteoEditar.valorBoleta || !sorteoEditar.fechaSorteo || !sorteoEditar.premio) {
        setError('Todos los campos marcados con * son obligatorios');
        return;
      }

      if (esNuevoSorteo) {
        await axios.post('http://localhost:5180/api/Sorteos', sorteoEditar);
        setMensaje('Sorteo creado con éxito');
      } else {
        await axios.put(`http://localhost:5180/api/Sorteos/${sorteoEditar.idSorteo}`, sorteoEditar);
        setMensaje('Sorteo actualizado con éxito');
      }

      cerrarModal();
      obtenerSorteos();
    } catch (error) {
      console.error('Error al guardar el sorteo:', error);
      setError('Error al guardar el sorteo. Por favor, intenta de nuevo.');
    }
  };

  const guardarTalonario = async () => {
    try {
      // Validaciones
      if (talonarioActual.numeroFinal <= talonarioActual.numeroInicial) {
        setError('El número final debe ser mayor que el número inicial');
        return;
      }
  
      // Obtener el sorteo actual para acceder a su categoría
      const sorteoActual = sorteos.find(s => s.idSorteo === talonarioActual.idSorteo);
      
      if (!sorteoActual) {
        setError('No se encontró el sorteo seleccionado');
        return;
      }
  
      // Ensure we're sending the correct data structure
      const talonarioAEnviar = {
        idSorteo: talonarioActual.idSorteo,
        numeroInicial: talonarioActual.numeroInicial,
        numeroFinal: talonarioActual.numeroFinal,
        cantidadBoletas: talonarioActual.cantidadBoletas,
        valorBoleta: talonarioActual.valorBoleta,
        fechaSorteo: new Date(talonarioActual.fechaSorteo).toISOString(),
        descripcion: talonarioActual.descripcion,
        activo: talonarioActual.activo,
        idCategoria: sorteoActual.idCategoria
      };
  
      // Log the data being sent for debugging
      console.log('Datos del talonario a enviar:', talonarioAEnviar);
  
      // Crear el talonario
      const respuesta = await axios.post('http://localhost:5180/api/SorteosTalonarios', talonarioAEnviar);
      console.log('Respuesta del servidor:', respuesta.data);
      
      // Obtener el ID del talonario creado
      const idTalonario = respuesta.data.idTalonario;
      
      try {
        setLoading(true);
        const respuestaBoletas = await axios.post(`http://localhost:5180/api/SorteosTalonarios/${idTalonario}/generar-boletas`);
        console.log('Respuesta generación boletas:', respuestaBoletas.data);
        setMensaje('Talonario creado y boletas generadas con éxito');
        
        // Si estamos viendo los talonarios de este sorteo, actualizarlos
        if (sorteoSeleccionado && sorteoSeleccionado.idSorteo === talonarioActual.idSorteo) {
          await obtenerTalonariosPorSorteo(talonarioActual.idSorteo);
        }
      } catch (errorBoletas: any) {
        console.error('Error al generar boletas:', errorBoletas);
        
        // Mostrar mensaje de error más detallado
        if (axios.isAxiosError(errorBoletas) && errorBoletas.response) {
          const errorMessage = errorBoletas.response.data || errorBoletas.message;
          setError(`Error al generar boletas: ${errorBoletas.response.status} - ${errorMessage}`);
        } else {
          setError(`Error al generar boletas: ${errorBoletas.message || 'Error desconocido'}`);
        }
        
        setMensaje('Talonario creado con éxito, pero hubo un error al generar las boletas');
      } finally {
        setLoading(false);
      }
      
      cerrarModalTalonario();
      obtenerSorteos(); // Actualizar la lista de sorteos
    } catch (error: unknown) {
      console.error('Error al crear talonario:', error);
      
      // Mostrar mensaje de error más detallado
      if (axios.isAxiosError(error) && error.response) {
        setError(`Error: ${error.response.status} - ${error.response.data}`);
      } else {
        setError('Error al crear el talonario. Por favor, intenta de nuevo.');
      }
      setLoading(false);
    }
  };

  const generarBoletas = async (idTalonario: number) => {
    try {
      setLoading(true);
      await axios.post(`http://localhost:5180/api/SorteosTalonarios/${idTalonario}/generar-boletas`);
      setMensaje('Boletas generadas con éxito');
      
      // Actualizar la lista de talonarios
      if (sorteoSeleccionado) {
        await obtenerTalonariosPorSorteo(sorteoSeleccionado.idSorteo);
      }
      
      obtenerSorteos(); // Actualizar la lista de sorteos
    } catch (error) {
      console.error('Error al generar boletas:', error);
      if (axios.isAxiosError(error) && error.response) {
        setError(`Error: ${error.response.status} - ${error.response.data}`);
      } else {
        setError('Error al generar las boletas. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstadoSorteo = async (id: number, nuevoEstado: string) => {
    try {
      await axios.put(`http://localhost:5180/api/Sorteos/${id}/estado`, { estado: nuevoEstado });
      setMensaje(`Sorteo ${nuevoEstado.toLowerCase()} con éxito`);
      obtenerSorteos();
    } catch (error) {
      console.error('Error al cambiar estado del sorteo:', error);
      setError('Error al cambiar el estado del sorteo. Por favor, intenta de nuevo.');
    }
  };

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case 'activo':
        return 'success';
      case 'finalizado':
        return 'primary';
      case 'cancelado':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Sorteos</h2>
        <Button variant="primary" onClick={abrirModalNuevo}>
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Sorteo
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
      {mensaje && <Alert variant="success" onClose={() => setMensaje('')} dismissible>{mensaje}</Alert>}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Cargando sorteos...</p>
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Valor</th>
              <th>Fecha Sorteo</th>
              <th>Estado</th>
              <th>Boletas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sorteos.length > 0 ? (
              sorteos.map(sorteo => (
                <tr key={sorteo.idSorteo}>
                  <td>{sorteo.idSorteo}</td>
                  <td>{sorteo.nombre}</td>
                  <td>{sorteo.nombreCategoria}</td>
                  <td>${sorteo.valorBoleta.toLocaleString()}</td>
                  <td>{formatearFecha(sorteo.fechaSorteo)}</td>
                  <td>
                    <Badge bg={getEstadoColor(sorteo.estado)}>{sorteo.estado}</Badge>
                  </td>
                  <td>
                    <small>
                      Total: {sorteo.totalBoletas} | 
                      Vendidas: {sorteo.boletasVendidas} | 
                      Disponibles: {sorteo.boletasDisponibles}
                    </small>
                  </td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-1"
                      onClick={() => abrirModalEditar(sorteo)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    {sorteo.estado === 'Activo' && (
                      <>
                        <Button 
                          variant="outline-info" 
                          size="sm"
                          className="me-1"
                          onClick={() => abrirModalTalonario(sorteo)}
                          title="Crear talonario"
                        >
                          <i className="bi bi-journal-plus"></i>
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          size="sm"
                          className="me-1"
                          onClick={() => abrirModalVerTalonarios(sorteo)}
                          title="Ver talonarios"
                        >
                          <i className="bi bi-journals"></i>
                        </Button>
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          className="me-1"
                          onClick={() => cambiarEstadoSorteo(sorteo.idSorteo, 'Finalizado')}
                          title="Finalizar sorteo"
                        >
                          <i className="bi bi-check-circle"></i>
                        </Button>
                      </>
                    )}
                    {sorteo.estado !== 'Cancelado' && (
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => cambiarEstadoSorteo(sorteo.idSorteo, 'Cancelado')}
                        title="Cancelar sorteo"
                      >
                        <i className="bi bi-x-circle"></i>
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center">No hay sorteos registrados</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Modal show={mostrarModal} onHide={cerrarModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {esNuevoSorteo ? 'Nuevo Sorteo' : 'Editar Sorteo'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Nombre *</Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={sorteoEditar.nombre || ''}
                    onChange={handleInputChange}
                    placeholder="Ingrese el nombre del sorteo"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Categoría *</Form.Label>
                  <Form.Select
                    name="idCategoria"
                    value={sorteoEditar.idCategoria || 0}
                    onChange={handleInputChange}
                  >
                    <option value={0}>Seleccione una categoría</option>
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
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="descripcion"
                value={sorteoEditar.descripcion || ''}
                onChange={handleInputChange}
                placeholder="Ingrese una descripción del sorteo"
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Valor Boleta *</Form.Label>
                  <Form.Control
                    type="number"
                    name="valorBoleta"
                    value={sorteoEditar.valorBoleta || 0}
                    onChange={handleInputChange}
                    min={1000}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Fecha Inicio *</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaInicio"
                    value={sorteoEditar.fechaInicio || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group className="mb-3">
                  <Form.Label>Fecha Sorteo *</Form.Label>
                  <Form.Control
                    type="date"
                    name="fechaSorteo"
                    value={sorteoEditar.fechaSorteo || ''}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Premio *</Form.Label>
              <Form.Control
                type="text"
                name="premio"
                value={sorteoEditar.premio || ''}
                onChange={handleInputChange}
                placeholder="Describa el premio del sorteo"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={sorteoEditar.estado || 'Activo'}
                onChange={handleInputChange}
              >
                <option value="Activo">Activo</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Cancelado">Cancelado</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarSorteo}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={mostrarModalTalonario} onHide={cerrarModalTalonario}>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo Talonario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Número Inicial</Form.Label>
              <Form.Control
                type="number"
                name="numeroInicial"
                value={talonarioActual.numeroInicial}
                onChange={handleTalonarioChange}
                min={1}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Número Final</Form.Label>
              <Form.Control
                type="number"
                name="numeroFinal"
                value={talonarioActual.numeroFinal}
                onChange={handleTalonarioChange}
                min={talonarioActual.numeroInicial + 1}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cantidad de Boletas</Form.Label>
              <Form.Control
                type="number"
                name="cantidadBoletas"
                value={talonarioActual.cantidadBoletas}
                onChange={handleTalonarioChange}
                readOnly
              />
              <Form.Text className="text-muted">
                Este valor se calcula automáticamente
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Valor de la Boleta</Form.Label>
              <Form.Control
                type="number"
                name="valorBoleta"
                value={talonarioActual.valorBoleta}
                onChange={handleTalonarioChange}
                min={1000}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="descripcion"
                value={talonarioActual.descripcion}
                onChange={handleTalonarioChange}
                placeholder="Ingrese una descripción del talonario"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Activo"
                name="activo"
                checked={talonarioActual.activo}
                onChange={handleTalonarioChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModalTalonario}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarTalonario}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={mostrarModalVerTalonarios} onHide={cerrarModalVerTalonarios} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Talonarios de {sorteoSeleccionado?.nombre}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center my-3">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Cargando talonarios...</p>
            </div>
          ) : talonariosDelSorteo.length > 0 ? (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Números</th>
                  <th>Cantidad</th>
                  <th>Valor</th>
                  <th>Fecha Sorteo</th>
                  <th>Boletas</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {talonariosDelSorteo.map(talonario => (
                  <tr key={talonario.idTalonario}>
                    <td>{talonario.idTalonario}</td>
                    <td>{talonario.numeroInicial} - {talonario.numeroFinal}</td>
                    <td>{talonario.cantidadBoletas}</td>
                    <td>${talonario.valorBoleta.toLocaleString()}</td>
                    <td>{formatearFecha(talonario.fechaSorteo)}</td>
                    <td>{talonario.boletasGeneradas} generadas</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        className="me-1"
                        onClick={() => window.open(`/boletas?talonario=${talonario.idTalonario}`, '_blank')}
                        title="Ver boletas"
                      >
                        <i className="bi bi-ticket-perforated"></i>
                      </Button>
                      {talonario.boletasGeneradas === 0 && (
                        <Button 
                          variant="outline-success" 
                          size="sm"
                          onClick={() => generarBoletas(talonario.idTalonario)}
                          title="Generar boletas"
                        >
                          <i className="bi bi-plus-circle"></i>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center my-3">
              <p>No hay talonarios para este sorteo</p>
              <Button 
                variant="primary"
                onClick={() => {
                  cerrarModalVerTalonarios();
                  abrirModalTalonario(sorteoSeleccionado!);
                }}
              >
                Crear Talonario
              </Button>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModalVerTalonarios}>
            Cerrar
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              cerrarModalVerTalonarios();
              abrirModalTalonario(sorteoSeleccionado!);
            }}
          >
            Nuevo Talonario
          </Button>
        </Modal.Footer>
        </Modal>
    </div>
  );
};

export default SorteosTalonarios;