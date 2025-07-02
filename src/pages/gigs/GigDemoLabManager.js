import React from 'react';
import { Button, Card, CardBody, CardTitle, CardText, Row, Col, Badge } from 'reactstrap';

const applicants = [
  {
    id: 'user-001',
    name: 'Elena Vance',
    skills: ['Chromatography', 'Protein Purification'],
    certifications: ['GLP'],
    status: 'Applied',
  },
  {
    id: 'user-002',
    name: 'Samir Patel',
    skills: ['Cell Culture', 'Bioreactors'],
    certifications: ['Biosafety Level 2'],
    status: 'Applied',
  },
];

export default function GigDemoLabManager() {
  return (
    <div className="container mt-4">
      <h2>Post a Gig (Demo)</h2>
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h4">Protein Purification Analysis</CardTitle>
          <CardText>
            <b>Description:</b> Analyze and purify protein samples for oncology research.<br/>
            <b>Required Skills:</b> Chromatography, Protein Purification<br/>
            <b>Certifications:</b> GLP
          </CardText>
          <Button color="primary" disabled>Gig Posted</Button>
        </CardBody>
      </Card>
      <h4>Applicants</h4>
      <Row>
        {applicants.map(app => (
          <Col md={6} key={app.id} className="mb-3">
            <Card>
              <CardBody>
                <CardTitle tag="h5">{app.name} <Badge color="info">{app.status}</Badge></CardTitle>
                <CardText>
                  <b>Skills:</b> {app.skills.join(', ')}<br/>
                  <b>Certifications:</b> {app.certifications.join(', ')}
                </CardText>
                <Button color="success">Award Gig</Button>{' '}
                <Button color="secondary">Message</Button>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
