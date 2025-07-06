import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Alert } from 'reactstrap';
import BrowseOfferings from './BrowseOfferings';
import ManageOfferings from './ManageOfferings';

class Offerings extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    dispatch: PropTypes.func.isRequired,
  };

  render() {
    const { currentUser } = this.props;
    
    // Check if user has access
    if (!currentUser || !['Lab', 'Worker', 'Provider'].includes(currentUser.role)) {
      return (
        <div className="container mt-4">
          <Alert color="danger">
            Access denied. Please contact your administrator if you believe this is an error.
          </Alert>
        </div>
      );
    }
    
    // Render appropriate component based on user role
    if (currentUser.role === 'Provider') {
      return <ManageOfferings />;
    } else {
      return <BrowseOfferings />;
    }
  }
}

function mapStateToProps(state) {
    return {
        currentUser: state.auth.currentUser,
    };
}

export default withRouter(connect(mapStateToProps)(Offerings));