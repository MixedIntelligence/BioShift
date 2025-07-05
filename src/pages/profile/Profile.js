import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import cx from 'classnames';
import {
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Alert,
} from 'reactstrap';
import Widget from '../../components/Widget';
import api from '../../services/api';

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

const Profile = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('1');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    headline: '',
    bio: '',
    phone: '',
    location: '',
    ...currentUser
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        headline: currentUser.headline || '',
        bio: currentUser.bio || '',
        phone: currentUser.phone || '',
        location: currentUser.location || '',
        ...currentUser
      });
    }
  }, [currentUser]);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: Implement updateProfile API call
      // await api.updateProfile(profileData);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      setSaveError('Failed to save profile. Please try again.');
      setTimeout(() => setSaveError(null), 3000);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setProfileData({
      headline: currentUser?.headline || '',
      bio: currentUser?.bio || '',
      phone: currentUser?.phone || '',
      location: currentUser?.location || '',
      ...currentUser
    });
  };

  return (
  <div className={s.root}>
    <h1 className="page-title">User - <span className="fw-semi-bold">Profile</span>
    </h1>

    {saveSuccess && (
      <Alert color="success">Profile updated successfully!</Alert>
    )}
    {saveError && (
      <Alert color="danger">{saveError}</Alert>
    )}

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
                <h5 className="fw-normal">{currentUser?.first_name || 'User'} <span className="fw-semi-bold">{currentUser?.last_name || ''}</span></h5>
                <p>{profileData.headline || 'Professional Title'}</p>
                <button className="btn btn-success btn-sm mb-3">
                  Send
                  <i className="fa fa-envelope ms-2" />
                </button>
                <div>
                  <ul className={cx(s.profileContacts, 'mt-sm')}>
                    <li><i className="fa fa-lg fa-phone fa-fw me-2" /><button className="btn-link"> {profileData.phone || 'No phone'}</button></li>
                    <li><i className="fa fa-lg fa-envelope fa-fw me-2" /><button className="btn-link"> {currentUser?.email || 'No email'}</button></li>
                    <li><i className="fa fa-lg fa-map-marker fa-fw me-2" /><button className="btn-link"> {profileData.location || 'No location'}</button></li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col md={7} xs={12}>
              <div className="stats-row mt-3">
                <div className={[s.profileStat, 'stat-item'].join(' ')}>
                  <p className={[s.profileStatValue, 'value text-right'].join(' ')}>0</p>
                  <h6 className="name">Gigs</h6>
                </div>
                <div className={[s.profileStat, 'stat-item'].join(' ')}>
                  <p className={[s.profileStatValue, 'value text-right'].join(' ')}>0</p>
                  <h6 className="name">Rating</h6>
                </div>
                <div className={[s.profileStat, 'stat-item'].join(' ')}>
                  <p className={[s.profileStatValue, 'value text-right'].join(' ')}>0</p>
                  <h6 className="name">Reviews</h6>
                </div>
              </div>
              <p>
                <span className="badge bg-info rounded-0"> {currentUser?.role || 'User'} </span>
                <span className="badge bg-primary rounded-0 ms-2"> BioMVP </span>
              </p>
              
              {!isEditing ? (
                <div>
                  <div className="d-flex justify-content-between align-items-center">
                    <h6>Profile Information</h6>
                    <Button color="primary" size="sm" onClick={() => setIsEditing(true)}>
                      <i className="fa fa-edit me-2" />
                      Edit Profile
                    </Button>
                  </div>
                  <p className="lead mt-3">
                    <strong>Headline:</strong> {profileData.headline || 'No headline set'}
                  </p>
                  <p className="text-muted">
                    <strong>Bio:</strong> {profileData.bio || 'No bio set'}
                  </p>
                </div>
              ) : (
                <Form className="mt-3">
                  <FormGroup>
                    <Label for="headline">Professional Headline</Label>
                    <Input
                      type="text"
                      name="headline"
                      id="headline"
                      value={profileData.headline}
                      onChange={handleInputChange}
                      placeholder="e.g., Research Scientist, Lab Technician, etc."
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="bio">Bio</Label>
                    <Input
                      type="textarea"
                      name="bio"
                      id="bio"
                      rows="3"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself, your experience, and what makes you unique..."
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="phone">Phone Number</Label>
                    <Input
                      type="text"
                      name="phone"
                      id="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      placeholder="Your phone number"
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="location">Location</Label>
                    <Input
                      type="text"
                      name="location"
                      id="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      placeholder="City, State/Country"
                    />
                  </FormGroup>
                  <div className="d-flex gap-2">
                    <Button color="success" onClick={handleSaveProfile}>
                      <i className="fa fa-save me-2" />
                      Save Changes
                    </Button>
                    <Button color="secondary" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
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

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(Profile);
