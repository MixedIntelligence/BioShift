import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'redux';
import gigs from './mock';
import { Card, CardBody, CardTitle, CardText, Button, Row, Col, Badge, Alert, Nav, NavItem, NavLink, TabContent, TabPane, Progress } from 'reactstrap';
import classnames from 'classnames';

// Mock applicants for demo (could be expanded or moved to mock.js)
const mockApplicants = [
  {
    id: 'user-001',
    name: 'Elena Vance',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    skills: ['Chromatography', 'Protein Purification'],
    certifications: ['GLP'],
    status: 'Applied',
    bio: '5+ years in protein analytics. Detail-oriented and reliable.',
    rating: 4.8,
  },
  {
    id: 'user-002',
    name: 'Samir Patel',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    skills: ['Cell Culture', 'Bioreactors'],
    certifications: ['Biosafety Level 2'],
    status: 'Applied',
    bio: 'Cell culture specialist with a passion for bioprocessing.',
    rating: 4.6,
  },
];

const mockLabProfile = {
  logo: 'https://randomuser.me/api/portraits/lego/6.jpg',
  name: 'Genomic Solutions Lab',
  rating: 4.9,
  verified: true,
  about: 'Leading biotech lab specializing in genomics and proteomics.',
  website: 'https://genomicslab.example.com',
  industry: 'Biotechnology',
};

const mockFAQ = [
  { q: 'What is the expected turnaround time?', a: 'Most gigs are expected to be completed within 2-4 weeks.' },
  { q: 'Is remote work allowed?', a: 'Yes, this gig is fully remote.' },
  { q: 'What tools are provided?', a: 'Access to lab data, cloud storage, and collaboration tools.' },
];

const GigDetailsPage = ({ currentUser }) => {
  const { id } = useParams();
  const history = useHistory();
  const gig = gigs.find(g => g.id === id);
  const role = currentUser?.role;
  const [applied, setApplied] = useState(false);
  const [awardedId, setAwardedId] = useState(null);
  const [messageSent, setMessageSent] = useState(false);
  const [showCredentialUpload, setShowCredentialUpload] = useState(false);
  const [credentialUploaded, setCredentialUploaded] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentReleased, setPaymentReleased] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  if (!gig) {
    return <div className="container mt-4"><h4>Gig not found.</h4></div>;
  }

  // Helper: Render Lab Profile Card
  const LabProfileCard = () => (
    <Card className="mb-3">
      <CardBody>
        <Row>
          <Col xs="3">
            <img src={mockLabProfile.logo} alt="Lab Logo" className="img-fluid rounded-circle" style={{ width: 64, height: 64 }} />
          </Col>
          <Col xs="9">
            <CardTitle tag="h5">{mockLabProfile.name} {mockLabProfile.verified && <Badge color="primary">Verified</Badge>}</CardTitle>
            <CardText>
              <b>Rating:</b> {mockLabProfile.rating} / 5<br/>
              <b>Industry:</b> {mockLabProfile.industry}<br/>
              <b>About:</b> {mockLabProfile.about}<br/>
              <a href={mockLabProfile.website} target="_blank" rel="noopener noreferrer">Website</a>
            </CardText>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );

  // Helper: Render FAQ
  const FAQSection = () => (
    <Card className="mb-3">
      <CardBody>
        <CardTitle tag="h5">FAQ & Expectations</CardTitle>
        {mockFAQ.map((item, idx) => (
          <div key={idx} className="mb-2">
            <b>Q:</b> {item.q}<br/>
            <b>A:</b> {item.a}
          </div>
        ))}
      </CardBody>
    </Card>
  );

  // Worker/Professional and Lab Manager view (tabbed, info-rich layout)
  const isWorker = role === 'worker';
  const isLab = role === 'lab';

  return (
    <div className="container mt-4">
      <Button color="link" onClick={() => history.goBack()}>&larr; Back to Gigs</Button>
      <Card className="mb-4">
        <CardBody>
          <Row>
            <Col md="8">
              <CardTitle tag="h3">{gig.title} <Badge color="success">{gig.status || 'Open'}</Badge> {gig.urgent && <Badge color="danger">Urgent</Badge>} {gig.remote && <Badge color="info">Remote</Badge>}</CardTitle>
              <CardText><strong>Compensation:</strong> {gig.payRate} <span className="ms-3"><strong>Duration:</strong> {gig.duration}</span></CardText>
              <Progress value={gig.status === 'Open' ? 33 : gig.status === 'In Progress' ? 66 : 100} className="mb-2" />
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
                  <CardText><strong>Description:</strong> {gig.description}</CardText>
                  <CardText><strong>Required Skills:</strong> {gig.requiredSkills.join(', ')}</CardText>
                  <CardText><strong>Required Certifications:</strong> {gig.requiredCertifications.join(', ')}</CardText>
                  <CardText><strong>Location:</strong> {gig.location}</CardText>
                  {isWorker && !applied && <Button color="primary" onClick={() => setApplied(true)}>Apply</Button>}
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
                    <Row>
                      {mockApplicants.map(app => {
                        const isAwarded = awardedId === app.id;
                        return (
                          <Col md={6} key={app.id} className="mb-3">
                            <Card>
                              <CardBody>
                                <Row>
                                  <Col xs="3">
                                    <img src={app.avatar} alt={app.name} className="img-fluid rounded-circle" style={{ width: 48, height: 48 }} />
                                  </Col>
                                  <Col xs="9">
                                    <CardTitle tag="h5">{app.name} <Badge color={isAwarded ? 'success' : 'info'}>{isAwarded ? 'Awarded' : app.status}</Badge></CardTitle>
                                    <CardText>
                                      <b>Skills:</b> {app.skills.join(', ')}<br/>
                                      <b>Certifications:</b> {app.certifications.join(', ')}<br/>
                                      <b>Bio:</b> {app.bio}<br/>
                                      <b>Rating:</b> {app.rating} / 5
                                    </CardText>
                                    <Button color="success" disabled={awardedId !== null} onClick={() => setAwardedId(app.id)}>{isAwarded ? 'Awarded' : 'Award Gig'}</Button>{' '}
                                    <Button color="secondary" onClick={() => setMessageSent(true)}>Message</Button>{' '}
                                    {isAwarded && (
                                      <>
                                        <Button color="info" onClick={() => setShowCredentialUpload(true)}>Request Credential</Button>
                                        {showCredentialUpload && !credentialUploaded && (
                                          <Alert color="warning" className="mt-2">Demo: Credential request sent to applicant!</Alert>
                                        )}
                                        {credentialUploaded && <Alert color="success" className="mt-2">Demo: Credential received!</Alert>}
                                        <Button color="primary" className="mt-2" onClick={() => setShowPayment(true)}>Release Payment</Button>
                                        {showPayment && !paymentReleased && (
                                          <div className="mt-2">
                                            <Button color="primary" onClick={() => setPaymentReleased(true)}>Confirm Release</Button>
                                          </div>
                                        )}
                                        {paymentReleased && <Alert color="success" className="mt-2">Demo: Payment released to applicant!</Alert>}
                                      </>
                                    )}
                                    {messageSent && <Alert color="info" className="mt-2">Demo: Message sent to applicant!</Alert>}
                                  </Col>
                                </Row>
                              </CardBody>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  ) : (
                    <Alert color="info">Only labs can view applicants.</Alert>
                  )}
                </TabPane>
                <TabPane tabId="3">
                  <LabProfileCard />
                </TabPane>
                <TabPane tabId="4">
                  <FAQSection />
                </TabPane>
              </TabContent>
            </Col>
            <Col md="4">
              <LabProfileCard />
            </Col>
          </Row>
        </CardBody>
      </Card>
    </div>
  );
};

// Connect to Redux to get currentUser
export default compose(
  connect(state => ({ currentUser: state.auth.currentUser }))
)(GigDetailsPage);
