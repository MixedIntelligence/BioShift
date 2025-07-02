import React from 'react';
import { Row, Col } from 'reactstrap';
import Widget from '../../components/Widget/Widget';

const ProviderDashboardPage = () => (
  <div className="container mt-4">
    <h2>Provider Dashboard</h2>
    <Row>
      <Col xs={12} lg={6} xl={4}>
        <Widget title={<h5>Potential Collaborations</h5>}>
          <ul>
            <li>LabLeap: 3 new startup/lab matches</li>
            <li>2 new partnership requests</li>
            <li>1 contract pending review</li>
          </ul>
        </Widget>
      </Col>
      <Col xs={12} lg={6} xl={4}>
        <Widget title={<h5>Recent Activity</h5>}>
          <ul>
            <li>Messaged by "Innovate Bio"</li>
            <li>Invited to join "Protein Purification" project</li>
            <li>Profile viewed by 4 labs</li>
          </ul>
        </Widget>
      </Col>
      <Col xs={12} lg={6} xl={4}>
        <Widget title={<h5>Provider Stats</h5>}>
          <ul>
            <li>Active Collaborations: 2</li>
            <li>Pending Offers: 1</li>
            <li>Completed Projects: 5</li>
          </ul>
        </Widget>
      </Col>
    </Row>
  </div>
);

export default ProviderDashboardPage;
