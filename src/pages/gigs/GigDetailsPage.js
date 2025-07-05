import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import api from '../../services/api';
import { Card, CardBody, CardTitle, CardText, Button, Row, Col, Badge, Alert, Nav, NavItem, NavLink, TabContent, TabPane, Progress, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';


const GigDetailsPage = ({ currentUser }) => {
  const { id } = useParams();
  const history = useHistory();
  const [gig, setGig] = useState(null);
  const role = currentUser?.role;
  const [applied, setApplied] = useState(false);
  const [messageSent, setMessageSent] = useState(false);
  const [showCredentialUpload, setShowCredentialUpload] = useState(false);
  const [credentialUploaded, setCredentialUploaded] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentReleased, setPaymentReleased] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantsError, setApplicantsError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const isLab = role === 'Lab';

  const handleApplicationStatusUpdate = (applicationId, status) => {
    setApplicants(prevApplicants =>
      prevApplicants.map(app =>
        app.id === applicationId ? { ...app, status } : app
      )
    );
  };

  const handleAccept = (applicationId) => {
    api.acceptApplication(applicationId)
      .then(response => {
        handleApplicationStatusUpdate(applicationId, response.data.status);
      })
      .catch(error => {
        console.error("Error accepting application:", error);
        // Optionally, show an error message to the user
      });
  };

  const handleReject = (applicationId) => {
    api.rejectApplication(applicationId)
      .then(response => {
        handleApplicationStatusUpdate(applicationId, response.data.status);
      })
      .catch(error => {
        console.error("Error rejecting application:", error);
        // Optionally, show an error message to the user
      });
  };

  useEffect(() => {
    setLoading(true);
    api.getGigById(id)
      .then(response => {
        setGig(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching gig details:", error);
        setError(error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (activeTab === '2' && isLab && gig) {
      setLoadingApplicants(true);
      api.getGigApplications(gig.id)
        .then(response => {
          setApplicants(response.data);
          setLoadingApplicants(false);
        })
        .catch(error => {
          setApplicantsError(error);
          setLoadingApplicants(false);
        });
    }
  }, [activeTab, isLab, gig]);

  // Helper: Render Lab Profile Card
  const LabProfileCard = ({ labProfile }) => (
    <Card className="mb-3">
      <CardBody>
        {labProfile ? (
          <Row>
            <Col xs="3">
              <img src={labProfile.logo} alt="Lab Logo" className="img-fluid rounded-circle" style={{ width: 64, height: 64 }} />
            </Col>
            <Col xs="9">
              <CardTitle tag="h5">{labProfile.name} {labProfile.verified && <Badge color="primary">Verified</Badge>}</CardTitle>
              <CardText>
                <b>Rating:</b> {labProfile.rating} / 5<br/>
                <b>Industry:</b> {labProfile.industry}<br/>
                <b>About:</b> {labProfile.about}<br/>
                <a href={labProfile.website} target="_blank" rel="noopener noreferrer">Website</a>
              </CardText>
            </Col>
          </Row>
        ) : (
          <p>Lab profile not available.</p>
        )}
      </CardBody>
    </Card>
  );

  // Helper: Render FAQ
  const FAQSection = ({ faq }) => (
    <Card className="mb-3">
      <CardBody>
        <CardTitle tag="h5">FAQ & Expectations</CardTitle>
        {faq && faq.length > 0 ? (
          faq.map((item, idx) => (
            <div key={idx} className="mb-2">
              <b>Q:</b> {item.q}<br/>
              <b>A:</b> {item.a}
            </div>
          ))
        ) : (
          <p>No FAQ available.</p>
        )}
      </CardBody>
    </Card>
  );

  // Worker view - can apply to gigs
  const isWorker = role === 'Worker';

  if (loading) {
    return <div className="container mt-4"><h4>Loading gig...</h4></div>;
  }

  if (error) {
    return <div className="container mt-4"><Alert color="danger">Error loading gig details.</Alert></div>;
  }

  if (!gig) {
    return <div className="container mt-4"><h4>Gig not found.</h4></div>;
  }

  return (
    <div className="container mt-4">
      <Button color="link" onClick={() => history.goBack()}>&larr; Back to Gigs</Button>
      <Card className="mb-4">
        <CardBody>
          <Row>
            <Col md="8">
              <CardTitle tag="h3">{gig?.title} <Badge color="success">{gig?.status || 'Open'}</Badge> {gig?.urgent && <Badge color="danger">Urgent</Badge>} {gig?.remote && <Badge color="info">Remote</Badge>}</CardTitle>
              <CardText><strong>Compensation:</strong> {gig?.pay_rate} <span className="ms-3"><strong>Duration:</strong> {gig?.duration}</span></CardText>
              <Progress value={gig?.status === 'Open' ? 33 : gig?.status === 'In Progress' ? 66 : 100} className="mb-2" />
              <Nav tabs>
                <NavItem>
                  <NavLink className={classnames({ active: activeTab === '1' })} onClick={() => setActiveTab('1')}>Details</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={classnames({ active: activeTab === '2' })} onClick={() => setActiveTab('2')}>Applicants</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={classnames({ active: activeTab === '3' })} onClick={() => setActiveTab('3')}>Lab Info</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink className={classnames({ active: activeTab === '4' })} onClick={() => setActiveTab('4')}>FAQ</NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab} className="mt-3">
                <TabPane tabId="1">
                  <CardText><strong>Description:</strong> {gig?.description}</CardText>
                  <CardText><strong>Required Skills:</strong> {Array.isArray(gig?.required_skills) ? gig.required_skills.join(', ') : gig?.required_skills}</CardText>
                  <CardText><strong>Required Certifications:</strong> {Array.isArray(gig?.required_certifications) ? gig.required_certifications.join(', ') : gig?.required_certifications}</CardText>
                  <CardText><strong>Location:</strong> {gig?.location}</CardText>
                  {isWorker && !applied && <Button color="primary" onClick={() => {
                    const isProfileComplete = currentUser?.headline && currentUser?.bio;
                    if (isProfileComplete) {
                      api.applyToGig(gig?.id).then(() => setApplied(true));
                    } else {
                      toggleModal();
                    }
                  }}>Apply</Button>}
                  {isWorker && applied && <Button color="success" disabled>Application Submitted</Button>}
                  {isWorker && <Button color="secondary" className="ms-2" onClick={() => setMessageSent(true)}>Message Lab</Button>}
                  {isWorker && <Button color="info" className="ms-2" onClick={() => setShowCredentialUpload(true)}>Upload Credential</Button>}
                  {messageSent && <Alert color="info" className="mt-2">Demo: Message sent to lab!</Alert>}
                  {showCredentialUpload && !credentialUploaded && (
                    <div className="mt-3">
                      <input type="file" onChange={() => setCredentialUploaded(true)} />
                      <Button color="primary" className="ms-2" onClick={() => setCredentialUploaded(true)}>Submit Credential</Button>
                    </div>
                  )}
                  {credentialUploaded && <Alert color="success" className="mt-2">Demo: Credential uploaded!</Alert>}
                </TabPane>
                <TabPane tabId="2">
                  {isLab ? (
                    loadingApplicants ? <p>Loading applicants...</p> :
                    applicantsError ? <Alert color="danger">Error loading applicants.</Alert> :
                    <Row>
                      {applicants.map(app => (
                          <Col md={6} key={app.id} className="mb-3">
                            <Card>
                              <CardBody>
                                <Row>
                                  <Col xs="3">
                                    <img src={app.avatar} alt={app.name} className="img-fluid rounded-circle" style={{ width: 48, height: 48 }} />
                                  </Col>
                                  <Col xs="9">
                                    <CardTitle tag="h5"><Link to={`/app/profile/${app.user_id}`}>{app.name}</Link> <Badge color={app.status === 'accepted' ? 'success' : 'info'}>{app.status}</Badge></CardTitle>
                                    <CardText>
                                      <b>Skills:</b> {Array.isArray(app.skills) ? app.skills.join(', ') : app.skills}<br/>
                                      <b>Certifications:</b> {Array.isArray(app.certifications) ? app.certifications.join(', ') : app.certifications}<br/>
                                      <b>Bio:</b> {app.bio}<br/>
                                      <b>Rating:</b> {app.rating} / 5
                                    </CardText>
                                    {app.status === 'pending' && (
                                      <>
                                        <Button color="success" onClick={() => handleAccept(app.id)}>Accept</Button>{' '}
                                        <Button color="danger" onClick={() => handleReject(app.id)}>Reject</Button>
                                      </>
                                    )}
                                    {app.status === 'accepted' && (
                                      <Alert color="success">
                                        Application accepted! <br />
                                        Contact: {app.email}
                                      </Alert>
                                    )}
                                    {app.status === 'rejected' && (
                                      <Alert color="danger">Application Rejected</Alert>
                                    )}
                                  </Col>
                                </Row>
                              </CardBody>
                            </Card>
                          </Col>
                        ))}
                    </Row>
                  ) : (
                    <Alert color="info">Only labs can view applicants.</Alert>
                  )}
                </TabPane>
                <TabPane tabId="3">
                  <LabProfileCard labProfile={gig?.lab_profile} />
                </TabPane>
                <TabPane tabId="4">
                  <FAQSection faq={gig?.faq} />
                </TabPane>
              </TabContent>
            </Col>
            <Col md="4">
              <LabProfileCard labProfile={gig?.lab_profile} />
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Modal isOpen={isModalOpen} toggle={toggleModal}>
        <ModalHeader toggle={toggleModal}>Incomplete Profile</ModalHeader>
        <ModalBody>
          To ensure labs can properly evaluate candidates, please complete your profile by adding a headline and a bio before applying for gigs.
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={() => {
            history.push('/app/profile');
            toggleModal();
          }}>
            Go to Profile
          </Button>{' '}
          <Button color="secondary" onClick={toggleModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

// Connect to Redux to get currentUser
export default compose(
  connect(state => ({ currentUser: state.auth.currentUser }))
)(GigDetailsPage);
