import React, { useState } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import api from '../../services/api';
import { 
  Card, 
  CardBody, 
  CardTitle, 
  Form, 
  FormGroup, 
  Label, 
  Input, 
  Button, 
  Alert, 
  Row, 
  Col,
  Container
} from 'reactstrap';

const CreateGigPage = ({ currentUser }) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    status: 'open'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Only allow Labs to create gigs
  if (currentUser?.role !== 'lab') {
    return (
      <Container className="mt-4">
        <Alert color="danger">
          Only Labs can create gigs. Please contact your administrator.
        </Alert>
      </Container>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.createGig(formData);
      setSuccess(true);
      setTimeout(() => {
        history.push(`/app/gigs/${response.data.id}`);
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <CardBody>
              <CardTitle tag="h3" className="text-center mb-4">
                Create New Gig
              </CardTitle>
              
              {error && <Alert color="danger">{error}</Alert>}
              {success && <Alert color="success">Gig created successfully! Redirecting...</Alert>}

              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Label for="title">Title *</Label>
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    placeholder="Enter gig title"
                    maxLength={100}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="description">Description</Label>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe the gig requirements, responsibilities, and expectations"
                    maxLength={1000}
                    rows={4}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="location">Location</Label>
                  <Input
                    type="text"
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Boston, MA or Remote"
                    maxLength={100}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="status">Status</Label>
                  <Input
                    type="select"
                    name="status"
                    id="status"
                    value={formData.status}
                    onChange={handleChange}
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="in_progress">In Progress</option>
                  </Input>
                </FormGroup>

                <div className="d-grid gap-2">
                  <Button 
                    type="submit" 
                    color="primary" 
                    disabled={loading || !formData.title.trim()}
                  >
                    {loading ? 'Creating...' : 'Create Gig'}
                  </Button>
                  <Button 
                    type="button" 
                    color="secondary" 
                    onClick={() => history.push('/app/gigs')}
                  >
                    Cancel
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

export default connect(state => ({ currentUser: state.auth.currentUser }))(CreateGigPage);
