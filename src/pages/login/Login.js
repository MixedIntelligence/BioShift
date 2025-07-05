import React from 'react';
import PropTypes from 'prop-types';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Container,
  Alert,
  Button,
} from 'reactstrap';
import Widget from '../../components/Widget';
import { loginUser } from '../../actions/auth';

class Login extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
    isFetching: PropTypes.bool,
    location: PropTypes.any, // eslint-disable-line
    errorMessage: PropTypes.string,
  };

  static defaultProps = {
    isAuthenticated: false,
    isFetching: false,
    location: {},
    errorMessage: null,
  };

  static isAuthenticated(token) {
    // Check if token exists and is not expired
    if (!token) return false;
    
    try {
      // Decode JWT to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // If token is expired, remove it and return false
      if (payload.exp && payload.exp < currentTime) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return false;
      }
      
      return true;
    } catch (error) {
      // If token is malformed, remove it and return false
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.doLogin = this.doLogin.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changePassword = this.changePassword.bind(this);
  }

  changeEmail(event) {
    this.setState({ email: event.target.value });
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  doLogin(e) {
    e.preventDefault();
    this.props.dispatch(
      loginUser({ email: this.state.email, password: this.state.password }),
    );
  }

  render() {
    const { from } = this.props.location.state || {
      from: { pathname: '/app' },
    };

    if (this.props.isAuthenticated) {
      // cant access login page while logged in
      return <Redirect to={from} />;
    }

    return (
      <div className="auth-page">
        <Container>
          <h5 className="auth-logo">
            <i className="fa fa-circle text-primary" />
            LabLeap
            <i className="fa fa-circle text-danger" />
          </h5>
          <Widget
            className="widget-auth mx-auto"
            title={<h3 className="mt-0">Login to LabLeap</h3>}
          >
            <p className="widget-auth-info">Use your email to sign in.</p>
            <form className="mt" onSubmit={this.doLogin}>
              {this.props.errorMessage && (
                <Alert className="alert-sm" color="danger">
                  {this.props.errorMessage}
                </Alert>
              )}
              <div className="form-group">
                <input
                  className="form-control no-border"
                  value={this.state.email}
                  onChange={this.changeEmail}
                  type="email"
                  required
                  name="email"
                  placeholder="Email"
                />
              </div>
              <div className="form-group">
                <input
                  className="form-control no-border"
                  value={this.state.password}
                  onChange={this.changePassword}
                  type="password"
                  required
                  name="password"
                  placeholder="Password"
                />
              </div>
              <Button
                type="submit"
                color="info"
                className="auth-btn mb-3"
                size="sm"
              >
                {this.props.isFetching ? 'Loading...' : 'Login'}
              </Button>
            </form>
            <p className="widget-auth-info">
              Don't have an account? Join LabLeap today!
            </p>
            <Link className="d-block text-center" to="/register">
              Create Your Account
            </Link>
          </Widget>
        </Container>
        <footer className="auth-footer">
          {new Date().getFullYear()} &copy; BioShift, Inc. - LabLeap
        </footer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.auth.isFetching,
    isAuthenticated: state.auth.isAuthenticated,
    errorMessage: state.auth.errorMessage,
  };
}

export default withRouter(connect(mapStateToProps)(Login));
