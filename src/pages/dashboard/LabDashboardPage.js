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

// Additional mock data for Lab Dashboard
const labNews = [
  { title: 'AI Accelerates Protein Design', source: 'Nature News', time: '1h ago' },
  { title: 'Lab Automation Trends 2025', source: 'LabTech', time: '3h ago' },
  { title: 'BioShift Connect Launches New API', source: 'BioShift Blog', time: 'Today' },
];
const labMessages = [
  { from: 'BioShift Connect', content: 'Integration with Google Drive successful.', time: 'Just now' },
  { from: 'System', content: 'New applicant: Elena Vance for "Protein Purification".', time: '10m ago' },
  { from: 'Payments', content: 'Payment released to Dr. Smith.', time: '1h ago' },
];
const labDeadlines = [
  { task: 'Submit grant proposal', due: '2025-07-05' },
  { task: 'Review gig applications', due: '2025-07-03' },
  { task: 'Order reagents', due: '2025-07-04' },
];
const labTasks = [
  { id: 10, type: 'Approval', title: 'Approve payment for "Genomics Analysis"', time: '09:30' },
  { id: 11, type: 'Meeting', title: 'Schedule team meeting', time: '11:00' },
  { id: 12, type: 'Upload', title: 'Upload SOP for new protocol', time: '13:00' },
  { id: 13, type: 'Alert', title: 'Respond to BioShift Connect alert', time: '15:00' },
];
const labKPIs = [
  { product: 'Active Gigs', total: '12', color: 'primary', registrations: { value: 4, profit: true }, bounce: { value: 2.1, profit: true } },
  { product: 'Pending Payments', total: '$8,200', color: 'success', registrations: { value: 2, profit: false }, bounce: { value: 1.2, profit: false } },
  { product: 'Upcoming Deadlines', total: '3', color: 'warning', registrations: { value: 1, profit: true }, bounce: { value: 0.5, profit: true } },
  { product: 'Unread Messages', total: '5', color: 'danger', registrations: { value: 3, profit: true }, bounce: { value: 0.8, profit: false } },
];
const labTable = [
  { name: 'Elena Vance', email: 'elena@lab.com', product: 'Protein Purification', price: '$2,000', date: '2025-07-01', city: 'Boston', status: 'Pending' },
  { name: 'Dr. Smith', email: 'smith@lab.com', product: 'Genomics Analysis', price: '$5,000', date: '2025-06-28', city: 'San Diego', status: 'Sent' },
  { name: 'Lab Automation', email: 'auto@lab.com', product: 'Automation Setup', price: '$1,200', date: '2025-06-25', city: 'Austin', status: 'Declined' },
  { name: 'SOP Upload', email: 'sop@lab.com', product: 'Protocol Update', price: '$0', date: '2025-06-20', city: 'Remote', status: 'Sent' },
];

const LabDashboardPage = () => {
  const dispatch = useDispatch();
  const { mainChart, isReceiving } = useSelector(state => state.analytics);

  useEffect(() => {
    dispatch(receiveDataRequest());
  }, [dispatch]);

  return (
    <div className="container-fluid mt-4" style={{ maxWidth: 1600 }}>
      <Row className="mb-4">
        {labKPIs.map((stat, idx) => (
          <Col key={idx} md={3} sm={6} xs={12} className="mb-3">
            <BigStat {...stat} />
          </Col>
        ))}
      </Row>
      <Row>
        <Col lg={8} xs={12}>
          <Widget title={<h5>Lab Analytics</h5>}>
            <MainChart data={mainChart} isReceiving={isReceiving} />
          </Widget>
          <Row>
            <Col md={6}>
              <TaskContainer data={[...mock.tasks, ...labTasks]} />
            </Col>
            <Col md={6}>
              <Widget title={<h5>Recent Activity</h5>}>
                <TableContainer data={labTable} />
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
              {labDeadlines.map((d, i) => (
                <li key={i} style={{ marginBottom: 10 }}>
                  <i className="fa fa-calendar text-info me-2" />{d.task}
                  <span style={{ float: 'right', color: '#aaa', fontSize: 13 }}>{d.due}</span>
                </li>
              ))}
            </ul>
          </Widget>
          <Widget title={<h5>Messages & Notifications</h5>}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {labMessages.map((m, i) => (
                <li key={i} style={{ marginBottom: 10 }}>
                  <b>{m.from}:</b> {m.content}
                  <span style={{ float: 'right', color: '#aaa', fontSize: 13 }}>{m.time}</span>
                </li>
              ))}
            </ul>
          </Widget>
          <Widget title={<h5>News & Insights</h5>}>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {labNews.map((n, i) => (
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

export default LabDashboardPage;
