import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Button,
  Progress,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from 'reactstrap';
import { toast } from 'react-toastify';
import Widget from '../../components/Widget';
import api from '../../services/api';

const Onboarding = ({ currentUser, history }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    // Basic info
    firstName: '',
    lastName: '',
    headline: '',
    bio: '',
    location: '',
    
    // Skills
    skills: [],
    newSkill: '',
    
    // Education
    education: [],
    currentEducation: {
      institution: '',
      degree: '',
      field_of_study: '',
      start_year: '',
      end_year: ''
    },
    
    // Company info (for Providers)
    companyDescription: '',
    services: [],
    
    // Lab info (for Labs)
    labDescription: '',
    capabilities: [],
  });

  const totalSteps = currentUser?.role === 'Provider' ? 4 : 
                   currentUser?.role === 'Lab' ? 4 : 3; // Worker has 3 steps

  useEffect(() => {
    // Check if user has already completed onboarding
    const checkOnboardingStatus = async () => {
      try {
        // TODO: Check if user profile is complete
        // For now, we'll assume they need onboarding
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      }
    };
    
    if (currentUser) {
      checkOnboardingStatus();
    }
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEducationChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      currentEducation: {
        ...prev.currentEducation,
        [field]: value
      }
    }));
  };

  const addSkill = () => {
    if (profileData.newSkill.trim()) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill.trim()],
        newSkill: ''
      }));
    }
  };

  const removeSkill = (index) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addEducation = () => {
    const { currentEducation } = profileData;
    if (currentEducation.institution && currentEducation.degree) {
      setProfileData(prev => ({
        ...prev,
        education: [...prev.education, currentEducation],
        currentEducation: {
          institution: '',
          degree: '',
          field_of_study: '',
          start_year: '',
          end_year: ''
        }
      }));
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      // Save all profile data
      await saveProfileData();
      toast.success('Welcome to LabLeap! Your profile has been completed.');
      history.push('/app/profile');
    } catch (error) {
      toast.error('Error completing profile. Please try again.');
      console.error('Error completing onboarding:', error);
    }
  };

  const saveProfileData = async () => {
    // Save skills
    for (const skill of profileData.skills) {
      await api.addSkill({ skill });
    }

    // Save education
    for (const edu of profileData.education) {
      await api.addEducation(edu);
    }

    // TODO: Save other profile data via API
  };

  const renderBasicInfoStep = () => (
    <Card>
      <CardHeader>
        <h4>Let's get to know you</h4>
        <p className="text-muted">Tell us about yourself</p>
      </CardHeader>
      <CardBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>First Name *</Label>
                <Input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Last Name *</Label>
                <Input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label>Professional Headline</Label>
            <Input
              type="text"
              value={profileData.headline}
              onChange={(e) => handleInputChange('headline', e.target.value)}
              placeholder="e.g., Molecular Biologist | Research Scientist | Biotech Enthusiast"
            />
          </FormGroup>
          <FormGroup>
            <Label>Location</Label>
            <Input
              type="text"
              value={profileData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, State/Country"
            />
          </FormGroup>
          <FormGroup>
            <Label>Bio</Label>
            <Input
              type="textarea"
              rows="4"
              value={profileData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Tell us about your background, interests, and goals..."
            />
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );

  const renderSkillsStep = () => (
    <Card>
      <CardHeader>
        <h4>Your Skills & Expertise</h4>
        <p className="text-muted">Add your technical skills, certifications, and areas of expertise</p>
      </CardHeader>
      <CardBody>
        <Form>
          <FormGroup>
            <Label>Add Skills</Label>
            <div className="d-flex">
              <Input
                type="text"
                value={profileData.newSkill}
                onChange={(e) => handleInputChange('newSkill', e.target.value)}
                placeholder="e.g., PCR, Cell Culture, HPLC, Python"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <Button color="primary" className="ms-2" onClick={addSkill}>
                Add
              </Button>
            </div>
          </FormGroup>
          
          {profileData.skills.length > 0 && (
            <div>
              <Label>Your Skills:</Label>
              <div className="mt-2">
                {profileData.skills.map((skill, index) => (
                  <span key={index} className="badge bg-primary me-2 mb-2 p-2">
                    {skill}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-2"
                      onClick={() => removeSkill(index)}
                    ></button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </Form>
      </CardBody>
    </Card>
  );

  const renderEducationStep = () => (
    <Card>
      <CardHeader>
        <h4>Education & Background</h4>
        <p className="text-muted">Share your educational background</p>
      </CardHeader>
      <CardBody>
        <Form>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Institution</Label>
                <Input
                  type="text"
                  value={profileData.currentEducation.institution}
                  onChange={(e) => handleEducationChange('institution', e.target.value)}
                  placeholder="University or Institution"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Degree</Label>
                <Input
                  type="text"
                  value={profileData.currentEducation.degree}
                  onChange={(e) => handleEducationChange('degree', e.target.value)}
                  placeholder="B.S., M.S., Ph.D., etc."
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label>Field of Study</Label>
            <Input
              type="text"
              value={profileData.currentEducation.field_of_study}
              onChange={(e) => handleEducationChange('field_of_study', e.target.value)}
              placeholder="e.g., Biochemistry, Molecular Biology, Biotechnology"
            />
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Start Year</Label>
                <Input
                  type="number"
                  value={profileData.currentEducation.start_year}
                  onChange={(e) => handleEducationChange('start_year', e.target.value)}
                  placeholder="2020"
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>End Year (or expected)</Label>
                <Input
                  type="number"
                  value={profileData.currentEducation.end_year}
                  onChange={(e) => handleEducationChange('end_year', e.target.value)}
                  placeholder="2024"
                />
              </FormGroup>
            </Col>
          </Row>
          <Button color="secondary" onClick={addEducation} className="mb-3">
            Add Education
          </Button>

          {profileData.education.length > 0 && (
            <div>
              <Label>Education Added:</Label>
              {profileData.education.map((edu, index) => (
                <div key={index} className="card mt-2 p-3">
                  <strong>{edu.degree} in {edu.field_of_study}</strong>
                  <span className="text-muted">{edu.institution} ({edu.start_year} - {edu.end_year})</span>
                </div>
              ))}
            </div>
          )}
        </Form>
      </CardBody>
    </Card>
  );

  const renderRoleSpecificStep = () => {
    if (currentUser?.role === 'Provider') {
      return (
        <Card>
          <CardHeader>
            <h4>Company Information</h4>
            <p className="text-muted">Tell us about your company and services</p>
          </CardHeader>
          <CardBody>
            <Form>
              <FormGroup>
                <Label>Company Description</Label>
                <Input
                  type="textarea"
                  rows="4"
                  value={profileData.companyDescription}
                  onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                  placeholder="Describe your company, what you do, and how you serve the biotech industry..."
                />
              </FormGroup>
              <FormGroup>
                <Label>Services Offered</Label>
                <Input
                  type="textarea"
                  rows="3"
                  value={profileData.services}
                  onChange={(e) => handleInputChange('services', e.target.value)}
                  placeholder="List the services you provide (e.g., Contract Research, Equipment Rental, Consulting)"
                />
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      );
    } else if (currentUser?.role === 'Lab') {
      return (
        <Card>
          <CardHeader>
            <h4>Lab Information</h4>
            <p className="text-muted">Tell us about your lab and capabilities</p>
          </CardHeader>
          <CardBody>
            <Form>
              <FormGroup>
                <Label>Lab Description</Label>
                <Input
                  type="textarea"
                  rows="4"
                  value={profileData.labDescription}
                  onChange={(e) => handleInputChange('labDescription', e.target.value)}
                  placeholder="Describe your lab, research focus, and the type of work you do..."
                />
              </FormGroup>
              <FormGroup>
                <Label>Lab Capabilities & Equipment</Label>
                <Input
                  type="textarea"
                  rows="3"
                  value={profileData.capabilities}
                  onChange={(e) => handleInputChange('capabilities', e.target.value)}
                  placeholder="List your lab's capabilities, equipment, and techniques available"
                />
              </FormGroup>
            </Form>
          </CardBody>
        </Card>
      );
    }
    return null;
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="onboarding-container">
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            <Widget className="mb-4">
              <div className="text-center mb-4">
                <h2>Welcome to LabLeap, {currentUser.email}!</h2>
                <p className="text-muted">Let's complete your profile to get started</p>
                <Progress value={(currentStep / totalSteps) * 100} className="mb-3" />
                <p>Step {currentStep} of {totalSteps}</p>
              </div>
            </Widget>

            {currentStep === 1 && renderBasicInfoStep()}
            {currentStep === 2 && renderSkillsStep()}
            {currentStep === 3 && renderEducationStep()}
            {currentStep === 4 && renderRoleSpecificStep()}

            <div className="d-flex justify-content-between mt-4">
              <Button 
                color="secondary" 
                onClick={prevStep} 
                disabled={currentStep === 1}
              >
                Previous
              </Button>
              
              {currentStep < totalSteps ? (
                <Button color="primary" onClick={nextStep}>
                  Next
                </Button>
              ) : (
                <Button color="success" onClick={completeOnboarding}>
                  Complete Profile
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser
});

export default withRouter(connect(mapStateToProps)(Onboarding));
