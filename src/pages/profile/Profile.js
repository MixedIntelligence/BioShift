import React, { useState } from 'react';
import cx from 'classnames';
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';
import Widget from '../../components/Widget';

import p19 from '../../images/pictures/19.jpg';
import a5 from '../../images/people/a5.jpg';

import s from './Profile.module.scss';
import Skills from './skills/Skills';
import Education from './education/Education';
import Publications from './publications/Publications';
import Documents from './documents/Documents';
import Payments from './payments/Payments';
import Agreements from './agreements/Agreements';
import Transactions from './transactions/Transactions';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('1');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
  <div className={s.root}>
    <h1 className="page-title">User - <span className="fw-semi-bold">Profile</span>
    </h1>

    <Row>
      <Col lg={6} xs={12}>
        <Widget>
          <div className="widget-top-overflow text-white">
            <div className="height-250 overflow-hidden">
              <img className="img-fluid" src={p19} alt="..." />
            </div>
            <button className="btn btn-outline btn-sm mb-2">
              <i className="fa fa-twitter me-2" />
              Follow
            </button>
          </div>
          <Row>
            <Col md={5} xs={12} className="text-center">
              <div className={s.profileContactContainer}>
                <span className="thumb-xl mb-3">
                  <img className={[s.profileAvatar, 'rounded-circle'].join(' ')} src={a5} alt="..." />
                </span>
                <h5 className="fw-normal">Adam <span className="fw-semi-bold">Johns</span></h5>
                <p>UI/UX designer</p>
                <button className="btn btn-success btn-sm mb-3">
                  Send
                  <i className="fa fa-envelope ms-2" />
                </button>
                <div>
                  <ul className={cx(s.profileContacts, 'mt-sm')}>
                    <li><i className="fa fa-lg fa-phone fa-fw me-2" /><button className="btn-link"> +375 29 555-55-55</button></li>
                    <li><i className="fa fa-lg fa-envelope fa-fw me-2" /><button className="btn-link"> psmith@example.com</button></li>
                    <li><i className="fa fa-lg fa-map-marker fa-fw me-2" /><button className="btn-link"> Minsk, Belarus</button></li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col md={7} xs={12}>
              <div className="stats-row mt-3">
                <div className={[s.profileStat, 'stat-item'].join(' ')}>
                  <p className={[s.profileStatValue, 'value text-right'].join(' ')}>251</p>
                  <h6 className="name">Posts</h6>
                </div>
                <div className={[s.profileStat, 'stat-item'].join(' ')}>
                  <p className={[s.profileStatValue, 'value text-right'].join(' ')}>9.38%</p>
                  <h6 className="name">Conversion</h6>
                </div>
                <div className={[s.profileStat, 'stat-item'].join(' ')}>
                  <p className={[s.profileStatValue, 'value text-right'].join(' ')}>842</p>
                  <h6 className="name">Followers</h6>
                </div>
              </div>
              <p>
                <span className="badge bg-info rounded-0"> UI/UX </span>
                <span className="badge bg-primary rounded-0 ms-2"> Web Design </span>
                <span className="badge bg-default rounded-0 ms-2"> Mobile Apps </span>
              </p>
              <p className="lead mt-xlg">
                My name is Adam Johns and here is my new Sing user profile page.
              </p>
              <p className="text-muted">
                I love reading people&apos;s summaries page especially those who are in the same industry as me.
                Sometimes it&apos;s much easier to find your concentration during the night.
              </p>
            </Col>
          </Row>
        </Widget>
      </Col>
      <Col lg={6} xs={12}>
        <Nav tabs>
          <NavItem>
            <NavLink
              className={cx({ active: activeTab === '1' })}
              onClick={() => { toggle('1'); }}
            >
              Skills
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={cx({ active: activeTab === '2' })}
              onClick={() => { toggle('2'); }}
            >
              Education
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={cx({ active: activeTab === '3' })}
              onClick={() => { toggle('3'); }}
            >
              Publications
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={cx({ active: activeTab === '4' })}
              onClick={() => { toggle('4'); }}
            >
              Documents
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={cx({ active: activeTab === '5' })}
              onClick={() => { toggle('5'); }}
            >
              Payments
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={cx({ active: activeTab === '6' })}
              onClick={() => { toggle('6'); }}
            >
              Agreements
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={cx({ active: activeTab === '7' })}
              onClick={() => { toggle('7'); }}
            >
              Transactions
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <Skills />
          </TabPane>
          <TabPane tabId="2">
            <Education />
          </TabPane>
          <TabPane tabId="3">
            <Publications />
          </TabPane>
          <TabPane tabId="4">
            <Documents />
          </TabPane>
          <TabPane tabId="5">
            <Payments />
          </TabPane>
          <TabPane tabId="6">
            <Agreements />
          </TabPane>
          <TabPane tabId="7">
            <Transactions />
          </TabPane>
        </TabContent>
      </Col>
    </Row>
  </div>
  );
};

export default Profile;
