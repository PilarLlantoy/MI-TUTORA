import { createContext, useEffect, useReducer } from 'react';
import axios from 'src/utils/aimAxios';
import PropTypes from 'prop-types';
import { keyCodeBack } from 'src/config';

const initialAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const setSession = (accessToken, user) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common.Authorization = `${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common.Authorization;
  }
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialAuthState,
  method: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  signin: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');
        if (accessToken) {
          const user = JSON.parse(window.localStorage.getItem('user'));
          setSession(accessToken, user);
          // const response = await axios.post('/auth/getUser', {
          //   token: accessToken
          // });
          // const user = response.data;
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };
    initialize();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(
      '/auth/login',
      {
        username: email,
        password
      },
      {
        headers: {
          Authorization: `${keyCodeBack}`
        },
        validateStatus: (status) => status < 500
      }
    );

    if (response.status === 200) {
      const { token, user } = response.data;
      setSession(token, user);
      dispatch({
        type: 'LOGIN',
        payload: {
          user
        }
      });
    } else {
      // if (response.status === 401) {
      //   alert('Credenciales incorrectas');
      // }
      // eslint-disable-next-line
      alert('Credenciales incorrectas');

      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  };

  const signin = async ({ email, firstName, lastName, imageUrl }) => {
    const response = await axios.post(
      '/auth/googlepostlogin',
      {
        email,
        fullName: `${firstName}, ${lastName}`,
        photoURL: imageUrl
      },
      {
        headers: {
          Authorization: `${keyCodeBack}`
        }
      }
    );

    const { token, user } = response.data;
    setSession(token, user);

    dispatch({
      type: 'LOGIN',
      payload: {
        user
      }
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (email, name, password) => {
    const response = await axios.post('/api/account/register', {
      email,
      name,
      password
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout,
        register,
        signin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
