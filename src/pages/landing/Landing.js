import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card, CardBody, Badge } from 'reactstrap';
import s from './Landing.module.scss';

const LandingPage = () => {
  return (
    <div className={s.root}>
      {/* Hero Section */}
      <section className={s.hero}>
        <Container>
          <Row className="justify-content-center text-center">
            <Col xs={12} lg={10}>
              <div className={s.heroContent}>
                <Badge color="success" pill className={s.statusBadge}>
                  🚀 Platform Live & Functional
                </Badge>
                <h1 className={s.heroTitle}>
                  Welcome to <span className={s.brandName}>LabLeap</span>
                </h1>
                <p className={s.heroSubtitle}>
                  The premier marketplace connecting labs, scientists, and service providers 
                  in the biotech industry. Join our growing community of innovators.
                </p>
                <div className={s.heroStats}>
                  <div className={s.stat}>
                    <span className={s.statNumber}>✅</span>
                    <span className={s.statLabel}>Gig Management</span>
                  </div>
                  <div className={s.stat}>
                    <span className={s.statNumber}>✅</span>
                    <span className={s.statLabel}>Applications</span>
                  </div>
                  <div className={s.stat}>
                    <span className={s.statNumber}>✅</span>
                    <span className={s.statLabel}>User Profiles</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Registration Section */}
      <section className={s.registration}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} lg={8} className="text-center mb-5">
              <h2 className={s.sectionTitle}>Join Our Community</h2>
              <p className={s.sectionSubtitle}>
                Choose your role and start connecting with the biotech ecosystem
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={12} md={4} className="mb-4">
              <Card className={s.roleCard}>
                <CardBody className="text-center">
                  <div className={s.roleIcon}>🧪</div>
                  <h4>Lab</h4>
                  <p>Post projects, find skilled workers, manage applications</p>
                  <ul className={s.featureList}>
                    <li>Create and manage gigs</li>
                    <li>Review applications</li>
                    <li>Connect with workers</li>
                  </ul>
                  <Link to="/register/lab">
                    <Button color="success" size="lg" block>
                      Join as Lab
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
            <Col xs={12} md={4} className="mb-4">
              <Card className={s.roleCard}>
                <CardBody className="text-center">
                  <div className={s.roleIcon}>👩‍🔬</div>
                  <h4>Worker</h4>
                  <p>Find exciting projects, apply to gigs, build your career</p>
                  <ul className={s.featureList}>
                    <li>Browse available gigs</li>
                    <li>Apply to projects</li>
                    <li>Build your profile</li>
                  </ul>
                  <Link to="/register/worker">
                    <Button color="primary" size="lg" block>
                      Join as Worker
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
            <Col xs={12} md={4} className="mb-4">
              <Card className={s.roleCard}>
                <CardBody className="text-center">
                  <div className={s.roleIcon}>🏢</div>
                  <h4>Provider</h4>
                  <p>Offer specialized services, equipment, and expertise</p>
                  <ul className={s.featureList}>
                    <li>List your services</li>
                    <li>Connect with labs</li>
                    <li>Grow your business</li>
                  </ul>
                  <Link to="/register/provider">
                    <Button color="info" size="lg" block>
                      Join as Provider
                    </Button>
                  </Link>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className={s.features}>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} lg={8} className="text-center mb-5">
              <h2 className={s.sectionTitle}>Platform Features</h2>
              <p className={s.sectionSubtitle}>
                Everything you need to succeed in the biotech marketplace
              </p>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} lg={3} className="mb-4">
              <div className={s.feature}>
                <div className={s.featureIcon}>🎯</div>
                <h5>Smart Matching</h5>
                <p>Find the perfect matches between labs and workers based on skills and requirements</p>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3} className="mb-4">
              <div className={s.feature}>
                <div className={s.featureIcon}>📋</div>
                <h5>Application Management</h5>
                <p>Streamlined application process with status tracking and instant notifications</p>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3} className="mb-4">
              <div className={s.feature}>
                <div className={s.featureIcon}>👤</div>
                <h5>Rich Profiles</h5>
                <p>Comprehensive user profiles with skills, experience, and project history</p>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3} className="mb-4">
              <div className={s.feature}>
                <div className={s.featureIcon}>🔒</div>
                <h5>Secure Platform</h5>
                <p>Enterprise-grade security with role-based access and data protection</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className={s.cta}>
        <Container>
          <Row className="justify-content-center text-center">
            <Col xs={12} lg={8}>
              <h2 className={s.ctaTitle}>Ready to Get Started?</h2>
              <p className={s.ctaSubtitle}>
                Join the future of biotech collaboration today
              </p>
              <div className={s.ctaButtons}>
                <Link to="/login">
                  <Button color="outline-primary" size="lg" className="me-3">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register">
                  <Button color="primary" size="lg">
                    Get Started Free
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default LandingPage;