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

// Additional mock data for Worker Dashboard
const workerNews = [
  { title: 'Lab Worker AI Upskilling', source: 'LabTech News', time: '2h ago' },
  { title: 'BioShift Connect: New Features', source: 'BioShift Blog', time: 'Today' },
  { title: 'Remote Lab Work Best Practices', source: 'Science Daily', time: '1d ago' },
];
const workerMessages = [
  { from: 'BioShift Connect', content: 'You have been matched to a new gig: "Protein Purification".', time: 'Just now' },
  { from: 'System', content: 'Credential verified for "Cell Culture Scale-Up".', time: '30m ago' },
  { from: 'Payments', content: 'Payment received: $3,500.', time: '2h ago' },
];
const workerDeadlines = [
  { task: 'Submit gig application', due: '2025-07-03' },
  { task: 'Complete upskill course', due: '2025-07-10' },
];
const workerTasks = [
  { id: 20, type: 'Application', title: 'Apply to "Genomics Data Analysis"', time: '10:00' },
  { id: 21, type: 'Upload', title: 'Upload new certification', time: '12:00' },
  { id: 22, type: 'Review', title: 'Review gig feedback', time: '14:00' },
  { id: 23, type: 'Alert', title: 'Respond to Connect alert', time: '15:00' },
  { id: 24, type: 'Profile', title: 'Update profile', time: '16:00' },
];
const workerKPIs = [
  { product: 'Total Gigs', total: '18', color: 'primary', registrations: { value: 6, profit: true }, bounce: { value: 2.5, profit: true } },
  { product: 'Active Gigs', total: '5', color: 'success', registrations: { value: 2, profit: false }, bounce: { value: 1.1, profit: false } },
  { product: 'Earnings', total: '$12,400', color: 'warning', registrations: { value: 3, profit: true }, bounce: { value: 0.7, profit: true } },
  { product: 'Unread Messages', total: '6', color: 'danger', registrations: { value: 4, profit: true }, bounce: { value: 1.0, profit: false } },
];
const workerTable = [
  { name: 'Protein Purification', email: 'lab@biomvp.com', product: 'Gig', price: '$2,000', date: '2025-07-01', city: 'Boston', status: 'Pending' },
  { name: 'Genomics Data Analysis', email: 'lab@biomvp.com', product: 'Gig', price: '$3,500', date: '2025-06-28', city: 'San Diego', status: 'Sent' },
  { name: 'Cell Culture Scale-Up', email: 'lab@biomvp.com', product: 'Upskill', price: '$0', date: '2025-06-25', city: 'Remote', status: 'Sent' },
  { name: 'Credential Upload', email: 'lab@biomvp.com', product: 'Profile', price: '$0', date: '2025-06-20', city: 'Remote', status: 'Sent' },
];

const WorkerDashboardPage = () => {
  const dispatch = useDispatch();
  const { mainChart, isReceiving } = useSelector(state => state.analytics);

  useEffect(() => {
    dispatch(receiveDataRequest());
  }, [dispatch]);

  return (
    <div className="container-fluid mt-4" style={{ maxWidth: 1600 }}>
      <Row className="mb-4">
        {workerKPIs.map((stat, idx) => (
          <Col key={idx} md={3} sm={6} xs={12} className="mb-3">
            <BigStat {...stat} />
          </Col>
        ))}
      </Row>
      <Row>
        <Col lg={8} xs={12}>
          <Widget title={<h5>Worker Analytics</h5>}>
            <MainChart data={mainChart} isReceiving={isReceiving} />
          </Widget>
          <Row>
            <Col md={6}>
              <TaskContainer data={[...mock.tasks, ...workerTasks]} />
            </Col>
            <Col md={6}>
              <Widget title={<h5>Recent Activity</h5>}>
                <TableContainer data={workerTable} />
              </Widget>
            </Col>
          </Row>
          {/* Removed the row for Map and Chats */}
        </Col>
        <Col lg={4} xs={12}>
          <Widget title={<h5>Calendar</h5>}>
            <Calendar />
          </Widget>
          <Widget title={<h5>Deadlines</h5>}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {workerDeadlines.map((d, i) => (
                <li key={i} style={{ marginBottom: 10 }}>
                  <i className="fa fa-calendar text-info me-2" />{d.task}
                  <span style={{ float: 'right', color: '#aaa', fontSize: 13 }}>{d.due}</span>
                </li>
              ))}
            </ul>
          </Widget>
          <Widget title={<h5>Messages & Notifications</h5>}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {workerMessages.map((m, i) => (
                <li key={i} style={{ marginBottom: 10 }}>
                  <b>{m.from}:</b> {m.content}
                  <span style={{ float: 'right', color: '#aaa', fontSize: 13 }}>{m.time}</span>
                </li>
              ))}
            </ul>
          </Widget>
          <Widget title={<h5>News & Insights</h5>}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {workerNews.map((n, i) => (
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

export default WorkerDashboardPage;
