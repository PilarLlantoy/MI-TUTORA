import { useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { styled } from '@mui/material/styles';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'src/utils/axios';
import { useDropzone } from 'react-dropzone';
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Zoom,
  Typography,
  TextField,
  CircularProgress,
  Button,
  FormControl,
  Select,
  MenuItem,
  Card,
  // CardContent,
  Divider,
  ListItem,
  ListItemText,
  Alert,
  List,
  Avatar,
  useTheme
} from '@mui/material';
import { useSnackbar } from 'notistack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
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

function PageHeader({ getAssociates }) {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();

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

  const informationFiles = acceptedFiles.map((file, index) => (
    <ListItem disableGutters component="div" key={index}>
      <ListItemText primary={file.name} />
      <b>{file.size} bytes</b>
      <Divider />
    </ListItem>
  ));

  const handleCreateProjectOpen = () => {
    setOpen(true);
  };

  const handleCreateProjectClose = () => {
    setOpen(false);
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

    setOpen(false);
  };

  const semesterOptions = [
    {
      id: 'none',
      name: 'Seleccione'
    },
    {
      id: '1',
      name: '1'
    },
    {
      id: '2',
      name: '2'
    },
    {
      id: '3',
      name: '3'
    },
    {
      id: '4',
      name: '4'
    },
    {
      id: '5',
      name: '5'
    },
    {
      id: '6',
      name: '6'
    },
    {
      id: '7',
      name: '7'
    },
    {
      id: '8',
      name: '8'
    },
    {
      id: '9',
      name: '9'
    },
    {
      id: '10',
      name: '10'
    }
  ];

  const meritOptions = [
    {
      id: 'none',
      name: 'Seleccione'
    },
    {
      id: '1',
      name: 'Medio Superior'
    },
    {
      id: '2',
      name: 'Tercio Superior'
    },
    {
      id: '3',
      name: 'Quinto Superior'
    },
    {
      id: '4',
      name: 'Décimo Superior'
    }
  ];

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

  const [semesterFilters, setSemesterFilters] = useState({
    status: null
  });

  const [meritFilters, setMeritFilters] = useState({
    status: null
  });

  const handleSemesterChange = (e) => {
    let value = null;

    if (e.target.value !== 'none') {
      value = e.target.value;
    }

    setSemesterFilters((prevFilters) => ({
      ...prevFilters,
      semester: value
    }));
  };

  const handleMeritChange = (e) => {
    let value = null;

    if (e.target.value !== 'none') {
      value = e.target.value;
    }

    setMeritFilters((prevFilters) => ({
      ...prevFilters,
      merit: value
    }));
  };

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Clientes
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
            Nueva Asociada
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
            Registrar Nueva Asociada
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            names: '',
            dni: '',
            university: '',
            career: '',
            email: '',
            semester: '',
            merit: '',
            identityFiles: '',
            informationFiles: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            names: Yup.string().required('El nombre es obligatorio'),
            dni: Yup.number().required('El DNI es obligatorio'), // .test('len', 'El DNI debe tener 8 caracteres', val => val.toString().length === 8),
            university: Yup.string().required('La universidad es obligatoria'),
            career: Yup.string().required('La carrera es obligatoria'),
            email: Yup.string().required('El correo es obligatorio'),
            semester: Yup.number().required('El ciclo es obligatorio'),
            merit: Yup.number().required('El mérito es obligatorio')
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
              getAssociates();
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
            isSubmitting,
            touched,
            values
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent
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
                      </Grid> */}
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
                </Card>

                <Typography variant="h4" gutterBottom>
                  Datos universitarios
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
                          <b>Universidad:</b>
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
                          error={Boolean(
                            touched.university && errors.university
                          )}
                          fullWidth
                          helperText={touched.university && errors.university}
                          name="university"
                          placeholder="Universidad"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.university}
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
                          <b>Carrera:</b>
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
                          error={Boolean(touched.career && errors.career)}
                          fullWidth
                          helperText={touched.career && errors.career}
                          name="career"
                          placeholder="Carrera"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.career}
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
                          <b>Ciclo:</b>
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
                        <FormControl fullWidth variant="outlined">
                          <Select
                            value={semesterFilters.semester || 'none'}
                            onChange={handleSemesterChange}
                            label="Ciclo"
                          >
                            {semesterOptions.map((semesterOption) => (
                              <MenuItem
                                key={semesterOption.id}
                                value={semesterOption.id}
                              >
                                {semesterOption.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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
                          <b>Orden de mérito:</b>
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
                        <FormControl fullWidth variant="outlined">
                          <Select
                            value={meritFilters.merit || 'none'}
                            onChange={handleMeritChange}
                            label="Mérito"
                          >
                            {meritOptions.map((meritOption) => (
                              <MenuItem
                                key={meritOption.id}
                                value={meritOption.id}
                              >
                                {meritOption.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
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
                        Confirme su información académica adjuntando un
                        consolidado académico o reporte.
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
                          </Grid> */}
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
                        {informationFiles.length > 0 && (
                          <>
                            <Alert
                              sx={{
                                py: 0,
                                mt: 2
                              }}
                              severity="success"
                            >
                              Has subido <b>{informationFiles.length}</b>{' '}
                              archivos
                            </Alert>
                            <Divider
                              sx={{
                                mt: 2
                              }}
                            />
                            <List disablePadding component="div">
                              {informationFiles}
                            </List>
                          </>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
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
