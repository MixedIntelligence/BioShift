import React from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import s from './Landing.module.scss';

const ALPHA_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScbXp-DxHb5zciyepNsM-LLfIVRWHbKsaFj1TFrXcODVMNGug/viewform?usp=dialog";

const LandingPage = () => (
  <div className={s.root}>
    {/* Hero Section */}
    <section className={s.hero}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={10} className="text-center">
            <img src="https://i.imgur.com/ALEL90c.png" alt="LabLeap by BioShift" className={s.logoImage} style={{maxWidth: 180, marginBottom: 24}} />
            <h1 className={s.heroTitle} style={{fontWeight: 700, fontSize: '2.5rem'}}>
              LabLeap by BioShift: Closed Alpha – Apply for Early Access
            </h1>
            <p className={s.heroSubtitle} style={{fontSize: '1.3rem', margin: '1.5rem 0'}}>
              Join our invite‑only pilot — empowering labs, scientists, and biotech providers during today’s hiring downturn and Federal funding crunch.
            </p>
            <a href={ALPHA_FORM_URL} target="_blank" rel="noopener noreferrer" className={s.primaryButton} style={{fontSize: '1.2rem', padding: '0.75em 2em', marginBottom: 32}}>
              Request Alpha Access
            </a>
          </Col>
        </Row>
      </Container>
    </section>

    {/* Why Now Section */}
    <section className={s.whyNow} style={{background: '#f8fafc', padding: '3rem 0'}}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={8} className="text-center">
            <h2 className={s.sectionTitle}>Science Needs Agility — Now More Than Ever</h2>
            <ul className={s.bulletList} style={{textAlign: 'left', margin: '2rem auto', maxWidth: 600}}>
              <li>Federal funding is tightening—labs need fast, reliable, short‑term talent.</li>
              <li>Layoffs are hitting researchers—microskills like yours are in demand.</li>
              <li>Our closed alpha builds a trusted network ahead of full launch.</li>
            </ul>
          </Col>
        </Row>
      </Container>
    </section>

    {/* Who We're Inviting & What You Gain */}
    <section className={s.invitees} style={{padding: '3rem 0'}}>
      <Container>
        <Row className="justify-content-center mb-4">
          <Col xs={12} lg={8} className="text-center">
            <h2 className={s.sectionTitle}>Who We’re Inviting & What You Gain</h2>
          </Col>
        </Row>
        <Row>
          <Col md={4} className="mb-4">
            <div className={s.inviteeCard}>
              <h3>🏢 Labs</h3>
              <ul>
                <li>Access pre‑vetted, gig-ready talent with verified skill sets</li>
                <li>Post projects instantly and reduce hiring lag</li>
                <li>Pay only on delivery, backed by built-in workflow and documentation support</li>
              </ul>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className={s.inviteeCard}>
              <h3>👩‍🔬 Workers</h3>
              <ul>
                <li>Showcase real science skills (certifications, tools, badges)</li>
                <li>Find high‑impact gigs from reputable institutions</li>
                <li>Streamline contracts, messaging, and payments—all in one place</li>
              </ul>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className={s.inviteeCard}>
              <h3>🔧 Providers</h3>
              <ul>
                <li>Connect with active labs and researchers</li>
                <li>Elevate your offerings with built-in distribution and engagement</li>
                <li>Earn pilot privileges, referral rewards, and brand exposure</li>
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* How It Works Section */}
    <section className={s.howItWorks} style={{background: '#f8fafc', padding: '3rem 0'}}>
      <Container>
        <Row className="justify-content-center mb-4">
          <Col xs={12} lg={8} className="text-center">
            <h2 className={s.sectionTitle}>How It Works (Closed Alpha Flow)</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} md={10}>
            <ol className={s.howList} style={{maxWidth: 700, margin: '0 auto', textAlign: 'left'}}>
              <li>Apply for Invite – Choose your role and fill out a short profile</li>
              <li>Get Matched – Labs post gigs, workers & providers apply</li>
              <li>Onboard Easily – SOPs, protocols, and comms auto‑delivered for fast ramp-up</li>
              <li>Deliver & Get Paid – Stripe-powered payment on completion</li>
              <li>Feedback Loop – Earn reviews, badges, and insights to boost future success</li>
            </ol>
            <div className={s.howNote} style={{fontSize: '1rem', color: '#666', marginTop: 16}}>
              <em>This flow emphasizes SOP delivery and tool documentation to cut time from hire to result.</em>
            </div>
          </Col>
        </Row>
      </Container>
    </section>

    {/* Pilot Benefits Section */}
    <section className={s.benefits} style={{padding: '3rem 0'}}>
      <Container>
        <Row className="justify-content-center mb-4">
          <Col xs={12} lg={8} className="text-center">
            <h2 className={s.sectionTitle}>Pilot Benefits</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} md={10}>
            <ul className={s.benefitList} style={{maxWidth: 700, margin: '0 auto', textAlign: 'left'}}>
              <li>Shape the Future — Your feedback will directly influence product design</li>
              <li>Priority Access — First in line for full launch, plus referral perks</li>
              <li>Community & Credibility — Feature on our pilot landing page and early case studies</li>
            </ul>
          </Col>
        </Row>
      </Container>
    </section>

    {/* FAQ Section */}
    <section className={s.faq} style={{background: '#f8fafc', padding: '3rem 0'}}>
      <Container>
        <Row className="justify-content-center mb-4">
          <Col xs={12} lg={8} className="text-center">
            <h2 className={s.sectionTitle}>FAQ</h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={12} md={10}>
            <dl className={s.faqList} style={{maxWidth: 700, margin: '0 auto', textAlign: 'left'}}>
              <dt>Who can join?</dt>
              <dd>Labs, scientists, and providers building out micro‑expertise pipelines.</dd>
              <dt>What’s expected?</dt>
              <dd>Active engagement, feedback, and project participation.</dd>
              <dt>When does it start?</dt>
              <dd>We're accepting pilots over the next 8–12 weeks.</dd>
            </dl>
          </Col>
        </Row>
      </Container>
    </section>

    {/* Footer CTA */}
    <footer className={s.footer} style={{padding: '2rem 0', background: '#222', color: '#fff'}}>
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} lg={8} className="text-center">
            <a href={ALPHA_FORM_URL} target="_blank" rel="noopener noreferrer" className={s.primaryButton} style={{fontSize: '1.1rem', padding: '0.7em 2em', marginBottom: 12, background: '#00cc7a'}}>
              Request Your Closed Alpha Invite →
            </a>
            <div style={{fontSize: '0.95rem', color: '#bbb', marginTop: 8}}>
              Applications reviewed weekly — limited spots available.
            </div>
            <div style={{marginTop: 24}}>
              <img src="/logo-header.png" alt="BioShift" style={{maxWidth: 120, opacity: 0.7}} />
              <div style={{marginTop: 8}}>© 2025 BioShift • Powered by LabLeap Technology</div>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  </div>
);

export default LandingPage;