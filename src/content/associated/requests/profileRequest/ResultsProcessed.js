import { useState } from 'react';
import PropTypes from 'prop-types';
// import { useSnackbar } from 'notistack';
// import AttachFileIcon from '@mui/icons-material/AttachFile';
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
  /*
  Stack,
  // styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Slide,
  */
  TextField,

  // TextareaAutosize,
  // ThemeProvider
} from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Chip from '@mui/material/Chip';
// import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
/*
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import certifyAxios from 'src/utils/aimAxios';
import useRefMounted from 'src/hooks/useRefMounted';
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
/*
const states = [
  {
    id: '0',
    name: 'Pending'
  },
  {
    id: '1',
    name: 'Approved'
  },
  {
    id: '2',
    name: 'Rejected'
  }
]
/*
const stateOptions = states.map((state) => ({
  value: state.id,
  label: state.name
}));

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

/*
const parseMerit = (merit) => {
    const meritParsed = meritOptions.find((option) => option.id === merit);
    return meritParsed.name;
}
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

const ResultsProcessed = (props) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  // const theme = useTheme();
  // const [openDialogDetailsReport, setOpenDialogDetailsReport] = useState(false);
  // const [openDialogDetailsTopicRequest, setOpenDialogDetailsTopicRequest] = useState(false);
  // const [openDialogDetailsProfileDataChange, setOpenDialogDetailsProfileDataChange] = useState(false);
  // const { enqueueSnackbar } = useSnackbar();
  const [filters] = useState({
    status: null
  });
  // const [request, setRequest] = useState();
  /*
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
  /*
  const [phoneNumberNew, setPhoneNumberNew] = useState(0);
  const [phoneNumberOld, setPhoneNumberOld] = useState(0);
  const [documentNumberPhotoURLNew, setDocumentNumberPhotoURLNew] = useState("");
  const [documentNumberPhotoURLOld, setDocumentNumberPhotoURLOld] = useState("");
  const [priceNew, setPriceNew] = useState(0);
  const [priceOld, setPriceOld] = useState(0);
  const [bankIdNew, setBankIdNew] = useState(0);
  const [bankIdOld, setBankIdOld] = useState(0);
  const [bankNameNew, setBankNameNew] = useState("");
  const [bankNameOld, setBankNameOld] = useState("");
  const [bankAccountOld, setBankAccountOld] = useState(0);
  const [bankAccountNew, setBankAccountNew] = useState(0);

  
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
  // const [requestState, setRequestState] = useState(0);
  // const [meritNameOld, setmeritNameOld] = useState("");
  // const [meritNameNew, setmeritNameNew] = useState("");
  /*
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
          /*
          setPhoneNumberNew(response.data.phoneNumberNew);
          setPhoneNumberOld(response.data.phoneNumberOld);
          setDocumentNumberPhotoURLNew(response.data.documentNumberPhotoURLNew);
          setDocumentNumberPhotoURLOld(response.data.documentNumberPhotoURLOld);
          setPriceNew(response.data.priceNew);
          setPriceOld(response.data.priceOld);
          setBankIdNew(response.data.bankIdNew);
          setBankIdOld(response.data.bankIdOld);
          setBankNameNew(response.data.bankNameNew);
          setBankNameOld(response.data.bankNameOld);
          setBankAccountOld(response.data.bankAccountOld);
          setBankAccountNew(response.data.bankAccountNew);
          
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
    } catch (err) {
      console.error(err);
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
      handleAcceptProfileDataChangeSuccess();
    } catch (error) {
      console.log('Error');
      handleAcceptProfileDataChangeError(error.status);
    }
    setOpenDialogDetailsProfileDataChange(false);
  }

  const handleAcceptProfileDataChangeSuccess = () => {
    console.log('Accept Success');
    enqueueSnackbar('Solicitud de Cambio de Datos aceptada con éxito', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 2000,
      TransitionComponent: Slide
    });
  }

  const handleAcceptProfileDataChangeError = (message) => {
    console.log('Error');
    enqueueSnackbar(`Error al aceptar la solicitud de Cambio de Datos . Error ${message}`,
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
      handleRejectProfileDataChangeSuccess();
    } catch (error) {
      console.log('Error');
      handleRejectProfileDataChangeError(error.status);
    }
    setOpenDialogDetailsProfileDataChange(false);
  }

  const handleRejectProfileDataChangeSuccess = () => {
    console.log('Reject Success');
    enqueueSnackbar('Solicitud de Cambio de Datos rechazada con éxito', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 2000,
      TransitionComponent: Slide
    });
  }

  const handleRejectProfileDataChangeError = (message) => {
    console.log('Error');
    enqueueSnackbar(`Hubo un error al rechazar la solicitud de Cambio de Datos. Error ${message}`,
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
      "requestType": 1,
      "state": 12
    }
    props.onPageParamsChange(reqObj);
  };

  const filteredAssociated = applyFilters(props.requests, query, filters);
  // const paginatedAssociated = applyPagination(filteredAssociated, page, limit);
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
                            {associated.partnerName}
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
                count={props.numberOfResult}
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
  numberOfResults: 0
};

export default ResultsProcessed;
