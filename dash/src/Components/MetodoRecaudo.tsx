import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';

interface MetodoRecaudo {
  idMetodoRecaudo: number;
  nombre: string;
}

const MetodosRecaudo: React.FC = () => {
  const [metodosRecaudo, setMetodosRecaudo] = useState<MetodoRecaudo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [metodoEditar, setMetodoEditar] = useState<Partial<MetodoRecaudo>>({ nombre: '' });
  const [esNuevoMetodo, setEsNuevoMetodo] = useState<boolean>(false);

  useEffect(() => {
    obtenerMetodosRecaudo();
  }, []);

  const obtenerMetodosRecaudo = async () => {
    try {
      setLoading(true);
      const respuesta = await axios.get('http://localhost:5180/api/MetodosRecaudo');
      console.log('Datos de métodos de recaudo recibidos:', respuesta.data);
      setMetodosRecaudo(respuesta.data);
    } catch (error) {
      console.error('Error al obtener métodos de recaudo:', error);
      alert('Error al cargar los métodos de recaudo. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const abrirModalNuevo = () => {
    setMetodoEditar({
      nombre: ''
    });
    setEsNuevoMetodo(true);
    setMostrarModal(true);
  };

  const abrirModalEditar = (metodo: MetodoRecaudo) => {
    setMetodoEditar(metodo);
    setEsNuevoMetodo(false);
    setMostrarModal(true);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
  };

  const guardarMetodo = async () => {
    try {
      if (!metodoEditar.nombre) {
        alert('El nombre del método de recaudo es obligatorio');
        return;
      }

      if (esNuevoMetodo) {
        await axios.post('http://localhost:5180/api/MetodosRecaudo', metodoEditar);
        alert('Método de recaudo creado con éxito');
      } else {
        await axios.put(`http://localhost:5180/api/MetodosRecaudo/${metodoEditar.idMetodoRecaudo}`, metodoEditar);
        alert('Método de recaudo actualizado con éxito');
      }

      cerrarModal();
      obtenerMetodosRecaudo();
    } catch (error) {
      console.error('Error al guardar el método de recaudo:', error);
      alert('Error al guardar el método de recaudo. Por favor, intenta de nuevo.');
    }
  };

  const eliminarMetodo = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este método de recaudo?')) {
      try {
        await axios.delete(`http://localhost:5180/api/MetodosRecaudo/${id}`);
        alert('Método de recaudo eliminado con éxito');
        obtenerMetodosRecaudo();
      } catch (error) {
        console.error('Error al eliminar el método de recaudo:', error);
        alert('Error al eliminar el método de recaudo. Por favor, intenta de nuevo.');
      }
    }
  };

  const actualizarCampo = (campo: keyof MetodoRecaudo, valor: string) => {
    if (metodoEditar) {
      setMetodoEditar({
        ...metodoEditar,
        [campo]: valor
      });
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Métodos de Recaudo</h2>
        <Button variant="primary" onClick={abrirModalNuevo}>
          <i className="bi bi-plus-circle me-2"></i>Nuevo Método
        </Button>
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
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {metodosRecaudo.length > 0 ? (
              metodosRecaudo.map((metodo) => (
                <tr key={metodo.idMetodoRecaudo}>
                  <td>{metodo.idMetodoRecaudo}</td>
                  <td>{metodo.nombre}</td>
                  <td>
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="me-2"
                      onClick={() => abrirModalEditar(metodo)}
                    >
                      <i className="bi bi-pencil"></i>
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => eliminarMetodo(metodo.idMetodoRecaudo)}
                    >
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center">No hay métodos de recaudo registrados</td>
              </tr>
            )}
          </tbody>
        </Table>
      )}

      <Modal show={mostrarModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            {esNuevoMetodo ? 'Nuevo Método de Recaudo' : 'Editar Método de Recaudo'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el nombre del método de recaudo"
                value={metodoEditar.nombre || ''}
                onChange={(e) => actualizarCampo('nombre', e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarMetodo}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MetodosRecaudo;