import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from 'src/hooks/useAuth';

const Guest = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    console.log(user);
    localStorage.setItem('personId', user.id)
    const { role, documentNumber } = user.person;
    if (role === 1) return <Navigate to="/aim/member" />;
    if (role === 2) return <Navigate to="/aim/associated" />;
    if (role === 3) return <Navigate to="/aim/admin" />;
    if (documentNumber === null)
      return <Navigate to="/account/register/google" />;
    if (role === 0) return <Navigate to="/aim/student" />;
  }

  return <>{children}</>;
};

Guest.propTypes = {
  children: PropTypes.node
};

export default Guest;
