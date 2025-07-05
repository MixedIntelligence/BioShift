import axios from 'axios';
import config from '../config';
import jwt from "jsonwebtoken";
import { toast } from 'react-toastify';
import { push } from 'connected-react-router';
import Errors from '../components/FormItems/error/errors';
import { mockUser } from './mock';

export const AUTH_FAILURE = 'AUTH_FAILURE';
export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const RESET_REQUEST = 'RESET_REQUEST';
export const RESET_SUCCESS = 'RESET_SUCCESS';
export const PASSWORD_RESET_EMAIL_REQUEST = 'PASSWORD_RESET_EMAIL_REQUEST';
export const PASSWORD_RESET_EMAIL_SUCCESS = 'PASSWORD_RESET_EMAIL_SUCCESS';
export const AUTH_INIT_SUCCESS = 'AUTH_INIT_SUCCESS';
export const AUTH_INIT_ERROR = 'AUTH_INIT_ERROR';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';

async function findMe() {
  if (config.isBackend) {
    const response = await axios.get('/users/me');
    return response.data;
  } else {
    return mockUser;
  }
}

export function authError(payload) {
  return {
    type: AUTH_FAILURE,
    payload,
  };
}

export function doInit() {
  return async (dispatch, getState) => {
    console.log('🚀 doInit() called');
    
    let currentUser = null;
    if (!config.isBackend) {
      console.log('🔧 Using mock user (frontend mode)');
      currentUser = mockUser;
      dispatch({
        type: AUTH_INIT_SUCCESS,
        payload: {
          currentUser,
        },
      });
      console.log('✅ doInit() completed successfully with mock user');
    } else {
      console.log('🌐 Using backend authentication');
      try {
        let token = localStorage.getItem('token');
        console.log('🔑 Token from localStorage:', token ? 'exists' : 'none');
        
        if (token) {
          // Quick token validation before making API call
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const currentTime = Date.now() / 1000;
            
            if (payload.exp && payload.exp < currentTime) {
              console.log('⏰ Token expired, clearing and proceeding without user');
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              delete axios.defaults.headers.common['Authorization'];
              token = null;
            } else {
              console.log('✅ Token is valid, fetching user info...');
              try {
                console.log('📡 Calling findMe() API...');
                currentUser = await findMe();
                console.log('👤 User found:', currentUser?.email);
              } catch (apiError) {
                console.log('❌ findMe() API failed:', apiError.response?.status, apiError.message);
                // Clear invalid token
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete axios.defaults.headers.common['Authorization'];
                currentUser = null;
              }
            }
          } catch (tokenError) {
            console.log('❌ Invalid token format, clearing...', tokenError);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            delete axios.defaults.headers.common['Authorization'];
            token = null;
          }
        }
        
        console.log('🎯 Dispatching AUTH_INIT_SUCCESS with user:', currentUser?.email || 'none');
        dispatch({
          type: AUTH_INIT_SUCCESS,
          payload: {
            currentUser,
          },
        });
        console.log('✅ doInit() completed successfully');
      } catch (error) {
        console.log('❌ Unexpected error during doInit:', error);
        
        dispatch({
          type: AUTH_INIT_ERROR,
          payload: error,
        });
        console.log('❌ doInit() completed with error');
      }
    }
  }
}

export function logoutUser() {
    return (dispatch) => {
        dispatch({
          type: LOGOUT_REQUEST,
        });
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        axios.defaults.headers.common['Authorization'] = "";
        dispatch({
          type: LOGOUT_SUCCESS,
        });
      dispatch(push('/login'));
    };
}

export function receiveToken(token) {
    return (dispatch) => {
        let user;

        if (config.isBackend) {
          user = jwt.decode(token)
        } else {
          user = {
            email: config.auth.email,
            user: {
              id: 'default_no_connection_id_444'
            }
          }
        }

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        axios.defaults.headers.common['Authorization'] = "Bearer " + token;
        dispatch({
          type: LOGIN_SUCCESS
        });
        dispatch(push('/app'));
    }
}

export function loginUser(creds) {
    return (dispatch) => {
      localStorage.setItem("dashboardTheme", 'dark')
      localStorage.setItem('navbarColor', '#fff')
      localStorage.setItem('navbarType', 'static')
      if (!config.isBackend) {
        dispatch(receiveToken('token'));
        dispatch(doInit());
        dispatch(push('/app'));
      } else {
        dispatch({
          type: LOGIN_REQUEST,
        });
        if (creds.social) {
          window.location.href = config.baseURLApi + "/auth/signin/" + creds.social + '?app=' + config.redirectUrl;
        } else if (creds && creds.email && creds.password) {
          axios.post("/auth/login", creds).then(res => {
            const { token } = res.data;
            dispatch(receiveToken(token));
            dispatch(doInit());
            dispatch(push('/app'));
          }).catch(err => {
            const errorMessage = err.response?.data?.error || err.response?.data || 'Login failed';
            dispatch(authError(errorMessage));
          })
        } else {
          dispatch(authError('Something was wrong. Try again'));
        }
      }
    };
}

export function verifyEmail(token) {
  return(dispatch) => {
    if (!config.isBackend) {
      dispatch(push('/login'));
    } else {
      axios.put("/auth/verify-email", {token}).then(verified => {
        if (verified) {
          toast.success("Your email was verified");
        }
      }).catch(err => {
        toast.error(err.response.data);
      }).finally(() => {
        dispatch(push('/login'));
      })
    }
  }
}

export function resetPassword(token, password) {
  return (dispatch) => {
    if (!config.isBackend) {
      dispatch(push('/login'));
    } else {
      dispatch({
        type: RESET_REQUEST,
      });
      axios.put("/auth/password-reset", {token, password}).then(res => {
          dispatch({
            type: RESET_SUCCESS,
          });
          toast.success("Password has been updated");
        dispatch(push('/login'));
      }).catch(err => {
        dispatch(authError(err.response.data));
      })
    }
  }
}

export function sendPasswordResetEmail(email) {
  return (dispatch) => {
    if (!config.isBackend) {
      dispatch(push('/login'));
    } else {
      dispatch({
        type: PASSWORD_RESET_EMAIL_REQUEST,
      });
      axios.post("/auth/send-password-reset-email", {email}).then(res => {
        dispatch({
          type: PASSWORD_RESET_EMAIL_SUCCESS,
        });
        toast.success("Email with resetting instructions has been sent");
        dispatch(push('/login'));
      }).catch(err => {
        dispatch(authError(err.response.data));
      })
    }
  }
}

export function registerUser(creds) {
  return (dispatch) => {
    if (!config.isBackend) {
      dispatch(push('/app/profile'));
    } else {
      dispatch({
        type: REGISTER_REQUEST,
      });

      if (creds && creds.email && creds.password) {
        axios.post("/auth/register", creds).then(res => {
          const { token } = res.data;
          dispatch({
            type: REGISTER_SUCCESS
          });
          // Store token and redirect without calling doInit to avoid potential loops
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = "Bearer " + token;
          
          // Decode user info from token for immediate use
          if (config.isBackend) {
            const user = jwt.decode(token);
            dispatch({
              type: 'AUTH_SET_USER',
              payload: { currentUser: user }
            });
          }
          
          toast.success("Registration successful! Welcome to LabLeap.");
          dispatch(push('/onboarding'));
        }).catch(err => {
          const errorMessage = err.response?.data?.error || err.response?.data || 'Registration failed';
          dispatch(authError(errorMessage));
        })

      } else {
        dispatch(authError('Something was wrong. Try again'));
      }
    }
  };
}
