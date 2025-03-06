import { FC } from 'react';

interface Trainer {
  idFormador: number;
  nombre: string;
  telefono: string;
}

const Trainers: FC = () => {
  const trainers: Trainer[] = [
    {
      idFormador: 1,
      nombre: "Jane",
      telefono: "(225) 555-0118"
    },
    {
      idFormador: 2,
      nombre: "Floyd Miles",
      telefono: "(225) 555-0118"
    }
  ];

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Hola Jorge 👋</h1>
        <input type="search" className="form-control" placeholder="Buscar" style={{width: '200px'}} />
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-success bg-opacity-25 p-3 rounded-circle">
              <i className="bi bi-people text-success fs-4"></i>
            </div>
            <div>
              <small className="text-muted">Total de Formadores</small>
              <h2 className="mb-0">5,423</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2>Todos los Formadores</h2>
        <p className="text-success mb-4">Formadores activos</p>
        
        <div className="d-flex justify-content-between mb-3">
          <input 
            type="search" 
            className="form-control" 
            placeholder="Buscar" 
            style={{width: '200px'}} 
          />
          <select className="form-select" style={{width: '200px'}}>
            <option>Reciente</option>
          </select>
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>ID Formador</th>
                <th>Nombre</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((trainer) => (
                <tr key={trainer.idFormador}>
                  <td>{trainer.idFormador}</td>
                  <td>{trainer.nombre}</td>
                  <td>{trainer.telefono}</td>
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
    </div>
  );
};

export default Trainers;