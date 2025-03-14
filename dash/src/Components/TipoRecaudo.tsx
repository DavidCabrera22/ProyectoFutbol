import { FC, useState, useEffect } from 'react';
import axios from 'axios';

interface TipoRecaudo {
  idTipoRecaudo: number;
  nombre: string;
}

const TiposRecaudo: FC = () => {
  const [tiposRecaudo, setTiposRecaudo] = useState<TipoRecaudo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerTiposRecaudo = async () => {
      try {
        setLoading(true);
        const respuesta = await axios.get('http://localhost:5180/api/TiposRecaudo');
        console.log('Datos de tipos de recaudo recibidos:', respuesta.data);
        setTiposRecaudo(respuesta.data);
      } catch (error) {
        console.error('Error al obtener tipos de recaudo:', error);
        alert('Error al cargar los tipos de recaudo. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    obtenerTiposRecaudo();
  }, []);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Tipos de Recaudo</h2>
        <button className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Tipo de Recaudo
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
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tiposRecaudo.length > 0 ? (
                    tiposRecaudo.map(tipo => (
                      <tr key={tipo.idTipoRecaudo}>
                        <td>{tipo.idTipoRecaudo}</td>
                        <td>{tipo.nombre}</td>
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
                      <td colSpan={3} className="text-center">No hay tipos de recaudo registrados</td>
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

export default TiposRecaudo;