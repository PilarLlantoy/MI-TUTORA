import {
  configS3,
  createBackUrl,
  getNewNameWithExtension,
  renameFile,
  getNameAndUrlFromBack,
} from 'src/utils/awsConfig';
import { downloadFileHandle } from 'src/content/awstest';
import { uploadFile } from 'react-s3';
import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { useDropzone } from 'react-dropzone';
import DropzoneAIM from 'src/components/DropzoneAIM';
import wait from 'src/utils/wait';
import certifyAxios from 'src/utils/aimAxios';
import debounce from 'lodash/debounce';
import useRefMounted from 'src/hooks/useRefMounted';
import useAuth from 'src/hooks/useAuth';

import {
  Alert,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  Grid,
  Box,
  Zoom,
  Checkbox,
  Typography,
  TextField,
  CircularProgress,
  Button,
  IconButton,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  useTheme
} from '@mui/material';
import { CheckboxWithLabel } from 'formik-mui';
import * as Yup from 'yup';
import { Formik, Field } from 'formik';
// import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useSnackbar } from 'notistack';
import DownloadIcon from '@mui/icons-material/Download';
import LaunchTwoToneIcon from '@mui/icons-material/LaunchTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import BulkActions from './BulkActions';


const applyFilters = (projects, query, filters) => {
  return projects.filter((project) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (project[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.status && project.status !== filters.status) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && project[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

export const uploadFileHandle = async (file, newFileName) => {
  if (file !== null) {
    // Renombrar el archivo para que sea unico pls y guardalo en el s3
    const nombreOriginal = file.name
    const nuevoNombre = getNewNameWithExtension(newFileName, nombreOriginal)
    const nuevoArchivoRenombrado = renameFile(file, nuevoNombre)
    console.log("archivo renombrado: ", nuevoArchivoRenombrado)
    try {
      const response = await uploadFile(nuevoArchivoRenombrado, configS3)
      if (response) {
        console.log("UPLOAD RESPONSE: ", response)
        return createBackUrl(nombreOriginal, response.location)
      }
    } catch (err) {
      console.error("UPLOAD ERROR", err)
      return ""
    }
  } else {
    return ""
  }
  return ""
}

function PageHeader({ projects }) {
  const [selectedItems, setSelectedProjects] = useState([]);
  const [open, setOpen] = useState(false);
  const [query] = useState('');
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [filters] = useState({
    status: null
  });
  const filteredProjects = applyFilters(projects, query, filters);
  const selectedSomeProjects =
    selectedItems.length > 0 && selectedItems.length < projects.length;
  const selectedBulkActions = selectedItems.length > 0;
  const [identityFile, setIdentityFile] = useState({});
  const [informationFile, setInformationFile] = useState({});
  const [photoFile, setPhotoFile] = useState({});
  const [certificateFile, setCertificateFile] = useState({});
  const [instituteOptions, setInstituteOptions] = useState([]);
  const [instituteMajorOptions, setInstituteMajorOptions] = useState([]);
  const [disableMajorCombo, setDisableMajorCombo] = useState(true);
  const [enteredName, setEnteredName] = useState('');
  const [enteredIdentity, setEnteredIdentity] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredPhone, setEnteredPhone] = useState('');
  const [enteredDescription, setEnteredDescription] = useState('');
  const [enteredPrice, setEnteredPrice] = useState();
  const [selectedSemester, setSelectedSemester] = useState();
  const [selectedMerit, setSelectedMerit] = useState();
  // const [profilePictureURL, setProfilePictureURL] = useState('');
  const isMountedRef = useRefMounted();
  const { user } = useAuth();

  const [selectedInstituteMajor, setSelectedInstituteMajor] = useState(
    user.person.instituteMajor.id
  );
  const [instituteInputValue, setInstituteInputValue] = useState(
    user.person.instituteMajor.institute.name
  );

  const getInstituteOptionsDelayed = useCallback(
    debounce((inputText) => {
      setInstituteOptions([]);
      if (inputText && inputText.length !== 0) getInstitutes(inputText);
    }, 200),
    []
  );

  useEffect(() => {
    if (user) {
      setEnteredName(user.person.fullName);
      setEnteredIdentity(user.person.documentNumber);
      setEnteredEmail(user.person.email);
      setInstituteInputValue(user.person.instituteMajor.institute.name); // Universidad
      getInstituteOptionsDelayed(instituteInputValue, (filteredOptions) => {
        setInstituteOptions(filteredOptions);
      });
      getInstituteMajors(user.person.instituteMajor.institute.id);
      setSelectedSemester(user.person.phase);
      setSelectedMerit(user.person.merit);
      setEnteredDescription(user.person.description);
      setEnteredPhone(user.person.phoneNumber);
      setEnteredPrice(user.person.price);

      // setProfilePictureURL(user.person.profilePictureURL);

      setPhotoFile(
        Object.assign(photoFile, {
          preview: getNameAndUrlFromBack(user.person.profilePictureURL).urlS3
        })
      );
      setInformationFile(
        Object.assign(informationFile, {
          preview: getNameAndUrlFromBack(user.person.academicPhotoURL).urlS3
        })
      );
      setIdentityFile(
        Object.assign(identityFile, {
          preview: getNameAndUrlFromBack(user.person.documentNumberPhotoURL).urlS3
        })
      );

      // getNameAndUrlFromBack(profilePictureURL).urlS3 || 
    }
  }, []);

  useEffect(() => {
    getInstituteOptionsDelayed(instituteInputValue, (filteredOptions) => {
      setInstituteOptions(filteredOptions);
    });
  }, [instituteInputValue, getInstituteOptionsDelayed]);

  const uploadFile = async (file) => {

    // "nombreEnS3" debe ser unico en S3 por lo que deben generar un nombre para su modulo -> "capacitacion-KF3&2DK"
    const nombreEnS3 = file.name.concat(generateRandomString(7));
    // llamada al S3
    const urlToSave = await uploadFileHandle(file, nombreEnS3);
    // "urlToSave" tiene el formato {nombre Original del archivo subido}#{url en S3}
    // puede ser utilizado para guarlado en el back
    // alert("Subido todo OK");

    return urlToSave;
  }

  const generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1 = ''; const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result1 += characters.charAt(Math.floor(Math.random() * charactersLength));
    } return result1;
  }

  const [errorDescription, setErrorDescription] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [errorIdentity, setErrorIdentity] = useState(false);
  const [errorPrice, setErrorPrice] = useState(false);

  const validateFields = () => {
    if (enteredName === null || enteredName.trim() === "") {
      handleCreateProjectFailure('El nombre completo es obligatorio');
      setErrorName(true);
      return false;
    };
    setErrorName(false);

    if (enteredIdentity === null || enteredIdentity.trim() === "" || enteredIdentity.length !== 8) {
      handleCreateProjectFailure('El documento de identidad es obligatorio y debe tener 8 dígitos');
      setErrorIdentity(true);
      return false;
    };
    setErrorIdentity(false);

    if (enteredEmail === null || enteredEmail.trim() === "") {
      handleCreateProjectFailure('El correo electrónico es obligatorio');
      setErrorEmail(true);
      return false;
    };
    setErrorEmail(false);

    if (enteredPhone === null || enteredPhone.trim() === "" || enteredPhone.length !== 9) {
      handleCreateProjectFailure('El número de teléfono es obligatorio y debe tener 9 dígitos');
      setErrorPhone(true);
      return false;
    };
    setErrorPhone(false);

    if (enteredDescription === null || enteredDescription.trim() === "") {
      handleCreateProjectFailure('La descripción es obligatoria');
      setErrorDescription(true);
      return false;
    };
    setErrorDescription(false);

    if (enteredPrice === null || Number.isNaN(+enteredPrice) || enteredPrice < 1) {
      handleCreateProjectFailure('La tarifa es obligatoria y debe ser un número válido');
      setErrorPrice(true);
      return false;
    };
    setErrorPrice(false);

    return true;
  }

  const handleFormSubmit = async () => {
    try {

      if (!validateFields()) return;

      let urlIdentityFile = null;
      let urlInformationFile = null;
      let urlPhotoFile = null;

      if (Object.keys(identityFile).length > 1) {
        urlIdentityFile = await uploadFile(identityFile);
      }
      if (Object.keys(informationFile).length > 1) {
        urlInformationFile = await uploadFile(informationFile);
      }
      if (Object.keys(photoFile).length > 1) {
        urlPhotoFile = await uploadFile(photoFile);
      }

      console.log('asd')
      if(urlIdentityFile !== null && urlIdentityFile.length === 0){
        handleCreateProjectFailure('Error al subir la foto del DNI al servidor.');
        return;
      }
      if(urlInformationFile !== null && urlInformationFile.length === 0){
        handleCreateProjectFailure('Error al subir el archivo académico al servidor.');
        return;
      }
      if(urlPhotoFile !== null && urlPhotoFile.length === 0){
        handleCreateProjectFailure('Error al subir la foto de perfil seleccionada al servidor.');
        return;
      }

      const request = {
        academicPhotoURL: urlInformationFile,
        bankAccount: null,
        bankId: null,
        description: (enteredDescription.trim() === user.person.description ? null : enteredDescription.trim()),
        documentNumberPhotoURL: urlIdentityFile,
        email: (enteredEmail.trim() === user.person.email ? null : enteredEmail.trim()),
        fullName: (enteredName.trim() === user.person.fullName ? null : enteredName.trim()),
        instituteMajorId: (selectedInstituteMajor === user.person.instituteMajor.id ? null : selectedInstituteMajor),
        merit: (selectedMerit === user.person.merit ? null : selectedMerit),
        multibankAccount: null,
        nameAssociateAccount: null,
        partnerId: user.id,
        phase: (selectedSemester === user.person.phase ? null : selectedSemester),
        phoneNumber: (enteredPhone.trim() === user.person.phoneNumber ? null : enteredPhone.trim()),
        price: (+enteredPrice === user.person.price ? null : +enteredPrice),
        profilePictureURL: urlPhotoFile,
        urlPhotoQR: null
      };

      console.log('YOUR FORM REQUEST IS: ', request);

      const response = await certifyAxios.post(
        '/request/profile/register',
        request
      );
      console.log('Server says: ', response.data);
      handleCreateProjectSuccess();
    } catch (err) {
      console.error(err);

      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.error(err.request);
      } else {
        console.error('Some other unknown error');
      }
      handleCreateProjectFailure(err.message || err.status || 'Error al conectarse con el servidor');
    }
  };

  const {
    isDragActive: isDragActiveIdentity,
    isDragAccept: isDragAcceptIdentity,
    isDragReject: isDragRejectIdentity,
    getRootProps: getRootIdentity,
    getInputProps: getInputIdentity
  } = useDropzone({
    accept: 'image/jpeg, image/png',
    maxFiles: 1,
    onDrop: (acceptedFile) => {
      if (acceptedFile[0] !== undefined)
        setIdentityFile(
          Object.assign(acceptedFile[0], {
            preview: URL.createObjectURL(acceptedFile[0])
          })
        );
    }
  });

  const getInstituteMajors = async (instituteKey) => {
    try {
      const request = {
        id: instituteKey
      };

      const response = await certifyAxios.post(
        '/common/institute/instituteMajor/query',
        request
      );

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

  const getInstitutes = useCallback(
    async (inputText) => {
      try {
        const request = {
          value: inputText
        };

        const response = await certifyAxios.post(
          '/common/institute/query',
          request
        );
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
    },
    [isMountedRef]
  );

  const handleInstituteChange = (e, v) => {
    console.log('institute changing');

    if (v) {
      console.log('institute changing and not null');
      // setSelectedInstitute(v);
      getInstituteMajors(v.key);
    } else {
      setInstituteMajorOptions([]);
    }
  };

  const handleInstituteMajorChange = (e) => {
    setSelectedInstituteMajor(e.target.value);
  };

  const {
    isDragActive: isDragActiveInformation,
    isDragAccept: isDragAcceptInformation,
    isDragReject: isDragRejectInformation,
    getRootProps: getRootInformation,
    getInputProps: getInputInformation
  } = useDropzone({
    accept: 'image/jpeg, image/png',
    maxFiles: 1,
    onDrop: (acceptedFile) => {
      if (acceptedFile[0] !== undefined)
        setInformationFile(
          Object.assign(acceptedFile[0], {
            preview: URL.createObjectURL(acceptedFile[0])
          })
        );
    }
  });

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
        setPhotoFile(
          Object.assign(acceptedFile[0], {
            preview: URL.createObjectURL(acceptedFile[0])
          })
        );
    }
  });

  const {
    isDragActive: isDragActiveCertificate,
    isDragAccept: isDragAcceptCertificate,
    isDragReject: isDragRejectCertificate,
    getRootProps: getRootCertificate,
    getInputProps: getInputCertificate
  } = useDropzone({
    accept: 'image/jpeg, image/png',
    maxFiles: 1,
    onDrop: (acceptedFile) => {
      if (acceptedFile[0] !== undefined)
        setCertificateFile(
          Object.assign(acceptedFile[0], {
            preview: URL.createObjectURL(acceptedFile[0])
          })
        );
    }
  });

  const applyPagination = (projects, page, limit) => {
    return projects.slice(page * limit, page * limit + limit);
  };

  const [toggleView] = useState('table_view');
  const paginatedProjects = applyPagination(filteredProjects, page, limit);
  const selectedAllProjects = selectedItems.length === projects.length;

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
  };

  const navigate = useNavigate();
  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
  };

  const handleSelectOneProject = (_event, projectId) => {
    if (!selectedItems.includes(projectId)) {
      setSelectedProjects((prevSelected) => [...prevSelected, projectId]);
    } else {
      setSelectedProjects((prevSelected) =>
        prevSelected.filter((id) => id !== projectId)
      );
    }
  };

  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
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

  const handleAddCertificateClose = () => {
    setOpen(false);
  };
  const handleAddCertificateOpen = () => {
    setOpen(true);
  };

  const handleSaveFileSuccess = () => {
    enqueueSnackbar('Los archivos se cargaron correctamente', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });

    setOpen(false);
  };

  const handleNameChange = (e) => {
    setEnteredName(e.target.value);
  };

  const handleIdentityChange = (e) => {
    setEnteredIdentity(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setEnteredDescription(e.target.value);
  };

  const handlePriceChange = (e) => {
    setEnteredPrice(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEnteredEmail(e.target.value);
  };

  const handlePhoneChange = (e) => {
    setEnteredPhone(e.target.value);
  }

  const handleCreateProjectSuccess = () => {
    enqueueSnackbar('Se ha creado la solicitud de cambio de datos de perfil de manera exitosa.', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 6000,
      TransitionComponent: Zoom
    });
    navigate('/aim/associated/requests');
  };

  const handleCreateProjectFailure = (msg) => {
    enqueueSnackbar(`Error en la creación de la solicitud (${msg})`, {
      variant: 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 4000,
      TransitionComponent: Zoom
    });
  };

  const handleSemesterChange = (e) => {
    setSelectedSemester(e.target.value);
  };

  const handleMeritChange = (e) => {
    setSelectedMerit(e.target.value);
  };

  const handleSelectAllProjects = (event) => {
    setSelectedProjects(
      event.target.checked ? projects.map((project) => project.id) : []
    );
  };

  const downloadFile = (urlfull) => {
    // Para la descarga, se obtiene el nombre original y la url de 
    // lo que se guardo en back ("urlToSave")
    const url = getNameAndUrlFromBack(urlfull)
    // console.log("nombre original y url: ", url.nombreOriginal, url.urlS3)
    downloadFileHandle(url.urlS3, url.nombreOriginal)
  }

  return (
    <>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Mi perfil
          </Typography>
        </Grid>

        {/* <Grid item>
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
        </Grid> */}
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
              names: enteredName,
              dni: enteredIdentity,
              university: '',
              career: '',
              email: '',
              semester: '',
              merit: '',
              identityFiles: '',
              informationFiles: '',
              submit: null
            }}
            // validationSchema={Yup.object().shape({
            //   names: Yup.string().required('El nombre es obligatorio'),
            //   identityType: Yup.number().required('El DNI es obligatorio'), // .test('len', 'El DNI debe tener 8 caracteres', val => val.toString().length === 8),
            //   documentNumber: Yup.string().length(8, 'El DNI debe tener 8 dígitos').required('El DNI es obligatorio'), // .test('len', 'El DNI debe tener 8 caracteres', val => val.toString().length === 8),
            //   phone: Yup.string().length(8, 'El telefono debe tener 9 dígitos').required('El DNI es obligatorio'),
            //   email: Yup.string().required('El correo es obligatorio'),
            //   university: Yup.string().required('La universidad es obligatoria'),
            //   major: Yup.string().required('La carrera es obligatoria'),
            //   semester: Yup.number().required('El ciclo es obligatorio'),
            //   merit: Yup.number().required('El mérito es obligatorio')
            // })}
            onSubmit={async () => {
              try {
                // await registerAsocciated(_values);
                // setStatus({ success: true });
                // setSubmitting(false);
                // handleCreateProjectSuccess();
                // getAssociates();
              } catch (err) {
                console.error(err);
              }
            }
            }
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched
            }) => (
              <form onSubmit={handleSubmit}>
                <CardContent
                  sx={{
                    p: 3
                  }}
                >
                  <Typography variant="h4" gutterBottom>
                    Datos personales
                  </Typography>
                  <Card sx={{ display: 'flex', flexDirection: 'row', mb: 4 }}>
                    <Grid item xs={6} sm={6} md={6}>
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
                            error={errorName}
                            fullWidth
                            helperText={touched.names && errors.names}
                            name="names"
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
                          <TextField
                            error={errorIdentity}
                            fullWidth
                            helperText={touched.dni && errors.dni}
                            name="dni"
                            placeholder="DNI"
                            type="number"
                            onBlur={handleBlur}
                            onChange={(e) => {
                              handleIdentityChange(e);
                              handleChange(e);
                            }}
                            value={enteredIdentity}
                            variant="outlined"
                            label="DNI"
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
                            error={errorEmail}
                            fullWidth
                            helperText={touched.email && errors.email}
                            name="email"
                            placeholder="Correo"
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
                            m: `${theme.spacing(1)}`
                          }}
                          item
                          xs={12}
                          sm={8}
                          md={9}
                        >
                          <TextField
                            error={errorPhone}
                            fullWidth
                            helperText={touched.phone && errors.phone}
                            name="phone"
                            placeholder="Teléfono Celular"
                            onBlur={handleBlur}
                            onChange={(e) => {
                              handlePhoneChange(e);
                              handleChange(e);
                            }}
                            value={enteredPhone}
                            variant="outlined"
                            label="Teléfono Celular"
                          />
                        </Grid>
                      </Grid>
                    </Grid>

                    <Divider orientation="vertical" flexItem />

                    <Grid
                      item
                      xs={5}
                      sm={5}
                      md={5}
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
                          Copia del DNI
                        </b>
                        <Grid
                          sx={{
                            mt: `${theme.spacing(1)}`,
                            mb: `${theme.spacing(3)}`,
                            mr: `${theme.spacing(1)}`,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          item
                          xs={12}
                          sm={8}
                          md={8}
                        >
                          <DropzoneAIM
                            isDragAccept={isDragAcceptIdentity}
                            isDragActive={isDragActiveIdentity}
                            isDragReject={isDragRejectIdentity}
                            getInputProps={getInputIdentity}
                            getRootProps={getRootIdentity}
                            acceptText=".jpeg .jpg .png"
                            files={identityFile}
                            setNewFiles={setIdentityFile}
                          />
                          <div style={{ display: "flex", flexDirection: "column", paddingLeft: '2rem' }}>
                            {identityFile.preview && (
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
                            {identityFile.preview &&
                              <>
                                <div style={{ position: "relative", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                  <img
                                    style={{ width: "10rem", height: "10rem", margin: "0" }}
                                    src={identityFile.preview}
                                    alt="Foto"
                                  />
                                </div>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<DownloadIcon />}
                                  onClick={() => { downloadFile(user.person.documentNumberPhotoURL) }}>
                                  Descargar
                                </Button>
                              </>
                            }
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>

                  <Typography variant="h4" gutterBottom>
                    Datos universitarios
                  </Typography>
                  <Card sx={{ display: 'flex', flexDirection: 'row', mb: 4 }}>
                    <Grid item xs={6} sm={6} md={6}>
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
                          <FormControl required fullWidth variant="outlined">
                            <Autocomplete
                              id="autocomplete-institutes"
                              onChange={(e, v) => {
                                handleInstituteChange(e, v);
                              }}
                              filterOptions={(x) => x}
                              onInputChange={(e, newInputValue) =>
                                setInstituteInputValue(newInputValue)
                              }
                              value={{
                                key: user.person.instituteMajor.institute.id,
                                value: instituteInputValue
                              }}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  name="university"
                                  onChange={(e, v) => {
                                    handleChange(e, v);
                                    handleInstituteChange(e, v);
                                  }}
                                  onBlur={handleBlur}
                                  error={Boolean(
                                    touched.university && errors.university
                                  )}
                                  helperText={
                                    touched.university && errors.university
                                  }
                                  label="Universidad"
                                />
                              )}
                              options={instituteOptions}
                              getOptionLabel={(instituteOption) =>
                                instituteOption.value
                              }
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
                              onChange={(e) => {
                                handleInstituteMajorChange(e);
                                handleChange(e);
                              }}
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
                          <FormControl fullWidth variant="outlined">
                            <InputLabel>Ciclo</InputLabel>
                            <Select
                              value={selectedSemester || 'none'}
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
                          sx={{
                            m: `${theme.spacing(1)}`
                          }}
                          item
                          xs={12}
                          sm={8}
                          md={9}
                        >
                          <FormControl fullWidth variant="outlined">
                            <InputLabel>Mérito</InputLabel>
                            <Select
                              value={selectedMerit || 'none'}
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
                      item
                      xs={5}
                      sm={5}
                      md={5}
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
                          Consolidado/reporte académico.
                        </b>
                        <Grid
                          sx={{
                            mt: `${theme.spacing(1)}`,
                            mb: `${theme.spacing(3)}`,
                            mr: `${theme.spacing(1)}`,
                            display: 'flex',
                            alignItems: 'center'
                          }}
                          item
                          xs={12}
                          sm={8}
                          md={8}
                        >
                          <DropzoneAIM
                            isDragAccept={isDragAcceptInformation}
                            isDragActive={isDragActiveInformation}
                            isDragReject={isDragRejectInformation}
                            getInputProps={getInputInformation}
                            getRootProps={getRootInformation}
                            acceptText=".jpeg .jpg .png .pdf"
                            files={informationFile}
                            setNewFiles={setInformationFile}
                          />
                          <div style={{ display: "flex", flexDirection: "column", paddingLeft: '2rem' }}>
                            {informationFile.preview && (
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
                            {informationFile.preview &&
                              <>
                                <div style={{ position: "relative", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                  <img
                                    style={{ width: "10rem", height: "10rem", margin: "0" }}
                                    src={informationFile.preview}
                                    alt="Consolidado/reporte académico"
                                  />
                                </div>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<DownloadIcon />}
                                  onClick={() => { downloadFile(user.person.academicPhotoURL) }}>
                                  Descargar
                                </Button>
                              </>
                            }
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>

                  <Typography variant="h4" gutterBottom>
                    Datos visibles para el cliente
                  </Typography>
                  <Card sx={{ display: 'flex', flexDirection: 'row', mb: 4 }}>
                    <Grid item xs={6} sm={6} md={6}>
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
                            error={errorDescription}
                            multiline
                            helperText={
                              touched.description && errors.description
                            }
                            name="description"
                            placeholder="Descripción/presentación personal"
                            onBlur={handleBlur}
                            onChange={(e) => {
                              handleDescriptionChange(e);
                              handleChange(e);
                            }}
                            value={enteredDescription}
                            fullWidth
                            rows={4}
                            variant="outlined"
                            label="Descripción/presentación personal"
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
                            error={errorPrice}
                            fullWidth
                            type="number"
                            helperText={touched.price && errors.price}
                            name="price"
                            placeholder="Tarifa"
                            onBlur={handleBlur}
                            onChange={(e) => {
                              handlePriceChange(e);
                              handleChange(e);
                            }}
                            value={enteredPrice}
                            variant="outlined"
                            label="Tarifa"
                          />
                        </Grid>
                      </Grid>


                    </Grid>

                    <Divider orientation="vertical" flexItem />

                    <Grid
                      item
                      xs={5}
                      sm={5}
                      md={5}
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
                        <b>Foto de perfil (visible a los clientes)</b>
                        <Grid
                          sx={{
                            mt: `${theme.spacing(1)}`,
                            mb: `${theme.spacing(3)}`,
                            mr: `${theme.spacing(1)}`,
                            display: 'flex',
                            alignItems: 'center'
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
                            acceptText=".jpeg .jpg .png"
                            files={photoFile}
                            setNewFiles={setPhotoFile}
                          />
                          <div style={{ display: "flex", flexDirection: "column", paddingLeft: '2rem' }}>
                            {photoFile.preview && (
                              <>
                                <Alert
                                  sx={{
                                    py: 0
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
                            {photoFile.preview &&
                              <>
                                <div style={{ position: "relative", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                                  <img
                                    style={{ width: "10rem", height: "10rem" }}
                                    src={photoFile.preview}
                                    alt="Foto"
                                  />
                                </div>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<DownloadIcon />}
                                  onClick={() => { downloadFile(user.person.profilePictureURL) }}>
                                  Descargar
                                </Button>
                              </>
                            }
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card>

                  <Typography variant="h4" gutterBottom>
                    Certificados y Diplomas
                  </Typography>
                  <Card
                    sx={{
                      p: 1,
                      mb: 3
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        container
                        justifyContent="flex-end"
                        margin="auto"
                        sx={{ p: 1, mb: 1 }}
                      >
                        <Button
                          type="submit"
                          startIcon={
                            isSubmitting ? (
                              <CircularProgress size="1rem" />
                            ) : null
                          }
                          disabled={Boolean(errors.submit) || isSubmitting}
                          variant="contained"
                          size="large"
                          color="secondary"
                          onClick={handleAddCertificateOpen}
                        >
                          Añadir
                        </Button>
                      </Grid>
                    </Grid>
                    {toggleView === 'table_view' && (
                      <Card
                        sx={{
                          p: 1,
                          mb: 3,
                          mr: 1,
                          ml: 1
                        }}
                      >
                        {selectedBulkActions && (
                          <Box p={2}>
                            <BulkActions />
                          </Box>
                        )}
                        {!selectedBulkActions && (
                          <Box
                            p={2}
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box>
                              <Typography component="span" variant="subtitle1">
                                Mostrando:
                              </Typography>{' '}
                              <b>{paginatedProjects.length}</b>{' '}
                              <b>documentos</b>
                            </Box>
                            <TablePagination
                              component="div"
                              count={filteredProjects.length}
                              onPageChange={handlePageChange}
                              onRowsPerPageChange={handleLimitChange}
                              page={page}
                              rowsPerPage={limit}
                              rowsPerPageOptions={[5, 10, 15]}
                            />
                          </Box>
                        )}
                        <Divider />

                        {paginatedProjects.length === 0 ? (
                          <>
                            <Typography
                              sx={{
                                py: 10
                              }}
                              variant="h3"
                              fontWeight="normal"
                              color="text.secondary"
                              align="center"
                            >
                              No se pudo encontrar certificados ni diplomas
                            </Typography>
                          </>
                        ) : (
                          <>
                            <TableContainer>
                              <Table>
                                <TableHead>
                                  <TableRow>
                                    <TableCell padding="checkbox">
                                      <Checkbox
                                        checked={selectedAllProjects}
                                        indeterminate={selectedSomeProjects}
                                        onChange={handleSelectAllProjects}
                                      />
                                    </TableCell>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Documento</TableCell>
                                    <TableCell align="center">
                                      Acciones
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {paginatedProjects.map((project) => {
                                    const isProjectSelected =
                                      selectedItems.includes(project.id);
                                    return (
                                      <TableRow
                                        hover
                                        key={project.id}
                                        selected={isProjectSelected}
                                      >
                                        <TableCell padding="checkbox">
                                          <Checkbox
                                            checked={isProjectSelected}
                                            onChange={(event) =>
                                              handleSelectOneProject(
                                                event,
                                                project.id
                                              )
                                            }
                                            value={isProjectSelected}
                                          />
                                        </TableCell>
                                        <TableCell>
                                          <Typography noWrap variant="h5">
                                            {project.name}
                                          </Typography>
                                        </TableCell>
                                        <TableCell>
                                          {project.tags.map((value) => {
                                            return (
                                              <span key={value}>
                                                <Link href="#">{value}</Link>,{' '}
                                              </span>
                                            );
                                          })}
                                        </TableCell>

                                        <TableCell>
                                          {project.tags.map((value) => {
                                            return (
                                              <span key={value}>
                                                <Link href="#">{value}</Link>,{' '}
                                              </span>
                                            );
                                          })}
                                        </TableCell>

                                        <TableCell align="center">
                                          <Typography noWrap>
                                            <Tooltip title="View" arrow>
                                              <IconButton color="primary">
                                                <LaunchTwoToneIcon fontSize="small" />
                                              </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete" arrow>
                                              <IconButton
                                                onClick={
                                                  handleAddCertificateClose
                                                }
                                                color="primary"
                                              >
                                                <DeleteTwoToneIcon fontSize="small" />
                                              </IconButton>
                                            </Tooltip>
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </TableContainer>
                            <Box p={2}>
                              <TablePagination
                                component="div"
                                count={filteredProjects.length}
                                onPageChange={handlePageChange}
                                onRowsPerPageChange={handleLimitChange}
                                page={page}
                                rowsPerPage={limit}
                                rowsPerPageOptions={[5, 10, 15]}
                              />
                            </Box>
                          </>
                        )}
                      </Card>
                    )}
                    <Grid item xs={12}>
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
                    </Grid>
                  </Card>

                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`,
                      mt: `${theme.spacing(3)}`
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
                      // type="submit"
                      startIcon={
                        isSubmitting ? <CircularProgress size="1rem" /> : null
                      }
                      // disabled={Boolean(errors.submit) || isSubmitting}
                      variant="contained"
                      size="large"
                      color="secondary"
                      onClick={handleFormSubmit}
                    >
                      Guardar cambios
                    </Button>
                    <Button color="secondary" size="large" variant="outlined">
                      Cancelar
                    </Button>
                  </Grid>
                </CardContent>
              </form>
            )}
          </Formik>
        </Grid>
      </Card>
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={handleAddCertificateClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            Añadir certificado o diploma
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            title: '',
            submit: null
          }}
          validationSchema={Yup.object().shape({
            title: Yup.string()
              .max(255)
              .required('El nombre del documento es obligatorio')
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              await wait(1000);
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              handleSaveFileSuccess();
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
                sx={{
                  p: 3
                }}
              >
                <Grid container spacing={0}>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    justifyContent="flex-end"
                    textAlign={{ sm: 'right' }}
                  >
                    <Box
                      pr={3}
                      sx={{
                        pt: `${theme.spacing(2)}`,
                        pb: { xs: 1, md: 0 }
                      }}
                      alignSelf="center"
                    >
                      <b>Nombre:</b>
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
                      error={Boolean(touched.title && errors.title)}
                      fullWidth
                      helperText={touched.title && errors.title}
                      name="title"
                      placeholder="Nombre del certificado"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.title}
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={4} md={3} textAlign={{ sm: 'right' }}>
                    <Box
                      pr={3}
                      sx={{
                        pb: { xs: 1, md: 0 }
                      }}
                    >
                      <b>Subir archivos:</b>
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
                    <DropzoneAIM
                      isDragAccept={isDragAcceptCertificate}
                      isDragActive={isDragActiveCertificate}
                      isDragReject={isDragRejectCertificate}
                      getInputProps={getInputCertificate}
                      getRootProps={getRootCertificate}
                      acceptText=".jpeg .jpg .png .pdf"
                      files={certificateFile}
                      setNewFiles={setCertificateFile}
                    />
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    md={3}
                    textAlign={{ sm: 'right' }}
                  />
                  <Grid
                    sx={{
                      mb: `${theme.spacing(3)}`
                    }}
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
                    >
                      Guardar
                    </Button>
                    <Button
                      color="secondary"
                      size="large"
                      variant="outlined"
                      onClick={handleAddCertificateClose}
                    >
                      Cancelar
                    </Button>
                  </Grid>
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
