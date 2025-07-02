import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col } from 'reactstrap';
import Widget from '../../components/Widget/Widget';
import MainChart from '../analytics/components/Charts/MainChart';
import BigStat from '../analytics/components/BigStat/BigStat';
import { receiveDataRequest } from '../../actions/analytics';
import mock from '../analytics/mock';

const LabDashboardPage = () => {
  const dispatch = useDispatch();
  const { mainChart, isReceiving } = useSelector(state => state.analytics);

  useEffect(() => {
    dispatch(receiveDataRequest());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <h2>Lab Dashboard</h2>
      <Row>
        <Col lg={12} xs={12}>
          <MainChart data={mainChart} isReceiving={isReceiving} />
        </Col>
        <Col xs={12} lg={6} xl={4}>
          <BigStat {...mock.bigStat[0]} />
        </Col>
        <Col xs={12} lg={6} xl={4}>
          <BigStat {...mock.bigStat[1]} />
        </Col>
        <Col xs={12} lg={6} xl={4}>
          <BigStat {...mock.bigStat[2]} />
        </Col>
        <Col xs={12} className="mb-lg">
          <Widget
            className="pb-0"
            bodyClass={`mt p-0`}
            title={<h4> Support <strong>Requests</strong></h4>}
            close
          >
            <ul>
              <li>Project "Protein Purification" marked as Completed</li>
              <li>New applicant for "Cell Culture Scale-Up"</li>
              <li>Project "Analytical Method Validation" posted</li>
            </ul>
          </Widget>
        </Col>
      </Row>
    </div>
  );
};

export default LabDashboardPage;
