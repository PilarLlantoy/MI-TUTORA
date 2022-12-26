import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
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
import { formatNameCapitals } from 'src/utils/training';
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

const applyPagination = (requests, page, limit) => {
  return requests.slice(page * limit, page * limit + limit);
};

const Results = (props) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const theme = useTheme();
  const [openDialogDetailsReport, setOpenDialogDetailsReport] = useState(false);
  const [openDialogDetailsTopicRequest, setOpenDialogDetailsTopicRequest] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [filters] = useState({
    status: null
  });
  const [request, setRequest] = useState();
  const isMountedRef = useRefMounted();

  const getRequest = useCallback(async () => {
    try {
      let id = localStorage.getItem('idRequest')
      console.log(id);
      const idObj = {
        "id": id
      }
      const response = await certifyAxios.post('/request/complaint/find', idObj);

      console.log(response.data);
      setRequest(response.data);
      if (isMountedRef.current) {
        if (response.data.length === 0) {
          // const lastPage = Math.ceil(response.data.total / pageSize);
          // reqObj.firstResult = lastPage;
          // setPageNumber(lastPage);
          // getAssociates(reqObj);
        }
        else {
          console.log(response.data);
          setRequest(response.data);
        }
      }


    } catch (err) {
      console.error(err);

    }
  }, []);


  /*
   const theme2 = createTheme({
     palette: {
       reject: {
         main: '#FF4545',
         contrastText: '#fff',
       },
       approve: {
         main: '#0077FF',
         contrastText: '#fff',
       },
       details: {
         main: '#BDBDBD',
         contrastText: '#000',
       },
     }
   });
   */

  // const { user } = useAuth();
  const handleOpenDetails = (requestElement) => {
    console.log(requestElement);
    console.log('Request');

    // ahora obtendremos los datos de la solicitud
    // Obtenemos el id de la solicitud para buscar los datos
    const idRequest = requestElement.requestId;
    localStorage.setItem('idRequest', idRequest);
    getRequest();
    console.log(request);

    localStorage.setItem('associatedName', request.partnerName);
    localStorage.setItem('associatedType', request.type);
    localStorage.setItem('associatedDate', request.date);
    localStorage.setItem('associatedClient', request.clientName);
    localStorage.setItem('associatedDetails', request.description);
    localStorage.setItem('associatedTopicCategory', request.classSubjectName);
    localStorage.setItem('associatedTopic', request.topic);
    localStorage.setItem('associatedTopicDetails', request.topicDetails);
    localStorage.setItem('associatedTopicLevels', request.classGradeNames);

    setOpenDialogDetailsReport(true);
    // Si la solicitud es de Tipo: Cliente reportado procederemos

    /*
    if (associated.type === "Cliente Reportado" || associated.type === "Socia Reportada") {
      console.log('Cliente Reportado');
      setOpenDialogDetailsReport(true);
      // Si la solicitud es de Tipo: cambio de tema procederemos
    } else if (associated.type === "Selección de Tema") {
      console.log('Selección de Tema');
      setOpenDialogDetailsTopicRequest(true);
    }
    */
  };
  const handleCloseDetails = () => {
    // Podríamos cerrar todos los modals abiertos
    setOpenDialogDetailsReport(false);
    setOpenDialogDetailsTopicRequest(false);
  };


  const handleAcceptOptionReport = () => {
    try {
      // console.log(associated);
      console.log('Accept this report request');
      handleAcceptReportClientSuccess();
    } catch (error) {
      console.log('Error');
      handleAcceptReportClientError(error.status);
    }
    setOpenDialogDetailsReport(false);
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

  const handleRejectOptionReport = () => {
    try {
      // console.log(associated);
      console.log('Reject this report request');
      handleRejectReportClientSuccess();
    } catch (error) {
      console.log('Error');
      handleRejectReportClientError(error.status);
    }
    setOpenDialogDetailsReport(false);
  }

  const handleRejectReportClientSuccess = () => {
    console.log('Reject Success');
    enqueueSnackbar('Solicitud de Reporte rechazada con éxito', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 2000,
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
        autoHideDuration: 2000,
        TransitionComponent: Slide
      });
  }
  // //
  // Cambio de Tema
  const handleAcceptOptionTopicRequest = () => {
    try {
      // console.log(associated);
      console.log('Accept this topic request');
      handleAcceptTopicRequestSuccess();
    } catch (error) {
      console.log('Error');
      handleAcceptTopicRequestError(error.status);
    }
    setOpenDialogDetailsTopicRequest(false);
  }

  const handleAcceptTopicRequestSuccess = () => {
    console.log('Accept Success');
    enqueueSnackbar('Solicitud de Selección de Tema aceptada con éxito', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 2000,
      TransitionComponent: Slide
    });
  }

  const handleAcceptTopicRequestError = (message) => {
    console.log('Error');
    enqueueSnackbar(`Error al aceptar la solicitud de Selección de Tema. Error ${message}`,
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

  const handleRejectOptionTopicRequest = () => {
    try {
      // console.log(associated);
      console.log('Reject this topic request');
      handleRejectTopicRequestSuccess();
    } catch (error) {
      console.log('Error');
      handleRejectTopicRequestError(error.status);
    }
    setOpenDialogDetailsTopicRequest(false);
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
  }

  const handleRejectTopicRequestError = (message) => {
    console.log('Error');
    enqueueSnackbar(`Hubo un error al rechazar la solicitud de Selección de Tema. Error ${message}`,
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
              No se encontraron solicitudes
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Solicitante</TableCell>
                    <TableCell>Tipo de Solicitud</TableCell>
                    <TableCell>Fecha de Solicitud</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAssociated.map((associated, idx) => {
                    return (
                      <TableRow hover key={idx}>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {formatNameCapitals(associated.partnerName).replace(',', '')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {formatNameCapitals(associated.requestType)} ss
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {associated.requestDate}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <TableCell
                            sx={{
                              whiteSpace: 'nowrap',
                              paddingBottom: 0,
                              paddingTop: 0,
                              px: 5
                            }}
                            align="center"
                          >
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
                        </TableCell>
                        <Dialog
                          open={openDialogDetailsReport}
                          onClose={handleCloseDetails}
                          fullWidth
                          maxWidth="sm"
                        >
                          <DialogTitle
                            variant="h3"
                            align="center"
                          >
                            Detalle de la Solicitud
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText>

                              <Grid xs={6} sm={6} md={12}>
                                <Typography
                                  variant="body1"
                                  fontSize="1.1rem"
                                >
                                  <b>Nombre Asociada: </b>{localStorage.getItem('associatedName')}
                                </Typography>

                                <Typography
                                  variant="body1"
                                  fontSize="1.1rem"
                                >
                                  <b>Tipo de Solicitud:</b> Cliente Reportado
                                </Typography>
                                <Typography
                                  variant="body1"
                                  fontSize="1.1rem"
                                >
                                  <b>Cliente:</b> {formatNameCapitals(localStorage.getItem('associatedClient')).replace(',', '')}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  fontSize="1.1rem"
                                >
                                  <b>Fecha de Solicitud:</b> {localStorage.getItem('associatedDate')}
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
                                  fontSize="1.1rem"
                                >
                                  <b>Detalles de lo ocurrido</b>
                                </Typography>
                                <TextField
                                  disabled

                                  sx={{ width: '100%' }}
                                  id="outlined-multiline-static"
                                  value={localStorage.getItem('associatedDetails')}
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
                              <Typography
                                variant="h6"
                                fontSize="1.1rem"
                              >
                                <b>Deja un comentario a la asociada explicando tu decisión</b>
                              </Typography>
                              <TextField
                                sx={{ width: '100%' }}
                                id="outlined-multiline-static"

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
                                  color: "white",
                                  backgroundColor: '#D40000',
                                  ':hover': {
                                    background: '#960202',
                                  },
                                }}
                                onClick={() => {
                                  console.log('Redirecting to Rechazo...');
                                  handleRejectOptionReport();
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
                                  handleAcceptOptionReport();
                                }}

                                variant="contained"
                                startIcon={<CheckCircleOutlineIcon fontSize="small" />}
                              >
                                Aceptar
                              </Button>

                            </Stack>
                          </DialogActions>
                        </Dialog>

                        <Dialog
                          open={openDialogDetailsTopicRequest}
                          onClose={handleCloseDetails}
                          fullWidth
                          maxWidth="sm"
                        >
                          <DialogTitle
                            variant="h3"
                            align="center"
                          >
                            Detalle de la Solicitud
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText>

                              <Grid xs={6} sm={6} md={12}>
                                <Typography
                                  variant="body1"
                                  fontSize="1.1rem"
                                >
                                  <b>Nombre Asociada: </b>{formatNameCapitals(localStorage.getItem('associatedName')).replace(',', '')}
                                </Typography>

                                <Typography
                                  variant="body1"
                                  fontSize="1.1rem"
                                >
                                  <b>Tipo de Solicitud:</b> {formatNameCapitals(localStorage.getItem('associatedType'))}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  fontSize="1.1rem"
                                >
                                  <b>Fecha de Solicitud:</b> {localStorage.getItem('associatedDate')}
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
                                  fontSize="1.1rem"
                                >
                                  <b>Categoría Seleccionada</b>
                                </Typography>
                                <TextField
                                  disabled

                                  sx={{ width: '50%' }}
                                  id="outlined-multiline-static"
                                  value={formatNameCapitals(localStorage.getItem('associatedTopicCategory'))}
                                  fontSize="1.1rem"
                                  size='medium'
                                // rows={4}
                                />
                                <Typography
                                  variant="h6"
                                  fontSize="1.1rem"
                                >
                                  <b>Tema Seleccionado</b>
                                </Typography>
                                <TextField
                                  disabled
                                  sx={{ width: '50%' }}
                                  id="outlined-multiline-static"
                                  value={formatNameCapitals(localStorage.getItem('associatedTopic'))}
                                  fontSize="1.1rem"
                                  size='medium'
                                // rows={4}
                                />

                                <Typography
                                  variant="h6"
                                  fontSize="1.1rem"
                                >
                                  <b>Descripción de lo que quiere enseñar</b>
                                </Typography>
                                <TextField
                                  disabled
                                  sx={{ width: '100%' }}
                                  id="outlined-multiline-static"
                                  value={localStorage.getItem('associatedTopicDetails')}
                                  fontSize="1.1rem"
                                  size='medium'
                                  multiline
                                // rows={4}
                                />

                                <Typography
                                  variant="h6"
                                  fontSize="1.1rem"
                                >
                                  <b>Grado(s) seleccionado(s)</b>
                                </Typography>
                                <TextField
                                  disabled
                                  sx={{ width: '100%' }}
                                  id="outlined-multiline-static"
                                  value={formatNameCapitals(localStorage.getItem('associatedTopicLevels'))}
                                  fontSize="1.1rem"
                                  size='medium'
                                  multiline
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
                              <Typography
                                variant="h6"
                                fontSize="1.1rem"
                              >
                                <b>Deja un comentario a la asociada explicando tu decisión</b>
                              </Typography>
                              <TextField
                                sx={{ width: '100%' }}
                                id="outlined-multiline-static"

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
                        </Dialog>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
            <Box p={2}>
              <TablePagination
                component="div"
                count={filteredAssociated.length}
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
    </>
  );
};

Results.propTypes = {
  requests: PropTypes.array.isRequired,
  onPageParamsChange: PropTypes.func,
  numberOfResults: PropTypes.number,
};

Results.defaultProps = {
  requests: [],
  onPageParamsChange: () => { },
  numberOfResults: 555
};

export default Results;
