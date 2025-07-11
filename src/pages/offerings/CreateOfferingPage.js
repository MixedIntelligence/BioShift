import React, { useState } from 'react';
import { Container, Card, CardBody, CardTitle, Form, FormGroup, Label, Input, Button, Alert, Row, Col, Badge, InputGroup, InputGroupText } from 'reactstrap';
import { FaPlus, FaArrowLeft, FaImage, FaLink, FaDollarSign } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';

const initialState = {
  title: '',
  subtitle: '',
  description: '',
  img: '',
  offering_type: 'SERVICE',
  category: '',
  pricing_model: 'FIXED',
  price: 0,
  rating: 0,
  url: '',
};

const CreateOfferingPage = () => {
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const price = form.pricing_model === 'FREE' ? 0 : Number(form.price) || 0;
      const payload = { ...form, price, rating: Number(form.rating) || 0 };
      await api.createOffering(payload);
      setSubmitted(true);
      setError(null);
      setForm(initialState);
      setTimeout(() => {
        history.push('/app/offerings');
      }, 2000);
    } catch (err) {
      setError('Failed to create offering. Please check your inputs and try again.');
      console.error(err);
    } finally {
      setLoading(false);
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

  const previewPrice = form.pricing_model === 'FREE' ? 0 : Number(form.price) || 0;

  return (
    <Container className="mt-4">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <CardTitle tag="h2" className="mb-0">
                  <FaPlus className="me-2" />
                  Create New Offering
                </CardTitle>
                <Button color="outline-secondary" onClick={() => history.push('/app/offerings')}>
                  <FaArrowLeft className="me-1" />
                  Back to Offerings
                </Button>
              </div>

              {submitted && (
                <Alert color="success" className="mb-4">
                  <h4>Success!</h4>
                  <p>Your offering has been created successfully. Redirecting to your offerings...</p>
                </Alert>
              )}

              {error && (
                <Alert color="danger" className="mb-4" dismissible onClose={() => setError(null)}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={8}>
                    <FormGroup>
                      <Label for="title">Title *</Label>
                      <Input name="title" id="title" value={form.title} onChange={handleChange} required placeholder="Enter a clear, descriptive title" />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="offering_type">Type *</Label>
                      <Input type="select" name="offering_type" id="offering_type" value={form.offering_type} onChange={handleChange}>
                        <option value="SERVICE">Service</option>
                        <option value="EQUIPMENT">Equipment</option>
                        <option value="SOFTWARE">Software</option>
                        <option value="COURSE">Course</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label for="subtitle">Subtitle</Label>
                  <Input name="subtitle" id="subtitle" value={form.subtitle} onChange={handleChange} placeholder="Brief tagline or summary" />
                </FormGroup>
                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input type="textarea" name="description" id="description" value={form.description} onChange={handleChange} placeholder="Describe your offering in detail" />
                </FormGroup>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="price">Price</Label>
                      <InputGroup>
                        <InputGroupText><FaDollarSign /></InputGroupText>
                        <Input type="number" name="price" id="price" value={form.price} onChange={handleChange} min="0" step="0.01" disabled={form.pricing_model === 'FREE'} placeholder={form.pricing_model === 'FREE' ? 'Free' : '0.00'} />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="img">Image URL</Label>
                      <InputGroup>
                        <InputGroupText><FaImage /></InputGroupText>
                        <Input name="img" id="img" value={form.img} onChange={handleChange} placeholder="https://... (optional)" />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup>
                  <Label for="url">Website URL</Label>
                  <InputGroup>
                    <InputGroupText><FaLink /></InputGroupText>
                    <Input name="url" id="url" value={form.url} onChange={handleChange} placeholder="https://..." />
                  </InputGroup>
                </FormGroup>
                {/* Preview */}
                <Card color="light" className="mb-4">
                  <CardBody>
                    <h5 className="mb-3">Preview</h5>
                    <div className="offering-preview" style={{ display: 'block', whiteSpace: 'normal' }}>
                      <div className="mb-2">
                        <Badge color={getOfferingTypeColor(form.offering_type)} className="me-2">{form.offering_type}</Badge>
                        {form.category && <Badge color="light">{form.category}</Badge>}
                      </div>
                      <h6 style={{marginBottom: '0.5rem'}}>{form.title || 'Your offering title'}</h6>
                      {form.subtitle && <p className="text-muted mb-2" style={{marginBottom: '0.5rem'}}>{form.subtitle}</p>}
                      <p style={{marginBottom: '0.5rem'}}>{form.description || 'Your offering description will appear here...'}</p>
                      <div className="text-primary" style={{marginBottom: '0.5rem'}}>
                        <strong>
                          {form.pricing_model === 'FREE' ? 'Free' : previewPrice ? `$${previewPrice}${form.pricing_model === 'SUBSCRIPTION' ? '/month' : form.pricing_model === 'PER_USE' ? '/use' : ''}` : ''}
                        </strong>
                      </div>
                      {form.url && <div><a href={form.url} target="_blank" rel="noopener noreferrer">{form.url}</a></div>}
                      {form.img && <div><img src={form.img} alt="Offering" style={{maxWidth: '150px', marginTop: '1rem'}} /></div>}
                    </div>
                  </CardBody>
                </Card>
                <div className="text-center">
                  <Button color="primary" type="submit" size="lg" disabled={loading || submitted}>
                    {loading ? 'Creating...' : 'Create Offering'}
                  </Button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateOfferingPage;
