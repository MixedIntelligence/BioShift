import React from 'react';
import { Button, Card, CardBody, CardTitle, CardText, Badge } from 'reactstrap';

export default function GigDemoProfessional() {
  return (
    <div className="container mt-4">
      <h2>Find Gigs (Demo)</h2>
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h4">Protein Purification Analysis <Badge color="success">Open</Badge></CardTitle>
          <CardText>
            <b>Description:</b> Analyze and purify protein samples for oncology research.<br/>
            <b>Required Skills:</b> Chromatography, Protein Purification<br/>
            <b>Certifications:</b> GLP
          </CardText>
          <Button color="primary">Apply</Button>{' '}
          <Button color="secondary">Message Lab</Button>
        </CardBody>
      </Card>
      <Card className="mb-4">
        <CardBody>
          <CardTitle tag="h5">Application Status</CardTitle>
          <CardText>
            <b>Status:</b> Pending Review<br/>
            <b>Lab:</b> Innovate Bio
          </CardText>
          <Button color="success" disabled>Awaiting Award</Button>
        </CardBody>
      </Card>
    </div>
  );
}
