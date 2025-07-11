import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, CardBody, CardTitle, Alert, Button, 
  Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input,
  Badge, Table
} from 'reactstrap';
import { connect } from 'react-redux';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import OfferingCard from './components/OfferingCard';

const ManageOfferings = ({ currentUser }) => {
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [currentOffering, setCurrentOffering] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const history = useHistory();

  const initialOfferingState = {
    title: '',
    subtitle: '',
    description: '',
    img: '',
    offering_type: 'SERVICE',
    category: '',
    pricing_model: 'FIXED',
    price: '',
    rating: '',
    url: '',
  };

  const [formData, setFormData] = useState(initialOfferingState);

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      setLoading(true);
      const response = await api.getMyOfferings();
      setOfferings(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch your offerings. Please try again.');
      console.error('Error fetching offerings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (offering) => {
    setCurrentOffering(offering);
    setFormData({
      title: offering.title || '',
      subtitle: offering.subtitle || '',
      description: offering.description || '',
      img: offering.img || '',
      offering_type: offering.offering_type || 'SERVICE',
      category: offering.category || '',
      pricing_model: offering.pricing_model || 'FIXED',
      price: offering.price || '',
      rating: offering.rating || '',
      url: offering.url || '',
    });
    setEditModal(true);
  };

  const handleDelete = (offeringId) => {
    setCurrentOffering(offerings.find(o => o.id === offeringId));
    setDeleteModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await api.updateOffering(currentOffering.id, formData);
      setSuccess('Offering updated successfully!');
      setEditModal(false);
      setCurrentOffering(null);
      setFormData(initialOfferingState);
      fetchOfferings();
    } catch (err) {
      setError('Failed to update offering. Please try again.');
      console.error('Error updating offering:', err);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.deleteOffering(currentOffering.id);
      setSuccess('Offering deleted successfully!');
      setDeleteModal(false);
      setCurrentOffering(null);
      fetchOfferings();
    } catch (err) {
      setError('Failed to delete offering. Please try again.');
      console.error('Error deleting offering:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleViewDetails = (offering) => {
    if (offering && typeof offering.id === 'number' && offering.id > 0) {
      history.push(`/app/offerings/${offering.id}`);
    } else {
      setError('Invalid offering ID. Cannot view details.');
    }
  };

  const getOfferingTypeColor = (type) => {
    switch (type) {
      case 'SERVICE': return 'primary';
      case 'EQUIPMENT': return 'success';
      case 'SOFTWARE': return 'info';
      case 'COURSE': return 'warning';
      default: return 'secondary';
    }
  };

  const getPricingModelText = (model, price) => {
    switch (model) {
      case 'FREE': return 'Free';
      case 'FIXED': return price ? `$${price}` : 'Price on request';
      case 'SUBSCRIPTION': return price ? `$${price}/month` : 'Subscription';
      case 'PER_USE': return price ? `$${price}/use` : 'Pay per use';
      default: return 'Contact for pricing';
    }
  };

  // Check if user has access
  if (!currentUser || currentUser.role !== 'Provider') {
    return (
      <Container className="mt-4">
        <Alert color="warning">
          <h4>Access Restricted</h4>
          <p>Only Provider accounts can manage offerings. Please contact your administrator if you believe this is an error.</p>
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
                  My Offerings
                </CardTitle>
                <div>
                  <Button 
                    color="outline-secondary" 
                    className="me-2"
                    onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
                  >
                    {viewMode === 'cards' ? 'Table View' : 'Card View'}
                  </Button>
                  <Button 
                    color="primary" 
                    onClick={() => history.push('/app/offerings/create')}
                  >
                    <FaPlus className="me-1" />
                    Add New Offering
                  </Button>
                </div>
              </div>

              {error && (
                <Alert color="danger" className="mb-4" dismissible onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert color="success" className="mb-4" dismissible onClose={() => setSuccess(null)}>
                  {success}
                </Alert>
              )}

              {/* Content */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : offerings.length > 0 ? (
                <>
                  {viewMode === 'cards' ? (
                    <Row>
                      {offerings.map(offering => (
                        <Col key={offering.id} lg={4} md={6} className="mb-4">
                          <OfferingCard 
                            offering={offering} 
                            isProvider={true}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                          />
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Type</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {offerings.map(offering => (
                          <tr key={offering.id}>
                            <td>
                              <strong>{offering.title}</strong>
                              {offering.subtitle && <br />}
                              <small className="text-muted">{offering.subtitle}</small>
                            </td>
                            <td>
                              <Badge color={getOfferingTypeColor(offering.offering_type)}>
                                {offering.offering_type}
                              </Badge>
                            </td>
                            <td>{offering.category || '-'}</td>
                            <td>{getPricingModelText(offering.pricing_model, offering.price)}</td>
                            <td>{new Date(offering.created_at).toLocaleDateString()}</td>
                            <td>
                              <Button 
                                color="outline-info" 
                                size="sm" 
                                className="me-1"
                                onClick={() => handleViewDetails(offering)}
                              >
                                <FaEye />
                              </Button>
                              <Button 
                                color="outline-secondary" 
                                size="sm" 
                                className="me-1"
                                onClick={() => handleEdit(offering)}
                              >
                                <FaEdit />
                              </Button>
                              <Button 
                                color="outline-danger" 
                                size="sm"
                                onClick={() => handleDelete(offering.id)}
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </>
              ) : (
                <Alert color="info" className="text-center">
                  <h4>No offerings yet</h4>
                  <p>Start by creating your first offering to showcase your services, equipment, or courses.</p>
                  <Button 
                    color="primary" 
                    onClick={() => history.push('/app/offerings/create')}
                  >
                    <FaPlus className="me-1" />
                    Create Your First Offering
                  </Button>
                </Alert>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Edit Modal */}
      <Modal isOpen={editModal} toggle={() => setEditModal(false)} size="lg">
        <ModalHeader toggle={() => setEditModal(false)}>
          Edit Offering
        </ModalHeader>
        <Form onSubmit={handleSaveEdit}>
          <ModalBody>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="title">Title *</Label>
                  <Input
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="subtitle">Subtitle</Label>
                  <Input
                    name="subtitle"
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </FormGroup>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="offering_type">Type *</Label>
                  <Input
                    type="select"
                    name="offering_type"
                    id="offering_type"
                    value={formData.offering_type}
                    onChange={handleInputChange}
                  >
                    <option value="SERVICE">Service</option>
                    <option value="EQUIPMENT">Equipment</option>
                    <option value="SOFTWARE">Software</option>
                    <option value="COURSE">Course</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="category">Category</Label>
                  <Input
                    name="category"
                    id="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="pricing_model">Pricing Model *</Label>
                  <Input
                    type="select"
                    name="pricing_model"
                    id="pricing_model"
                    value={formData.pricing_model}
                    onChange={handleInputChange}
                  >
                    <option value="FIXED">Fixed Price</option>
                    <option value="SUBSCRIPTION">Subscription</option>
                    <option value="PER_USE">Pay Per Use</option>
                    <option value="FREE">Free</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="price">Price</Label>
                  <Input
                    type="number"
                    name="price"
                    id="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="img">Image URL</Label>
                  <Input
                    name="img"
                    id="img"
                    value={formData.img}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="url">Website URL</Label>
                  <Input
                    name="url"
                    id="url"
                    value={formData.url}
                    onChange={handleInputChange}
                  />
                </FormGroup>
              </Col>
            </Row>
          </ModalBody>
          <ModalFooter>
            <Button type="submit" color="primary">
              Save Changes
            </Button>
            <Button color="secondary" onClick={() => setEditModal(false)}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal isOpen={deleteModal} toggle={() => setDeleteModal(false)}>
        <ModalHeader toggle={() => setDeleteModal(false)}>
          Confirm Delete
        </ModalHeader>
        <ModalBody>
          Are you sure you want to delete "{currentOffering?.title}"? This action cannot be undone.
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDelete}>
            Delete
          </Button>
          <Button color="secondary" onClick={() => setDeleteModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(ManageOfferings);
