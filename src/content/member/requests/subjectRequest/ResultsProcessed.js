import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatNameCapitals } from 'src/utils/training';
// import { useSnackbar } from 'notistack';
import {
  Box,
  // Button,
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
  TextField,
  // TextareaAutosize,
  // ThemeProvider
} from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Chip from '@mui/material/Chip';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
/*
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import certifyAxios from 'src/utils/aimAxios';
import useRefMounted from 'src/hooks/useRefMounted';
// import InfoIcon from '@mui/icons-material/Info';
*/
// import { createTheme } from '@mui/material/styles';


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

const ResultsProcessed = (props) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [filters] = useState({
    status: null
  });
  // const [request, setRequest] = useState();
  // const isMountedRef = useRefMounted();
  // const theme = useTheme();
  /*
    const [openDialogDetailsTopicRequest, setOpenDialogDetailsTopicRequest] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
  
  
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
      // getRequest();
    }, []);
  
  
  
  /*
  const handleCloseDetails = () => {
    // Podríamos cerrar todos los modals abiertos
    setOpenDialogDetailsTopicRequest(false);
  };
  
  
  
  // //
  // Cambio de Tema
  const handleAcceptOptionTopicRequest = () => {
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
        "resultDescription": descriptionRequest,
        "state": 1
      }
      console.log(requestObj);
      getResponse(requestObj);
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
  
  const getResponse = useCallback(async (reqObj) => {
    try {
      console.log(reqObj);
      const response = await certifyAxios.post('/request/subject/update', reqObj);
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
    } catch (err) {
      console.error(err);
    }
  }, []);
  
  
  const handleRejectOptionTopicRequest = () => {
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
        "resultDescription": descriptionRequest,
        "state": 2
      }
      console.log(requestObj);
      getResponse(requestObj);
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
  
  */
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
      "state": 12
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
      "state": 12
    }
    props.onPageParamsChange(reqObj);
  };

  const filteredAssociated = applyFilters(props.requests, query, filters);
  // const paginatedAssociated = applyPagination(filteredAssociated, page, limit);
  const paginatedAssociated = filteredAssociated;

  useEffect(() => {
    // getRequest();
    console.log("Received Requests");
  }, [props.numberOfResults]);

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
                    <TableCell>Nro. de Solicitud</TableCell>
                    <TableCell>Fecha de Solicitud</TableCell>
                    <TableCell>Estado</TableCell>
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
                            ST - 00{associated.requestId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {`${formattedDate.toLocaleDateString('es-ES')} ${formattedDate.toLocaleTimeString('es-ES')} hrs.`}
                          </Typography>
                        </TableCell>

                        {associated.state === 1 ? (
                          <>
                            <TableCell>
                              <Chip icon={<CheckCircleOutlineIcon />} label="Aceptada" variant="outlined" color="success" sx={{ color: "green" }} />
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell>
                              <Chip icon={<HighlightOffIcon />} label="Rechazada" color="error" variant="outlined" />
                            </TableCell>
                          </>
                        )}

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

    </>
  );
};

ResultsProcessed.propTypes = {
  requests: PropTypes.array.isRequired,
  onPageParamsChange: PropTypes.func,
  numberOfResults: PropTypes.number,
};

ResultsProcessed.defaultProps = {
  requests: [],
  onPageParamsChange: () => { },
  numberOfResults: 555
};

export default ResultsProcessed;
