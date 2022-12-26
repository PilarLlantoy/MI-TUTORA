import { useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  // Tooltip,
  Typography,
  Container,
  // Alert,
  styled,
  Button
} from '@mui/material';
import { Helmet } from 'react-helmet-async';

import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';
import { auth0Config } from 'src/config';

import useAuth from 'src/hooks/useAuth';
import Auth0Login from '../LoginAuth0';
import FirebaseAuthLogin from '../LoginFirebaseAuth';
import JWTLogin from '../LoginJWT';
import AmplifyLogin from '../LoginAmplify';

const Content = styled(Box)(
  () => `
    display: flex;
    flex: 1;
    width: 100%;
`
);

// const MainContent = styled(Box)(
//   () => `
//   padding: 0 0 0 440px;
//   width: 100%;
//   display: flex;
//   align-items: center;
// `
// );

function LoginCover() {
  const navigate = useNavigate();
  const { method, signin, isAuthenticated } = useAuth();

  const onGoogleLoginSuccess = (response) => {
    const data = {
      email: response.profileObj.email,
      firstName: response.profileObj.givenName,
      lastName: response.profileObj.familyName || '',
      imageUrl: response.profileObj.imageUrl
    };

    // TODO: Hay una manera en el template que maneja las redirecciones
    // de los log-sign in. Este es un workaround
    signin({ ...data });
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/aim');
    }
    const initClient = () => {
      gapi.client.init({
        client_id: auth0Config.client_id,
        scope: ''
      });
    };
    gapi.load('client:auth2', initClient);
  }, []);

  return (
    <>
      <Helmet>
        <title>Inicio de Sesión</title>
      </Helmet>
      <Content textAlign="center">
        <Container
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
          }}
          maxWidth="sm"
        >
          <Card
            sx={{
              p: 4,
              my: 4
            }}
          >
            <Box textAlign="center">
              <Typography
                variant="h2"
                sx={{
                  mb: 1
                }}
              >
                Iniciar Sesión
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{
                  mb: 3
                }}
              >
                Ingrese sus credenciales
              </Typography>
            </Box>
            {method === 'Auth0' && <Auth0Login />}
            {method === 'FirebaseAuth' && <FirebaseAuthLogin />}
            {method === 'JWT' && <JWTLogin />}
            {method === 'Amplify' && <AmplifyLogin />}
            {/* {method !== 'Auth0' && (
              <Tooltip
                sx={{
                  mt: 2
                }}
                title="Used only for the live preview demonstration !"
              >
                <Alert severity="warning">
                  Usar <b>admin@aim.com</b> y contraseña <b>admin12345</b>
                </Alert>
              </Tooltip>
            )} */}
            <GoogleLogin
              sx={{
                mt: 2
              }}
              clientId={auth0Config.client_id}
              buttonText="Ingresar con Google"
              onSuccess={onGoogleLoginSuccess}
              onFailure={null}
              cookiePolicy="single_host_origin"
            />
            <Button
              sx={{
                mt: 3
              }}
              component={RouterLink}
              color="info"
              fullWidth
              size="large"
              to="/account/register/classic"
              variant="contained"
            >
              Registrarse
            </Button>
          </Card>
        </Container>
      </Content>
    </>
  );
}

export default LoginCover;
