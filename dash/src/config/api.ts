const API_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? '/api'  // Fallback para producción si no hay variable de entorno
    : 'http://localhost:5180/api');

export default API_URL;