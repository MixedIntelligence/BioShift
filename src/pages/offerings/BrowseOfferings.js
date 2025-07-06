import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Alert, Button, Input, InputGroup, InputGroupText } from 'reactstrap';
import { connect } from 'react-redux';
import { FaSearch, FaFilter } from 'react-icons/fa';
import api from '../../services/api';
import OfferingCard from './components/OfferingCard';

const BrowseOfferings = ({ currentUser }) => {
  const [offerings, setOfferings] = useState([]);
  const [filteredOfferings, setFilteredOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedPricingModel, setSelectedPricingModel] = useState('');

  useEffect(() => {
    fetchOfferings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [offerings, searchTerm, selectedCategory, selectedType, selectedPricingModel]);

  const fetchOfferings = async () => {
    try {
      setLoading(true);
      const response = await api.getOfferings();
      setOfferings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch offerings. Please try again.');
      console.error('Error fetching offerings:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = offerings;

    if (searchTerm) {
      filtered = filtered.filter(offering => 
        offering.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offering.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offering.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(offering => offering.category === selectedCategory);
    }

    if (selectedType) {
      filtered = filtered.filter(offering => offering.offering_type === selectedType);
    }

    if (selectedPricingModel) {
      filtered = filtered.filter(offering => offering.pricing_model === selectedPricingModel);
    }

    setFilteredOfferings(filtered);
  };

  const getUniqueValues = (field) => {
    return [...new Set(offerings.map(offering => offering[field]).filter(Boolean))];
  };

  // Check if user has access
  if (!currentUser || !['Lab', 'Worker'].includes(currentUser.role)) {
    return (
      <Container className="mt-4">
        <Alert color="warning">
          <h4>Access Restricted</h4>
          <p>Only Lab and Worker accounts can browse offerings. Please contact your administrator if you believe this is an error.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-4">
      <Row>
        <Col>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <CardTitle tag="h2" className="mb-0">
                  <FaSearch className="me-2" />
                  Browse Offerings
                </CardTitle>
                <Button color="primary" onClick={fetchOfferings} disabled={loading}>
                  {loading ? 'Loading...' : 'Refresh'}
                </Button>
              </div>

              {error && (
                <Alert color="danger" className="mb-4">
                  {error}
                </Alert>
              )}

              {/* Search and Filters */}
              <Row className="mb-4">
                <Col md={6}>
                  <InputGroup>
                    <InputGroupText>
                      <FaSearch />
                    </InputGroupText>
                    <Input
                      type="text"
                      placeholder="Search offerings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Input
                    type="select"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">All Types</option>
                    <option value="SERVICE">Service</option>
                    <option value="EQUIPMENT">Equipment</option>
                    <option value="SOFTWARE">Software</option>
                    <option value="COURSE">Course</option>
                  </Input>
                </Col>
                <Col md={2}>
                  <Input
                    type="select"
                    value={selectedPricingModel}
                    onChange={(e) => setSelectedPricingModel(e.target.value)}
                  >
                    <option value="">All Pricing</option>
                    <option value="FREE">Free</option>
                    <option value="FIXED">Fixed Price</option>
                    <option value="SUBSCRIPTION">Subscription</option>
                    <option value="PER_USE">Pay Per Use</option>
                  </Input>
                </Col>
                <Col md={2}>
                  <Input
                    type="select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {getUniqueValues('category').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </Input>
                </Col>
              </Row>

              {/* Results */}
              <Row>
                {loading ? (
                  <Col>
                    <div className="text-center py-5">
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </Col>
                ) : filteredOfferings.length > 0 ? (
                  filteredOfferings.map(offering => (
                    <Col key={offering.id} lg={4} md={6} className="mb-4">
                      <OfferingCard offering={offering} isProvider={false} />
                    </Col>
                  ))
                ) : (
                  <Col>
                    <Alert color="info" className="text-center">
                      <h4>No offerings found</h4>
                      <p>Try adjusting your search criteria or check back later for new offerings.</p>
                    </Alert>
                  </Col>
                )}
              </Row>

              {/* Summary */}
              {!loading && filteredOfferings.length > 0 && (
                <Row className="mt-4">
                  <Col>
                    <Card color="light">
                      <CardBody className="text-center">
                        <small className="text-muted">
                          Showing {filteredOfferings.length} of {offerings.length} offerings
                        </small>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(BrowseOfferings);
