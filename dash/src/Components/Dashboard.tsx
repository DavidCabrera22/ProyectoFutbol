import { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { ProgressBar } from 'react-bootstrap';
import { useAuth } from './AuthContext';

interface EstadisticasGenerales {
  totalAlumnos: number;
  totalFormadores: number;
  totalSedes: number;
  totalServicios: number;
}

interface CategoriaStats {
  nombre: string;
  cantidadAlumnos: number;
  porcentaje: number;
}

interface Servicio {
  nombre: string;
  idServicio: number;
}

const Dashboard: FC = () => {
  const { user } = useAuth();
  const [estadisticas, setEstadisticas] = useState<EstadisticasGenerales>({
    totalAlumnos: 0,
    totalFormadores: 0,
    totalSedes: 0,
    totalServicios: 0
  });
  const [categorias, setCategorias] = useState<CategoriaStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [asistenciaPromedio, setAsistenciaPromedio] = useState(0);
  const [rendimientoPromedio, setRendimientoPromedio] = useState(0);
  const [alumnosPorMes, setAlumnosPorMes] = useState<number[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        
        // Obtener datos de alumnos
        const respAlumnos = await axios.get('http://localhost:5180/api/Alumnos');
        const alumnos = respAlumnos.data;
        
        // Obtener datos de formadores
        const respFormadores = await axios.get('http://localhost:5180/api/Formadores');
        const formadores = respFormadores.data;
        
        // Obtener datos de sedes
        const respSedes = await axios.get('http://localhost:5180/api/Sedes');
        const sedes = respSedes.data;
        
        // Obtener datos de servicios
        const respServicios = await axios.get('http://localhost:5180/api/Servicios');
        const servicios = respServicios.data;

        // Calcular estadísticas generales
        setEstadisticas({
          totalAlumnos: alumnos.length,
          totalFormadores: formadores.length,
          totalSedes: sedes.length,
          totalServicios: servicios.length
        });

        // Generar datos para categorías
        const categoriasData = servicios.map((servicio: Servicio) => {
          // Contar alumnos por servicio (simulado)
          const cantidadAlumnos = Math.floor(Math.random() * 50) + 5;
          const porcentaje = Math.floor((cantidadAlumnos / alumnos.length) * 100);
          
          return {
            nombre: servicio.nombre,
            cantidadAlumnos,
            porcentaje
          };
        });
        
        setCategorias(categoriasData.sort((a: CategoriaStats, b: CategoriaStats) => b.cantidadAlumnos - a.cantidadAlumnos));
        
        // Simular asistencia y rendimiento promedio
        setAsistenciaPromedio(Math.floor(Math.random() * 30) + 70); // Entre 70% y 100%
        setRendimientoPromedio(Math.floor(Math.random() * 30) + 70); // Entre 70% y 100%
        
        // Simular alumnos por mes (últimos 6 meses)
        const alumnosMensuales = Array.from({ length: 6 }, () => Math.floor(Math.random() * 50) + 20);
        setAlumnosPorMes(alumnosMensuales);
        
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatos();
  }, []);

  // Obtener el nombre del mes actual y los 5 anteriores
  const obtenerMesesAnteriores = () => {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth();
    
    const mesesAnteriores = [];
    for (let i = 5; i >= 0; i--) {
      const indice = (mesActual - i + 12) % 12;
      mesesAnteriores.push(meses[indice]);
    }
    
    return mesesAnteriores;
  };

  const mesesAnteriores = obtenerMesesAnteriores();

  return (
    <div className="p-4">
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-3 p-4 mb-4">
            <h1>Hola {user?.nombreUsuario || 'Usuario'} 👋</h1>
            <p className="text-muted">Bienvenido al panel de estadísticas de TopFutbol</p>
          </div>

          {/* Estadísticas generales */}
          <div className="row g-4 mb-4">
            <div className="col-md-3">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-people fs-1 text-primary mb-3"></i>
                  <h5>Alumnos</h5>
                  <h2 className="mt-2">{estadisticas.totalAlumnos}</h2>
                  <p className="text-muted small">Alumnos registrados</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-person-badge fs-1 text-success mb-3"></i>
                  <h5>Formadores</h5>
                  <h2 className="mt-2">{estadisticas.totalFormadores}</h2>
                  <p className="text-muted small">Formadores activos</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-geo-alt fs-1 text-danger mb-3"></i>
                  <h5>Sedes</h5>
                  <h2 className="mt-2">{estadisticas.totalSedes}</h2>
                  <p className="text-muted small">Sedes operativas</p>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card h-100">
                <div className="card-body text-center">
                  <i className="bi bi-list-check fs-1 text-warning mb-3"></i>
                  <h5>Servicios</h5>
                  <h2 className="mt-2">{estadisticas.totalServicios}</h2>
                  <p className="text-muted small">Servicios disponibles</p>
                </div>
              </div>
            </div>
          </div>

          {/* Métricas de rendimiento */}
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h5>Asistencia Promedio</h5>
                  <p className="text-muted small">Porcentaje de asistencia de los alumnos</p>
                  <div className="d-flex align-items-center mt-4">
                    <h2 className="me-3">{asistenciaPromedio}%</h2>
                    <ProgressBar 
                      now={asistenciaPromedio} 
                      variant={asistenciaPromedio > 85 ? "success" : asistenciaPromedio > 70 ? "warning" : "danger"} 
                      style={{ height: '10px', width: '100%' }} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h5>Rendimiento Promedio</h5>
                  <p className="text-muted small">Rendimiento promedio de los alumnos</p>
                  <div className="d-flex align-items-center mt-4">
                    <h2 className="me-3">{rendimientoPromedio}%</h2>
                    <ProgressBar 
                      now={rendimientoPromedio} 
                      variant={rendimientoPromedio > 85 ? "success" : rendimientoPromedio > 70 ? "warning" : "danger"} 
                      style={{ height: '10px', width: '100%' }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categorías con más alumnos */}
          <div className="row g-4 mb-4">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h5>Categorías con más alumnos</h5>
                  <p className="text-muted small">Distribución de alumnos por categoría</p>
                  
                  {categorias.slice(0, 5).map((categoria, index) => (
                    <div key={index} className="mt-4">
                      <div className="d-flex justify-content-between mb-1">
                        <span>{categoria.nombre}</span>
                        <span>{categoria.cantidadAlumnos} alumnos</span>
                      </div>
                      <ProgressBar 
                        now={categoria.porcentaje} 
                        variant={index === 0 ? "primary" : index === 1 ? "success" : index === 2 ? "warning" : "danger"} 
                        style={{ height: '8px' }} 
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h5>Alumnos por mes</h5>
                  <p className="text-muted small">Evolución de alumnos en los últimos 6 meses</p>
                  
                  <div className="d-flex justify-content-between align-items-end mt-4" style={{ height: '200px' }}>
                    {alumnosPorMes.map((cantidad, index) => (
                      <div key={index} className="d-flex flex-column align-items-center" style={{ width: '16%' }}>
                        <div 
                          className="bg-primary rounded-top" 
                          style={{ 
                            width: '80%', 
                            height: `${(cantidad / Math.max(...alumnosPorMes)) * 180}px` 
                          }}
                        ></div>
                        <div className="text-muted small mt-2">{mesesAnteriores[index]}</div>
                        <div className="small">{cantidad}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas adicionales */}
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5>Distribución por edad</h5>
                  <div className="mt-4">
                    <div className="d-flex justify-content-between mb-1">
                      <span>5-8 años</span>
                      <span>32%</span>
                    </div>
                    <ProgressBar now={32} variant="info" style={{ height: '8px', marginBottom: '15px' }} />
                    
                    <div className="d-flex justify-content-between mb-1">
                      <span>9-12 años</span>
                      <span>45%</span>
                    </div>
                    <ProgressBar now={45} variant="primary" style={{ height: '8px', marginBottom: '15px' }} />
                    
                    <div className="d-flex justify-content-between mb-1">
                      <span>13-15 años</span>
                      <span>18%</span>
                    </div>
                    <ProgressBar now={18} variant="success" style={{ height: '8px', marginBottom: '15px' }} />
                    
                    <div className="d-flex justify-content-between mb-1">
                      <span>16+ años</span>
                      <span>5%</span>
                    </div>
                    <ProgressBar now={5} variant="warning" style={{ height: '8px' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5>Formadores destacados</h5>
                  <p className="text-muted small">Formadores con mejor rendimiento</p>
                  
                  <div className="mt-3">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-person-fill text-white"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">Carlos Rodríguez</h6>
                        <small className="text-muted">Categoría Sub-12</small>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-person-fill text-white"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">María González</h6>
                        <small className="text-muted">Categoría Sub-10</small>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center">
                      <div className="bg-warning rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-person-fill text-white"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">Juan Pérez</h6>
                        <small className="text-muted">Categoría Sub-15</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5>Próximos eventos</h5>
                  <p className="text-muted small">Eventos programados</p>
                  
                  <div className="mt-3">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-danger rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-calendar-event text-white"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">Torneo Interno</h6>
                        <small className="text-muted">15 de Junio, 2023</small>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-info rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-calendar-event text-white"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">Evaluación Técnica</h6>
                        <small className="text-muted">22 de Junio, 2023</small>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center">
                      <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                        <i className="bi bi-calendar-event text-white"></i>
                      </div>
                      <div>
                        <h6 className="mb-0">Encuentro Amistoso</h6>
                        <small className="text-muted">30 de Junio, 2023</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Dashboard;