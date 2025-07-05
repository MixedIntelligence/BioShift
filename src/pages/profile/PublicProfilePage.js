import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardBody, CardTitle, CardText, Spinner, Alert } from 'reactstrap';
import api from '../../services/api';

const PublicProfilePage = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getUserProfile(userId)
      .then(response => {
        setUser(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return <Spinner style={{ width: '3rem', height: '3rem' }} />;
  }

  if (error) {
    return <Alert color="danger">Error loading user profile: {error.message}</Alert>;
  }

  if (!user) {
    return <Alert color="warning">User not found.</Alert>;
  }

  return (
    <div className="container mt-4">
      <Card>
        <CardBody>
          <CardTitle tag="h3">{user.username}</CardTitle>
          <CardText>**Email:** {user.email}</CardText>
          <CardText>**Bio:** {user.bio || 'Not provided.'}</CardText>
          <CardText>**Skills:** {user.skills ? user.skills.join(', ') : 'Not provided.'}</CardText>
        </CardBody>
      </Card>
    </div>
  );
};

export default PublicProfilePage;