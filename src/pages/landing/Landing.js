import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button } from 'reactstrap';
import s from './Landing.module.scss';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const heroSlides = [
    {
      title: "Connect. Collaborate. Accelerate Discovery.",
      subtitle: "The premier marketplace connecting biotech talent with breakthrough research opportunities",
      accent: "BIOTECH PROFESSIONALS"
    },
    {
      title: "Find Top Talent for Your Research",
      subtitle: "Access qualified scientists and researchers for your critical projects",
      accent: "RESEARCH INSTITUTIONS"
    },
    {
      title: "Showcase Your Expertise",
      subtitle: "Offer specialized services to the biotech community and grow your business",
      accent: "SERVICE PROVIDERS"
    }
  ];

  return (
    <div className={s.root}>
      {/* Navigation */}
      <nav className={s.nav}>
        <Container>
          <div className={s.navContent}>
            <div className={s.logo}>
              <img src="/logo-header.png" alt="BioShift LabLeap" className={s.logoImage} />
              <span className={s.logoText}>BioShift</span>
            </div>
            <div className={s.navLinks}>
              <Link to="/login" className={s.navLink}>Sign In</Link>
              <Link to="/register" className={s.navButton}>Get Started</Link>
            </div>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className={s.hero}>
        <div className={s.heroBackground}></div>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} lg={10}>
              <div className={`${s.heroContent} ${isVisible ? s.visible : ''}`}>
                <div className={s.heroStatus}>
                  <span className={s.statusIndicator}></span>
                  <span className={s.statusText}>{heroSlides[currentSlide].accent}</span>
                </div>
                <h1 className={s.heroTitle}>
                  {heroSlides[currentSlide].title}
                </h1>
                <p className={s.heroSubtitle}>
                  {heroSlides[currentSlide].subtitle}
                </p>
                <div className={s.heroStats}>
                  <div className={s.stat}>
                    <span className={s.statValue}>500+</span>
                    <span className={s.statLabel}>Active Projects</span>
                  </div>
                  <div className={s.stat}>
                    <span className={s.statValue}>1,200+</span>
                    <span className={s.statLabel}>Professionals</span>
                  </div>
                  <div className={s.stat}>
                    <span className={s.statValue}>150+</span>
                    <span className={s.statLabel}>Labs & Providers</span>
                  </div>
                </div>
                <div className={s.heroAction}>
                  <Link to="/register" className={s.primaryButton}>
                    <span>Get Started Free</span>
                    <div className={s.buttonGlow}></div>
                  </Link>
                  <Link to="/login" className={s.secondaryButton}>
                    <span>Sign In</span>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* User Paths Section */}
      <section className={s.userPaths}>
        <Container>
          <Row className="justify-content-center mb-5">
            <Col xs={12} lg={8}>                <div className={s.sectionHeader}>
                <h2 className={s.sectionTitle}>Join the BioShift Community</h2>
                <p className={s.sectionSubtitle}>
                  Choose your path in the biotech ecosystem
                </p>
              </div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={12} md={4} className="mb-4">
              <div className={`${s.pathCard} ${s.workerPath}`}>
                <div className={s.pathHeader}>
                  <div className={s.pathIcon}>
                    <div className={s.iconCore}></div>
                  </div>
                  <h3>Researchers & Scientists</h3>
                  <span className={s.pathSubtitle}>Advance Your Career</span>
                </div>
                <div className={s.pathContent}>
                  <p>Find exciting research opportunities and advance your career in biotechnology</p>
                  <ul className={s.pathFeatures}>
                    <li>• Discover contract and full-time positions</li>
                    <li>• Connect with leading research institutions</li>
                    <li>• Build valuable professional relationships</li>
                    <li>• Showcase your expertise and achievements</li>
                  </ul>
                </div>
                <div className={s.pathAction}>
                  <Link to="/register/worker" className={s.pathButton}>
                    <span>Find Research Opportunities</span>
                    <div className={s.buttonAccent}></div>
                  </Link>
                </div>
              </div>
            </Col>
            <Col xs={12} md={4} className="mb-4">
              <div className={`${s.pathCard} ${s.labPath}`}>
                <div className={s.pathHeader}>
                  <div className={s.pathIcon}>
                    <div className={s.iconCore}></div>
                  </div>
                  <h3>Research Institutions</h3>
                  <span className={s.pathSubtitle}>Find Top Talent</span>
                </div>
                <div className={s.pathContent}>
                  <p>Access a pool of qualified professionals for your research initiatives</p>
                  <ul className={s.pathFeatures}>
                    <li>• Post research positions and projects</li>
                    <li>• Review qualified candidate profiles</li>
                    <li>• Streamline your hiring process</li>
                    <li>• Access specialized scientific expertise</li>
                  </ul>
                </div>
                <div className={s.pathAction}>
                  <Link to="/register/lab" className={s.pathButton}>
                    <span>Post Research Positions</span>
                    <div className={s.buttonAccent}></div>
                  </Link>
                </div>
              </div>
            </Col>
            <Col xs={12} md={4} className="mb-4">
              <div className={`${s.pathCard} ${s.providerPath}`}>
                <div className={s.pathHeader}>
                  <div className={s.pathIcon}>
                    <div className={s.iconCore}></div>
                  </div>
                  <h3>Service Providers</h3>
                  <span className={s.pathSubtitle}>Grow Your Business</span>
                </div>
                <div className={s.pathContent}>
                  <p>Connect with labs and researchers who need your services</p>
                  <ul className={s.pathFeatures}>
                    <li>• List your specialized services</li>
                    <li>• Connect with potential clients</li>
                    <li>• Manage service requests</li>
                    <li>• Expand your client base</li>
                  </ul>
                </div>
                <div className={s.pathAction}>
                  <Link to="/register/provider" className={s.pathButton}>
                    <span>List Services</span>
                    <div className={s.buttonAccent}></div>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Platform Features */}
      <section className={s.features}>
        <Container>
          <Row className="justify-content-center mb-5">
            <Col xs={12} lg={8}>                <div className={s.sectionHeader}>
                <h2 className={s.sectionTitle}>Powered by Innovation</h2>
                <p className={s.sectionSubtitle}>
                  Advanced tools designed for the biotech industry
                </p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={6} lg={3} className="mb-4">
              <div className={s.featureCard}>
                <div className={s.featureIcon}>
                  <div className={s.iconMatrix}></div>
                </div>
                <h4>Smart Job Matching</h4>
                <p>Discover opportunities that perfectly align with your skills, experience, and research interests</p>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3} className="mb-4">
              <div className={s.featureCard}>
                <div className={s.featureIcon}>
                  <div className={s.iconMatrix}></div>
                </div>
                <h4>AI-Powered Insights</h4>
                <p>Get personalized career guidance and project recommendations from our intelligent assistant</p>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3} className="mb-4">
              <div className={s.featureCard}>
                <div className={s.featureIcon}>
                  <div className={s.iconMatrix}></div>
                </div>
                <h4>Professional Networking</h4>
                <p>Connect with industry leaders, collaborators, and peers in the biotech community</p>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3} className="mb-4">
              <div className={s.featureCard}>
                <div className={s.featureIcon}>
                  <div className={s.iconMatrix}></div>
                </div>
                <h4>Secure Transactions</h4>
                <p>Safe, reliable payment processing with transparent fees and timely compensation</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className={s.cta}>
        <div className={s.ctaBackground}></div>
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} lg={8}>
              <div className={s.ctaContent}>
                <h2 className={s.ctaTitle}>
                  Ready to Transform Your Biotech Career?
                </h2>
                <p className={s.ctaSubtitle}>
                  Join the BioShift community and connect with opportunities that match your expertise
                </p>
                <div className={s.ctaActions}>
                  <Link to="/register" className={s.ctaPrimary}>
                    <span>Sign Up Free</span>
                    <div className={s.ctaGlow}></div>
                  </Link>
                  <Link to="/login" className={s.ctaSecondary}>
                    <span>Sign In</span>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer */}
      <footer className={s.footer}>
        <Container>
          <Row>
            <Col xs={12}>
              <div className={s.footerContent}>
                <div className={s.footerLogo}>
                  <img src="/logo-header.png" alt="BioShift" className={s.footerLogoImage} />
                  <span>BioShift</span>
                </div>
                <div className={s.footerLinks}>
                  <span>© 2025 BioShift</span>
                  <span>•</span>
                  <span>Powered by LabLeap Technology</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
    </div>
  );
};

export default LandingPage;