import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Modal, Form } from 'react-bootstrap';
const API_URL = import.meta.env.VITE_API_URL;

interface Category {
  idCategoria: number;
  nombre: string;
}

const Categories: FC = () => {
  // Estados para manejar los datos y la UI
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState<Category[]>([]);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [ordenamiento, setOrdenamiento] = useState('reciente');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [categoriaEditar, setCategoriaEditar] = useState<Category | null>(null);
  const [esNuevaCategoria, setEsNuevaCategoria] = useState(false);

  // Efecto para cargar las categorías al montar el componente
  useEffect(() => {
    obtenerCategorias();
  }, []);

  // Función para obtener las categorías desde la API
  const obtenerCategorias = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/Categorias`);
      setCategorias(response.data);
      setCategoriasFiltradas(response.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  // Función para manejar la búsqueda de categorías
  const manejarBusqueda = (evento: React.ChangeEvent<HTMLInputElement>) => {
    const termino = evento.target.value;
    setTerminoBusqueda(termino);
    
    if (termino.trim() === '') {
      setCategoriasFiltradas(categorias);
    } else {
      const filtradas = categorias.filter(categoria => 
        categoria.nombre.toLowerCase().includes(termino.toLowerCase())
      );
      setCategoriasFiltradas(filtradas);
    }
  };

  // Función para manejar el ordenamiento de categorías
  const manejarOrdenamiento = (evento: React.ChangeEvent<HTMLSelectElement>) => {
    const valor = evento.target.value;
    setOrdenamiento(valor);
    const categoriasOrdenadas = [...categoriasFiltradas];
    
    switch (valor) {
      case 'a-z':
        categoriasOrdenadas.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'z-a':
        categoriasOrdenadas.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
      case 'reciente':
        categoriasOrdenadas.sort((a, b) => b.idCategoria - a.idCategoria);
        break;
      case 'antiguo':
        categoriasOrdenadas.sort((a, b) => a.idCategoria - b.idCategoria);
        break;
    }
    
    setCategoriasFiltradas(categoriasOrdenadas);
  };

  // Función para iniciar la creación de una nueva categoría
  const nuevaCategoria = () => {
    setEsNuevaCategoria(true);
    setCategoriaEditar({
      idCategoria: 0,
      nombre: ''
    });
    setMostrarModal(true);
  };

  // Función para iniciar la edición de una categoría existente
  const editarCategoria = (id: number) => {
    const categoria = categorias.find(c => c.idCategoria === id);
    if (categoria) {
      setEsNuevaCategoria(false);
      setCategoriaEditar({ ...categoria });
      setMostrarModal(true);
    }
  };

  // Función para eliminar una categoría
  const eliminarCategoria = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        await axios.delete(`${API_URL}/api/Categorias/${id}`);
        obtenerCategorias();
      } catch (error) {
        console.error('Error al eliminar categoría:', error);
      }
    }
  };

  // Función para actualizar un campo de la categoría en edición
  const actualizarCampo = (campo: keyof Category, valor: string) => {
    if (categoriaEditar) {
      setCategoriaEditar({
        ...categoriaEditar,
        [campo]: valor
      });
    }
  };

  // Función para guardar los cambios (crear o actualizar categoría)
  const guardarCambios = async () => {
    if (!categoriaEditar) return;

    try {
      if (esNuevaCategoria) {
        await axios.post(`${API_URL}/api/Categorias`, categoriaEditar);
        alert('Categoría creada con éxito');
      } else {
        await axios.put(`${API_URL}/api/Categorias/${categoriaEditar.idCategoria}`, categoriaEditar);
        alert('Categoría actualizada con éxito');
      }
      
      setMostrarModal(false);
      obtenerCategorias();
    } catch (error) {
      console.error('Error al guardar categoría:', error);
      alert('Error al guardar la categoría');
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Hola Jorge 👋</h1>
        <div className="d-flex gap-3">
          <Button variant="success" onClick={nuevaCategoria}>
            <i className="bi bi-plus-circle me-2"></i>
            Agregar Categoría
          </Button>
          <input 
            type="search" 
            className="form-control" 
            placeholder="Buscar categoría..." 
            style={{width: '200px'}} 
            value={terminoBusqueda}
            onChange={manejarBusqueda}
          />
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-success bg-opacity-25 p-3 rounded-circle">
              <i className="bi bi-tags text-success fs-4"></i>
            </div>
            <div>
              <small className="text-muted">Total de Categorías</small>
              <h2 className="mb-0">{categorias.length}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2>Todos las Categorías</h2>
        <p className="text-success mb-4">Categorías activas</p>
        
        <div className="d-flex justify-content-between mb-3">
          <input 
            type="search" 
            className="form-control" 
            placeholder="Buscar por nombre..." 
            style={{width: '300px'}} 
            value={terminoBusqueda}
            onChange={manejarBusqueda}
          />
          <select 
            className="form-select" 
            style={{width: '200px'}}
            value={ordenamiento}
            onChange={manejarOrdenamiento}
          >
            <option value="reciente">Más reciente</option>
            <option value="antiguo">Más antiguo</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID Categoría</th>
                <th>Nombre de la categoría</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categoriasFiltradas.map((categoria) => (
                <tr key={categoria.idCategoria}>
                  <td>{categoria.idCategoria}</td>
                  <td>{categoria.nombre}</td>
                  <td>
                    <div className="btn-group">
                      <button 
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => editarCategoria(categoria.idCategoria)}
                        title="Editar"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarCategoria(categoria.idCategoria)}
                        title="Eliminar"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <nav>
          <ul className="pagination justify-content-end">
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            <li className="page-item active"><a className="page-link" href="#">1</a></li>
            <li className="page-item"><a className="page-link" href="#">2</a></li>
            <li className="page-item"><a className="page-link" href="#">3</a></li>
            <li className="page-item"><a className="page-link" href="#">4</a></li>
            <li className="page-item"><a className="page-link" href="#">40</a></li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal de edición/creación */}
      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {esNuevaCategoria ? 'Agregar Categoría' : 'Editar Categoría'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {categoriaEditar && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Nombre de la categoría</Form.Label>
                <Form.Control
                  type="text"
                  value={categoriaEditar.nombre}
                  onChange={(e) => actualizarCampo('nombre', e.target.value)}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setMostrarModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarCambios}>
            {esNuevaCategoria ? 'Crear Categoría' : 'Guardar Cambios'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Categories;