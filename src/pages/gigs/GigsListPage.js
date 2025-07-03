import React from 'react';
import { connect } from 'react-redux';
import gigs from './mock';
import { Card, CardBody, CardTitle, CardText, Button, Row, Col, Badge } from 'reactstrap';

const GigsListPage = ({ currentUser }) => (
  <div className="container mt-4">
    <h2>Available Projects & Gigs</h2>
    <Row>
      {gigs.map(gig => (
        <Col md={6} lg={4} key={gig.id} className="mb-4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">{gig.title} <Badge color={gig.status === 'Completed' ? 'secondary' : gig.status === 'Awarded' ? 'success' : gig.status === 'Applied' ? 'info' : 'primary'}>{gig.status}</Badge></CardTitle>
              <CardText>{gig.description}</CardText>
              <CardText>
                <strong>Skills:</strong> {gig.requiredSkills.join(', ')}<br/>
                <strong>Certifications:</strong> {gig.requiredCertifications.join(', ')}<br/>
                <strong>Duration:</strong> {gig.duration}<br/>
                <strong>Location:</strong> {gig.location}<br/>
                <strong>Pay Rate:</strong> {gig.payRate}<br/>
                <strong>Lab:</strong> {gig.lab.name}
              </CardText>
              <Button color="primary" href={`#/app/gigs/${gig.id}`}>View Details</Button>
            </CardBody>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

export default connect(state => ({ currentUser: state.auth.currentUser }))(GigsListPage);
