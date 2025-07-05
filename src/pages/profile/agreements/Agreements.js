import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Table,
  Spinner,
} from 'reactstrap';
import s from './Agreements.module.scss';
import api from '../../../services/api';

const Agreements = ({ currentUser }) => {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchAgreements();
    }
  }, [currentUser]);

  const fetchAgreements = async () => {
    try {
      const response = await api.getAgreements();
      setAgreements(response.data);
    } catch (err) {
      setError(err.message);
      setAgreements([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle className="h5">Agreements</CardTitle>
              {loading && <Spinner color="primary" />}
              {error && <p className="text-danger">{error}</p>}
              {!loading && !error && (
                <Table className={s.customTable} responsive>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agreements.map((agreement) => (
                      <tr key={agreement.id}>
                        <td>{agreement.id}</td>
                        <td>{agreement.title}</td>
                        <td>{agreement.status}</td>
                        <td>{new Date(agreement.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(Agreements);