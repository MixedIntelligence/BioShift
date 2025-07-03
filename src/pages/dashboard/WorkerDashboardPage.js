import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Card, CardBody, CardTitle, CardText, Badge, Button } from 'reactstrap';
import Widget from '../../components/Widget/Widget';
import MainChart from '../analytics/components/Charts/MainChart';
import { receiveDataRequest } from '../../actions/analytics';
import gigs from '../gigs/mock';

const publications = [
  { title: 'Lab Worker Upskilling', journal: 'Lab Science Review', year: 2025 },
  { title: 'Bioprocessing Trends', journal: 'BioProcess Journal', year: 2024 },
];
const journals = [
  { name: 'Lab Science Review', url: 'https://labsci.org/' },
  { name: 'BioProcess Journal', url: 'https://bioprocessintl.com/' },
];
const upskill = [
  { skill: 'Advanced Cell Culture', provider: 'Coursera' },
  { skill: 'Lab Data Science', provider: 'edX' },
];

const WorkerDashboardPage = () => {
  const dispatch = useDispatch();
  const { mainChart, isReceiving } = useSelector(state => state.analytics);

  useEffect(() => {
    dispatch(receiveDataRequest());
  }, [dispatch]);

  // Demo summary data
  const totalGigs = gigs.length;
  const activeGigs = gigs.filter(g => g.status === 'Open' || g.status === 'Awarded' || g.status === 'Applied').length;
  const completedGigs = gigs.filter(g => g.status === 'Completed').length;
  const totalEarnings = gigs.filter(g => g.status === 'Completed').length * 3500; // demo

  return (
    <div className="container mt-4">
      <h2>Worker Dashboard</h2>
      <Row className="mb-3">
        <Col md={3}><Card body className="text-center"><CardTitle tag="h5">Total Gigs</CardTitle><CardText><h3>{totalGigs}</h3></CardText></Card></Col>
        <Col md={3}><Card body className="text-center"><CardTitle tag="h5">Active Gigs</CardTitle><CardText><h3>{activeGigs}</h3></CardText></Card></Col>
        <Col md={3}><Card body className="text-center"><CardTitle tag="h5">Completed</CardTitle><CardText><h3>{completedGigs}</h3></CardText></Card></Col>
        <Col md={3}><Card body className="text-center"><CardTitle tag="h5">Earnings</CardTitle><CardText><h3>${totalEarnings.toLocaleString()}</h3></CardText></Card></Col>
      </Row>
      <Row>
        <Col lg={8} xs={12}>
          <MainChart data={mainChart} isReceiving={isReceiving} />
        </Col>
        <Col lg={4} xs={12}>
          <Widget title={<h5>Suggestions & Tasks</h5>}>
            <ul>
              <li>Apply to "Genomics Data Analysis"</li>
              <li>Upload credential for "Cell Culture Scale-Up"</li>
              <li>Suggested Gigs: 2 new matches</li>
            </ul>
          </Widget>
          <Widget title={<h5>Upskill Opportunities</h5>}>
            <ul>
              {upskill.map(u => <li key={u.skill}>{u.skill} <Badge color="info">{u.provider}</Badge></li>)}
            </ul>
          </Widget>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col md={6}>
          <Widget title={<h5>Recent Publications</h5>}>
            <ul>
              {publications.map(p => <li key={p.title}><b>{p.title}</b> <br /><small>{p.journal}, {p.year}</small></li>)}
            </ul>
          </Widget>
        </Col>
        <Col md={6}>
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

export default WorkerDashboardPage;
