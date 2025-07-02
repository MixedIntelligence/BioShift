import React from 'react';
import { useParams, useHistory } from 'react-router-dom';
import gigs from './mock';
import { Card, CardBody, CardTitle, CardText, Button } from 'reactstrap';

const GigDetailsPage = () => {
  const { id } = useParams();
  const history = useHistory();
  const gig = gigs.find(g => g.id === id);

  if (!gig) {
    return <div className="container mt-4"><h4>Gig not found.</h4></div>;
  }

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
          <Button color="primary" disabled>Apply (Demo Only)</Button>
        </CardBody>
      </Card>
    </div>
  );
};

export default GigDetailsPage;
