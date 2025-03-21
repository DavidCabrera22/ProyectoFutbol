import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Corregido: ruta correcta al contexto

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="text-center">
            <Card.Header className="bg-danger text-white">
              <h3>Acceso Denegado</h3>
            </Card.Header>
            <Card.Body>
              <i className="bi bi-shield-lock display-1 text-danger mb-3"></i>
              <h4>No tienes permisos para acceder a esta página</h4>
              <p className="text-muted">
                Tu rol actual es: <strong>{user?.rol || 'Usuario'}</strong>
              </p>
              <div className="mt-4">
                <Button variant="primary" onClick={() => navigate('/dashboard')}>
                  Volver al Dashboard
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Unauthorized;