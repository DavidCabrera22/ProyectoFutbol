import { FC, useState, useEffect } from 'react';
import axios from 'axios';

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
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        setLoading(true);
        const [respSaldos, respSedes] = await Promise.all([
          axios.get('http://localhost:5180/api/Saldos'),
          axios.get('http://localhost:5180/api/Sedes')
        ]);
        
        console.log('Datos de saldos recibidos:', respSaldos.data);
        console.log('Datos de sedes recibidos:', respSedes.data);
        
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

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Saldos por Sede</h2>
        <button className="btn btn-primary">
          <i className="bi bi-plus-circle me-2"></i>
          Nuevo Saldo
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
                    <th>Sede</th>
                    <th>Fecha</th>
                    <th>Valor</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {saldos.length > 0 ? (
                    saldos.map(saldo => (
                      <tr key={saldo.idSaldo}>
                        <td>{saldo.idSaldo}</td>
                        <td>{saldo.nombreSede}</td>
                        <td>{new Date(saldo.fecha).toLocaleDateString()}</td>
                        <td>${saldo.valor.toLocaleString()}</td>
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
                      <td colSpan={5} className="text-center">No hay saldos registrados</td>
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

export default Saldos;