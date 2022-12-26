import { createContext, useEffect, useReducer } from 'react';
import { Auth0Client } from '@auth0/auth0-spa-js';
import { auth0Config } from 'src/config';
import PropTypes from 'prop-types';

let auth0Client = null;

const initialAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
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
  })
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialAuthState,
  method: 'Auth0',
  loginWithPopup: () => Promise.resolve(),
  logout: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    const initialize = async () => {
      try {
        auth0Client = new Auth0Client({
          redirect_uri: window.location.origin,
          ...auth0Config
        });

        await auth0Client.checkSession();

        const isAuthenticated = await auth0Client.isAuthenticated();

        if (isAuthenticated) {
          const user = await auth0Client.getUser();

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated,
              user: {
                id: user.sub,
                jobtitle: 'Lead Developer',
                avatar: user.picture,
                email: user.email,
                name: user.name,
                role: user.role,
                location: user.location,
                username: user.username,
                posts: user.posts,
                coverImg: user.coverImg,
                followers: user.followers,
                description: user.description
              }
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated,
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

  const loginWithPopup = async (options) => {
    await auth0Client.loginWithPopup(options);

    const isAuthenticated = await auth0Client.isAuthenticated();

    if (isAuthenticated) {
      const user = await auth0Client.getUser();

      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            id: user.sub,
            jobtitle: 'Lead Developer',
            avatar: user.picture,
            email: user.email,
            name: user.name,
            role: user.role,
            location: user.location,
            username: user.username,
            posts: user.posts,
            coverImg: user.coverImg,
            followers: user.followers,
            description: user.description
          }
        }
      });
    }
  };

  const logout = () => {
    auth0Client.logout();
    dispatch({
      type: 'LOGOUT'
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'Auth0',
        loginWithPopup,
        logout
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
