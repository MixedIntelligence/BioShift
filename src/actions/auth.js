import axios from 'axios';
import config from '../config';
import jwt from "jsonwebtoken";
import { toast } from 'react-toastify';
import { push } from 'connected-react-router';
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

// Track if doInit is currently running to prevent infinite loops
let isInitializing = false;
let lastTokenError = null;

export function doInit() {
  return async (dispatch, getState) => {
    console.log('🚀 doInit() called');
    
    // Prevent concurrent calls to doInit
    if (isInitializing) {
      console.log('⚠️ doInit() already running, skipping...');
      return;
    }
    
    isInitializing = true;
    
    try {
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
          
          // If we just cleared a bad token, don't process it again
          if (token && token === lastTokenError) {
            console.log('🔄 Same bad token detected, force clearing and skipping...');
            localStorage.clear();
            token = null;
          }
          
          if (token) {
            // Quick token validation before making API call
            try {
              // Validate JWT token format (must have 3 parts separated by dots)
              const tokenParts = token.split('.');
              if (tokenParts.length !== 3) {
                throw new Error('Invalid JWT format - must have 3 parts');
              }
              
              // Safely decode the token payload
              let payload;
              try {
                // Add padding if needed for base64 decoding
                let base64 = tokenParts[1];
                while (base64.length % 4) {
                  base64 += '=';
                }
                payload = JSON.parse(atob(base64));
              } catch (decodeError) {
                throw new Error('Invalid token payload - cannot decode');
              }
              
              const currentTime = Date.now() / 1000;
              
              if (payload.exp && payload.exp < currentTime) {
                console.log('⏰ Token expired, clearing and proceeding without user');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete axios.defaults.headers.common['Authorization'];
                token = null;
              } else {
                console.log('✅ Token is valid, fetching user info...');
                // Set axios auth header for API calls
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                
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
              
              // Track this bad token to prevent loops
              lastTokenError = token;
              
              // Aggressive cleanup - clear everything auth-related
              try {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('dashboardTheme');
                localStorage.removeItem('navbarColor');
                localStorage.removeItem('navbarType');
                delete axios.defaults.headers.common['Authorization'];
                
                // Force clear any session/cookie data
                if (typeof sessionStorage !== 'undefined') {
                  sessionStorage.removeItem('token');
                  sessionStorage.removeItem('user');
                }
                
                console.log('🧹 Aggressive cleanup completed');
              } catch (cleanupError) {
                console.error('Cleanup error:', cleanupError);
              }
              
              token = null;
              
              // Show user-friendly message only once per session
              if (!window.authErrorShown) {
                toast.error('Your session has expired. Please log in again.');
                window.authErrorShown = true;
              }
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
          console.error('❌ FATAL: Unexpected error during doInit, this is likely breaking the app.', error);
          
          dispatch({
            type: AUTH_INIT_ERROR,
            payload: error.message || 'A critical error occurred during app initialization.',
          });
          
          toast.error("A critical error occurred. Please try refreshing the page.");
        }
      }
    } finally {
      isInitializing = false;
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
          console.log('🔐 Attempting login for:', creds.email);
          console.log('🌐 Backend URL:', config.baseURLApi);
          
          // Clear any existing corrupted auth data before login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          delete axios.defaults.headers.common['Authorization'];
          
          axios.post("/auth/login", creds)
            .then(res => {
              console.log('✅ Login successful:', res.data);
              const { token } = res.data;
              if (!token) {
                throw new Error('No token received from server');
              }
              
              // Validate token format before storing
              try {
                const tokenParts = token.split('.');
                if (tokenParts.length !== 3) {
                  throw new Error('Invalid JWT format received from server');
                }
                // Test decode to ensure it's valid
                let base64 = tokenParts[1];
                while (base64.length % 4) {
                  base64 += '=';
                }
                JSON.parse(atob(base64));
              } catch (tokenValidationError) {
                console.error('❌ Invalid token format from server:', tokenValidationError);
                throw new Error('Invalid token format received from server');
              }
              
              dispatch(receiveToken(token));
              dispatch(doInit());
              dispatch(push('/app'));
            })
            .catch(err => {
              console.log('❌ Login failed:', err);
              console.log('Response data:', err.response?.data);
              console.log('Response status:', err.response?.status);
              
              let errorMessage = 'Login failed';
              if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
              } else if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
              } else if (err.response?.data) {
                errorMessage = typeof err.response.data === 'string' ? err.response.data : JSON.stringify(err.response.data);
              } else if (err.message) {
                errorMessage = err.message;
              }
              
              // Add specific error messages for common issues
              if (err.response?.status === 401) {
                errorMessage = 'Invalid email or password';
              } else if (err.response?.status === 404) {
                errorMessage = 'Login service not found. Please check if the server is running.';
              } else if (err.response?.status === 500) {
                errorMessage = 'Server error. Please try again later.';
              } else if (err.code === 'ECONNREFUSED' || err.code === 'ERR_NETWORK') {
                errorMessage = 'Cannot connect to server. Please check if the backend is running.';
              }
              
              dispatch(authError(errorMessage));
              toast.error(errorMessage);
            });
        } else {
          const errorMessage = 'Please enter both email and password';
          dispatch(authError(errorMessage));
          toast.error(errorMessage);
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
