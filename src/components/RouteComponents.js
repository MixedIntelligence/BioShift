import Login from '../pages/login/Login';
import { Redirect, Route } from 'react-router-dom';
import React from 'react';

export const AdminRoute = ({currentUser, dispatch, component, ...rest}) => {
  console.log('[AdminRoute] currentUser:', currentUser, 'component:', component, 'rest:', rest);
  if (!currentUser || currentUser.role !== 'admin' || !Login.isAuthenticated(localStorage.getItem('token'))) {
    console.log('[AdminRoute] Redirecting to /app/main');
    return (<Redirect to="/app/main"/>);
  } else if (currentUser && currentUser.role === 'admin') {
    const el = <Route {...rest} render={props => (React.createElement(component, props))}/>;
    console.log('[AdminRoute] Rendering Route:', el);
    return el;
  }
};

export function UserRoute({dispatch, component, currentUser, loadingInit, isAuthenticated, ...rest}) {
  const token = localStorage.getItem('token');
  const user = currentUser;
  const currentPath = (rest && rest.location && rest.location.pathname) || window.location.pathname;
  console.log('[UserRoute] user:', user, 'isAuthenticated:', isAuthenticated, 'component:', component, 'rest:', rest, 'currentPath:', currentPath, 'loadingInit:', loadingInit);

  // Error boundary/fallback UI
  if (typeof component !== 'function') {
    return (
      <div style={{color: 'red', padding: 20}}>
        [UserRoute Error] Invalid component provided. Please check route configuration.
      </div>
    );
  }

  // Block redirect logic until Redux auth state is initialized
  if (loadingInit) {
    return (
      <div style={{color: 'gray', padding: 20}}>
        [UserRoute] Initializing authentication state... Please wait.
      </div>
    );
  }

  // Prevent infinite redirect loop
  if (!isAuthenticated || !user) {
    if (currentPath !== '/login') {
      console.log('[UserRoute] Redirecting to /login');
      return (
        <>
          <Redirect to="/login" />
          <div style={{color: 'red', padding: 20}}>
            [UserRoute] Not authenticated. Redirecting to login...<br />
            If you see this message, authentication state is missing or invalid.<br />
            Redux user: {JSON.stringify(user)}<br />
            Token: {token ? 'present' : 'absent'}
          </div>
        </>
      );
    } else {
      return (
        <div style={{color: 'red', padding: 20}}>
          [UserRoute] Not authenticated and already on /login. Redux user: {JSON.stringify(user)}
        </div>
      );
    }
  } else {
    try {
      const el = <Route {...rest} render={props => (React.createElement(component, props))}/>;
      console.log('[UserRoute] Rendering Route:', el);
      return el;
    } catch (err) {
      console.error('[UserRoute] Render error:', err);
      return (
        <div style={{color: 'red', padding: 20}}>
          [UserRoute Error] Failed to render protected route.<br />
          {err && err.message}
        </div>
      );
    }
  }
};

export const ProviderRoute = ({currentUser, dispatch, component, ...rest}) => {
  console.log('[ProviderRoute] currentUser:', currentUser, 'component:', component, 'rest:', rest);
  if (!currentUser || currentUser.role !== 'Provider' || !Login.isAuthenticated(localStorage.getItem('token'))) {
    console.log('[ProviderRoute] Redirecting to /login');
    return (<Redirect to="/login"/>);
  } else if (currentUser && currentUser.role === 'Provider') {
    const el = <Route {...rest} render={props => (React.createElement(component, props))}/>;
    console.log('[ProviderRoute] Rendering Route:', el);
    return el;
  }
};

export const AuthRoute = ({dispatch, component, ...rest}) => {
  const {from} = rest.location && rest.location.state ? rest.location.state : {from: {pathname: '/app'}};
  const isAuth = Login.isAuthenticated(localStorage.getItem('token'));
  console.log('[AuthRoute] isAuthenticated:', isAuth, 'component:', component, 'rest:', rest, 'from:', from);
  if (isAuth) {
    console.log('[AuthRoute] Redirecting to', from);
    return (
      <Redirect to={from}/>
    );
  } else {
    const el = <Route {...rest} render={props => (React.createElement(component, props))}/>;
    console.log('[AuthRoute] Rendering Route:', el);
    return el;
  }
};
