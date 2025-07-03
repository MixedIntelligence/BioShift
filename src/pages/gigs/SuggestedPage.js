import React from 'react';
import { connect } from 'react-redux';
import gigs from './mock';
import users from '../../mockUsers';
import { Button, Badge, Progress, Table } from 'reactstrap';
import Widget from '../../components/Widget/Widget';

const getInitials = (user) => {
  if (!user.firstName && !user.lastName) return '?';
  return `${user.firstName ? user.firstName[0] : ''}${user.lastName ? user.lastName[0] : ''}`.toUpperCase();
};

const SuggestedPage = ({ currentUser }) => {
  if (!currentUser) return null;
  const role = currentUser.role;

  let items = [];
  let title = '';

  if (role === 'worker') {
    items = gigs;
    title = 'Suggested Gigs';
  } else if (role === 'lab') {
    items = users.filter(u => u.role === 'worker');
    title = 'Suggested Talent';
  } else if (role === 'provider') {
    items = users.filter(u => u.role === 'lab');
    title = 'Suggested Labs';
  } else {
    items = [];
    title = 'Suggested';
  }

  return (
    <div className="container mt-4">
      <Widget title={<h4>{title}</h4>}>
        {items.length === 0 ? (
          <p>No suggestions found.</p>
        ) : (
          <Table responsive hover>
            <thead>
              <tr>
                <th></th>
                <th>{role === 'worker' ? 'Gig' : role === 'lab' ? 'Talent' : 'Lab'}</th>
                {role === 'lab' && <th>Skill Match</th>}
                {role === 'lab' && <th>Experience</th>}
                {role === 'lab' && <th>Publications</th>}
                {role === 'provider' && <th>Product Fit</th>}
                {role === 'provider' && <th>Skill Gaps</th>}
                {role === 'provider' && <th>Actionable Suggestion</th>}
                {role === 'worker' && <th>Status</th>}
                {role === 'worker' && <th>Lab</th>}
                <th>Skills</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td>
                    <span className="avatar bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{width:32,height:32,fontWeight:'bold'}}>
                      {getInitials(item)}
                    </span>
                  </td>
                  <td>
                    {role === 'worker' ? item.title : `${item.firstName} ${item.lastName}`}
                  </td>
                  {role === 'lab' && (
                    <>
                      <td style={{minWidth:120}}>
                        <Progress value={item.skillMatch || 0} color="success" className="mb-1" style={{height:8}} />
                        <span className="fs-sm">{item.skillMatch || 0}%</span>
                      </td>
                      <td>{item.experienceYears || 0} yrs</td>
                      <td><Badge color="info">{item.publications || 0}</Badge></td>
                    </>
                  )}
                  {role === 'provider' && (
                    <>
                      <td style={{minWidth:120}}>
                        <Progress value={item.productFit || 0} color="primary" className="mb-1" style={{height:8}} />
                        <span className="fs-sm">{item.productFit || 0}%</span>
                      </td>
                      <td>
                        {item.skillGaps && item.skillGaps.length > 0 ? (
                          item.skillGaps.map((gap, idx) => <Badge key={idx} color="warning" className="me-1">{gap}</Badge>)
                        ) : <Badge color="success">None</Badge>}
                      </td>
                      <td>
                        {item.productFit && item.productFit > 80 ? (
                          <span>High fit! Reach out to this lab for collaboration.</span>
                        ) : (
                          <span>Consider tailoring your product to address: {item.skillGaps && item.skillGaps.length > 0 ? item.skillGaps.join(', ') : 'N/A'}</span>
                        )}
                      </td>
                    </>
                  )}
                  {role === 'worker' && (
                    <>
                      <td><Badge color={item.status === 'Completed' ? 'secondary' : item.status === 'Awarded' ? 'success' : item.status === 'Applied' ? 'info' : 'primary'}>{item.status}</Badge></td>
                      <td>{item.lab.name}</td>
                    </>
                  )}
                  <td>
                    {(role === 'worker' ? item.requiredSkills : item.skills).map((skill, idx) => (
                      <Badge key={idx} color="secondary" className="me-1">{skill}</Badge>
                    ))}
                  </td>
                  <td>
                    {role === 'worker' && <Button color="primary" size="sm" href={`#/app/gigs/${item.id}`}>View</Button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Widget>
    </div>
  );
};

const mapStateToProps = state => ({
  currentUser: state.auth.currentUser
});

export default connect(mapStateToProps)(SuggestedPage);
