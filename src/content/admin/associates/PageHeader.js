import { useState, useCallback, useEffect } from 'react';
import useRefMounted from 'src/hooks/useRefMounted';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Autocomplete from '@mui/material/Autocomplete';
import 'react-quill/dist/quill.snow.css';
import certifyAxios from 'src/utils/aimAxios';
import { useDropzone } from 'react-dropzone';
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Zoom,
  Typography,
  TextField,
  FormHelperText,
  CircularProgress,
  Button,
  FormControl,
  Select,
  MenuItem,
  Card,
  Divider,
  Alert,
  useTheme
} from '@mui/material';
import { useSnackbar } from 'notistack';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import InputLabel from '@mui/material/InputLabel';
import debounce from 'lodash/debounce';
import DropzoneAIM from 'src/components/DropzoneAIM';



function PageHeader({ getAssociates }) {
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const isMountedRef = useRefMounted();

  const [enteredName, setEnteredName] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState();
  const [enteredIdentity, setEnteredIdentity] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [selectedSemester, setSelectedSemester] = useState();
  const [selectedMerit, setSelectedMerit] = useState();
  // const [selectedInstitute, setSelectedInstitute] = useState();
  const [uploadedPhoto, setUploadedPhoto] = useState({});

  const [instituteInputValue, setInstituteInputValue] = useState('');
  const [instituteOptions, setInstituteOptions] = useState([]);

  const [instituteMajorOptions, setInstituteMajorOptions] = useState([]);
  const [selectedInstituteMajor, setSelectedInstituteMajor] = useState();
  const [disableMajorCombo, setDisableMajorCombo] = useState(true);

  const getInstituteOptionsDelayed = useCallback(
    debounce((inputText) => {
      // console.log('ENTERING DEBOUNCE with inputText: ', inputText);
      setInstituteOptions([]);
      if (inputText && inputText.length !== 0) getInstitutes(inputText);
    }, 200),
    []
  );

  const {
    isDragActive: isDragActivePhoto,
    isDragAccept: isDragAcceptPhoto,
    isDragReject: isDragRejectPhoto,
    getRootProps: getRootPhoto,
    getInputProps: getInputPhoto
  } = useDropzone({
    accept: 'image/jpeg, image/png',
    maxFiles: 1,
    onDrop: (acceptedFile) => {
      if (acceptedFile[0] !== undefined)
        setUploadedPhoto(
          Object.assign(acceptedFile[0], {
            preview: URL.createObjectURL(acceptedFile[0]),
          }),
        );
    },
  });

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
    setEnteredName('');
    setSelectedDocumentType();
    setEnteredIdentity('');
    setEnteredEmail('');
    setSelectedInstituteMajor();
    setUploadedPhoto({});
    setSelectedSemester();
    setSelectedMerit();
  };

  const handleCreateProjectFailure = (message) => {
    enqueueSnackbar(`Hubo un error en el registro. ${message}`, {
      variant: 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  const semesterOptions = [
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

  const documentTypeOptions = [
    {
      id: 1,
      name: 'DNI'
    },
    {
      id: 2,
      name: 'Carné de extranjería'
    }
  ];


  const getInstitutes = useCallback(async (inputText) => {
    try {
      const request = {
        "value": inputText
      };

      const response = await certifyAxios.post('/common/institute/query', request);
      // console.log('Received institutes: ', response.data.list);
      setInstituteOptions(response.data.list);

      // if (isMountedRef.current) {
      // }
    } catch (err) {
      console.error(err);

      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.error(err.request);
      } else {
        console.error('Some other unknown error');
      }
    }
  }, [isMountedRef]);

  const getInstituteMajors = async (instituteKey) => {
    try {
      const request = {
        "id": instituteKey
      };

      // console.log('instituteMajor request: ', request);
      const response = await certifyAxios.post('/common/institute/instituteMajor/query', request);
      // console.log('Received majors: ', response.data.list);


      if (response.data.list.length > 0) {
        setInstituteMajorOptions(response.data.list);
        setDisableMajorCombo(false);
      }

    } catch (err) {
      console.error(err);

      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.error(err.request);
      } else {
        console.error('Some other unknown error');
      }
    }
  };

  const handleNameChange = (e) => {
    setEnteredName(e.target.value);
  }

  const handleDocumentTypeChange = (e) => {
    setSelectedDocumentType(e.target.value);
  }

  const handleIdentityChange = (e) => {
    setEnteredIdentity(e.target.value);
  }

  const handleEmailChange = (e) => {
    setEnteredEmail(e.target.value);
  }

  const handleInstituteChange = (e, v) => {
    console.log('institute changing');

    if (v) {
      console.log('institute changing and not null');
      // setSelectedInstitute(v);
      getInstituteMajors(v.key);
    }
    else {
      setInstituteMajorOptions([]);
    }

  };

  const handleInstituteMajorChange = (e) => {
    setSelectedInstituteMajor(e.target.value);
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  const handleMeritChange = (e) => {
    setSelectedMerit(e.target.value);
  };

  useEffect(() => {
    getInstituteOptionsDelayed(instituteInputValue, (filteredOptions) => {
      setInstituteOptions(filteredOptions);
    });
  }, [instituteInputValue, getInstituteOptionsDelayed]);


  const handleFormSubmit = async () => {
    try {
      const request = {
        "documentNumber": enteredIdentity,
        "documentType": selectedDocumentType - 1, // el combo por alguna razón no admite id 0
        "email": enteredEmail,
        "fullName": enteredName,
        "id": null,
        "instituteMajorId": selectedInstituteMajor,
        "photoUrl": uploadedPhoto.path,
        "phase": selectedSemester,
        "merit": selectedMerit
      };

      console.log('YOUR FORM REQUEST IS: ', request);

      const response = await certifyAxios.post('/person/partner/register', request);
      console.log('Server says: ', response.data);
      handleCreateProjectSuccess();

      // llamamos al servicio de listado de asociadas:
      getAssociates({
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
        console.error('Some other unknown error');
      }
    }
  }

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Asociadas
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
            Nueva Asociada
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            names: '',
            identityType: '',
            documentNumber: '',
            email: '',
            university: '',
            major: '',
            semester: '',
            merit: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            names: Yup.string().required('El nombre es obligatorio'),
            identityType: Yup.number().required('El DNI es obligatorio'), // .test('len', 'El DNI debe tener 8 caracteres', val => val.toString().length === 8),
            documentNumber: Yup.number().required('El DNI es obligatorio'), // .test('len', 'El DNI debe tener 8 caracteres', val => val.toString().length === 8),
            email: Yup.string().required('El correo es obligatorio'),
            university: Yup.string().required('La universidad es obligatoria'),
            major: Yup.string().required('La carrera es obligatoria'),
            semester: Yup.number().required('El ciclo es obligatorio'),
            merit: Yup.number().required('El mérito es obligatorio')
          })}
          onSubmit={async (
            // values, { setErrors, setStatus, setSubmitting }
          ) => {
            console.log('submitting');
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            // values
          }) => (
            <form noValidate onSubmit={handleSubmit}>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
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
                        sx={{
                          m: `${theme.spacing(1)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                      >
                        <TextField
                          name="names"
                          required
                          error={Boolean(touched.names && errors.names)}
                          fullWidth
                          helperText={touched.names && errors.names}
                          placeholder="Nombres"
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleNameChange(e);
                            handleChange(e);
                          }}
                          value={enteredName}
                          variant="outlined"
                          label="Nombre Completo"
                        />
                      </Grid>

                      <Grid
                        sx={{
                          m: `${theme.spacing(1)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                      >
                        <FormControl fullWidth required variant="outlined" error={Boolean(touched.identityType && errors.identityType)}>
                          <InputLabel>Tipo de Documento de Identidad</InputLabel>
                          <Select
                            name="identityType"
                            helperText={touched.identityType && errors.identityType}
                            onBlur={handleBlur}
                            value={selectedDocumentType || ''}
                            onChange={(e) => {
                              handleDocumentTypeChange(e);
                              handleChange(e);
                            }}
                            label="Tipo de Documento de Identidad"
                          >
                            {documentTypeOptions.map((docTypeOption) => (
                              <MenuItem
                                key={docTypeOption.id}
                                value={docTypeOption.id}
                              >
                                {docTypeOption.name}
                              </MenuItem>
                            ))}
                          </Select>
                          <FormHelperText>{touched.identityType && errors.identityType}</FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        sx={{
                          m: `${theme.spacing(1)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                      >
                        <TextField
                          name="documentNumber"
                          error={Boolean(touched.documentNumber && errors.documentNumber)}
                          helperText={touched.documentNumber && errors.documentNumber}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleIdentityChange(e);
                            handleChange(e);
                          }}

                          required
                          fullWidth
                          placeholder="Documento de Identidad"
                          type="number"
                          value={enteredIdentity}
                          variant="outlined"
                          label="Documento de Identidad"
                        />
                      </Grid>

                      <Grid
                        sx={{
                          m: `${theme.spacing(1)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                      >
                        <TextField
                          name="email"
                          error={Boolean(touched.email && errors.email)}
                          helperText={touched.email && errors.email}
                          onBlur={handleBlur}
                          onChange={(e) => {
                            handleEmailChange(e);
                            handleChange(e);
                          }}
                          required
                          fullWidth
                          placeholder="Correo"
                          value={enteredEmail}
                          variant="outlined"
                          label="Correo"
                        />
                      </Grid>

                      <Grid
                        sx={{
                          m: `${theme.spacing(1)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                      >

                        <FormControl required fullWidth variant="outlined" >
                          <Autocomplete
                            id="autocomplete-institutes"
                            onChange={(e, v) => {
                              handleInstituteChange(e, v);
                            }}
                            filterOptions={(x) => x}

                            onInputChange={(e, newInputValue) => setInstituteInputValue(newInputValue)}
                            renderInput={(params) => (
                              <TextField {...params}
                                name="university"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                error={Boolean(touched.university && errors.university)}
                                helperText={touched.university && errors.university}
                                label="Universidad"
                              />
                            )}
                            options={instituteOptions}
                            getOptionLabel={(instituteOption) => instituteOption.value}
                            placeholder='Escriba para buscar'
                            noOptionsText="No se han encontrado universidades"
                            forcePopupIcon={false}
                          />
                        </FormControl>
                      </Grid>


                      <Grid
                        sx={{
                          m: `${theme.spacing(1)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                      >
                        <FormControl required fullWidth variant="outlined">
                          <InputLabel>Carrera</InputLabel>
                          <Select
                            disabled={disableMajorCombo}
                            value={selectedInstituteMajor}
                            onChange={handleInstituteMajorChange}
                            label="Carrera"
                          >
                            {instituteMajorOptions.map((majorOption) => (
                              <MenuItem
                                key={majorOption.key}
                                value={majorOption.key}
                              >
                                {majorOption.value}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid
                        sx={{
                          m: `${theme.spacing(1)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                      >
                        <FormControl required fullWidth variant="outlined" error={Boolean(touched.semester && errors.semester)}>
                          <InputLabel>Ciclo</InputLabel>
                          <Select
                            name="semester"
                            helperText={touched.semester && errors.semester}
                            onBlur={handleBlur}
                            value={selectedSemester || ''}
                            onChange={(e) => {
                              handleSemesterChange(e);
                              handleChange(e);
                            }}

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
                          <FormHelperText>{touched.semester && errors.semester}</FormHelperText>
                        </FormControl>
                      </Grid>

                      <Grid
                        sx={{
                          mt: `${theme.spacing(1)}`,
                          mx: `${theme.spacing(1)}`,
                          mb: `${theme.spacing(2)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                      >
                        <FormControl required fullWidth variant="outlined" error={Boolean(touched.merit && errors.merit)}>
                          <InputLabel>Mérito</InputLabel>
                          <Select
                            name="merit"
                            helperText={touched.merit && errors.merit}
                            onBlur={handleBlur}
                            value={selectedMerit || ''}
                            onChange={(e) => {
                              handleMeritChange(e);
                              handleChange(e);
                            }}

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
                          <FormHelperText>{touched.merit && errors.merit}</FormHelperText>
                        </FormControl>
                      </Grid>

                    </Grid>
                  </Grid>

                  <Divider orientation="vertical" flexItem />

                  <Grid
                    item
                    xs={6}
                    sm={6}
                    md={6}
                    sx={{ display: 'box', flexDirection: 'column' }}
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
                        Foto
                      </b>


                      <Grid
                        sx={{
                          mt: `${theme.spacing(0)}`,
                          mb: `${theme.spacing(3)}`,
                          mr: `${theme.spacing(1)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={8}
                      >
                        <DropzoneAIM
                          isDragAccept={isDragAcceptPhoto}
                          isDragActive={isDragActivePhoto}
                          isDragReject={isDragRejectPhoto}
                          getInputProps={getInputPhoto}
                          getRootProps={getRootPhoto}
                          acceptText=".png .jpg"
                          files={uploadedPhoto}
                          setNewFiles={setUploadedPhoto}
                        />
                        <div style={{ display: "flex", flexDirection: "column", marginTop: `${theme.spacing(1)}` }}>
                          {uploadedPhoto.preview && (
                            <>
                              <Alert
                                sx={{
                                  py: 0,
                                  mt: 2
                                }}
                                severity="success"
                              >
                                Has subido el archivo exitosamente.
                              </Alert>
                              <Divider
                                sx={{
                                  mt: 2
                                }}
                              />
                            </>
                          )}
                          {uploadedPhoto.preview &&
                            <div style={{ position: "relative", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                              <img
                                style={{ width: "10rem", height: "10rem", margin: "0" }}
                                src={uploadedPhoto.preview}
                                alt="Foto"
                              />
                            </div>}
                        </div>
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
