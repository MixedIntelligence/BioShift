import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import api from '../../services/api';
import { Card, CardBody, CardTitle, CardText, Button, Row, Col, Badge, Spinner, Alert, Input, InputGroup, InputGroupText } from 'reactstrap';

const GigsListPage = ({ currentUser }) => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchGigs = (query = '') => {
    setLoading(true);
    const apiCall = query ? api.searchGigs(query) : api.getGigs();
    apiCall
      .then(response => {
        setGigs(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  const handleSearch = () => {
    fetchGigs(searchQuery);
  };

  if (loading) {
    return <Spinner style={{ width: '3rem', height: '3rem' }} />
  }

  if (error) {
    return <Alert color="danger">Error fetching gigs: {error.message}</Alert>
  }

  return (
    <div className="container mt-4">
      <h2>Available Projects & Gigs</h2>
      <Row className="mb-4">
        <Col>
          <InputGroup>
            <Input
              placeholder="Search by keyword..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSearch()}
            />
            <InputGroupText>
              <Button color="primary" onClick={handleSearch}>Search</Button>
            </InputGroupText>
          </InputGroup>
        </Col>
      </Row>
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
}

export default connect(state => ({ currentUser: state.auth.currentUser }))(GigsListPage);
