import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'react-redux';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import Widget from '../../components/Widget';
import api from '../../services/api';

const MyApplicants = ({ currentUser, match }) => {
  const [applicants, setApplicants] = useState([]);
  const gigId = match.params.id;

  const fetchApplicants = useCallback(async () => {
    if (currentUser) {
      try {
        const { data } = await api.getGigApplications(gigId);
        setApplicants(data);
      } catch (error) {
        console.error('Error fetching applicants', error);
      }
    }
  }, [currentUser, gigId]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleAccept = async (applicationId) => {
    try {
      await api.acceptApplication(applicationId);
      fetchApplicants(); // Refresh the list
    } catch (error) {
      console.error('Error accepting application', error);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await api.rejectApplication(applicationId);
      fetchApplicants(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting application', error);
    }
  };

  return (
    <div>
      <h2 className="page-title">My Applicants</h2>
      <Widget title="Applicants for My Gig" collapse close>
        <ListGroup>
          {applicants.map(applicant => (
            <ListGroupItem key={applicant.id}>
              <div>
                <h5>{applicant.username}</h5>
                <p>Status: {applicant.status}</p>
              </div>
              <div>
                <Button color="success" onClick={() => handleAccept(applicant.id)} className="mr-2">Accept</Button>
                <Button color="danger" onClick={() => handleReject(applicant.id)}>Reject</Button>
              </div>
            </ListGroupItem>
          ))}
        </ListGroup>
      </Widget>
    </div>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(MyApplicants);