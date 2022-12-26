import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatNameCapitals } from 'src/utils/training';
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

// import { createTheme } from '@mui/material/styles';
// import StarIcon from '@mui/icons-material/Star';
/*
const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
    transition: ${theme.transitions.create(['transform', 'background'])};
    transform: scale(1);
    transform-origin: center;

    &:hover {
        transform: scale(1.1);
    }
  `
);
*/

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

/*
const applyPagination = (requests, page, limit) => {
  return requests.slice(page * limit, page * limit + limit);
};
*/

const ResultsPending = (props) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const theme = useTheme();
  const [openDialogDetailsReport, setOpenDialogDetailsReport] = useState(false);
  // const [openDialogDetailsTopicRequest, setOpenDialogDetailsTopicRequest] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [filters] = useState({
    status: null
  });
  // const [request, setRequest] = useState();
  const isMountedRef = useRefMounted();
  // const [associated, setAssociated] = useState([]);
  // const [selectedRequest, setSelectedRequest] = useState(); //para requestId y requestDate
  // const [selectedRequestDetails, setSelectedRequestDetails] = useState();
  const [partnerName, setPartnerName] = useState("");
  // const [clientID, setClientID] = useState("");
  const [clientName, setClientName] = useState("");
  // Solicitud
  const [commentRequest, setCommentRequest] = useState("");
  const [descriptionRequest, setDescriptionRequest] = useState("");
  const [requestDate, setRequestDate] = useState("");
  const [requestId, setRequestId] = useState(0);
  const [requestType, setRequestType] = useState("");
  const [requestObjId, setRequestObjId] = useState({
    "id": 0,
  });

  const handleChangeComment = (event) => {
    setCommentRequest(event.target.value);
  }

  const getRequest = async () => {
    try {
      // console.log(requestId);
      let id = localStorage.getItem('idRequest')
      // console.log(id);
      const idObj = {
        "id": id,
      }
      console.log(idObj);
      const response = await certifyAxios.post('/request/complaint/find', idObj);
      // console.log(response.data);
      // setRequest(response.data);
      if (isMountedRef.current) {
        if (response.data.length === 0) {
          // const lastPage = Math.ceil(response.data.total / pageSize);
        }
        else {
          console.log(response.data);

          const formattedReqDate = new Date(response.data.requestDate);


          setPartnerName(response.data.partnerName);
          setClientName(response.data.clientName);
          setDescriptionRequest(response.data.description);
          setRequestDate(`${formattedReqDate.toLocaleDateString('es-ES')} ${formattedReqDate.toLocaleTimeString('es-ES')} hrs.`);
          setRequestId(response.data.requestId);
          console.log(requestId);
          // setRequest(response.data);
          setOpenDialogDetailsReport(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }
  // const { user } = useAuth();
  const handleOpenDetails = (requestElement) => {

    console.log(requestElement);

    if (requestElement.requestType === "Complaint Request") {
      setRequestType("Cliente Reportado");
    }
    console.log('Request');

    // ahora obtendremos los datos de la solicitud
    // Obtenemos el id de la solicitud para buscar los datos
    setRequestObjId({
      ...requestObjId,
      "id": requestElement.requestId,
    });
    setPartnerName("Esperando datos...");
    console.log("Esperando datos...");
    setRequestId(requestElement.requestId);
    // console.log(requestElement.requestId);
    // console.log(requestId);
    const idRequest = requestElement.requestId;
    localStorage.setItem('idRequest', idRequest);
    getRequest();

    setOpenDialogDetailsReport(true);
  };
  const handleCloseDetails = () => {
    setOpenDialogDetailsReport(false);
  };


  const handleAcceptOptionReport = async () => {
    try {
      let memberId = localStorage.getItem('personId');

      const requestObj = {
        "complaintRequestId": requestId,
        "commentary": commentRequest,
        "memberId": parseInt(memberId),
        "state": 1
      }
      console.log(requestObj);
      const response = await certifyAxios.post("/request/complaint/update", requestObj)
      console.log(response)
      // console.log(associated);
      console.log('Accept this report request');
      handleAcceptReportClientSuccess();

      props.getRequests({
        "firstResult": 1,
        "maxResults": 5,
        "partnerName": "",
        "requestType": 2,
        "state": 0
      });
    } catch (error) {
      console.log('Error');
      handleAcceptReportClientError(error.status);
    }
    setOpenDialogDetailsReport(false);
    setCommentRequest(""); // limpiamos el campo de comentario
  }

  const handleAcceptReportClientSuccess = () => {
    console.log('Accept Success');
    enqueueSnackbar('Solicitud de Reporte aceptada con éxito', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 2000,
      TransitionComponent: Slide
    });
  }

  const handleAcceptReportClientError = (message) => {
    console.log('Error');
    enqueueSnackbar(`Error al aceptar la solicitud de Reporte. Error ${message}`,
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

  const handleRejectOptionReport = async () => {
    try {
      let memberId = localStorage.getItem('personId');
      const requestObj = {
        "complaintRequestId": requestId,
        "commentary": commentRequest,
        "memberId": parseInt(memberId),
        "state": 2
      }
      // console.log(requestObj);
      const response = await certifyAxios.post("/request/complaint/update", requestObj)
      console.log(response)
      console.log('Reject this report request');
      handleRejectReportClientSuccess();

      props.getRequests({
        "firstResult": 1,
        "maxResults": 5,
        "partnerName": "",
        "requestType": 2,
        "state": 0
      });
    } catch (error) {
      console.log('Error');
      if (error.status === 1005) {
        // console.log("dd");
      }

      console.log(error.message);
      handleRejectReportClientError(error.status);
    }
    setOpenDialogDetailsReport(false);
    // Reseteamos el commentary
    setCommentRequest("");
  }

  const handleRejectReportClientSuccess = () => {
    console.log('Reject Success');
    enqueueSnackbar('Solicitud de Reporte rechazada con éxito', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 5000,
      TransitionComponent: Slide
    });
  }

  const handleRejectReportClientError = (message) => {
    console.log('Error');
    enqueueSnackbar(`Hubo un error al rechazar la solicitud de Reporte. Error ${message}`,
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
      "requestType": 2,
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
      "requestType": 2,
      "state": 0
    }
    props.onPageParamsChange(reqObj);
  };

  useEffect(() => {
    console.log('Received numberOfResults: ', props.numberOfResults);
    console.log('requestId actualizados: ', requestId);
    // setRequestId(requestId);

  }, [props.numberOfResults]);

  const filteredAssociated = applyFilters(props.requests, query, filters);
  const paginatedAssociated = filteredAssociated;

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
                            RP - 00{associated.requestId}
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
        open={openDialogDetailsReport}
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
        <DialogContent>
          <DialogContentText>

            <Grid xs={6} sm={6} md={12}>
              <Typography
                variant="body1"
                fontSize="0.9rem"
                py="0.3rem"
              >
                <b>Nombre Asociada: </b>{formatNameCapitals(partnerName.replace(',', ''))}

              </Typography>

              <Typography
                variant="body1"
                fontSize="0.9rem"
                py="0.3rem"
              >
                <b>Tipo de Solicitud:</b> {requestType}
              </Typography>
              <Typography
                variant="body1"
                py="0.3rem"
                fontSize="0.9rem"
              >
                <b>Cliente:</b> {formatNameCapitals(clientName.replace(',', ''))}
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
              <Typography
                variant="h6"
                fontSize="0.9rem"
              >
                <b>Detalles de lo ocurrido</b>
              </Typography>
              <TextField
                disabled

                sx={{ width: '100%' }}
                id="outlined-multiline-static"
                value={descriptionRequest}
                fontSize="1.1rem"
                multiline
                size='medium'
              // rows={4}
              />
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
              <Tooltip title='En caso se acepte la solicitud, el comentario ingresado será 
              notificado a ambas partes (cliente y asociada). Si se rechaza la solicitud, 
              solo será notificado el usuario denunciante sobre la decisión tomada.'>
                <InfoIcon />
              </Tooltip>
            </Box>

            <TextField
              sx={{ width: '100%' }}
              id="outlined-multiline-static"
              onChange={handleChangeComment}
              value={commentRequest}
              multiline
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
                color: '#ffffff',
                backgroundColor: '#D40000',
                ':hover': {
                  background: '#960202',
                },
              }}
              onClick={handleRejectOptionReport}
              variant="contained"
              startIcon={<CancelIcon fontSize="small" />}
            >
              Rechazar
            </Button>
            <Button
              sx={{
                my: { xs: 1, sm: 1 },
                color: '#ffffff',
                backgroundColor: '#0077FF',
                ':hover': {
                  background: '#014796',
                },
              }}
              onClick={handleAcceptOptionReport}

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
