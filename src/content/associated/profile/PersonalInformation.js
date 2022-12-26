import 'react-quill/dist/quill.snow.css';
import { styled } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';

import {
  Grid,
  Box,
  Zoom,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Divider,
  ListItem,
  ListItemText,
  Alert,
  List,
  Avatar,
  useTheme
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import axios from 'src/utils/axios';
import { useSnackbar } from 'notistack';
// import CloseIcon from '@mui/icons-material/Close';
import CloudUploadTwoToneIcon from '@mui/icons-material/CloudUploadTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.primary.lighter};
    color: ${theme.colors.primary.main};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarSuccess = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.success.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);

const AvatarDanger = styled(Avatar)(
  ({ theme }) => `
    background: ${theme.colors.error.light};
    width: ${theme.spacing(7)};
    height: ${theme.spacing(7)};
`
);
const BoxUploadWrapper = styled(Box)(
  ({ theme }) => `
    border-radius: ${theme.general.borderRadius};
    padding: ${theme.spacing(3)};
    background: ${theme.colors.alpha.black[5]};
    border: 1px dashed ${theme.colors.alpha.black[30]};
    outline: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: ${theme.transitions.create(['border', 'background'])};

    &:hover {
      background: ${theme.colors.alpha.white[100]};
      border-color: ${theme.colors.primary.main};
    }
`
);

function PersonalInformation() {
  const {
    acceptedFiles,
    isDragActive,
    isDragAccept,
    isDragReject,
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: 'image/jpeg, image/png'
  });

  const identityFiles = acceptedFiles.map((file, index) => (
    <ListItem disableGutters component="div" key={index}>
      <ListItemText primary={file.name} />
      <b>{file.size} bytes</b>
      <Divider />
    </ListItem>
  ));

  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();


  const registerAsocciated = async (_values) => {
    console.log('values', _values);

    const {
      names,
      dni,
      university,
      career,
      email,
      semester,
      merit,
      identityFiles,
      informationFiles
    } = _values;
    await axios.post('/api/associated/register', {
      names,
      dni,
      university,
      career,
      email,
      semester,
      merit,
      identityFiles,
      informationFiles
    });
  };

  const handleCreateProjectSuccess = () => {
    enqueueSnackbar('Se ha registrado a la nueva asociada satisfactoriamente', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Mi perfil
          </Typography>
        </Grid>

        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 },
              mr: { xs: 0, sm: 2 }
            }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Ver perfil
          </Button>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Solicitar edición
          </Button>
        </Grid>
      </Grid>
      <Card
        sx={{
          p: 1,
          mb: 3,
          mt: 2
        }}
      >
        <Grid item xs={12} sm={12} md={12}>
          <Formik
            initialValues={{
              names: '',
              dni: '',
              email: '',
              submit: null
            }}
            validationSchema={Yup.object().shape({
              names: Yup.string().required('El nombre es obligatorio'),
              dni: Yup.number().required('El DNI es obligatorio'), // .test('len', 'El DNI debe tener 8 caracteres', val => val.toString().length === 8),
              email: Yup.string().required('El correo es obligatorio'),
            })}
            onSubmit={async (
              _values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                console.log('viva cristo');
                await registerAsocciated(_values);
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                handleCreateProjectSuccess();
                // getAssociates();
              } catch (err) {
                console.error(err);
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              // isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <CardContent
                  dividers
                  sx={{
                    p: 3
                  }}
                >
                  <Typography variant="h4" gutterBottom>
                    Datos personales
                  </Typography>
                  <Card sx={{ display: 'flex', flexDirection: 'row', mb: 4 }}>
                    <Grid xs={6} sm={6} md={6}>
                      <Grid
                        container
                        spacing={0}
                        direction="column"
                        justifyContent="center"
                        paddingLeft={2}
                        paddingRight={2}
                      >
                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={3}
                          justifyContent="flex-end"
                          textAlign={{ sm: 'left' }}
                        >
                          <Box
                            pr={3}
                            sx={{
                              pt: `${theme.spacing(2)}`,
                              pb: { xs: 1, md: 0 }
                            }}
                            alignSelf="center"
                          >
                            <b>Nombres:</b>
                          </Box>
                        </Grid>
                        <Grid
                          sx={{
                            mb: `${theme.spacing(3)}`
                          }}
                          item
                          xs={12}
                          sm={8}
                          md={9}
                        >
                          <TextField
                            error={Boolean(touched.names && errors.names)}
                            fullWidth
                            helperText={touched.names && errors.names}
                            name="names"
                            placeholder="Nombres"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.names}
                            variant="outlined"
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={3}
                          justifyContent="flex-end"
                          textAlign={{ sm: 'left' }}
                        >
                          <Box
                            pr={3}
                            sx={{
                              pt: `${theme.spacing(2)}`,
                              pb: { xs: 1, md: 0 }
                            }}
                            alignSelf="center"
                          >
                            <b>DNI:</b>
                          </Box>
                        </Grid>
                        <Grid
                          sx={{
                            mb: `${theme.spacing(3)}`
                          }}
                          item
                          xs={12}
                          sm={8}
                          md={9}
                        >
                          <TextField
                            error={Boolean(touched.dni && errors.dni)}
                            fullWidth
                            helperText={touched.dni && errors.dni}
                            name="dni"
                            placeholder="DNI"
                            type="number"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.dni}
                            variant="outlined"
                          />
                        </Grid>

                        <Grid
                          item
                          xs={12}
                          sm={4}
                          md={3}
                          justifyContent="flex-end"
                          textAlign={{ sm: 'left' }}
                        >
                          <Box
                            pr={3}
                            sx={{
                              pt: `${theme.spacing(2)}`,
                              pb: { xs: 1, md: 0 }
                            }}
                            alignSelf="center"
                          >
                            <b>Correo:</b>
                          </Box>
                        </Grid>
                        <Grid
                          sx={{
                            mb: `${theme.spacing(3)}`
                          }}
                          item
                          xs={12}
                          sm={8}
                          md={9}
                        >
                          <TextField
                            error={Boolean(touched.email && errors.email)}
                            fullWidth
                            helperText={touched.email && errors.email}
                            name="email"
                            placeholder="Correo"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            variant="outlined"
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Divider orientation="vertical" flexItem />

                    <Grid
                      xs={6}
                      sm={6}
                      md={6}
                      sx={{ display: 'flex', flexDirection: 'row' }}
                    >
                      <Grid
                        container
                        spacing={0}
                        direction="column"
                        justifyContent="center"
                        alignItems="center"
                        paddingLeft={2}
                        paddingRight={2}
                      >
                        <b>
                          Confirme su identidad adjuntando una copia de su DNI
                        </b>
                        <Grid
                          sx={{
                            mt: `${theme.spacing(3)}`,
                            mb: `${theme.spacing(3)}`
                          }}
                          item
                          xs={12}
                          sm={8}
                          md={9}
                        >
                          <BoxUploadWrapper {...getRootProps()}>
                            <input {...getInputProps()} />
                            {isDragAccept && (
                              <>
                                <AvatarSuccess variant="rounded">
                                  <CheckTwoToneIcon />
                                </AvatarSuccess>
                                <Typography
                                  sx={{
                                    mt: 2
                                  }}
                                >
                                  Arrastra los archivos para comenzar la subida
                                </Typography>
                              </>
                            )}
                            {isDragReject && (
                              <>
                                <AvatarDanger variant="rounded">
                                  <CloseTwoToneIcon />
                                </AvatarDanger>
                                <Typography
                                  sx={{
                                    mt: 2
                                  }}
                                >
                                  No puedes subir estos tipos de archivos
                                </Typography>
                              </>
                            )}
                            {!isDragActive && (
                              <>
                                <AvatarWrapper variant="rounded">
                                  <CloudUploadTwoToneIcon />
                                </AvatarWrapper>
                                <Typography
                                  sx={{
                                    mt: 2
                                  }}
                                >
                                  Arrastra y suelta los archivos aquí
                                </Typography>
                              </>
                            )}
                          </BoxUploadWrapper>
                          {identityFiles.length > 0 && (
                            <>
                              <Alert
                                sx={{
                                  py: 0,
                                  mt: 2
                                }}
                                severity="success"
                              >
                                Has subido <b>{identityFiles.length}</b>{' '}
                                archivos
                              </Alert>
                              <Divider
                                sx={{
                                  mt: 2
                                }}
                              />
                              <List disablePadding component="div">
                                {identityFiles}
                              </List>
                            </>
                          )}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>
                </CardContent>
              </form>
            )}
          </Formik>
        </Grid>
      </Card>
    </>
  );
}

export default PersonalInformation;
