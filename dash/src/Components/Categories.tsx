import { FC } from 'react';

interface Category {
  idCategoria: number;
  nombreCategoria: string;
}

const Categories: FC = () => {
  const categories: Category[] = [
    {
      idCategoria: 1,
      nombreCategoria: "juvenil"
    },
    {
      idCategoria: 2,
      nombreCategoria: "Pony"
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
              <i className="bi bi-tags text-success fs-4"></i>
            </div>
            <div>
              <small className="text-muted">Total de Categorías</small>
              <h2 className="mb-0">5,423</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <h2>Todos las Categorías</h2>
        <p className="text-success mb-4">Categorías activos</p>
        
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
                <th>ID Categoría</th>
                <th>Nombre de la categoría</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.idCategoria}>
                  <td>{category.idCategoria}</td>
                  <td>{category.nombreCategoria}</td>
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

export default Categories;