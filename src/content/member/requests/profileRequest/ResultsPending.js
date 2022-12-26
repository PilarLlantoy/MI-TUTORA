import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { downloadFileHandle } from 'src/content/awstest';
import { formatNameCapitals } from 'src/utils/training';
import {
  Box,
  Button,
  Card,
  Grid,
  Divider,
  // Tooltip,
  // IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  // Zoom,
  Typography,
  Stack,
  // styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useTheme,
  Slide,
  TextField,
  Tooltip,
  IconButton,
  // TextareaAutosize,
  // ThemeProvider
} from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
import DownloadIcon from '@mui/icons-material/Download';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import certifyAxios from 'src/utils/aimAxios';
import useRefMounted from 'src/hooks/useRefMounted';

import { getNameAndUrlFromBack } from 'src/utils/awsConfig';

const applyFilters = (associated, query, filters) => {
  // console.log(associated);
  return associated.filter((associated) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (associated[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.status && associated.status !== filters.status) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && associated[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (requests, page, limit) => {
  return requests.slice(page * limit, page * limit + limit);
};

const ResultsPending = (props) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const theme = useTheme();
  // const [openDialogDetailsReport, setOpenDialogDetailsReport] = useState(false);
  // const [openDialogDetailsTopicRequest, setOpenDialogDetailsTopicRequest] = useState(false);
  const [openDialogDetailsProfileDataChange, setOpenDialogDetailsProfileDataChange] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [filters] = useState({
    status: null
  });
  // const [request, setRequest] = useState();
  const isMountedRef = useRefMounted();

  const [partnerName, setPartnerName] = useState('');

  const [requestDate, setRequestDate] = useState("");
  const [requestId, setRequestId] = useState(0);
  // const [requestType, setRequestType] = useState("");
  const [requestObjId, setRequestObjId] = useState({
    "id": 0,
  });
  const [emailOld, setEmailOld] = useState("");
  const [emailNew, setEmailNew] = useState("");
  const [descriptionNew, setDescriptionNew] = useState("");
  const [descriptionOld, setDescriptionOld] = useState("");
  const [fullNameNew, setFullNameNew] = useState("");
  const [fullNameOld, setFullNameOld] = useState("");
  const [phoneNumberNew, setPhoneNumberNew] = useState(0);
  const [phoneNumberOld, setPhoneNumberOld] = useState(0);

  const [documentNumberPhotoURLNew, setDocumentNumberPhotoURLNew] = useState("");
  const [documentNumberPhotoURLOld, setDocumentNumberPhotoURLOld] = useState("");

  const [priceNew, setPriceNew] = useState(0);
  const [priceOld, setPriceOld] = useState(0);

  /*
  const [bankIdNew, setBankIdNew] = useState(0);
  const [bankIdOld, setBankIdOld] = useState(0);
  const [bankNameNew, setBankNameNew] = useState("");
  const [bankNameOld, setBankNameOld] = useState("");
  const [bankAccountOld, setBankAccountOld] = useState(0);
  const [bankAccountNew, setBankAccountNew] = useState(0);

  */
  const [academicPhotoURLNew, setAcademicPhotoURLNew] = useState("");
  const [academicPhotoURLOld, setAcademicPhotoURLOld] = useState("");
  const [instituteMajorIdNew, setInstituteMajorIdNew] = useState(0);
  const [instituteMajorIdOld, setInstituteMajorIdOld] = useState(0);
  const [instituteNameNew, setInstituteNameNew] = useState("");
  const [instituteNameOld, setInstituteNameOld] = useState("");
  const [majorNameNew, setMajorNameNew] = useState("");
  const [majorNameOld, setMajorNameOld] = useState("");
  const [phaseNew, setPhaseNew] = useState(0);
  const [phaseOld, setPhaseOld] = useState(0);
  const [meritNew, setMeritNew] = useState(0);
  const [meritOld, setMeritOld] = useState(0);
  const [profilePictureURLNew, setProfilePictureURLNew] = useState("");
  const [profilePictureURLOld, setProfilePictureURLOld] = useState("");

  const getRequest = useCallback(async () => {
    try {
      let id = localStorage.getItem('idRequest')
      console.log(id);
      const idObj = {
        "id": id
      };
      console.log(idObj);
      console.log(requestObjId);
      const response = await certifyAxios.post('/request/profile/find', idObj);

      console.log(response.data);
      // setRequest(response.data);
      if (isMountedRef.current) {
        if (response.data.length === 0) {
          // const lastPage = Math.ceil(response.data.total / pageSize);
          // reqObj.firstResult = lastPage;
          // setPageNumber(lastPage);
          // getAssociates(reqObj);
        }
        else {
          console.log(response.data);
          // console.log(request);

          setPartnerName(response.data.partnerName);
          setRequestDate(response.data.requestDate);
          setRequestId(response.data.requestId);
          console.log(requestId);
          setEmailOld(response.data.emailOld);
          setEmailNew(response.data.emailNew);
          setDescriptionNew(response.data.descriptionNew);
          setDescriptionOld(response.data.descriptionOld);
          setFullNameNew(response.data.fullNameNew);
          setFullNameOld(response.data.fullNameOld);

          setPhoneNumberNew(response.data.phoneNumberNew);
          setPhoneNumberOld(response.data.phoneNumberOld);

          setDocumentNumberPhotoURLNew(response.data.documentNumberPhotoURLNew);
          setDocumentNumberPhotoURLOld(response.data.documentNumberPhotoURLOld);

          /*
          setPriceNew(response.data.priceNew);
          setPriceOld(response.data.priceOld);
          setBankIdNew(response.data.bankIdNew);
          setBankIdOld(response.data.bankIdOld);
          setBankNameNew(response.data.bankNameNew);
          setBankNameOld(response.data.bankNameOld);
          setBankAccountOld(response.data.bankAccountOld);
          setBankAccountNew(response.data.bankAccountNew);
          */
          setAcademicPhotoURLNew(response.data.academicPhotoURLNew);
          setAcademicPhotoURLOld(response.data.academicPhotoURLOld);
          setInstituteMajorIdNew(response.data.instituteMajorIdNew);
          setInstituteMajorIdOld(response.data.instituteMajorIdOld);
          console.log(instituteMajorIdNew, instituteMajorIdOld);
          setInstituteNameNew(response.data.instituteNameNew);
          setInstituteNameOld(response.data.instituteNameOld);
          setMajorNameNew(response.data.majorNameNew);
          setMajorNameOld(response.data.majorNameOld);
          setPhaseNew(response.data.phaseNew);
          setPhaseOld(response.data.phaseOld);
          setMeritNew(response.data.meritNew);
          // meritOptions.map((merit) => {
          setMeritOld(response.data.meritOld);

          setProfilePictureURLNew(getNameAndUrlFromBack(response.data.profilePictureURLNew));
          setProfilePictureURLOld(getNameAndUrlFromBack(response.data.profilePictureURLOld));

          setPriceOld(response.data.priceOld);
          setPriceNew(response.data.priceNew);

          // setRequest(response.data);
        }
      }


    } catch (err) {
      console.error(err);

    }
  }, []);



  // const { user } = useAuth();
  const handleOpenDetails = (requestElement) => {
    console.log(requestElement);
    console.log('Request');

    // ahora obtendremos los datos de la solicitud
    // Obtenemos el id de la solicitud para buscar los datos
    const idRequest = requestElement.requestId;
    localStorage.setItem('idRequest', idRequest);
    setRequestObjId({
      ...requestObjId,
      "id": requestElement.requestId,
    });
    getRequest();

    // setOpenDialogDetailsReport(true);
    setOpenDialogDetailsProfileDataChange(true);

  };
  const handleCloseDetails = () => {
    // Podríamos cerrar todos los modals abiertos
    // setOpenDialogDetailsReport(false);
    // setOpenDialogDetailsTopicRequest(false);
    setOpenDialogDetailsProfileDataChange(false);
  };


  const getResponse = useCallback(async (reqObj) => {
    try {
      console.log(reqObj);
      const response = await certifyAxios.post('/request/profile/response', reqObj);
      console.log(response.data);
      // setRequest(response.data);
      if (isMountedRef.current) {
        if (response.data.length === 0) {

          // getAssociates(reqObj);
        } else {
          console.log(response.data);
          // console.log(request);

        }
      }
      handleProfileDataChangeSuccess();

      props.getRequests({
        "firstResult": 1,
        "maxResults": 5,
        "partnerName": "",
        "requestType": 1,
        "state": 0
      });
    } catch (err) {
      console.error(err);
      handleProfileDataChangeError(err.status);
    }
  }, []);


  const handleAcceptOptionProfileDataChange = () => {
    try {
      // console.log(associated);
      console.log('Accept this profile data change request');
      // ejecutaremos la acción para cambiar el estado de la solicitud
      // const id = localStorage.getItem('idRequest');
      let id = localStorage.getItem('idRequest');
      console.log(id);
      // pending: 0
      // aceptar: 1
      // rechazar: 2
      // armamos el objeto para enviarlo al backend
      const requestObj = {
        "memberId": localStorage.getItem('personId'),
        "requestId": id,
        "resultDescription": "",
        "state": 1
      }
      console.log(requestObj);
      getResponse(requestObj);

      props.getRequests({
        "firstResult": 1,
        "maxResults": 5,
        "partnerName": "",
        "requestType": 1,
        "state": 0
      });
    } catch (error) {
      console.log('Error');
      handleProfileDataChangeError(error.status);
    }
    setOpenDialogDetailsProfileDataChange(false);
  }

  const handleProfileDataChangeSuccess = () => {
    console.log('Accept Success');
    enqueueSnackbar('Operación exitosa.', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 5000,
      TransitionComponent: Slide
    });
  }

  const handleRejectOptionProfileDataChange = () => {
    try {
      // console.log(associated);
      console.log('Reject this profile data change request');
      // ejecutaremos la acción para cambiar el estado de la solicitud
      // const id = localStorage.getItem('idRequest');
      let id = localStorage.getItem('idRequest');
      console.log(id);
      // pending: 0
      // aceptar: 1
      // rechazar: 2
      // armamos el objeto para enviarlo al backend
      const requestObj = {
        "memberId": localStorage.getItem('personId'),
        "requestId": id,
        "resultDescription": "",
        "state": 2
      }
      console.log(requestObj);
      getResponse(requestObj);

      props.getRequests({
        "firstResult": 1,
        "maxResults": 5,
        "partnerName": "",
        "requestType": 1,
        "state": 0
      });
    } catch (error) {
      console.log('Error');
      handleProfileDataChangeError(error.status);
    }
    setOpenDialogDetailsProfileDataChange(false);
  }

  const handleProfileDataChangeError = (message) => {
    console.log('Error');
    enqueueSnackbar(`Error en la operación. Error ${message}`,
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        autoHideDuration: 3000,
        TransitionComponent: Slide
      });
  }
  // //
  // Cambio de Tema


  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  // Manejaremos las solicitudes de reporte de clientes
  // requestType: 2
  const handlePageChange = (_event, newPage) => {
    setPage(newPage);

    const reqObj = {
      "firstResult": newPage + 1,
      "maxResults": limit,
      "partnerName": "",
      "requestType": 1,
      "state": 0
    };
    props.onPageParamsChange(reqObj);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));

    const reqObj = {
      "firstResult": page + 1,
      "maxResults": event.target.value,
      "partnerName": "",
      "requestType": 1,
      "state": 0
    }
    props.onPageParamsChange(reqObj);
  };

  const filteredAssociated = applyFilters(props.requests, query, filters);
  const paginatedAssociated = applyPagination(filteredAssociated, page, limit);


  const downloadFile = (urlfull) => {
    // Para la descarga, se obtiene el nombre original y la url de 
    // lo que se guardo en back ("urlToSave")
    const url = getNameAndUrlFromBack(urlfull)
    // console.log("nombre original y url: ", url.nombreOriginal, url.urlS3)
    downloadFileHandle(url.urlS3, url.nombreOriginal)
  }

  return (
    <>
      <Card
        sx={{
          p: 1,
          mb: 3
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box p={1}>
              <TextField
                sx={{
                  m: 0
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchTwoToneIcon />
                    </InputAdornment>
                  )
                }}
                onChange={handleQueryChange}
                placeholder="Busque por nombres"
                value={query}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Card>
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
            <b>{paginatedAssociated.length}</b> <b>solicitudes</b>
          </Box>
          <TablePagination
            component="div"
            count={props.numberOfResults}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleLimitChange}
            page={page}
            rowsPerPage={limit}
            rowsPerPageOptions={[5, 10, 15]}
          />
        </Box>
        <Divider />

        {paginatedAssociated.length === 0 ? (
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
              No se encontraron solicitudes pendientes
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Solicitante</TableCell>
                    <TableCell>Nro. de Solicitud</TableCell>
                    <TableCell>Fecha de Solicitud</TableCell>
                    <TableCell>Acciones</TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAssociated.map((associated, idx) => {
                    let formattedDate = new Date(associated.requestDate);
                    return (
                      <TableRow hover key={idx}>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {formatNameCapitals(associated.partnerName.replace(',', ''))}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            CP - 00{associated.requestId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {`${formattedDate.toLocaleDateString('es-ES')} ${formattedDate.toLocaleTimeString('es-ES')} hrs.`}
                          </Typography>
                        </TableCell>
                        <TableCell
                          sx={{
                            whiteSpace: 'nowrap',
                            paddingBottom: 0,
                            paddingTop: 0,
                            px: 5
                          }}
                          align="center">

                          <Box>
                            <Tooltip title="Ver Detalle" arrow>
                              <IconButton
                                sx={{
                                  ml: 1,
                                  backgroundColor: `${theme.colors.info.lighter}`,
                                  color: `${theme.colors.info.main}`,
                                  transition: `${theme.transitions.create([
                                    'all'
                                  ])}`,

                                  '&:hover': {
                                    backgroundColor: `${theme.colors.info.main}`,
                                    color: `${theme.palette.getContrastText(
                                      theme.colors.info.main
                                    )}`
                                  },
                                  display: 'flex',
                                  justifyContent: 'center'
                                }}
                                onClick={() => handleOpenDetails(associated)}
                              >
                                <RemoveRedEyeIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>

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
                count={props.numberOfResults}
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

      <Dialog
        open={openDialogDetailsProfileDataChange}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="lg"
        maxHeight="lg"
      >
        <DialogTitle
          align="center"
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            Detalle de la solicitud
          </Typography>
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            <Grid xs={6} sm={6} md={12}>
              <Typography
                variant="body1"
                fontSize="0.9rem"
                py="0.3rem">
                <b>Nombre Asociada:</b> {formatNameCapitals(partnerName.replace(',', ''))}
              </Typography>
              <Typography
                variant="body1"
                fontSize="0.9rem"
                py="0.3rem">
                <b>Tipo de Solicitud:</b> Cambio de Datos de Perfil
              </Typography>
              <Typography
                variant="body1"
                fontSize="0.9rem"
                py="0.3rem">
                <b>Fecha de Solicitud:</b> {requestDate}
              </Typography>
            </Grid>
            <Card sx={{ display: 'flex', flexDirection: 'row', m: 5, p: 1 }}>
              <Grid container columnSpacing={{ xs: 1, sm: 0, md: 1 }}>
                <Grid item xs={2}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography
                      color='white'
                      fontFamily="Roboto"
                      variant="h4">
                      <b>  _ </b>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography textAlign="center">
                      <b>Original</b>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography textAlign="center">
                      <b>Cambio</b>
                    </Typography>
                  </Box>
                </Grid>
                {/* <Grid item xs={1.5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography textAlign="center">
                      <b>Archivo adjunto</b>
                    </Typography>
                  </Box>
                </Grid> */}

                <Grid item xs={2}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography>
                      <b>Nombre</b>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!fullNameNew) ? '#FEFEFE' : '#FFEEEE' }}>
                      {fullNameOld}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!fullNameNew) ? '#FEFEFE' : '#EBFFDE' }}>
                      {fullNameNew || fullNameOld}
                    </Typography>
                  </Box>
                </Grid>
                {/* <Grid item xs={1.5}>
                  <Box
                    border={0}
                    borderColor="#F0F0F0"
                  >
                    <Typography variant="h4">
                      <AttachFileIcon
                        style={{ color: "#0077FF", backgroundColor: "#D4E8FF" }}
                        fontSize="large"
                      />
                    </Typography>
                  </Box>
                </Grid> */}

                <Grid item xs={2}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography>
                      <b>Celular</b>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!phoneNumberNew) ? '#FEFEFE' : '#FFEEEE' }}>
                      {phoneNumberOld}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!phoneNumberNew) ? '#FEFEFE' : '#EBFFDE' }}>
                      {phoneNumberNew || phoneNumberOld}
                    </Typography>
                  </Box>
                </Grid>
                {/* <Grid item xs={1.5}>
                  <Box
                    border={0}
                    borderColor="#F0F0F0"
                  >
                    <Typography variant="h4">
                      <b> </b>
                    </Typography>
                  </Box>
                </Grid> */}


                <Grid item xs={2}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography>
                      <b>Correo electrónico</b>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  // backgroundColor="#FFEEEE"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!emailNew) ? '#FEFEFE' : '#FFEEEE' }}>
                      {emailOld}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  // backgroundColor="#EBFFDE"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!emailNew) ? '#FEFEFE' : '#EBFFDE' }}>
                      {emailNew || emailOld}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography>
                      <b>Universidad</b>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!instituteNameNew) ? '#FEFEFE' : '#FFEEEE' }}>
                      {instituteNameOld}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!instituteNameNew) ? '#FEFEFE' : '#EBFFDE' }}>
                      {instituteNameNew || instituteNameOld}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography>
                      <b>Carrera</b>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!majorNameNew) ? '#FEFEFE' : '#FFEEEE' }}>
                      {majorNameOld}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!majorNameNew) ? '#FEFEFE' : '#EBFFDE' }}>
                      {majorNameNew || majorNameOld}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography>
                      <b>Ciclo</b>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  // backgroundColor="#FFEEEE"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!phaseNew) ? '#FEFEFE' : '#FFEEEE' }}>
                      {phaseOld}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  // backgroundColor="#EBFFDE"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!phaseNew) ? '#FEFEFE' : '#EBFFDE' }}>
                      {phaseNew || phaseOld}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography>
                      <b>Orden de Mérito</b>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  // backgroundColor="#FFEEEE"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!meritNew) ? '#FEFEFE' : '#FFEEEE' }}>
                      {meritOld}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  // backgroundColor="#EBFFDE"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!meritNew) ? '#FEFEFE' : '#EBFFDE' }}>
                      {meritNew || meritOld}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={2}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography>
                      <b>Foto de perfil</b>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    style={{ backgroundColor: (!profilePictureURLNew.nombreOriginal) ? '#FEFEFE' : '#FFEEEE' }}
                  >
                    {profilePictureURLOld &&
                      <img
                        src={profilePictureURLOld.urlS3}
                        alt={fullNameOld}
                        style={{ minWidth: '2rem', minHeight: '2rem', maxWidth: '11rem', maxHeight: '11rem' }}
                      />}
                    <br />
                    <Typography variant="h6">
                      {profilePictureURLOld.nombreOriginal}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                    sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                    style={{ backgroundColor: (!profilePictureURLNew.nombreOriginal) ? '#FEFEFE' : '#EBFFDE' }}
                  >
                    {(profilePictureURLOld || profilePictureURLNew) &&
                      <img
                        src={profilePictureURLNew.urlS3 || profilePictureURLOld.urlS3}
                        alt={fullNameNew}
                        style={{ minWidth: '2rem', minHeight: '2rem', maxWidth: '11rem', maxHeight: '11rem' }}
                      />}
                    <Typography variant="h6" >
                      {profilePictureURLNew.nombreOriginal || profilePictureURLOld.nombreOriginal}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={2}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography>
                      <b>Descripción personal</b>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                    backgroundColor="#FFEEEE"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!descriptionNew) ? '#FEFEFE' : '#FFEEEE' }}>
                      {descriptionOld}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                    backgroundColor="#EBFFDE"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!descriptionNew) ? '#FEFEFE' : '#EBFFDE' }}>
                      {descriptionNew || descriptionOld}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={2}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography>
                      <b>Tarifa</b>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                    backgroundColor="#FFEEEE"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!priceNew) ? '#FEFEFE' : '#FFEEEE' }}>
                      {priceOld}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                    backgroundColor="#EBFFDE"
                  >
                    <Typography variant="h6" style={{ backgroundColor: (!priceNew) ? '#FEFEFE' : '#EBFFDE' }}>
                      {priceNew || priceOld}
                    </Typography>
                  </Box>
                </Grid>


                <Grid item xs={2}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography>
                      <b>Copia del DNI</b>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    style={{ backgroundColor: (!documentNumberPhotoURLNew) ? '#FEFEFE' : '#FFEEEE' }}
                  >
                    {documentNumberPhotoURLOld &&
                      <Button
                        sx={{ m: 2 }}
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => { downloadFile(documentNumberPhotoURLOld) }}>
                        Descargar
                      </Button>
                    }
                    {getNameAndUrlFromBack(documentNumberPhotoURLOld).nombreOriginal}
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    style={{ backgroundColor: (!documentNumberPhotoURLNew) ? '#FEFEFE' : '#EBFFDE' }}
                  >
                    {(documentNumberPhotoURLOld || documentNumberPhotoURLNew) &&
                      (<Button
                        sx={{ m: 2 }}
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => { downloadFile(documentNumberPhotoURLNew || documentNumberPhotoURLOld) }}>
                        Descargar
                      </Button>)
                    }
                    {getNameAndUrlFromBack(documentNumberPhotoURLNew || documentNumberPhotoURLOld).nombreOriginal}
                  </Box>
                </Grid>


                <Grid item xs={2}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                  >
                    <Typography>
                      <b>Consolidado/reporte académico</b>
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    style={{ backgroundColor: (!academicPhotoURLNew) ? '#FEFEFE' : '#FFEEEE' }}
                  >
                    {academicPhotoURLOld &&
                      <Button
                        sx={{ m: 2 }}
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => { downloadFile(academicPhotoURLOld) }}>
                        Descargar
                      </Button>}
                    {getNameAndUrlFromBack(academicPhotoURLOld).nombreOriginal}
                  </Box>
                </Grid>
                <Grid item xs={5}>
                  <Box
                    border={1}
                    borderColor="#F0F0F0"
                    sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    style={{ backgroundColor: (!academicPhotoURLNew) ? '#FEFEFE' : '#EBFFDE' }}
                  >
                    {(academicPhotoURLOld || academicPhotoURLNew) &&
                      <Button
                        sx={{ m: 2 }}
                        size="small"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => { downloadFile(academicPhotoURLNew || academicPhotoURLOld) }}>
                        Descargar
                      </Button>}
                    {getNameAndUrlFromBack(academicPhotoURLNew || academicPhotoURLOld).nombreOriginal}
                  </Box>
                </Grid>

              </Grid>
            </Card>
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Stack spacing={2} direction="row">
            <Button
              onClick={handleCloseDetails}
              variant="outlined"
              color="error"
            >
              Cancelar
            </Button>
            <Button
              sx={{
                my: { xs: 1, sm: 1 },
                color: "white",
                backgroundColor: '#D40000',
                ':hover': {
                  background: '#960202',
                },
              }}
              onClick={() => {
                console.log('Redirecting to Rechazo...');
                handleRejectOptionProfileDataChange();
              }}

              variant="contained"
              startIcon={<CancelIcon fontSize="small" />}
            >
              Rechazar
            </Button>
            <Button
              sx={{
                my: { xs: 1, sm: 1 },
                color: "white",
                backgroundColor: '#0077FF',
                ':hover': {
                  background: '#014796',
                },
              }}
              onClick={() => {
                console.log('Redirecting to Aceptación...');
                handleAcceptOptionProfileDataChange();
              }}
              variant="contained"
              startIcon={<CheckCircleOutlineIcon fontSize="small" />}
            >
              Aceptar
            </Button>

          </Stack>
        </DialogActions>
      </Dialog>

    </>
  );
};

ResultsPending.propTypes = {
  requests: PropTypes.array.isRequired,
  onPageParamsChange: PropTypes.func,
  numberOfResults: PropTypes.number,
  getRequests: PropTypes.func
};

ResultsPending.defaultProps = {
  requests: [],
  onPageParamsChange: () => { },
  numberOfResults: 555,
  getRequests: () => { },
};

export default ResultsPending;
