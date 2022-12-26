import { useState, Children, useEffect } from 'react';
import {
  Typography,
  Container,
  Button,
  Card,
  CircularProgress,
  Grid,
  Box,
  Step,
  StepLabel,
  Stepper,
  // Link,
  Collapse,
  Alert,
  Avatar,
  IconButton,
  // Select,
  MenuItem,
  InputLabel,
  FormControl
  // Autocomplete
} from '@mui/material';
import { Field, Form, Formik } from 'formik';
import { TextField } from 'formik-mui';
import * as Yup from 'yup';
import CloseIcon from '@mui/icons-material/Close';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';
import ErrorIcon from '@mui/icons-material/Error';
import CancelIcon from '@mui/icons-material/Cancel';
import { useNavigate } from 'react-router-dom';

import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import Logo from 'src/components/LogoSign';
import useAuth from 'src/hooks/useAuth';
import axios from 'src/utils/aimAxios';
import CustomizedSelectForFormik from './CustomizedSelectForFormik';

const types = [
  { key: 0, value: 'DNI' },
  { key: 1, value: 'CE' }
];

const MainContent = styled(Box)(
  () => `
    height: 100%;
    overflow: auto;
    flex: 1;
`
);

const BoxActions = styled(Box)(
  ({ theme }) => `
    background: ${theme.colors.alpha.black[5]}
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.success.main};
      color: ${theme.palette.success.contrastText};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};
      box-shadow: ${theme.colors.shadows.success};
      margin-left: auto;
      margin-right: auto;
      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

const AvatarError = styled(Avatar)(
  ({ theme }) => `
      background-color: ${theme.colors.error.main};
      color: ${theme.palette.error.contrastText};
      width: ${theme.spacing(12)};
      height: ${theme.spacing(12)};
      box-shadow: ${theme.colors.shadows.error};
      margin-left: auto;
      margin-right: auto;
      .MuiSvgIcon-root {
        font-size: ${theme.typography.pxToRem(45)};
      }
`
);

function RegisterWizard() {
  const [openAlert, setOpenAlert] = useState(true);
  const { user, isAuthenticated, logout } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState(false);
  const navigate = useNavigate();

  const registerUser = async (values) => {
    const { phoneNumber, documentNumber, documentType } = values;
    const body = {
      clientId: user.person.id,
      documentType,
      documentNumber,
      phoneNumber: phoneNumber === '' ? null : phoneNumber
    };

    if (isAuthenticated) {
      try {
        const response = await axios.post('/person/client/update', body, {
          validateStatus: (status) => status < 500
        });
        if (response.status === 200) {
          setResult(true);
        } else {
          setResult(false);
          if (response.data.message.length) {
            setErrorMessage(response.data.message);
          } else {
            setErrorMessage(
              'Error desconocido, por favor inténtelo de nuevo. Si el error persiste, comunicarse con soporte'
            );
          }
        }
      } catch (e) {
        setResult(false);
        setErrorMessage(e.message);
        console.log(e);
      }
    } else {
      setErrorMessage('Usuario no autenticado');
      setResult(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const { fullName, email } = user.person;
      const [firstNameValue, lastNameValue] = fullName.split(',');
      setFirstName(firstNameValue);
      setLastName(lastNameValue || '');
      setEmail(email);
    } else {
      console.log('No inicio con google');
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Registro de Estudiante</title>
      </Helmet>
      <MainContent>
        <Container sx={{ my: 4 }} maxWidth="md">
          <Logo />
          <Card sx={{ mt: 3, pt: 4 }}>
            <Box px={4}>
              <Grid container>
                <Typography variant="h2" sx={{ mb: 1 }} pr={2}>
                  Creación de cuenta
                </Typography>
                <Button
                  startIcon={<CancelIcon size="1rem" />}
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                >
                  Cancelar
                </Button>
              </Grid>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 3 }}
              >
                Complete los campos a continuación para registrarse.
              </Typography>
            </Box>

            {isAuthenticated && firstName !== '' ? (
              <FormikStepper
                initialValues={{
                  firstName,
                  lastName,
                  terms: true,
                  email,
                  phoneNumber: '',
                  documentType: 0,
                  documentNumber: ''
                }}
                onSubmit={async (_values) => {
                  try {
                    await registerUser(_values);
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                <FormikStep
                  validationSchema={Yup.object().shape({
                    email: Yup.string()
                      .email(
                        'El correo electrónico proporcionado debe ser una dirección de correo electrónico válida'
                      )
                      .max(255)
                      .required('El correo electrónico es obligatorio'),
                    firstName: Yup.string()
                      .max(255)
                      .required('El nombre es obligatorio'),
                    lastName: Yup.string().max(255),
                    documentNumber: Yup.string()
                      .matches(/^\d+$/, 'Debe ingresar un valor numérico')
                      .required('El número de documento es obligatorio'),
                    phoneNumber: Yup.string().matches(
                      /^\d+$/,
                      'Debe ingresar un valor numérico'
                    )
                  })}
                  label="Información Personal"
                >
                  <Box p={4}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                        <Field
                          fullWidth
                          name="firstName"
                          component={TextField}
                          label="Nombres"
                          placeholder="Escribe tu nombre aquí"
                          // value={firstName}
                          // onChange={(e) => setFirstName(e.target.value)}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          fullWidth
                          name="lastName"
                          component={TextField}
                          label="Apellidos"
                          placeholder="Escribe tus apellidos aquí"
                          // value={lastName}
                          // onChange={(e) => setLastName(e.target.value)}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl sx={{ minWidth: 'calc(100%)' }}>
                          <InputLabel>Tipo de documento</InputLabel>
                          <Field
                            name="documentType"
                            component={CustomizedSelectForFormik}
                          >
                            {types.map((type) => (
                              <MenuItem key={type.key} value={type.key}>
                                {type.value}
                              </MenuItem>
                            ))}
                          </Field>
                          {/* <Select
                            value={documentType}
                            onChange={handleStatusChange}
                            label="Tipo de documento"
                            placeholder="Seleccione tipo de documento"
                          >
                            {types.map((type) => (
                              <MenuItem key={type.key} value={type.key}>
                                {type.value}
                              </MenuItem>
                            ))}
                          </Select> */}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          fullWidth
                          name="documentNumber"
                          component={TextField}
                          label="Número de documento"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          fullWidth
                          name="email"
                          component={TextField}
                          label="Correo electrónico"
                          placeholder="Escribe tu correo electrónico aquí"
                          // value={email}
                          disabled
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          fullWidth
                          name="phoneNumber"
                          component={TextField}
                          label="Número telefónico (+51)"
                        />
                      </Grid>
                      {/* <Grid item xs={12} md={6}>
                        <Field
                          fullWidth
                          type="password"
                          name="password"
                          component={TextField}
                          label="Contraseña"
                          placeholder="Escribe tu contraseña aquí"
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Field
                          fullWidth
                          type="password"
                          name="password_confirm"
                          component={TextField}
                          label="Confirma tu contraseña"
                          placeholder="Confirma tu contraseña aquí"
                        />
                      </Grid> */}

                      {/* <Grid item xs={12}>
                        <br />
                        <Field
                          name="terms"
                          type="checkbox"
                          component={CheckboxWithLabel}
                          Label={{
                            label: (
                              <Typography variant="body2">
                                Acepto los{' '}
                                <Link component="a" href="#">
                                  términos y condiciones
                                </Link>
                                .
                              </Typography>
                            )
                          }}
                        />
                      </Grid> */}
                    </Grid>
                  </Box>
                </FormikStep>

                <FormikStep label="Resultado de Registro">
                  <Box px={4} py={8}>
                    {result ? (
                      <Container maxWidth="sm">
                        <AvatarSuccess>
                          <CheckTwoToneIcon />
                        </AvatarSuccess>
                        <Collapse in={openAlert}>
                          <Alert
                            sx={{ mt: 5 }}
                            action={
                              <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                  setOpenAlert(false);
                                }}
                              >
                                <CloseIcon fontSize="inherit" />
                              </IconButton>
                            }
                            severity="info"
                          >
                            Registro satisfactorio
                          </Alert>
                        </Collapse>

                        <Button
                          fullWidth
                          variant="contained"
                          href="/account/login"
                        >
                          Ingresar
                        </Button>
                      </Container>
                    ) : (
                      <Container maxWidth="sm">
                        <AvatarError>
                          <ErrorIcon />
                        </AvatarError>
                        <Collapse in={openAlert}>
                          <Alert
                            sx={{ mt: 5 }}
                            action={
                              <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={() => {
                                  setOpenAlert(false);
                                }}
                              >
                                <CloseIcon fontSize="inherit" />
                              </IconButton>
                            }
                            severity="error"
                          >
                            {errorMessage}
                          </Alert>
                        </Collapse>

                        <Button
                          fullWidth
                          variant="contained"
                          href="/account/register/google"
                        >
                          Intentar de nuevo
                        </Button>
                      </Container>
                    )}
                  </Box>
                </FormikStep>
              </FormikStepper>
            ) : (
              ''
            )}
          </Card>
        </Container>
      </MainContent>
    </>
  );
}

export function FormikStep({ children }) {
  return <>{children}</>;
}

export function FormikStepper({ children, ...props }) {
  const childrenArray = Children.toArray(children);
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step];
  const [completed, setCompleted] = useState(false);

  function isLastStep() {
    return step === childrenArray.length - 2;
  }

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          setCompleted(true);
          setStep((s) => s + 1);
        } else {
          setStep((s) => s + 1);
          helpers.setTouched({});
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form autoComplete="off">
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step
                key={child.props.label}
                completed={step > index || completed}
              >
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {currentChild}
          {!completed ? (
            <BoxActions
              p={4}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Button
                disabled={isSubmitting || step === 0}
                variant="outlined"
                color="primary"
                type="button"
                onClick={() => setStep((s) => s - 1)}
              >
                Anterior
              </Button>

              <Button
                startIcon={
                  isSubmitting ? <CircularProgress size="1rem" /> : null
                }
                disabled={isSubmitting}
                variant="outlined"
                color="secondary"
                type="submit"
              >
                {isSubmitting
                  ? 'Registrando'
                  : isLastStep()
                  ? 'Completar Registro'
                  : 'Siguiente'}
              </Button>
            </BoxActions>
          ) : null}
        </Form>
      )}
    </Formik>
  );
}

export default RegisterWizard;