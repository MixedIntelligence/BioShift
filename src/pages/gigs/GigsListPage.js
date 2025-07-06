import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { 
  Card, 
  CardBody, 
  CardTitle, 
  CardText, 
  Button, 
  Row, 
  Col, 
  Badge, 
  Spinner, 
  Alert, 
  Input, 
  InputGroup, 
  InputGroupText,
  FormGroup,
  Label,
  Collapse,
  UncontrolledTooltip
} from 'reactstrap';

const GigsListPage = ({ currentUser }) => {
  const [gigs, setGigs] = useState([]);
  const [filteredGigs, setFilteredGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    location: '',
    minPayRate: '',
    maxPayRate: '',
    duration: '',
    skills: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchGigs = (query = '') => {
    setLoading(true);
    const apiCall = query ? api.searchGigs(query) : api.getGigs();
    apiCall
      .then(response => {
        setGigs(response.data);
        setFilteredGigs(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  };

  const applyFilters = () => {
    let filtered = gigs;

    // Apply search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(gig => 
        gig.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        gig.required_skills?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(gig => gig.status === filters.status);
    }

    // Apply location filter
    if (filters.location.trim()) {
      filtered = filtered.filter(gig => 
        gig.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply skills filter
    if (filters.skills.trim()) {
      filtered = filtered.filter(gig => 
        gig.required_skills?.toLowerCase().includes(filters.skills.toLowerCase())
      );
    }

    // Apply duration filter
    if (filters.duration.trim()) {
      filtered = filtered.filter(gig => 
        gig.duration?.toLowerCase().includes(filters.duration.toLowerCase())
      );
    }

    // Apply pay rate filters (basic string matching for now)
    if (filters.minPayRate.trim() || filters.maxPayRate.trim()) {
      filtered = filtered.filter(gig => {
        if (!gig.pay_rate) return false;
        const payRateText = gig.pay_rate.toLowerCase();
        
        // Basic filtering - could be enhanced with proper number parsing
        if (filters.minPayRate.trim() && !payRateText.includes(filters.minPayRate.toLowerCase())) {
          return false;
        }
        if (filters.maxPayRate.trim() && !payRateText.includes(filters.maxPayRate.toLowerCase())) {
          return false;
        }
        return true;
      });
    }

    setFilteredGigs(filtered);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      location: '',
      minPayRate: '',
      maxPayRate: '',
      duration: '',
      skills: ''
    });
    setSearchQuery('');
    setFilteredGigs(gigs);
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, gigs]);

  const handleSearch = () => {
    applyFilters();
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
      {/* Search and Filters */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <CardBody className="pb-2">
              {/* Main Search */}
              <Row className="mb-3">
                <Col md={8}>
                  <InputGroup>
                    <Input
                      placeholder="Search by keyword, title, or skills..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && handleSearch()}
                    />
                    <Button color="primary" onClick={handleSearch}>
                      <i className="fa fa-search me-1"></i>Search
                    </Button>
                  </InputGroup>
                </Col>
                <Col md={4}>
                  <div className="d-flex gap-2">
                    <Button 
                      color="outline-secondary" 
                      onClick={() => setShowFilters(!showFilters)}
                      id="filterToggle"
                    >
                      <i className="fa fa-filter me-1"></i>
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                    <UncontrolledTooltip target="filterToggle">
                      Toggle advanced filtering options
                    </UncontrolledTooltip>
                    <Button color="outline-danger" onClick={clearFilters} size="sm">
                      Clear
                    </Button>
                  </div>
                </Col>
              </Row>

              {/* Advanced Filters */}
              <Collapse isOpen={showFilters}>
                <hr className="my-3" />
                <Row>
                  <Col md={3}>
                    <FormGroup>
                      <Label for="statusFilter" className="form-label-sm">Status</Label>
                      <Input
                        type="select"
                        id="statusFilter"
                        value={filters.status}
                        onChange={e => handleFilterChange('status', e.target.value)}
                        size="sm"
                      >
                        <option value="">All Statuses</option>
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="closed">Closed</option>
                      </Input>
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for="locationFilter" className="form-label-sm">Location</Label>
                      <Input
                        type="text"
                        id="locationFilter"
                        placeholder="e.g., San Francisco, Remote"
                        value={filters.location}
                        onChange={e => handleFilterChange('location', e.target.value)}
                        size="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for="skillsFilter" className="form-label-sm">Required Skills</Label>
                      <Input
                        type="text"
                        id="skillsFilter"
                        placeholder="e.g., PCR, Python, Cell Culture"
                        value={filters.skills}
                        onChange={e => handleFilterChange('skills', e.target.value)}
                        size="sm"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={3}>
                    <FormGroup>
                      <Label for="durationFilter" className="form-label-sm">Duration</Label>
                      <Input
                        type="text"
                        id="durationFilter"
                        placeholder="e.g., 2 weeks, 3 months"
                        value={filters.duration}
                        onChange={e => handleFilterChange('duration', e.target.value)}
                        size="sm"
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mb-2">
                  <Col md={6}>
                    <FormGroup>
                      <Label className="form-label-sm">Pay Rate Contains</Label>
                      <Row>
                        <Col>
                          <Input
                            type="text"
                            placeholder="Min (e.g., $50)"
                            value={filters.minPayRate}
                            onChange={e => handleFilterChange('minPayRate', e.target.value)}
                            size="sm"
                          />
                        </Col>
                        <Col>
                          <Input
                            type="text"
                            placeholder="Max (e.g., $100)"
                            value={filters.maxPayRate}
                            onChange={e => handleFilterChange('maxPayRate', e.target.value)}
                            size="sm"
                          />
                        </Col>
                      </Row>
                    </FormGroup>
                  </Col>
                  <Col md={6} className="d-flex align-items-end">
                    <div className="text-muted small">
                      <i className="fa fa-info-circle me-1"></i>
                      Showing {filteredGigs.length} of {gigs.length} gigs
                    </div>
                  </Col>
                </Row>
              </Collapse>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row>
        {filteredGigs.length === 0 ? (
          <Col>
            <Alert color="info" className="text-center">
              <h5>No gigs found</h5>
              <p className="mb-0">
                {gigs.length === 0 
                  ? "No gigs are currently available." 
                  : "Try adjusting your search criteria or filters."
                }
              </p>
            </Alert>
          </Col>
        ) : (
          filteredGigs.map(gig => (
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
        ))
        )}
      </Row>
    </div>
  );
}

export default connect(state => ({ currentUser: state.auth.currentUser }))(GigsListPage);
