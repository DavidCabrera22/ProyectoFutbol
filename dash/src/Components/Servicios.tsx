import { FC, useState, useEffect } from 'react';
import axios from 'axios';

interface Servicio {
  idServicio: number;
  nombre: string;
}

const Servicios: FC = () => {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerServicios = async () => {
      try {
        setLoading(true);
        const respuesta = await axios.get('http://localhost:5180/api/Servicios');
        console.log('Datos de servicios recibidos:', respuesta.data);
        setServicios(respuesta.data);
      } catch (error) {
        console.error('Error al obtener servicios:', error);
        alert('Error al cargar los servicios. Por favor, intenta de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    obtenerServicios();
  }, []);

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Servicios</h2>
        <button className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Servicio
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
                  {servicios.length > 0 ? (
                    servicios.map(servicio => (
                      <tr key={servicio.idServicio}>
                        <td>{servicio.idServicio}</td>
                        <td>{servicio.nombre}</td>
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
                      <td colSpan={3} className="text-center">No hay servicios registrados</td>
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

export default Servicios;