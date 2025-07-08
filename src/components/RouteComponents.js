import Login from '../pages/login/Login';
import { Redirect, Route } from 'react-router';
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

export const UserRoute = ({dispatch, component, ...rest}) => {
  const token = localStorage.getItem('token');
  const isAuthenticated = Login.isAuthenticated(token);
  const user = (window.store && window.store.getState && window.store.getState().auth && window.store.getState().auth.currentUser) || null;
  console.log('[UserRoute] user:', user, 'isAuthenticated:', isAuthenticated, 'component:', component, 'rest:', rest);
  if (!isAuthenticated || !user) {
    console.log('[UserRoute] Redirecting to /login');
    return (<Redirect to="/login"/>);
  } else {
    const el = <Route {...rest} render={props => (React.createElement(component, props))}/>;
    console.log('[UserRoute] Rendering Route:', el);
    return el;
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
