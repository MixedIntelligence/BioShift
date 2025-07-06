import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
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
  Container,
  Spinner
} from 'reactstrap';

const EditGigPage = ({ currentUser }) => {
  const history = useHistory();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    status: 'open',
    required_skills: '',
    duration: '',
    pay_rate: '',
    requirements: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const response = await api.getGigById(id);
        const gig = response.data;
        
        // Verify the current user owns this gig
        if (gig.user_id !== currentUser.id) {
          setError('You can only edit your own gigs.');
          setLoading(false);
          return;
        }
        
        const gigData = {
          title: gig.title || '',
          description: gig.description || '',
          location: gig.location || '',
          status: gig.status || 'open',
          required_skills: gig.required_skills || '',
          duration: gig.duration || '',
          pay_rate: gig.pay_rate || '',
          requirements: gig.requirements || ''
        };
        
        setFormData(gigData);
        setOriginalData(gigData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching gig:', error);
        setError('Failed to load gig details. Please try again.');
        setLoading(false);
      }
    };

    if (id && currentUser) {
      fetchGig();
    }
  }, [id, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      // Update the gig using the API
      await api.updateGig(id, {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        status: formData.status,
        requiredSkills: formData.required_skills,
        duration: formData.duration,
        payRate: formData.pay_rate,
        requiredCertifications: formData.requirements
      });
      
      setSuccess(true);
      setOriginalData(formData);
      
      setTimeout(() => {
        history.push('/app/my-gigs');
      }, 2000);
      
    } catch (error) {
      console.error('Error updating gig:', error);
      setError('Failed to update gig. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    history.push('/app/gigs/my-gigs');
  };

  const hasChanges = JSON.stringify(formData) !== JSON.stringify(originalData);

  // Only allow Labs to edit gigs
  if (currentUser?.role !== 'Lab') {
    return (
      <Container className="mt-4">
        <Alert color="danger">
          Only Labs can edit gigs. Please contact your administrator.
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner size="lg" />
        <p className="mt-2">Loading gig details...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row>
        <Col md={8} className="mx-auto">
          <Card>
            <CardBody>
              <CardTitle tag="h4">Edit Gig</CardTitle>
              
              {error && (
                <Alert color="danger" className="mb-3">
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert color="success" className="mb-3">
                  Gig updated successfully! Redirecting...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="title">Gig Title *</Label>
                      <Input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        placeholder="Enter gig title"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
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
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label for="description">Description *</Label>
                  <Input
                    type="textarea"
                    name="description"
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    required
                    placeholder="Describe the gig requirements and responsibilities"
                  />
                </FormGroup>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="location">Location</Label>
                      <Input
                        type="text"
                        name="location"
                        id="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., San Francisco, CA or Remote"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="duration">Duration</Label>
                      <Input
                        type="text"
                        name="duration"
                        id="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        placeholder="e.g., 2 weeks, 3 months"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="pay_rate">Pay Rate</Label>
                      <Input
                        type="text"
                        name="pay_rate"
                        id="pay_rate"
                        value={formData.pay_rate}
                        onChange={handleChange}
                        placeholder="e.g., $50/hour, $5000/project"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={6}>
                    <FormGroup>
                      <Label for="required_skills">Required Skills</Label>
                      <Input
                        type="text"
                        name="required_skills"
                        id="required_skills"
                        value={formData.required_skills}
                        onChange={handleChange}
                        placeholder="e.g., PCR, Cell Culture, Python"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <FormGroup>
                  <Label for="requirements">Additional Requirements</Label>
                  <Input
                    type="textarea"
                    name="requirements"
                    id="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any specific requirements or qualifications"
                  />
                </FormGroup>

                <div className="d-flex justify-content-between">
                  <Button 
                    type="button" 
                    color="secondary" 
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    color="primary" 
                    disabled={saving || !hasChanges}
                  >
                    {saving ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Updating...
                      </>
                    ) : (
                      'Update Gig'
                    )}
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

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser
});

export default connect(mapStateToProps)(EditGigPage);
