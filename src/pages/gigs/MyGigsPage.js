import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, CardText, Button, Row, Col, Badge, Nav, NavItem, NavLink, Progress, Table } from 'reactstrap';
import classnames from 'classnames';
import api from '../../services/api';

const MyGigsPage = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [myGigs, setMyGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        let response;
        if (currentUser?.role === 'Lab') {
          // Use the new API endpoint for labs to get their own gigs
          response = await api.getMyGigs();
        } else {
          // For workers, get all gigs and filter by applications later
          response = await api.getGigs();
        }
        setMyGigs(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching gigs", error);
        setLoading(false);
      }
    };
    if (currentUser) {
      fetchGigs();
    }
  }, [currentUser]);

  if (!currentUser) return null;
  if (loading) return <div className="container mt-4"><h4>Loading...</h4></div>;

  const activeGigs = myGigs.filter(g => g.status === 'open' || g.status === 'in_progress');
  const completedGigs = myGigs.filter(g => g.status === 'completed');
  const paymentGigs = myGigs.filter(g => g.status === 'completed' || g.status === 'awarded');

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
                  <CardTitle tag="h5">{gig.title} <Badge color={gig.status === 'awarded' ? 'success' : gig.status === 'applied' ? 'info' : 'primary'}>{gig.status}</Badge></CardTitle>
                  <CardText>{gig.description}</CardText>
                  <CardText>
                    <strong>Skills:</strong> {gig.required_skills || 'Not specified'}<br/>
                    <strong>Duration:</strong> {gig.duration || 'Not specified'}<br/>
                    <strong>Location:</strong> {gig.location || 'Not specified'}<br/>
                    <strong>Pay Rate:</strong> {gig.pay_rate || 'Not specified'}<br/>
                    <strong>Status:</strong> {gig.status}
                  </CardText>
                  <Progress value={gig.status === 'awarded' ? 80 : gig.status === 'applied' ? 40 : 20} className="mb-2" />
                  <div className="d-flex flex-wrap gap-2">
                    <Button color="primary" href={`#/app/gigs/${gig.id}`} size="sm">View Details</Button>
                    {currentUser?.role === 'Lab' && (
                      <Button color="info" href={`#/app/gigs/edit/${gig.id}`} size="sm">Edit</Button>
                    )}
                    <Button color="secondary" size="sm">Message</Button>
                  </div>
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
                    <strong>Skills:</strong> {gig.required_skills || 'Not specified'}<br/>
                    <strong>Duration:</strong> {gig.duration || 'Not specified'}<br/>
                    <strong>Location:</strong> {gig.location || 'Not specified'}<br/>
                    <strong>Pay Rate:</strong> {gig.pay_rate || 'Not specified'}<br/>
                    <strong>Status:</strong> {gig.status}
                  </CardText>
                  <Progress value={100} className="mb-2" color="success" />
                  <div className="d-flex flex-wrap gap-2">
                    <Button color="primary" href={`#/app/gigs/${gig.id}`} size="sm">View Details</Button>
                    {currentUser?.role === 'Lab' && (
                      <Button color="info" href={`#/app/gigs/edit/${gig.id}`} size="sm">Edit</Button>
                    )}
                    <Button color="success" size="sm">Download Certificate</Button>
                  </div>
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
                <td><Badge color={gig.status === 'completed' ? 'secondary' : gig.status === 'awarded' ? 'success' : gig.status === 'applied' ? 'info' : 'primary'}>{gig.status}</Badge></td>
                <td>{currentUser?.role === 'Lab' ? currentUser.first_name + ' ' + currentUser.last_name || currentUser.email : 'Lab'}</td>
                <td>{gig.duration || 'Not specified'}</td>
                <td>{gig.pay_rate || 'Not specified'}</td>
                <td>{gig.status === 'completed' ? 'Yes' : 'No'}</td>
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
                <td><Badge color={gig.status === 'completed' ? 'secondary' : gig.status === 'awarded' ? 'success' : gig.status === 'applied' ? 'info' : 'primary'}>{gig.status}</Badge></td>
                <td>{gig.pay_rate || 'Not specified'}</td>
                <td>{gig.status === 'completed' ? 'Paid' : 'Pending'}</td>
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
