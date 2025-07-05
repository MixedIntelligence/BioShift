import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
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
      <Row className="mb-4">
        <Col>
          <h2>Available Projects & Gigs</h2>
        </Col>
        {currentUser?.role === 'Lab' && (
          <Col xs="auto">
            <Button color="success" tag={Link} to="/app/post-gig">
              Create New Gig
            </Button>
          </Col>
        )}
      </Row>
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
                <CardTitle tag="h5">
                  {gig.title} 
                  <Badge color={gig.status === 'closed' ? 'secondary' : gig.status === 'in_progress' ? 'warning' : 'success'} className="ms-2">
                    {gig.status || 'open'}
                  </Badge>
                </CardTitle>
                <CardText>{gig.description}</CardText>
                <CardText>
                  <strong>Location:</strong> {gig.location || 'Not specified'}<br/>
                  <strong>Posted:</strong> {new Date(gig.created_at).toLocaleDateString()}<br/>
                  <strong>Gig ID:</strong> #{gig.id}
                </CardText>
                <div className="d-flex gap-2">
                  <Button color="primary" tag={Link} to={`/app/gigs/${gig.id}`}>
                    View Details
                  </Button>
                  {currentUser?.role === 'Worker' && (
                    <Button color="success" size="sm">
                      Apply Now
                    </Button>
                  )}
                  {currentUser?.role === 'Lab' && (
                    <Button color="info" size="sm" tag={Link} to={`/app/gigs/${gig.id}/applicants`}>
                      View Applicants
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default connect(state => ({ currentUser: state.auth.currentUser }))(GigsListPage);
