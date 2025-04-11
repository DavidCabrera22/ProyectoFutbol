import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Alert, Button } from 'react-bootstrap';

const ApiTest: React.FC = () => {
  const [apiUrl, setApiUrl] = useState('');
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Obtener la URL de la API del entorno
    const url = import.meta.env.VITE_API_URL;
    setApiUrl(url);
    console.log('URL de API cargada:', url);
  }, []);

  const testDirectApi = async () => {
    try {
      setLoading(true);
      console.log('Probando conexión directa a API:', 'https://topfutbol-api-production.up.railway.app/api/Sedes');
      const response = await axios.get('https://topfutbol-api-production.up.railway.app/api/Sedes');
      console.log('Respuesta directa:', response);
      setTestResult({
        success: true,
        message: `Conexión directa exitosa. Status: ${response.status}`
      });
    } catch (error) {
      console.error('Error en conexión directa:', error);
      setTestResult({
        success: false,
        message: `Error en conexión directa: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const testProxyApi = async () => {
    try {
      setLoading(true);
      console.log('Probando conexión a través de proxy:', `${apiUrl}/api/Sedes`);
      const response = await axios.get(`${apiUrl}/api/Sedes`);
      console.log('Respuesta proxy:', response);
      setTestResult({
        success: true,
        message: `Conexión proxy exitosa. Status: ${response.status}`
      });
    } catch (error) {
      console.error('Error en conexión proxy:', error);
      setTestResult({
        success: false,
        message: `Error en conexión proxy: ${error instanceof Error ? error.message : 'Error desconocido'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-5">
      <Card>
        <Card.Header>Prueba de Conexión a API</Card.Header>
        <Card.Body>
          <p><strong>URL de API configurada:</strong> {apiUrl}</p>
          
          <div className="d-flex gap-2 mb-3">
            <Button 
              variant="primary" 
              onClick={testDirectApi} 
              disabled={loading}
            >
              Probar Conexión Directa
            </Button>
            
            <Button 
              variant="success" 
              onClick={testProxyApi} 
              disabled={loading}
            >
              Probar Conexión Proxy
            </Button>
          </div>
          
          {testResult && (
            <Alert variant={testResult.success ? 'success' : 'danger'}>
              {testResult.message}
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ApiTest;