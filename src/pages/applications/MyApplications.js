import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, CardHeader, CardBody, Table, Badge, Button, Alert, Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-toastify';
import Widget from '../../components/Widget';
import s from './MyApplications.module.scss';

const MyApplications = ({ currentUser }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getUserApplications();
      setApplications(response.data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again.');
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: { color: 'warning', text: 'Pending' },
      accepted: { color: 'success', text: 'Accepted' },
      rejected: { color: 'danger', text: 'Rejected' },
      withdrawn: { color: 'secondary', text: 'Withdrawn' }
    };
    
    const statusInfo = statusMap[status?.toLowerCase()] || { color: 'info', text: status || 'Unknown' };
    return <Badge color={statusInfo.color}>{statusInfo.text}</Badge>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPayment = (payRate) => {
    if (!payRate) return 'Not specified';
    
    // If it's already a formatted string, return as is
    if (typeof payRate === 'string' && isNaN(payRate)) {
      return payRate;
    }
    
    // If it's a number, format as currency
    if (typeof payRate === 'number' || !isNaN(payRate)) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(Number(payRate));
    }
    
    return payRate;
  };

  if (loading) {
    return (
      <div className={s.root}>
        <h2 className="page-title">My Applications</h2>
        <Widget>
          <div className="text-center p-4">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p>Loading your applications...</p>
          </div>
        </Widget>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.root}>
        <h2 className="page-title">My Applications</h2>
        <Alert color="danger">
          <strong>Error:</strong> {error}
          <Button color="primary" size="sm" className="ml-2" onClick={fetchApplications}>
            Try Again
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className={s.root}>
      <h2 className="page-title">My Applications</h2>
      
      <Row>
        <Col>
          <Widget>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Gigs I've Applied To</h5>
              <Badge color="info">{applications.length} Total</Badge>
            </div>
            
            {applications.length === 0 ? (
              <div className="text-center py-5">
                <div className="mb-3">
                  <i className="fa fa-search fa-3x text-muted"></i>
                </div>
                <h4 className="text-muted">No Applications Yet</h4>
                <p className="text-muted mb-4">
                  You haven't applied to any gigs yet. Start exploring available opportunities!
                </p>
                <Link to="/app/gigs" className="btn btn-primary">
                  Browse Gigs
                </Link>
              </div>
            ) : (
              <div className="table-responsive">
                <Table className="table-borderless" style={{ marginBottom: 0 }}>
                  <thead>
                    <tr>
                      <th>Gig Title</th>
                      <th>Company</th>
                      <th>Location</th>
                      <th>Payment</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id}>
                        <td>
                          <Link 
                            to={`/app/gigs/${app.gig_id}`}
                            className="text-decoration-none"
                          >
                            <strong>{app.title || 'Untitled Gig'}</strong>
                          </Link>
                          <div className="text-muted small">
                            {app.description && app.description.length > 100 
                              ? app.description.substring(0, 100) + '...'
                              : app.description || 'No description available'
                            }
                          </div>
                        </td>
                        <td>
                          <div>{app.lab_name || (app.lab_first_name && app.lab_last_name ? app.lab_first_name + ' ' + app.lab_last_name : app.lab_email) || 'Not specified'}</div>
                          <div className="text-muted small">{app.lab_email}</div>
                        </td>
                        <td>
                          <div>{app.location || 'Not specified'}</div>
                          <div className="text-muted small">Remote/On-site</div>
                        </td>
                        <td>
                          <div>{formatPayment(app.pay_rate)}</div>
                          <div className="text-muted small">Rate</div>
                        </td>
                        <td>
                          <div>{formatDate(app.applied_at)}</div>
                          <div className="text-muted small">
                            {app.applied_at && new Date(app.applied_at).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(app.status)}
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <Link 
                              to={`/app/gigs/${app.gig_id}`}
                              className="btn btn-sm btn-outline-primary"
                            >
                              View Gig
                            </Link>
                            {app.status === 'pending' && (
                              <Button 
                                color="outline-secondary" 
                                size="sm"
                                onClick={() => {
                                  // TODO: Implement withdraw application
                                  toast.info('Withdraw application feature coming soon');
                                }}
                              >
                                Withdraw
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Widget>
        </Col>
      </Row>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser
});

export default connect(mapStateToProps)(MyApplications);
