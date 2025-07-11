import React from 'react';
import {
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import a1 from '../../../images/people/a1.jpg';
import a2 from '../../../images/people/a2.jpg';
import a4 from '../../../images/people/a4.jpg';
import a6 from '../../../images/people/a6.jpg';
import avatar from '../../../images/avatar.png';
import s from './ListGroup.module.scss'; // eslint-disable-line

class Messages2Demo extends React.Component {
  render() {
    return (
      <ListGroup className={[s.listGroup, 'thin-scroll'].join(' ')}>
        <ListGroupItem className={[s.listGroupItem, 'bg-warning-light'].join(' ')}>
          <span className={[s.notificationIcon, 'thumb-sm'].join(' ')}>
            <img className="rounded-circle" src={a2} alt="..." />
            <i className="status status-bottom bg-success" />
          </span>
          <time className="text-link help float-end">10 sec ago</time>
          <h6 className="m-0 fw-bold mb-1">Chris Gray</h6>
          <p className="deemphasize text-ellipsis m-0">Hey! What's up? So many times since we</p>
        </ListGroupItem>
        {/* ...other demo items... */}
      </ListGroup>
    );
  }
}

export default Messages2Demo;
