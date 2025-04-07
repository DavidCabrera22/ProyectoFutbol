const API_URL = import.meta.env.PROD 
  ? '/api'  // En producción, usamos rutas relativas que Nginx redirigirá
  : 'http://localhost:5180/api';

export default API_URL;