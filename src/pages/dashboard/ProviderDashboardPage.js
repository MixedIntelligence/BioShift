import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'reactstrap';
import Widget from '../../components/Widget/Widget';
import MainChart from '../analytics/components/Charts/MainChart';
import BigStat from '../analytics/components/BigStat/BigStat';
import TaskContainer from '../analytics/components/TaskContainer/TaskContainer';
import TableContainer from '../analytics/components/TableContainer/TableContainer';
import Calendar from '../dashboard/components/calendar/Calendar';
import mock from '../analytics/mock';
import { receiveDataRequest } from '../../actions/analytics';

// Additional mock data for Provider Dashboard
const providerNews = [
  { title: 'Pharma Outsourcing Growth', source: 'Pharma News', time: '3h ago' },
  { title: 'BioShift Connect: New Partner Labs', source: 'BioShift Blog', time: 'Today' },
  { title: 'Provider Collaboration Best Practices', source: 'Science Daily', time: '1d ago' },
];
const providerMessages = [
  { from: 'BioShift Connect', content: 'New partnership request from "LabLeap".', time: 'Just now' },
  { from: 'System', content: 'Contract signed for "Protein Purification".', time: '1h ago' },
  { from: 'Offers', content: 'Offer received: "Lab Automation Project".', time: '2h ago' },
];
const providerDeadlines = [
  { task: 'Review contract for "Genomics Analysis"', due: '2025-07-04' },
  { task: 'Respond to partnership request', due: '2025-07-05' },
];
const providerTasks = [
  { id: 30, type: 'Contract', title: 'Sign contract for "Protein Purification"', time: '09:00' },
  { id: 31, type: 'Offer', title: 'Review new offer', time: '11:00' },
  { id: 32, type: 'Call', title: 'Schedule kickoff call', time: '13:00' },
  { id: 33, type: 'Alert', title: 'Respond to Connect alert', time: '15:00' },
];
const providerKPIs = [
  { product: 'Active Collabs', total: '4', color: 'primary', registrations: { value: 2, profit: true }, bounce: { value: 1.2, profit: true } },
  { product: 'Pending Offers', total: '3', color: 'success', registrations: { value: 1, profit: false }, bounce: { value: 0.7, profit: false } },
  { product: 'Completed Projects', total: '8', color: 'warning', registrations: { value: 2, profit: true }, bounce: { value: 0.4, profit: true } },
  { product: 'Unread Messages', total: '5', color: 'danger', registrations: { value: 3, profit: true }, bounce: { value: 0.9, profit: false } },
];
const providerTable = [
  { name: 'LabLeap', email: 'contact@lableap.com', product: 'Collab', price: '$10,000', date: '2025-07-01', city: 'Boston', status: 'Pending' },
  { name: 'Genomics Analysis', email: 'lab@biomvp.com', product: 'Contract', price: '$5,000', date: '2025-06-28', city: 'San Diego', status: 'Sent' },
  { name: 'Automation Project', email: 'auto@lab.com', product: 'Offer', price: '$2,500', date: '2025-06-25', city: 'Austin', status: 'Declined' },
  { name: 'Kickoff Call', email: 'call@lab.com', product: 'Call', price: '$0', date: '2025-06-20', city: 'Remote', status: 'Sent' },
];

const ProviderDashboardPage = () => {
  const dispatch = useDispatch();
  const { mainChart, isReceiving } = useSelector(state => state.analytics);

  useEffect(() => {
    dispatch(receiveDataRequest());
  }, [dispatch]);

  return (
    <div className="container-fluid mt-4" style={{ maxWidth: 1600 }}>
      <Row className="mb-4">
        {providerKPIs.map((stat, idx) => (
          <Col key={idx} md={3} sm={6} xs={12} className="mb-3">
            <BigStat {...stat} />
          </Col>
        ))}
      </Row>
      <Row>
        <Col lg={8} xs={12}>
          <Widget title={<h5>Provider Analytics</h5>}>
            <MainChart data={mainChart} isReceiving={isReceiving} />
          </Widget>
          <Row>
            <Col md={6}>
              <TaskContainer data={[...mock.tasks, ...providerTasks]} />
            </Col>
            <Col md={6}>
              <Widget title={<h5>Recent Activity</h5>}>
                <TableContainer data={providerTable} />
              </Widget>
            </Col>
          </Row>
        </Col>
        <Col lg={4} xs={12}>
          <Widget title={<h5>Calendar</h5>}>
            <Calendar />
          </Widget>
          <Widget title={<h5>Deadlines</h5>}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {providerDeadlines.map((d, i) => (
                <li key={i} style={{ marginBottom: 10 }}>
                  <i className="fa fa-calendar text-info me-2" />{d.task}
                  <span style={{ float: 'right', color: '#aaa', fontSize: 13 }}>{d.due}</span>
                </li>
              ))}
            </ul>
          </Widget>
          <Widget title={<h5>Messages & Notifications</h5>}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {providerMessages.map((m, i) => (
                <li key={i} style={{ marginBottom: 10 }}>
                  <b>{m.from}:</b> {m.content}
                  <span style={{ float: 'right', color: '#aaa', fontSize: 13 }}>{m.time}</span>
                </li>
              ))}
            </ul>
          </Widget>
          <Widget title={<h5>News & Insights</h5>}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {providerNews.map((n, i) => (
                <li key={i} style={{ marginBottom: 10 }}>
                  <button style={{ fontWeight: 600, background: 'none', border: 'none', color: '#007bff', padding: 0, cursor: 'pointer' }}>{n.title}</button>
                  <span style={{ color: '#888', marginLeft: 8 }}>{n.source}</span>
                  <span style={{ float: 'right', color: '#aaa', fontSize: 13 }}>{n.time}</span>
                </li>
              ))}
            </ul>
          </Widget>
        </Col>
      </Row>
    </div>
  );
};

export default ProviderDashboardPage;
