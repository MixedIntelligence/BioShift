import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, Redirect } from 'react-router';
import { ToastContainer } from 'react-toastify';
import { ConnectedRouter } from 'connected-react-router';
import { getHistory } from '../index';
import { AdminRoute, UserRoute, AuthRoute } from './RouteComponents';

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
import Onboarding from '../pages/auth/onboarding/Onboarding';
import Reset from '../pages/auth/reset';
import Forgot from '../pages/auth/forgot';
import Landing from '../pages/landing/Landing';
import ErrorBoundary from './ErrorBoundary';

const CloseButton = ({closeToast}) => <i onClick={closeToast} className="la la-close notifications-close"/>

class App extends React.PureComponent {
  
  render() {
    // Log props and state for debugging
    console.log('[App.js] render', {
      currentUser: this.props.currentUser,
      loadingInit: this.props.loadingInit,
      token: localStorage.getItem('token')
    });
    // Only render router after auth state is initialized
    if (this.props.loadingInit) {
      console.log('[App.js] Loading init...');
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '18px',
          backgroundColor: '#f5f5f5'
        }}>
          <div>
            <div>🔄 Initializing BioMVP...</div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
              Loading authentication state
            </div>
          </div>
        </div>
      );
    }
    // Only render the router after loadingInit is false
    return (
      <ErrorBoundary>
        <div>
          <ToastContainer
              autoClose={5000}
              hideProgressBar
              closeButton={<CloseButton/>}
          />
          <ConnectedRouter history={getHistory()}>
                <Switch>
                    <Route path="/app/gigs" exact render={() => <div>App Test Route (Top Level)</div>} />
                    <Route path="/" exact component={Landing} />
                    {/* <Route path="/app" exact render={() => <Redirect to="/app/main"/>}/> */}
                    {/* <UserRoute path="/app" dispatch={this.props.dispatch} component={LayoutComponent}/> */}
                    {console.log('[App.js] Rendering AdminRoute for /admin', {component: LayoutComponent, currentUser: this.props.currentUser, dispatch: this.props.dispatch})}
                    <AdminRoute path="/admin" currentUser={this.props.currentUser} dispatch={this.props.dispatch}
                            component={LayoutComponent}/>
                    <Route path="/documentation" exact
                          render={() => <Redirect to="/documentation/getting-started/overview"/>}/>
                    <Route path="/documentation" component={DocumentationLayoutComponent}/>
                    {console.log('[App.js] Rendering AuthRoute for /register', {component: Register})}
                    <AuthRoute path="/register" exact component={Register} />
                    {console.log('[App.js] Rendering AuthRoute for /register/worker', {component: WorkerRegister})}
                    <AuthRoute path="/register/worker" exact component={WorkerRegister} />
                    {console.log('[App.js] Rendering AuthRoute for /register/lab', {component: LabRegister})}
                    <AuthRoute path="/register/lab" exact component={LabRegister} />
                    {console.log('[App.js] Rendering AuthRoute for /register/provider', {component: ProviderRegister})}
                    <AuthRoute path="/register/provider" exact component={ProviderRegister} />
                    {console.log('[App.js] Rendering UserRoute for /onboarding', {component: Onboarding, dispatch: this.props.dispatch, currentUser: this.props.currentUser, isAuthenticated: this.props.isAuthenticated})}
                    <UserRoute path="/onboarding" exact dispatch={this.props.dispatch} currentUser={this.props.currentUser} isAuthenticated={this.props.isAuthenticated} component={Onboarding} />
                    {console.log('[App.js] Rendering AuthRoute for /login', {component: Login})}
                    <AuthRoute path="/login" exact component={Login}/>
                    {console.log('[App.js] Rendering AuthRoute for /verify-email', {component: Verify})}
                    <AuthRoute path="/verify-email" exact component={Verify}/>
                    {console.log('[App.js] Rendering AuthRoute for /password-reset', {component: Reset})}
                    <AuthRoute path="/password-reset" exact component={Reset}/>
                    {console.log('[App.js] Rendering AuthRoute for /forgot', {component: Forgot})}
                    <AuthRoute path="/forgot" exact component={Forgot}/>
                    <Route path="/error" exact component={ErrorPage}/>
                    {/* Default catch-all redirect updated from /app/main/analytics to /app/gigs due to dashboard issues. Restore if dashboard is fixed. */}
                    <Redirect from="*" to="/app/gigs"/>
                </Switch>
          </ConnectedRouter>
      </div>
      </ErrorBoundary>
    );
  }
}

const mapStateToProps = store => ({
  currentUser: store.auth.currentUser,
  loadingInit: store.auth.loadingInit,
  isAuthenticated: store.auth.isAuthenticated,
});

export default connect(mapStateToProps)(App);
