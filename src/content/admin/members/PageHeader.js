import { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
// import { styled } from '@mui/material/styles';
// import useRefMounted from 'src/hooks/useRefMounted';
import InputLabel from '@mui/material/InputLabel';
// import Autocomplete from '@mui/material/Autocomplete';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import certifyAxios from 'src/utils/aimAxios';
// import { useDropzone } from 'react-dropzone';
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  // Box,
  Zoom,
  Typography,
  TextField,
  CircularProgress,
  Button,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  Card,
  // CardContent,
  // Divider,
  /*
  ListItem,
  ListItemText,
  Alert,
  List,
  Avatar,
  */
  useTheme
} from '@mui/material';
import { useSnackbar } from 'notistack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';


function PageHeader({ getMembers }) {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  // const isMountedRef = useRefMounted();

  const [enteredFullName, setEnteredFullName] = useState('');
  const [selectedDocumentType, setSelectedDocumenType] = useState();
  const [enteredDocumentNumber, setEnteredDocumentNumber] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPhone, setEnteredPhone] = useState('');

  const handleCreateProjectOpen = () => {
    setOpen(true);
  };

  const handleCreateProjectClose = () => {
    setOpen(false);
  };

  const handleCreateProjectSuccess = () => {
    enqueueSnackbar('Se ha registrado al nuevo miembro satisfactoriamente', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
    setEnteredFullName('');
    setSelectedDocumenType('');
    setEnteredDocumentNumber('');
    setEnteredEmail('');
    setEnteredPhone('');
    setOpen(false);
  };

  const handleCreateProjectFailure = (message) => {

    enqueueSnackbar(`Hubo un error en el registro. ${message}`,
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Zoom
      });
  };


  const documentTypeOptions = [
    {
      id: 'none',
      name: 'Seleccione'
    },
    {
      id: '1',
      name: 'Documento de Identidad'
    },
    {
      id: '2',
      name: 'Carnet de Extranjería'
    }
  ];


  const handleFullNameChange = (event) => {
    setEnteredFullName(event.target.value);
  }

  const handleDocumentTypeChange = (event) => {
    setSelectedDocumenType(event.target.value);
  }

  const handleDocumentNumberChange = (event) => {
    setEnteredDocumentNumber(event.target.value);
  }

  const handleEmailChange = (event) => {
    setEnteredEmail(event.target.value);
  }

  const handlePhoneChange = (event) => {
    setEnteredPhone(event.target.value);
  }

  const handleFormSubmit = async () => {
    try {
      const request = {
        "fullName": enteredFullName,
        "documentType": selectedDocumentType - 1,
        "documentNumber": enteredDocumentNumber,
        "email": enteredEmail,
        "phoneNumber": enteredPhone
      };
      console.log(request);
      const response = await certifyAxios.post('/person/member/register', request);
      console.log('Server response: ', response.data);
      handleCreateProjectSuccess();
      getMembers({
        "firstResult": 1,
        "fullName": "",
        "maxResults": 5,
        "suspended": 0
      });

    } catch (err) {
      handleCreateProjectFailure(err.message);
      console.error(err);

      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.error(err.request);
      } else {
        console.error('Error desconocido');
      }
    }
  }

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Miembros AIM
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={handleCreateProjectOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Nuevo Miembro AIM
          </Button>
        </Grid>
      </Grid>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleCreateProjectClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            Nuevo Miembro AIM
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            fullName: '',
            documentType: '',
            documentNumber: '',
            email: '',
            phone: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            fullName: Yup.string().required('El nombre es obligatorio'),
            documentType: Yup.string().required('El tipo de documento es obligatorio'),
            documentNumber: Yup.string().required('El número de documento es obligatorio'),
            email: Yup.string().required('El correo es obligatorio'),
            phoneNumber: Yup.string().required('El teléfono es obligatorio')
          })}
          onSubmit={async () => {
            console.log('Form submitted');
          }}
        >


          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
          }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
                <Typography variant="h4" gutterBottom>
                  Ingresa tus datos personales
                </Typography>
                <Card sx={{ display: 'flex', flexDirection: 'row', mb: 4 }}>
                  <Grid xs={6} sm={6} md={12}>
                    <Grid
                      container
                      spacing={0}
                      direction="column"
                      justifyContent="center"
                      paddingLeft={2}
                      paddingRight={2}
                    >
                      <Grid
                        sx={{
                          m: `${theme.spacing(2)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                      >
                        <TextField
                          error={Boolean(touched.fullName && errors.fullName)}
                          fullWidth
                          required
                          helperText={touched.fullName && errors.fullName}
                          name="fullName"
                          placeholder="Ejemplo: Carlos Perez"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleFullNameChange(e)
                            handleChange(e);
                          }}
                          value={enteredFullName}
                          variant="outlined"
                          label="Nombre Completo"
                        />
                      </Grid>

                      <Grid
                        sx={{
                          m: `${theme.spacing(2)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                      >
                        <FormControl fullWidth required variant="outlined" error={Boolean(touched.documentType && errors.documentType)}>
                          <InputLabel>Tipo de Documento</InputLabel>
                          <Select
                            name="documentType"
                            helperText={touched.documentType && errors.documentType}
                            onBlur={handleBlur}
                            value={selectedDocumentType || 'none'}
                            onChange={(e) => {
                              handleDocumentTypeChange(e)
                              handleChange(e);
                            }}
                            label="Tipo de Documento"
                          >
                            {documentTypeOptions.map((documentTypeOption) => (
                              <MenuItem
                                key={documentTypeOption.id}
                                value={documentTypeOption.id}
                              >
                                {documentTypeOption.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{touched.documentType && errors.documentType}</FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        sx={{
                          m: `${theme.spacing(2)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                      >
                        <TextField
                          error={Boolean(touched.documentNumber && errors.documentNumber)}
                          required
                          fullWidth
                          helperText={touched.documentNumber && errors.documentNumber}
                          name="documentNumber"
                          placeholder="Ejemplo: 12345678"
                          type="number"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleDocumentNumberChange(e);
                            handleChange(e);
                          }}
                          value={enteredDocumentNumber}
                          variant="outlined"
                          label="Nro de Documento"
                        />
                      </Grid>

                      <Grid
                        sx={{
                          m: `${theme.spacing(2)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                      >
                        <TextField
                          error={Boolean(touched.email && errors.email)}
                          fullWidth
                          required
                          helperText={touched.email && errors.email}
                          name="email"
                          placeholder="Ejemplo: usuario@dominio.com"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleEmailChange(e);
                            handleChange(e);
                          }}
                          value={enteredEmail}
                          variant="outlined"
                          label="Correo"
                        />
                      </Grid>

                      <Grid
                        sx={{
                          m: `${theme.spacing(2)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                      >
                        <TextField
                          error={Boolean(touched.phone && errors.phone)}
                          fullWidth
                          required
                          helperText={touched.phone && errors.phone}
                          name="phoneNumber"
                          placeholder="Ejemplo: 999999999"
                          type="number"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handlePhoneChange(e);
                            handleChange(e);
                          }}
                          value={enteredPhone}
                          variant="outlined"
                          label="Teléfono"
                        />
                      </Grid>


                    </Grid>
                  </Grid>
                  {/*
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
                      {/* <Grid
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
                            pb: { xs: 1, md: 0 }
                          }}
                        >
                          <b>
                            Confirme su identidad adjuntando una copia de su DNI
                          </b>
                        </Box>
                      </Grid> }
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
                              Has subido <b>{identityFiles.length}</b> archivos
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
                  */}
                </Card>

                <Grid
                  sx={{
                    mb: `${theme.spacing(3)}`
                  }}
                  container
                  justifyContent="center"
                  margin="auto"
                  item
                  xs={12}
                  sm={8}
                  md={9}
                >
                  <Button
                    sx={{
                      mr: 2
                    }}
                    type="submit"
                    startIcon={
                      isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                    disabled={Boolean(errors.submit) || isSubmitting}
                    variant="contained"
                    size="large"
                    color="secondary"
                    onClick={handleFormSubmit}
                  >
                    Registrar
                  </Button>
                  <Button
                    color="secondary"
                    size="large"
                    variant="outlined"
                    onClick={handleCreateProjectClose}
                  >
                    Cancelar
                  </Button>
                </Grid>
              </DialogContent>
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

export default PageHeader;
