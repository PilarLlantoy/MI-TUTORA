import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from 'src/hooks/useAuth';
import Login from 'src/content/pages/Auth/Login/Cover';

const Authenticated = (props) => {
  const { children } = props;
  const auth = useAuth();
  const location = useLocation();
  const [requestedLocation, setRequestedLocation] = useState(null);

  if(localStorage.getItem('firstTime') === null || localStorage.getItem('firstTime') === undefined){
    localStorage.setItem('firstTime', 'false')
  }

  if (!auth.isAuthenticated) {
    if (location.pathname !== requestedLocation) {
      setRequestedLocation(location.pathname);
    }
    return <Login />;
  }

  if (requestedLocation && location.pathname !== requestedLocation) {
    setRequestedLocation(null);
    return <Navigate to={requestedLocation} />;
  }

  return <>{children}</>;
};

Authenticated.propTypes = {
  children: PropTypes.node
};

export default Authenticated;
