import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, CardBody, CardTitle, CardText, Badge, Button } from 'reactstrap';
import Widget from '../../components/Widget/Widget';
import MainChart from '../analytics/components/Charts/MainChart';
import BigStat from '../analytics/components/BigStat/BigStat';
import { receiveDataRequest } from '../../actions/analytics';
import mock from '../analytics/mock';
import gigs from '../gigs/mock';

const publications = [
  { title: 'Protein Purification Advances', journal: 'Nature Methods', year: 2025 },
  { title: 'Cell Culture Scale-Up Strategies', journal: 'Biotech Today', year: 2024 },
];
const journals = [
  { name: 'Nature Biotechnology', url: 'https://www.nature.com/nbt/' },
  { name: 'Journal of Lab Automation', url: 'https://journals.sagepub.com/home/jla' },
];
const upskill = [
  { skill: 'Advanced Chromatography', provider: 'Coursera' },
  { skill: 'Lab Data Science', provider: 'edX' },
];

const LabDashboardPage = () => {
  const dispatch = useDispatch();
  const { mainChart, isReceiving } = useSelector(state => state.analytics);

  useEffect(() => {
    dispatch(receiveDataRequest());
  }, [dispatch]);

  // Demo summary data
  const totalGigs = gigs.length;
  const activeGigs = gigs.filter(g => g.status === 'Open' || g.status === 'Awarded' || g.status === 'Applied').length;
  const completedGigs = gigs.filter(g => g.status === 'Completed').length;
  const totalEarnings = gigs.filter(g => g.status === 'Completed').length * 5000; // demo
  const budget = 20000;

  return (
    <div className="container mt-4">
      <h2>Lab Dashboard</h2>
      <Row className="mb-3">
        <Col md={3}><Card body className="text-center"><CardTitle tag="h5">Total Gigs</CardTitle><CardText><h3>{totalGigs}</h3></CardText></Card></Col>
        <Col md={3}><Card body className="text-center"><CardTitle tag="h5">Active Gigs</CardTitle><CardText><h3>{activeGigs}</h3></CardText></Card></Col>
        <Col md={3}><Card body className="text-center"><CardTitle tag="h5">Completed</CardTitle><CardText><h3>{completedGigs}</h3></CardText></Card></Col>
        <Col md={3}><Card body className="text-center"><CardTitle tag="h5">Budget</CardTitle><CardText><h3>${budget.toLocaleString()}</h3></CardText></Card></Col>
      </Row>
      <Row>
        <Col lg={8} xs={12}>
          <MainChart data={mainChart} isReceiving={isReceiving} />
        </Col>
        <Col lg={4} xs={12}>
          <Widget title={<h5>Financials</h5>}>
            <ul>
              <li>Total Earnings: <b>${totalEarnings.toLocaleString()}</b></li>
              <li>Budget Remaining: <b>${(budget - totalEarnings).toLocaleString()}</b></li>
              <li>Pending Payments: <b>$2,000</b></li>
            </ul>
          </Widget>
          <Widget title={<h5>Tasks & Suggestions</h5>}>
            <ul>
              <li>Review new applicant for "Cell Culture Scale-Up"</li>
              <li>Complete project report for "Analytical Method Validation"</li>
              <li>Suggested Talent: 3 new matches</li>
            </ul>
          </Widget>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={4}>
          <Widget title={<h5>Upskill Opportunities</h5>}>
            <ul>
              {upskill.map(u => <li key={u.skill}>{u.skill} <Badge color="info">{u.provider}</Badge></li>)}
            </ul>
          </Widget>
        </Col>
        <Col md={4}>
          <Widget title={<h5>Recent Publications</h5>}>
            <ul>
              {publications.map(p => <li key={p.title}><b>{p.title}</b> <br /><small>{p.journal}, {p.year}</small></li>)}
            </ul>
          </Widget>
        </Col>
        <Col md={4}>
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

export default LabDashboardPage;
