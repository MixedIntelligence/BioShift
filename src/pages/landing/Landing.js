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
      title: "Find Your Next Biotech Opportunity",
      subtitle: "Connect with labs, projects, and collaborators in life sciences",
      accent: "FOR SCIENTISTS & RESEARCHERS"
    },
    {
      title: "Post Projects & Find Talent",
      subtitle: "Get your research projects staffed with qualified professionals",
      accent: "FOR LABS & INSTITUTIONS"
    },
    {
      title: "Grow Your Service Business",
      subtitle: "Connect with labs and researchers who need your specialized services",
      accent: "FOR SERVICE PROVIDERS"
    }
  ];

  return (
    <div className={s.root}>
      {/* Navigation */}
      <nav className={s.nav}>
        <Container>
          <div className={s.navContent}>
            <div className={s.logo}>
              <img src="/logo-header.png" alt="LabLeap" className={s.logoImage} />
              <span className={s.logoText}>LabLeap</span>
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
            <Col xs={12} lg={8}>
              <div className={s.sectionHeader}>
                <h2 className={s.sectionTitle}>Choose Your Role</h2>
                <p className={s.sectionSubtitle}>
                  Join the biotech community that fits your goals
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
                  <h3>Scientists & Researchers</h3>
                  <span className={s.pathSubtitle}>Find Your Next Project</span>
                </div>
                <div className={s.pathContent}>
                  <p>Browse opportunities that match your expertise and career goals</p>
                  <ul className={s.pathFeatures}>
                    <li>• Find contract and full-time positions</li>
                    <li>• Work with leading biotech companies</li>
                    <li>• Build your professional network</li>
                    <li>• Showcase your skills and experience</li>
                  </ul>
                </div>
                <div className={s.pathAction}>
                  <Link to="/register/worker" className={s.pathButton}>
                    <span>Find Opportunities</span>
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
                  <h3>Labs & Institutions</h3>
                  <span className={s.pathSubtitle}>Staff Your Projects</span>
                </div>
                <div className={s.pathContent}>
                  <p>Connect with qualified professionals for your research needs</p>
                  <ul className={s.pathFeatures}>
                    <li>• Post projects and job openings</li>
                    <li>• Review applications and profiles</li>
                    <li>• Manage your hiring pipeline</li>
                    <li>• Find specialized expertise</li>
                  </ul>
                </div>
                <div className={s.pathAction}>
                  <Link to="/register/lab" className={s.pathButton}>
                    <span>Post Projects</span>
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
            <Col xs={12} lg={8}>
              <div className={s.sectionHeader}>
                <h2 className={s.sectionTitle}>Platform Features</h2>
                <p className={s.sectionSubtitle}>
                  Everything you need to succeed in biotech
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
                <h4>Smart Matching</h4>
                <p>Get matched with opportunities that fit your skills, experience, and career goals</p>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3} className="mb-4">
              <div className={s.featureCard}>
                <div className={s.featureIcon}>
                  <div className={s.iconMatrix}></div>
                </div>
                <h4>Bionics AI Assistant</h4>
                <p>Get personalized career advice and project insights from our AI-powered assistant</p>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3} className="mb-4">
              <div className={s.featureCard}>
                <div className={s.featureIcon}>
                  <div className={s.iconMatrix}></div>
                </div>
                <h4>BioShift Connect</h4>
                <p>Integrate with lab management systems, APIs, and third-party tools seamlessly</p>
              </div>
            </Col>
            <Col xs={12} md={6} lg={3} className="mb-4">
              <div className={s.featureCard}>
                <div className={s.featureIcon}>
                  <div className={s.iconMatrix}></div>
                </div>
                <h4>Secure Payments</h4>
                <p>Safe, secure payment processing with transparent fee structure and timely payouts</p>
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
                  Ready to Get Started?
                </h2>
                <p className={s.ctaSubtitle}>
                  Join thousands of biotech professionals advancing their careers and projects on LabLeap
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
                  <img src="/logo-header.png" alt="LabLeap" className={s.footerLogoImage} />
                  <span>LabLeap</span>
                </div>
                <div className={s.footerLinks}>
                  <span>© 2025 LabLeap</span>
                  <span>•</span>
                  <span>Connecting Biotech Professionals</span>
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