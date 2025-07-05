import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ConnectedRouter } from 'connected-react-router';
import { getHistory } from '../index';
import { AdminRoute, UserRoute, AuthRoute, ProviderRoute } from './RouteComponents';

/* eslint-disable */
import ErrorPage from '../pages/error';
/* eslint-enable */

import '../styles/theme.scss';
import LayoutComponent from '../components/Layout';
import DocumentationLayoutComponent from '../documentation/DocumentationLayout';
import Login from '../pages/login';
import Verify from '../pages/auth/verify';
import WorkerRegister from '../pages/auth/register/WorkerRegister';
import LabRegister from '../pages/auth/register/LabRegister';
import ProviderRegister from '../pages/auth/register/ProviderRegister';
import Register from '../pages/auth/register/Register';
import ProviderDashboard from '../pages/dashboard/ProviderDashboard';
import Reset from '../pages/auth/reset';
import Forgot from '../pages/auth/forgot';
import Landing from '../pages/landing/Landing';

const CloseButton = ({closeToast}) => <i onClick={closeToast} className="la la-close notifications-close"/>

class App extends React.PureComponent {
  
  render() {
    if (this.props.loadingInit) {
      return <div/>;
    }

    return (
        <div>
            <ToastContainer
                autoClose={5000}
                hideProgressBar
                closeButton={<CloseButton/>}
            />
            <ConnectedRouter history={getHistory()}>
                  <Switch>
                      <Route path="/" exact component={Landing} />
                      <Route path="/app" exact render={() => <Redirect to="/app/main"/>}/>
                      <UserRoute path="/app" dispatch={this.props.dispatch} component={LayoutComponent}/>
                      <AdminRoute path="/admin" currentUser={this.props.currentUser} dispatch={this.props.dispatch}
                              component={LayoutComponent}/>
                      <Route path="/documentation" exact
                            render={() => <Redirect to="/documentation/getting-started/overview"/>}/>
                      <Route path="/documentation" component={DocumentationLayoutComponent}/>
                      <AuthRoute path="/register" exact component={Register} />
                      <AuthRoute path="/register/worker" exact component={WorkerRegister} />
                      <AuthRoute path="/register/lab" exact component={LabRegister} />
                      <AuthRoute path="/register/provider" exact component={ProviderRegister} />
                      <AuthRoute path="/login" exact component={Login}/>
                      <AuthRoute path="/verify-email" exact component={Verify}/>
                      <AuthRoute path="/password-reset" exact component={Reset}/>
                      <AuthRoute path="/forgot" exact component={Forgot}/>
                      <Route path="/error" exact component={ErrorPage}/>
                      <Redirect from="*" to="/app/main/analytics"/>
                  </Switch>
            </ConnectedRouter>
        </div>

    );
  }
}

const mapStateToProps = store => ({
  currentUser: store.auth.currentUser,
  loadingInit: store.auth.loadingInit,
});

export default connect(mapStateToProps)(App);
