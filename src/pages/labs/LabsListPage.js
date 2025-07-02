import React from 'react';
import labs from './mock';
import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';

const LabsListPage = () => (
  <div className="container mt-4">
    <h2>Labs & Clients</h2>
    <Row>
      {labs.map(lab => (
        <Col md={6} lg={4} key={lab.id} className="mb-4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">{lab.name}</CardTitle>
              <CardText>
                <strong>Industry:</strong> {lab.industry}<br/>
                <strong>Size:</strong> {lab.size} scientists<br/>
                <strong>Location:</strong> {lab.location}<br/>
                <strong>Contact:</strong> {lab.contact.name} ({lab.contact.email})<br/>
                <strong>Summary:</strong> {lab.summary}<br/>
                <strong>Projects:</strong> {lab.projects.join(', ')}
              </CardText>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

export default LabsListPage;
