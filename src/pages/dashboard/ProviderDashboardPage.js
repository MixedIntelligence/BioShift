import React from 'react';
import { Row, Col, Card, CardBody, CardTitle, CardText, Badge } from 'reactstrap';
import Widget from '../../components/Widget/Widget';

const publications = [
  { title: 'Provider Collaboration Models', journal: 'Science Partnering', year: 2025 },
  { title: 'Trends in Pharma Outsourcing', journal: 'Pharma Journal', year: 2024 },
];
const journals = [
  { name: 'Science Partnering', url: 'https://sciencepartnering.com/' },
  { name: 'Pharma Journal', url: 'https://pharmajournal.com/' },
];
const upskill = [
  { skill: 'Project Management', provider: 'Coursera' },
  { skill: 'Pharma Business', provider: 'edX' },
];

const ProviderDashboardPage = () => {
  // Demo summary data
  const collaborations = 2;
  const offers = 1;
  const completed = 5;

  return (
    <div className="container mt-4">
      <h2>Provider Dashboard</h2>
      <Row className="mb-3">
        <Col md={4}><Card body className="text-center"><CardTitle tag="h5">Active Collabs</CardTitle><CardText><h3>{collaborations}</h3></CardText></Card></Col>
        <Col md={4}><Card body className="text-center"><CardTitle tag="h5">Pending Offers</CardTitle><CardText><h3>{offers}</h3></CardText></Card></Col>
        <Col md={4}><Card body className="text-center"><CardTitle tag="h5">Completed Projects</CardTitle><CardText><h3>{completed}</h3></CardText></Card></Col>
      </Row>
      <Row>
        <Col md={6}>
          <Widget title={<h5>Suggestions & Tasks</h5>}>
            <ul>
              <li>Review contract for "Protein Purification"</li>
              <li>Respond to partnership request from "FoodSafe Labs"</li>
              <li>Suggested Labs: 2 new matches</li>
            </ul>
          </Widget>
          <Widget title={<h5>Upskill Opportunities</h5>}>
            <ul>
              {upskill.map(u => <li key={u.skill}>{u.skill} <Badge color="info">{u.provider}</Badge></li>)}
            </ul>
          </Widget>
        </Col>
        <Col md={6}>
          <Widget title={<h5>Recent Publications</h5>}>
            <ul>
              {publications.map(p => <li key={p.title}><b>{p.title}</b> <br /><small>{p.journal}, {p.year}</small></li>)}
            </ul>
          </Widget>
          <Widget title={<h5>Relevant Journals</h5>}>
            <ul>
              {journals.map(j => <li key={j.name}><a href={j.url} target="_blank" rel="noopener noreferrer">{j.name}</a></li>)}
            </ul>
          </Widget>
        </Col>
      </Row>
    </div>
  );
};

export default ProviderDashboardPage;
