import React, { useState } from 'react';
import { connect } from 'react-redux';
import gigs from './mock';
import { Card, CardBody, CardTitle, CardText, Button, Row, Col, Badge, Nav, NavItem, NavLink, Progress, Table } from 'reactstrap';
import classnames from 'classnames';

const MyGigsPage = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('active');
  if (!currentUser) return null;
  const role = currentUser.role;
  let myGigs = [];

  if (role === 'lab') {
    myGigs = gigs;
  } else if (role === 'worker') {
    myGigs = gigs.filter(g => g.applicants && g.applicants.includes(currentUser.id));
  } else {
    myGigs = [];
  }

  const activeGigs = myGigs.filter(g => g.status === 'Open' || g.status === 'Awarded' || g.status === 'Applied');
  const completedGigs = myGigs.filter(g => g.status === 'Completed');
  const paymentGigs = myGigs.filter(g => g.status === 'Awarded' || g.status === 'Completed');

  return (
    <div className="container mt-4">
      <h2>My Gigs</h2>
      <Nav tabs className="mb-3">
        <NavItem>
          <NavLink className={classnames({ active: activeTab === 'active' })} onClick={() => setActiveTab('active')}>Active</NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={classnames({ active: activeTab === 'completed' })} onClick={() => setActiveTab('completed')}>Completed</NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={classnames({ active: activeTab === 'history' })} onClick={() => setActiveTab('history')}>History</NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={classnames({ active: activeTab === 'payments' })} onClick={() => setActiveTab('payments')}>Payments</NavLink>
        </NavItem>
      </Nav>
      {activeTab === 'active' && (
        <Row>
          {activeGigs.length === 0 && <Col><p>No active gigs.</p></Col>}
          {activeGigs.map(gig => (
            <Col md={6} lg={4} key={gig.id} className="mb-4">
              <Card>
                <CardBody>
                  <CardTitle tag="h5">{gig.title} <Badge color={gig.status === 'Awarded' ? 'success' : gig.status === 'Applied' ? 'info' : 'primary'}>{gig.status}</Badge></CardTitle>
                  <CardText>{gig.description}</CardText>
                  <CardText>
                    <strong>Skills:</strong> {gig.requiredSkills.join(', ')}<br/>
                    <strong>Duration:</strong> {gig.duration}<br/>
                    <strong>Location:</strong> {gig.location}<br/>
                    <strong>Pay Rate:</strong> {gig.payRate}<br/>
                    <strong>Lab:</strong> {gig.lab.name}
                  </CardText>
                  <Progress value={gig.status === 'Awarded' ? 80 : gig.status === 'Applied' ? 40 : 20} className="mb-2" />
                  <Button color="primary" href={`#/app/gigs/${gig.id}`}>View Details</Button>{' '}
                  <Button color="secondary">Message</Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {activeTab === 'completed' && (
        <Row>
          {completedGigs.length === 0 && <Col><p>No completed gigs.</p></Col>}
          {completedGigs.map(gig => (
            <Col md={6} lg={4} key={gig.id} className="mb-4">
              <Card>
                <CardBody>
                  <CardTitle tag="h5">{gig.title} <Badge color="secondary">Completed</Badge></CardTitle>
                  <CardText>{gig.description}</CardText>
                  <CardText>
                    <strong>Skills:</strong> {gig.requiredSkills.join(', ')}<br/>
                    <strong>Duration:</strong> {gig.duration}<br/>
                    <strong>Location:</strong> {gig.location}<br/>
                    <strong>Pay Rate:</strong> {gig.payRate}<br/>
                    <strong>Lab:</strong> {gig.lab.name}
                  </CardText>
                  <Progress value={100} className="mb-2" color="success" />
                  <Button color="primary" href={`#/app/gigs/${gig.id}`}>View Details</Button>{' '}
                  <Button color="info">Download Certificate</Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      {activeTab === 'history' && (
        <Table striped responsive>
          <thead>
            <tr>
              <th>Gig</th>
              <th>Status</th>
              <th>Lab</th>
              <th>Duration</th>
              <th>Pay Rate</th>
              <th>Completed</th>
            </tr>
          </thead>
          <tbody>
            {myGigs.length === 0 && <tr><td colSpan={6}>No history.</td></tr>}
            {myGigs.map(gig => (
              <tr key={gig.id}>
                <td>{gig.title}</td>
                <td><Badge color={gig.status === 'Completed' ? 'secondary' : gig.status === 'Awarded' ? 'success' : gig.status === 'Applied' ? 'info' : 'primary'}>{gig.status}</Badge></td>
                <td>{gig.lab.name}</td>
                <td>{gig.duration}</td>
                <td>{gig.payRate}</td>
                <td>{gig.status === 'Completed' ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {activeTab === 'payments' && (
        <Table striped responsive>
          <thead>
            <tr>
              <th>Gig</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Payment Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {paymentGigs.length === 0 && <tr><td colSpan={5}>No payment records.</td></tr>}
            {paymentGigs.map(gig => (
              <tr key={gig.id}>
                <td>{gig.title}</td>
                <td><Badge color={gig.status === 'Completed' ? 'secondary' : gig.status === 'Awarded' ? 'success' : gig.status === 'Applied' ? 'info' : 'primary'}>{gig.status}</Badge></td>
                <td>{gig.payRate}</td>
                <td>{gig.status === 'Completed' ? 'Paid' : 'Pending'}</td>
                <td><Button color="info" size="sm">Download Invoice</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default connect(state => ({ currentUser: state.auth.currentUser }))(MyGigsPage);
