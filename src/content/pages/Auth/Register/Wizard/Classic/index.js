import { useState, Children } from 'react';
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

import { keyCodeBack } from 'src/config';
import { Helmet } from 'react-helmet-async';
import { styled } from '@mui/material/styles';
import Logo from 'src/components/LogoSign';
import axios from 'src/utils/aimAxios';
import User from './user';
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
  const [result, setResult] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const registerUser = async (values) => {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      documentNumber,
      documentType
    } = values;

    const user = new User(
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      documentType,
      documentNumber
    );

    try {
      const response = await axios.post(
        '/auth/register',
        user,
        {
          headers: {
            Authorization: `${keyCodeBack}`
          }
        },
        {
          validateStatus: (status) => status < 500
        }
      );
      if (response.status === 200) {
        setResult(true);
      } else {
        setResult(false);
        setErrorMessage(
          'Error desconocido, por favor inténtelo de nuevo. Si el error persiste, comunicarse con soporte'
        );
      }
    } catch (e) {
      setResult(false);
      setErrorMessage(e.message);
      console.log(e);
    }

    // console.log('GA', response);
  };

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
              <Typography variant="h2" sx={{ mb: 1 }}>
                Creación de cuenta
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 3 }}
              >
                Complete los campos a continuación para registrarse.
              </Typography>
            </Box>

            <FormikStepper
              initialValues={{
                firstName: '',
                lastName: '',
                terms: true,
                password: '',
                password_confirm: '',
                email: '',
                phoneNumber: '',
                documentNumber: '',
                documentType: 0
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
                  lastName: Yup.string()
                    .max(255)
                    .required('Los apellidos son obligatorios'),
                  password: Yup.string()
                    .min(
                      6,
                      'La contraseña debe tener por lo menos 6 caracteres '
                    )
                    .max(255)
                    .required('La contraseña es obligatoria'),
                  password_confirm: Yup.string()
                    .oneOf(
                      [Yup.ref('password')],
                      'Las contraseñas deben ser iguales'
                    )
                    .required('La contraseña es obligatoria'),
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
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        fullWidth
                        name="lastName"
                        component={TextField}
                        label="Apellidos"
                        placeholder="Escribe tus apellidos aquí"
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
                        // validate={validate}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Field
                        fullWidth
                        name="email"
                        component={TextField}
                        label="Correo electrónico"
                        placeholder="Escribe tu correo electrónico aquí"
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
                    <Grid item xs={12} md={6}>
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
                    </Grid>

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
                        href="/account/register/classic"
                      >
                        Intentar de nuevo
                      </Button>
                    </Container>
                  )}
                </Box>
              </FormikStep>
            </FormikStepper>
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
