import { FC, useState, useEffect } from 'react';
import axios from 'axios';

interface TipoMovimiento {
  idTipo: number;
  nombre: string;
  estado: number;
}

const TiposMovimiento: FC = () => {
  const [tiposMovimiento, setTiposMovimiento] = useState<TipoMovimiento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerTiposMovimiento = async () => {
      try {
        setLoading(true);
        const respuesta = await axios.get('http://localhost:5180/api/TiposMovimiento');
        console.log('Datos de tipos de movimiento recibidos:', respuesta.data);
        setTiposMovimiento(respuesta.data);
      } catch (error) {
        console.error('Error al obtener tipos de movimiento:', error);
        alert('Error al cargar los tipos de movimiento. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    obtenerTiposMovimiento();
  }, []);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tipos de Movimiento</h2>
        <button className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Tipo
        </button>
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
                    <th>Nombre</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tiposMovimiento.length > 0 ? (
                    tiposMovimiento.map(tipo => (
                      <tr key={tipo.idTipo}>
                        <td>{tipo.idTipo}</td>
                        <td>{tipo.nombre}</td>
                        <td>
                          <span className={`badge ${tipo.estado === 1 ? 'bg-success' : 'bg-danger'}`}>
                            {tipo.estado === 1 ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-2">
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="text-center">No hay tipos de movimiento registrados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiposMovimiento;