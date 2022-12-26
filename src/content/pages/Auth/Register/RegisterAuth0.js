import { useState } from 'react';
import { Button, Alert, styled } from '@mui/material';
import useAuth from 'src/hooks/useAuth';
import useRefMounted from 'src/hooks/useRefMounted';
import { useTranslation } from 'react-i18next';

const ImgWrapper = styled('img')(
  ({ theme }) => `
    margin-right: ${theme.spacing(1)};
    width: 32px;
`
);

function RegisterAuth0() {
  const { loginWithPopup } = useAuth();
  const [error, setError] = useState(null);
  const isMountedRef = useRefMounted();
  const { t } = useTranslation();

  const handleRegister = async () => {
    try {
      await loginWithPopup();
    } catch (err) {
      console.error(err);
      if (isMountedRef.current) {
        setError(err.message);
      }
    }
  };

  return (
    <>
      {error && <Alert severity="error">{error}</Alert>}

      <Button
        fullWidth
        onClick={handleRegister}
        size="large"
        sx={{
          py: 2
        }}
        variant="outlined"
      >
        <ImgWrapper alt="Auth0" src="/static/images/logo/auth0.svg" />
        {t('Sign in with')} Auth0
      </Button>
    </>
  );
}

export default RegisterAuth0;
