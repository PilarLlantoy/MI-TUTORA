import { useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { useSnackbar } from 'notistack';
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
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import certifyAxios from 'src/utils/aimAxios';
import useRefMounted from 'src/hooks/useRefMounted';
import InfoIcon from '@mui/icons-material/Info';
import { formatNameCapitals } from 'src/utils/training';
// import { createTheme } from '@mui/material/styles';
// import StarIcon from '@mui/icons-material/Star';

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

  const [openDialogDetailsTopicRequest, setOpenDialogDetailsTopicRequest] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [filters] = useState({
    status: null
  });
  // const [request, setRequest] = useState();
  const isMountedRef = useRefMounted();

  const [partnerName, setPartnerName] = useState('');
  const [descriptionRequest, setDescriptionRequest] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [requestId, setRequestId] = useState(0);
  // const [requestType, setRequestType] = useState("");
  const [requestObjId, setRequestObjId] = useState({
    "id": 0,
  });
  const [classCategoryName, setClassCategoryName] = useState("");
  const [classSubjectName, setClassSubjectName] = useState("");
  const [classGradeNames, setClassGradeNames] = useState([]);
  const [commentRequest, setCommentRequest] = useState("");

  const handleChangeComment = (event) => {
    setCommentRequest(event.target.value);
  };

  const getRequest = useCallback(async () => {
    try {
      let id = localStorage.getItem('idRequest')
      console.log(id);
      const idObj = {
        "id": id
      }
      const response = await certifyAxios.post('/request/subject/find', idObj);

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

          console.log(response.data);
          setPartnerName(response.data.partnerName);
          setClassCategoryName(response.data.classCategoryName);
          setClassSubjectName(response.data.classSubjectName);
          setDescriptionRequest(response.data.description);
          setClassGradeNames(response.data.classGradeNames);
          setRequestDate(response.data.requestDate);
          setRequestId(response.data.requestId);

          // setRequest(response.data);
        }
      }


    } catch (err) {
      console.error(err);

    }
  }, []);

  useEffect(() => {
    // getRequests();
    console.log('Received numberOfResults: ', props.numberOfResults);
  }, [props.numberOfResults]);


  // const { user } = useAuth();
  const handleOpenDetails = (requestElement) => {
    console.log(requestElement);
    console.log('Request');

    setRequestObjId({
      ...requestObjId,
      "id": requestElement.requestId,
    });
    console.log(requestObjId);
    // ahora obtendremos los datos de la solicitud
    // Obtenemos el id de la solicitud para buscar los datos
    const idRequest = requestElement.requestId;
    localStorage.setItem('idRequest', idRequest);

    console.log(requestElement.requestId);
    console.log(requestId);
    getRequest();
    setOpenDialogDetailsTopicRequest(true);
  };
  const handleCloseDetails = () => {
    // Podríamos cerrar todos los modals abiertos
    setOpenDialogDetailsTopicRequest(false);
  };



  // //
  // Cambio de Tema
  const handleAcceptOptionTopicRequest = async () => {
    try {
      // console.log(associated);
      console.log('Accept this topic request');
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
        "subjectRequestId": id,
        "resultDescription": commentRequest,
        "state": 1
      }
      console.log(requestObj);
      // getResponse(requestObj);
      const response = await certifyAxios.post('/request/subject/update', requestObj);
      console.log(response.data);
      if (isMountedRef.current) {
        if (response.data.length === 0) {
          // getAssociates(reqObj);
        } else {
          console.log(response.data);
          // console.log(request);
        }
      }

      handleAcceptTopicRequestSuccess();

      props.getRequests({
        "firstResult": 1,
        "maxResults": 5,
        "partnerName": "",
        "requestType": 0,
        "state": 0
      });
    } catch (error) {
      console.log('Error', error);
      if (error.message === 'Required value. resultDescription') {
        handleAcceptTopicRequestError(" Debe ingresar un comentario");
      } else {
        handleAcceptTopicRequestError("Hubo un error al aceptar la solicitud de Tema");
      }
    }
    // setOpenDialogDetailsTopicRequest(false);
  }

  const handleAcceptTopicRequestSuccess = () => {
    console.log('Accept Success');
    enqueueSnackbar('Solicitud de Selección de Tema aceptada con éxito', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 5000,
      TransitionComponent: Slide
    });
    setOpenDialogDetailsTopicRequest(false);
  }

  const handleAcceptTopicRequestError = (message) => {
    console.log('Error');
    enqueueSnackbar(`Error: ${message}`,
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        autoHideDuration: 5000,
        TransitionComponent: Slide
      });
  }


  const handleRejectOptionTopicRequest = async () => {
    try {
      // console.log(associated);
      console.log('Reject this topic request');
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
        "subjectRequestId": id,
        "resultDescription": commentRequest,
        "state": 2
      }
      console.log(requestObj);
      // getResponse(requestObj);
      const response = await certifyAxios.post('/request/subject/update', requestObj);
      console.log(response.data);
      if (isMountedRef.current) {
        if (response.data.length === 0) {
          // getAssociates(reqObj);
        } else {
          console.log(response.data);
          // console.log(request);
        }
      }

      handleRejectTopicRequestSuccess();

      props.getRequests({
        "firstResult": 1,
        "maxResults": 5,
        "partnerName": "",
        "requestType": 0,
        "state": 0
      });

    } catch (error) {
      console.log('Error', error);
      if (error.message === 'Required value. resultDescription') {
        handleRejectTopicRequestError(" Debe ingresar un comentario");
      } else {
        handleRejectTopicRequestError("Hubo un error al rechazar la solicitud de Tema");
      }
    }

  }

  const handleRejectTopicRequestSuccess = () => {
    console.log('Reject Topic Request Success');
    enqueueSnackbar('Solicitud de Selección de Tema rechazada con éxito', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 2000,
      TransitionComponent: Slide
    });
    setOpenDialogDetailsTopicRequest(false);
  }

  const handleRejectTopicRequestError = (message) => {
    console.log('Error');
    enqueueSnackbar(`Error: ${message}`,
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        autoHideDuration: 2000,
        TransitionComponent: Slide
      });
  }

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
      "requestType": 0,
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
      "requestType": 0,
      "state": 0
    }
    props.onPageParamsChange(reqObj);
  };

  const filteredAssociated = applyFilters(props.requests, query, filters);
  const paginatedAssociated = applyPagination(filteredAssociated, page, limit);

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
                            {associated.partnerName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            ST - 00{associated.requestId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {`${formattedDate.toLocaleDateString('es-ES')} ${formattedDate.toLocaleTimeString('es-ES')} hrs.`}
                          </Typography>
                        </TableCell>
                        <TableCell>
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
                                  }
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
        open={openDialogDetailsTopicRequest}
        onClose={handleCloseDetails}
        fullWidth
        maxWidth="sm"
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
        <Formik
          initValues={{
            comment: ''
          }}
          validationSchema={Yup.object().shape({
            comment: Yup.string().max(255).required('El comentario es requerido')
          })}
        >
          {({ errors }) => (
            <Form>
              <DialogContent>
                <DialogContentText>

                  <Grid xs={6} sm={6} md={12}>
                    <Typography
                      variant="body1"
                      fontSize="0.9rem"
                      py="0.3rem"
                    >
                      <b>Nombre Asociada: </b>{partnerName}
                    </Typography>

                    <Typography
                      variant="body1"
                      fontSize="0.9rem"
                      py="0.3rem"
                    >
                      <b>Tipo de Solicitud:</b> Selección de Tema
                    </Typography>
                    <Typography
                      variant="body1"
                      fontSize="0.9rem"
                      py="0.3rem"
                    >
                      <b>Fecha de Solicitud:</b> {requestDate}
                    </Typography>
                  </Grid>

                  <Grid
                    container
                    spacing={0}
                    direction="column"
                    justifyContent="center"
                    paddingLeft={0}
                    paddingRight={0}
                    paddingBottom={1}
                    paddingTop={1}
                  >
                    <Box sx={{ py: "0.2rem" }}>
                      <Typography
                        variant="h6"
                        fontSize="0.9rem"
                      >
                        <b>Categoría Seleccionada</b>
                      </Typography>
                      <TextField
                        disabled

                        sx={{ width: '50%' }}
                        id="outlined-multiline-static"
                        value={formatNameCapitals(classCategoryName)}
                        fontSize="1.1rem"
                        size='medium'
                      // rows={4}
                      />
                    </Box>
                    <Box sx={{ py: "0.2rem" }}>
                      <Typography
                        variant="h6"
                        fontSize="0.9rem"
                      >
                        <b>Tema Seleccionado</b>
                      </Typography>
                      <TextField
                        disabled
                        sx={{ width: '50%' }}
                        id="outlined-multiline-static"
                        value={formatNameCapitals(classSubjectName)}
                        fontSize="1.1rem"
                        size='medium'
                      // rows={4}
                      />
                    </Box>

                    <Box sx={{ py: "0.2rem" }}>
                      <Typography
                        variant="h6"
                        fontSize="0.9rem"
                      >
                        <b>Descripción de lo que quiere enseñar</b>
                      </Typography>
                      <TextField
                        disabled
                        sx={{ width: '100%' }}
                        id="outlined-multiline-static"
                        value={descriptionRequest}
                        fontSize="1.1rem"
                        size='medium'
                        multiline
                      // rows={4}
                      />
                    </Box>

                    <Box sx={{ py: "0.2rem" }}>
                      <Typography
                        variant="h6"
                        fontSize="0.9rem"
                      >
                        <b>Grado(s) seleccionado(s)</b>
                      </Typography>
                      <TextField
                        disabled
                        sx={{ width: '100%' }}
                        id="outlined-multiline-static"
                        value={formatNameCapitals(classSubjectName)}
                        fontSize="1.1rem"
                        size='medium'
                        multiline
                      // rows={4}
                      />
                    </Box>

                  </Grid>

                </DialogContentText>

                <Grid
                  container
                  spacing={0}
                  direction="column"
                  justifyContent="center"
                  paddingLeft={0}
                  paddingRight={0}
                  paddingBottom={2}
                  paddingTop={1}
                >

                  <Box sx={{ display: 'flex' }}>
                    <Typography
                      variant="h6"
                      fontSize="0.9rem" sx={{ pr: '1rem' }}
                    >
                      <b>Deja un comentario explicando tu decisión</b>
                    </Typography>
                    <Tooltip title='Sea cual sea la decisión tomada (rechazo o aceptación), se notificará a la asociada con el comentario ingresado.'>
                      <InfoIcon />
                    </Tooltip>
                  </Box>



                  <TextField
                    name="comment"
                    error={Boolean(errors.comment)}
                    sx={{ width: '100%' }}
                    id="outlined-multiline-static"
                    onChange={handleChangeComment}
                    multiline
                    required
                    rows={4}
                  />



                </Grid>


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
                      handleRejectOptionTopicRequest();
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
                      handleAcceptOptionTopicRequest();
                    }}

                    variant="contained"
                    startIcon={<CheckCircleOutlineIcon fontSize="small" />}
                  >
                    Aceptar
                  </Button>

                </Stack>
              </DialogActions>
            </Form>
          )}
        </Formik>
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
  numberOfResults: 0,
  getRequests: () => { },
};

export default ResultsPending;
