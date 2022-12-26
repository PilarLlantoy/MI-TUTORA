/* eslint-disable */
import {
  Navigate,
  useLocation,
  useParams,
  useNavigate
} from 'react-router-dom';
import PropTypes from 'prop-types';
import useAuth from 'src/hooks/useAuth';
import certifyAxios from 'src/utils/aimAxios';
import Status404 from 'src/content/pages/Status/Status404';
import { useEffect, useState } from 'react';

const AuthRoom = ({ children }) => {
  const { user } = useAuth();
  const { roomId } = useParams();
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();

  const verify = async () => {
    try {
      const response = await certifyAxios.post(
        '/reservationRequest/checkPersonRoom',
        {
          personId: user.person.id,
          roomId: roomId
        }
      );
      
      const {status, data} = response;
      
      if(status == 200){
        let { allowed, personRole } = response.data;
        setIsVerified(allowed);
      }else{
        navigate('/status');
      }
    } catch (error) {
      navigate('/status');
    }
  };

  useEffect(() => {
    verify();
  }, []);

  return <>{isVerified ? children : <div/>}</>;
};

AuthRoom.propTypes = {
  children: PropTypes.node
};

export default AuthRoom;

/* eslint-enable */
