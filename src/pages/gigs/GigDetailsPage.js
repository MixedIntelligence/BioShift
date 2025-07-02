import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import gigs from './mock';
import { Card, CardBody, CardTitle, CardText, Button, Row, Col, Badge, Alert } from 'reactstrap';

// Mock applicants for demo (could be expanded or moved to mock.js)
const mockApplicants = [
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

const GigDetailsPage = ({ currentUser }) => {
  const { id } = useParams();
  const history = useHistory();
  const gig = gigs.find(g => g.id === id);
  const role = currentUser?.role;
  const [applied, setApplied] = useState(false);
  const [awardedId, setAwardedId] = useState(null);
  const [messageSent, setMessageSent] = useState(false);

  if (!gig) {
    return <div className="container mt-4"><h4>Gig not found.</h4></div>;
  }

  // Worker/Professional view
  if (role === 'worker') {
    return (
      <div className="container mt-4">
        <Button color="link" onClick={() => history.goBack()}>&larr; Back to Gigs</Button>
        <Card className="mb-4">
          <CardBody>
            <CardTitle tag="h3">{gig.title} <Badge color="success">Open</Badge></CardTitle>
            <CardText><strong>Description:</strong> {gig.description}</CardText>
            <CardText><strong>Required Skills:</strong> {gig.requiredSkills.join(', ')}</CardText>
            <CardText><strong>Required Certifications:</strong> {gig.requiredCertifications.join(', ')}</CardText>
            <CardText><strong>Duration:</strong> {gig.duration}</CardText>
            <CardText><strong>Location:</strong> {gig.location}</CardText>
            <CardText><strong>Pay Rate:</strong> {gig.payRate}</CardText>
            <CardText><strong>Lab:</strong> {gig.lab.name} ({gig.lab.industry})<br/>{gig.lab.summary}</CardText>
            {!applied ? (
              <Button color="primary" onClick={() => setApplied(true)}>Apply</Button>
            ) : (
              <Button color="success" disabled>Application Submitted</Button>
            )}
            {' '}
            <Button color="secondary" onClick={() => setMessageSent(true)}>Message Lab</Button>
            {messageSent && <Alert color="info" className="mt-2">Demo: Message sent to lab!</Alert>}
          </CardBody>
        </Card>
        {applied && (
          <Card className="mb-4">
            <CardBody>
              <CardTitle tag="h5">Application Status</CardTitle>
              <CardText>
                <b>Status:</b> Pending Review<br/>
                <b>Lab:</b> {gig.lab.name}
              </CardText>
              <Button color="success" disabled>Awaiting Award</Button>
            </CardBody>
          </Card>
        )}
      </div>
    );
  }

  // Lab Manager view
  if (role === 'lab') {
    return (
      <div className="container mt-4">
        <Button color="link" onClick={() => history.goBack()}>&larr; Back to Gigs</Button>
        <Card className="mb-4">
          <CardBody>
            <CardTitle tag="h3">{gig.title}</CardTitle>
            <CardText><b>Description:</b> {gig.description}</CardText>
            <CardText><b>Required Skills:</b> {gig.requiredSkills.join(', ')}</CardText>
            <CardText><b>Certifications:</b> {gig.requiredCertifications.join(', ')}</CardText>
            <CardText><b>Duration:</b> {gig.duration}</CardText>
            <CardText><b>Location:</b> {gig.location}</CardText>
            <CardText><b>Pay Rate:</b> {gig.payRate}</CardText>
            <CardText><b>Lab:</b> {gig.lab.name} ({gig.lab.industry})<br/>{gig.lab.summary}</CardText>
            <Button color="primary" disabled>Gig Posted</Button>
          </CardBody>
        </Card>
        <h4>Applicants</h4>
        <Row>
          {mockApplicants.map(app => (
            <Col md={6} key={app.id} className="mb-3">
              <Card>
                <CardBody>
                  <CardTitle tag="h5">{app.name} <Badge color={awardedId === app.id ? 'success' : 'info'}>{awardedId === app.id ? 'Awarded' : app.status}</Badge></CardTitle>
                  <CardText>
                    <b>Skills:</b> {app.skills.join(', ')}<br/>
                    <b>Certifications:</b> {app.certifications.join(', ')}
                  </CardText>
                  <Button color="success" disabled={awardedId !== null} onClick={() => setAwardedId(app.id)}>{awardedId === app.id ? 'Awarded' : 'Award Gig'}</Button>{' '}
                  <Button color="secondary" onClick={() => setMessageSent(true)}>Message</Button>
                  {messageSent && <Alert color="info" className="mt-2">Demo: Message sent to applicant!</Alert>}
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  // Default: Provider/Admin or fallback
  return (
    <div className="container mt-4">
      <Button color="link" onClick={() => history.goBack()}>&larr; Back to Gigs</Button>
      <Card>
        <CardBody>
          <CardTitle tag="h3">{gig.title}</CardTitle>
          <CardText><strong>Description:</strong> {gig.description}</CardText>
          <CardText><strong>Required Skills:</strong> {gig.requiredSkills.join(', ')}</CardText>
          <CardText><strong>Required Certifications:</strong> {gig.requiredCertifications.join(', ')}</CardText>
          <CardText><strong>Duration:</strong> {gig.duration}</CardText>
          <CardText><strong>Location:</strong> {gig.location}</CardText>
          <CardText><strong>Pay Rate:</strong> {gig.payRate}</CardText>
          <CardText><strong>Lab:</strong> {gig.lab.name} ({gig.lab.industry})<br/>{gig.lab.summary}</CardText>
        </CardBody>
      </Card>
    </div>
  );
};

// Connect to Redux to get currentUser
export default compose(
  connect(state => ({ currentUser: state.auth.currentUser }))
)(GigDetailsPage);
