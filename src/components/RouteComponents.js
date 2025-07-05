import Login from '../pages/login/Login';
import { logoutUser } from '../actions/auth';
import { Redirect, Route } from 'react-router';
import React from 'react';

export const AdminRoute = ({currentUser, dispatch, component, ...rest}) => {
  if (!currentUser || currentUser.role !== 'admin' || !Login.isAuthenticated(localStorage.getItem('token'))) {
    return (<Redirect to="/app/main"/>)
  } else if (currentUser && currentUser.role === 'admin') {
    return (
      <Route {...rest} render={props => (React.createElement(component, props))}/>
    );
  }
};

export const UserRoute = ({dispatch, component, ...rest}) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = Login.isAuthenticated(token);
  
  if (!isAuthenticated) {
    // Temporarily disable automatic logout to prevent infinite loops
    // TODO: Re-enable with proper safeguards after debugging
    /*
    if (token && !window.isLoggingOut) {
      window.isLoggingOut = true;
      setTimeout(() => {
        dispatch(logoutUser());
        window.isLoggingOut = false;
      }, 0);
    }
    */
    return (<Redirect to="/login"/>)
  } else {
    return ( // eslint-disable-line
      <Route {...rest} render={props => (React.createElement(component, props))}/>
    );
  }
};

export const ProviderRoute = ({currentUser, dispatch, component, ...rest}) => {
  if (!currentUser || currentUser.role !== 'Provider' || !Login.isAuthenticated(localStorage.getItem('token'))) {
    return (<Redirect to="/login"/>)
  } else if (currentUser && currentUser.role === 'Provider') {
    return (
      <Route {...rest} render={props => (React.createElement(component, props))}/>
    );
  }
};

export const AuthRoute = ({dispatch, component, ...rest}) => {
  const {from} = rest.location.state || {from: {pathname: '/app'}};

  if (Login.isAuthenticated(localStorage.getItem('token'))) {
    return (
      <Redirect to={from}/>
    );
  } else {
    return (
      <Route {...rest} render={props => (React.createElement(component, props))}/>
    );
  }
};
