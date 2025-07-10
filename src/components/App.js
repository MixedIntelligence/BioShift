import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { UserRoute } from './RouteComponents';
import LayoutComponent from './Layout/Layout';
import Login from '../pages/login/Login';
import Register from '../pages/auth/register/Register';
import LandingPage from '../pages/landing/Landing';

class App extends React.PureComponent {
  render() {
    if (this.props.loadingInit) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '2rem',
          color: '#ccc'
        }}>
          Loading...
        </div>
      );
    }
    return (
      <Router>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route path="/register" exact component={Register} />
          <Route path="/" exact component={LandingPage} />
          <Route path="/app" exact render={() => <Redirect to="/app/gigs" />} />
          <UserRoute
            path="/app"
            dispatch={this.props.dispatch}
            component={LayoutComponent}
            currentUser={this.props.currentUser}
            loadingInit={this.props.loadingInit}
            isAuthenticated={this.props.isAuthenticated}
          />
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = (state) => ({
  currentUser: state.auth.currentUser,
  loadingInit: state.auth.loadingInit,
  isAuthenticated: state.auth.isAuthenticated,
  errorMessage: state.auth.errorMessage,
});

export default connect(mapStateToProps)(App);
