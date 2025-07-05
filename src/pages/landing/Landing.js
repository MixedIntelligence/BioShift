import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'reactstrap';
import s from './Landing.module.scss';

const LandingPage = () => {
  return (
    <div className={s.root}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6} className="text-center">
            <h1 className="mb-4">Welcome to LabLeap</h1>
            <p className="lead mb-5">
              The premier platform connecting labs, workers, and providers in the scientific community.
            </p>
            <h2 className="mb-4">Join as a...</h2>
            <Row>
              <Col>
                <Link to="/register/worker">
                  <Button color="primary" size="lg" block>Worker</Button>
                </Link>
              </Col>
              <Col>
                <Link to="/register/lab">
                  <Button color="success" size="lg" block>Lab</Button>
                </Link>
              </Col>
              <Col>
                <Link to="/register/provider">
                  <Button color="info" size="lg" block>Provider</Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;