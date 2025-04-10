/*import React, { useState, useEffect } from 'react';
//import { Table, Button, Modal, Form, Spinner, Row, Col } from 'react-bootstrap';
import axios from 'axios';

interface Alumno {
  id: string;
  nombre: string;
  apellido: string;
  documento: string; // Este campo debería ser el mismo que id en muchos casos
  telefono: string;
  email: string;
  direccion: string;
  activo: boolean;
  curso?: string;
}

interface VendedorSorteo {
  idVendedor: number;
  idAlumno: string;
  alumno: Alumno;
  fechaRegistro: string;
  activo: boolean;
  idCategoria?: number;
}

const SorteosVendedores: React.FC = () => {
  const [vendedores, setVendedores] = useState<VendedorSorteo[]>([]);
  const [alumnos, setAlumnos] = useState<Alumno[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [vendedorEditar, setVendedorEditar] = useState<Partial<VendedorSorteo>>({
    idAlumno: '',
    activo: true,
    idCategoria: 1
  });
  const [esNuevoVendedor, setEsNuevoVendedor] = useState<boolean>(false);

  // Cargar datos almacenados en localStorage al iniciar
  useEffect(() => {
    const alumnosGuardados = localStorage.getItem('alumnos');
    if (alumnosGuardados) {
      setAlumnos(JSON.parse(alumnosGuardados));
    }
    
    const vendedoresGuardados = localStorage.getItem('vendedores');
    if (vendedoresGuardados) {
      setVendedores(JSON.parse(vendedoresGuardados));
      setLoading(false);
    }
    
    // Siempre obtenemos datos frescos del servidor
    obtenerAlumnos();
  }, []);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    if (alumnos.length > 0) {
      localStorage.setItem('alumnos', JSON.stringify(alumnos));
    }
  }, [alumnos]);

  useEffect(() => {
    if (vendedores.length > 0) {
      localStorage.setItem('vendedores', JSON.stringify(vendedores));
    }
  }, [vendedores]);

  const obtenerVendedores = async () => {
    try {
      setLoading(true);
      const respuesta = await axios.get('http://localhost:5180/api/SorteosVendedores');
      console.log('Datos de vendedores recibidos:', respuesta.data);
      
      // Aseguramos que cada vendedor tenga la información completa del alumno
      const vendedoresConDatos = respuesta.data.map((vendedor: any) => {
        // Buscamos el alumno correspondiente usando el idAlumno
        const alumnoEncontrado = alumnos.find(a => a.id === vendedor.idAlumno);
        
        return {
          ...vendedor,
          alumno: alumnoEncontrado || {
            nombre: 'Alumno no encontrado',
            apellido: '',
            // Asignamos el idAlumno como documento si no se encuentra el alumno
            documento: vendedor.idAlumno,
            telefono: '',
            email: ''
          }
        };
      });
      
      console.log('Vendedores con datos de alumnos:', vendedoresConDatos);
      setVendedores(vendedoresConDatos);
    } catch (error) {
      console.error('Error al obtener vendedores:', error);
      alert('Error al cargar los vendedores. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const obtenerAlumnos = async () => {
    try {
      const respuesta = await axios.get('http://localhost:5180/api/Alumnos');
      console.log('Datos de alumnos recibidos:', respuesta.data);
      
      // Aseguramos que cada alumno tenga el campo documento igual a su id
      const alumnosConDocumento = respuesta.data.map((alumno: any) => ({
        ...alumno,
        documento: alumno.id // Asignamos el id como documento si no existe
      }));
      
      setAlumnos(alumnosConDocumento);
      
      // Después de obtener los alumnos, ahora obtenemos los vendedores
      await obtenerVendedores();
    } catch (error) {
      console.error('Error al obtener alumnos:', error);
      alert('Error al cargar los alumnos. Por favor, intenta de nuevo.');
      setLoading(false); // Aseguramos que se quite el loading en caso de error
    }
  };

  const abrirModalNuevo = () => {
    setVendedorEditar({
      idAlumno: '',
      activo: true,
      idCategoria: 1
    });
    setEsNuevoVendedor(true);
    setMostrarModal(true);
  };

  const abrirModalEditar = (vendedor: VendedorSorteo) => {
    setVendedorEditar({
      idVendedor: vendedor.idVendedor,
      idAlumno: vendedor.idAlumno,
      activo: vendedor.activo,
      idCategoria: vendedor.idCategoria || 1
    });
    setEsNuevoVendedor(false);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const guardarVendedor = async () => {
    try {
      if (!vendedorEditar.idAlumno) {
        alert('Debe seleccionar un alumno');
        return;
      }

      // Encontrar el alumno seleccionado para obtener sus datos
      const alumnoSeleccionado = alumnos.find(a => a.id === vendedorEditar.idAlumno);
      
      if (!alumnoSeleccionado) {
        alert('El alumno seleccionado no existe');
        return;
      }

      // Datos a enviar al servidor
      const datosVendedor = {
        ...vendedorEditar,
        // Incluimos información adicional para compatibilidad con TalonarioDigital
        nombreAlumno: `${alumnoSeleccionado.nombre} ${alumnoSeleccionado.apellido}`,
        curso: alumnoSeleccionado.curso || 'Sin curso'
      };

      if (esNuevoVendedor) {
        await axios.post('http://localhost:5180/api/SorteosVendedores', datosVendedor);
        alert('Vendedor registrado con éxito');
      } else {
        await axios.put(`http://localhost:5180/api/SorteosVendedores/${vendedorEditar.idVendedor}`, datosVendedor);
        alert('Vendedor actualizado con éxito');
      }

      cerrarModal();
      // Volvemos a cargar los vendedores después de guardar
      obtenerAlumnos(); // Obtenemos alumnos y luego vendedores
    } catch (error) {
      console.error('Error al guardar el vendedor:', error);
      alert('Error al guardar el vendedor. Por favor, intenta de nuevo.');
    }
  };

  const cambiarEstadoVendedor = async (id: number, nuevoEstado: boolean) => {
    try {
      await axios.patch(`http://localhost:5180/api/SorteosVendedores/${id}/estado`, { activo: nuevoEstado });
      alert(`Vendedor ${nuevoEstado ? 'activado' : 'desactivado'} con éxito`);
      obtenerVendedores();
    } catch (error) {
      console.error('Error al cambiar el estado del vendedor:', error);
      alert('Error al cambiar el estado del vendedor. Por favor, intenta de nuevo.');
    }
  };

  const actualizarCampo = (campo: keyof VendedorSorteo, valor: any) => {
    if (vendedorEditar) {
      setVendedorEditar({
        ...vendedorEditar,
        [campo]: valor
      });
    }
  };

  // Helper function to format date or return a placeholder
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'N/A';
    }
  };

  // Helper function to handle null/undefined values
  const formatValue = (value: any) => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    return value;
  };

  return (
    <div className="sorteos-section">
      <div className="sorteos-header">
        <h2 className="sorteos-title">Vendedores de Sorteos</h2>
        <Button variant="primary" onClick={abrirModalNuevo}>
          <i className="bi bi-plus-circle me-2"></i>Registrar Alumno como Vendedor
        </Button>
      </div>

      <div className="sorteos-body">
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Cargando...</span>
            </Spinner>
          </div>
        ) : (
          <Table striped bordered hover responsive className="sorteos-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Documento</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Fecha Registro</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vendedores.length > 0 ? (
                vendedores.map((vendedor) => (
                  <tr key={vendedor.idVendedor}>
                    <td>{vendedor.idVendedor}</td>
                    <td>{formatValue(vendedor.idAlumno)}</td>
                    <td>{formatValue(vendedor.alumno?.nombre)}</td>
                    <td>{formatValue(vendedor.alumno?.apellido)}</td>
                    <td>{formatValue(vendedor.alumno?.telefono)}</td>
                    <td>{formatValue(vendedor.alumno?.email)}</td>
                    <td>{formatDate(vendedor.fechaRegistro)}</td>
                    <td>
                      <span className={`sorteos-badge ${vendedor.activo ? 'sorteos-badge-success' : 'sorteos-badge-danger'}`}>
                        {vendedor.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => abrirModalEditar(vendedor)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button 
                        variant={vendedor.activo ? "outline-danger" : "outline-success"} 
                        size="sm"
                        onClick={() => cambiarEstadoVendedor(vendedor.idVendedor, !vendedor.activo)}
                      >
                        <i className={`bi ${vendedor.activo ? "bi-toggle-on" : "bi-toggle-off"}`}></i>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center">No hay vendedores registrados</td>
                </tr>
              )}
            </tbody>
          </Table>
        )}
      </div>

      <Modal show={mostrarModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {esNuevoVendedor ? 'Registrar Alumno como Vendedor' : 'Editar Vendedor'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Alumno</Form.Label>
              <Form.Select
                value={vendedorEditar.idAlumno || ''}
                onChange={(e) => actualizarCampo('idAlumno', e.target.value)}
                disabled={!esNuevoVendedor}
              >
                <option value="">Seleccione un alumno</option>
                {alumnos.map(alumno => (
                  <option key={alumno.id} value={alumno.id}>
                    {alumno.nombre} {alumno.apellido} - {alumno.id}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check 
                type="switch"
                id="custom-switch"
                label="Activo"
                checked={vendedorEditar.activo}
                onChange={(e) => actualizarCampo('activo', e.target.checked)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarVendedor}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SorteosVendedores;*/