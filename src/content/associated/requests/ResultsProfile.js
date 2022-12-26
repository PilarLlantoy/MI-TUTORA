import { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
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
  TextField,
  Tooltip,
  IconButton,
  // TextareaAutosize,
  // ThemeProvider
} from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import certifyAxios from 'src/utils/aimAxios';
import useRefMounted from 'src/hooks/useRefMounted';

const applyFilters = (associated, query, filters) => {

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

const ResultsProfile = (props) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const theme = useTheme();
  const [openDialogDetailsProfile, setOpenDialogDetailsProfile] = useState(false);
  const [filters] = useState({
    status: null
  });
  const [request, setRequest] = useState();
  const isMountedRef = useRefMounted();
  const [partnerName, setPartnerName] = useState("");
  const [changes, setChanges] = useState([]);
  const [requestDate, setRequestDate] = useState("");
  const [requestId, setRequestId] = useState(0);
  const [requestType] = useState("Solicitud de Cambio de Datos");

  const getRequest = useCallback(async () => {
    try {
      let id = localStorage.getItem('idRequest')
      console.log(id);
      const idObj = {
        "id": id
      }
      const response = await certifyAxios.post('/request/profile/find', idObj);
      console.log(response.data);
      if (isMountedRef.current) {
        if (response.data.length === 0) {
          // const lastPage = Math.ceil(response.data.total / pageSize);
        }
        else {
          const formattedReqDate = new Date(response.data.requestDate);
          setPartnerName(response.data.partnerName);
          if (response.data.requestId !== -1) {
            // Setearemos los cambios dentro del objeto changes
            if (response.data.academicPhotoURLNew !== null) {
              setChanges(changes => [...changes, " Foto Académica"]);
            }
            if (response.data.bankAccountNew !== null) {
              setChanges(changes => [...changes, " Cuenta Bancaria"]);
            }
            if (response.data.bankIdNew !== null) {
              setChanges(changes => [...changes, " ID del Banco"]);
            }
            if (response.data.bankNameNew !== null) {
              setChanges(changes => [...changes, " Nombre del Banco"]);
            }
            if (response.data.descriptionNew !== null) {
              setChanges(changes => [...changes, " Descripción"]);
            }
            if (response.data.documentNumberPhotoURLNew !== null) {
              setChanges(changes => [...changes, " Foto de Documento"]);
            }
            if (response.data.emailNew !== null) {
              setChanges(changes => [...changes, " Email"]);
            }
            if (response.data.fullNameNew !== null) {
              setChanges(changes => [...changes, "Nombre Completo"]);
            }
            /*
            if (response.data.instituteMajorIdNew !== null) {
              setChanges(changes => [...changes, " ID de la Universidad / Carrera"]);
            }
            */
            if (response.data.instituteNameNew !== null) {
              setChanges(changes => [...changes, " Universidad"]);
            }
            if (response.data.majorNameNew !== null) {
              setChanges(changes => [...changes, " Carrera"]);
            }
            if (response.data.meritNew !== null) {
              setChanges(changes => [...changes, " Mérito"]);
            }
            if (response.data.multibankAccountNew !== null) {
              setChanges(changes => [...changes, " Cuenta de Multibanco"]);
            }
            if (response.data.nameAssociateAccountNew !== null) {
              setChanges(changes => [...changes, " Nombre de la Cuenta Asociada"]);
            }
            if (response.data.phaseNew !== null) {
              setChanges(changes => [...changes, " Semestre"]);
            }
            if (response.data.phoneNumberNew !== null) {
              setChanges(changes => [...changes, " Teléfono"]);
            }
            if (response.data.priceNew !== null) {
              setChanges(changes => [...changes, " Precio por Hora"]);
            }
            if (response.data.profilePictureURLNew !== null) {
              setChanges(changes => [...changes, " Foto de Perfil"]);
            }
            if (response.data.urlPhotoQRNew !== null) {
              setChanges(changes => [...changes, " QR"]);
            }
          }
          setRequestDate(`${formattedReqDate.toLocaleDateString('es-ES')} ${formattedReqDate.toLocaleTimeString('es-ES')} hrs.`);
          setRequestId(response.data.requestId);
          console.log(requestId);
          console.log(changes);
          setOpenDialogDetailsProfile(true);
          setRequest(response.data);
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
    getRequest();
    console.log(request);

    setOpenDialogDetailsProfile(true);
  };
  const handleCloseDetails = () => {
    // Podríamos cerrar todos los modals abiertos
    setOpenDialogDetailsProfile(false);
  };
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
              textAlign="center"
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
                    <TableCell>Nro. de Solicitud</TableCell>
                    <TableCell>Fecha de Solicitud</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAssociated.map((requestItem, idx) => {
                    let formattedDate = new Date(requestItem.requestDate);
                    return (
                      <TableRow
                        hover
                        key={idx}
                        sx={{
                          px: 5
                        }}
                      >
                        <TableCell>
                          <Typography noWrap variant="h5">
                            CP - 00{requestItem.requestId}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {`${formattedDate.toLocaleDateString('es-ES')} ${formattedDate.toLocaleTimeString('es-ES')} hrs.`}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={<PermIdentityIcon />}
                            label="Pendiente"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell
                          sx={{
                            whiteSpace: 'nowrap',
                            paddingBottom: 0,
                            paddingTop: 0,
                            px: 'auto'
                          }}
                        >
                          <Box
                          >
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
                                onClick={() => handleOpenDetails(requestItem)}
                              >
                                <RemoveRedEyeIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                        <Dialog
                          open={openDialogDetailsProfile}
                          onClose={handleCloseDetails}
                          fullWidth
                          maxWidth="sm"
                        >
                          <DialogTitle
                            align="center"
                            sx={{
                              paddingTop: 2,
                              paddingBottom: 1,
                              backgroundColor: `${theme.colors.info.lighter}`,
                            }}
                          >
                            <Typography
                              fontSize="1.4rem"
                              gutterBottom>
                              DETALLE DE LA SOLICITUD
                            </Typography>
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText>
                              <Grid
                                xs={6}
                                sm={6}
                                md={12}
                                sx={{
                                  paddingTop: "1rem",
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  fontSize="0.9rem"
                                  color="#223354"
                                  py="0.3rem"
                                >
                                  <b>Nombre Asociada: </b>{formatNameCapitals(partnerName.replace(',', ''))}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  fontSize="0.9rem"
                                  color="#223354"
                                  py="0.3rem"
                                >
                                  <b>Tipo de Solicitud:</b> {requestType}
                                </Typography>
                                <Typography
                                  variant="body1"
                                  fontSize="0.9rem"
                                  py="0.3rem"
                                  color="#223354"
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
                                  paddingBottom="0.75rem"
                                  color="#223354"
                                >
                                  <b>Cambios Solicitados en:</b>
                                </Typography>
                                <TextField
                                  disabled
                                  sx={{ width: '100%' }}
                                  id="outlined-multiline-static"
                                  value={changes}
                                  fontSize="1.1rem"
                                  multiline
                                  size='medium'
                                // rows={4}
                                />
                              </Grid>

                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Stack spacing={2} direction="row">
                              <Button
                                sx={{
                                  my: { xs: 1, sm: 1 },
                                  backgroundColor: '#1965ff',
                                  color: '#fff',
                                  ':hover': {
                                    backgroundColor: '#1965ff',
                                    color: '#fff',
                                  },
                                }}
                                onClick={handleCloseDetails}
                                variant="outlined"
                              >
                                Cerrar
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

ResultsProfile.propTypes = {
  requests: PropTypes.array.isRequired,
  onPageParamsChange: PropTypes.func,
  numberOfResults: PropTypes.number,
};

ResultsProfile.defaultProps = {
  requests: [],
  onPageParamsChange: () => { },
  numberOfResults: 0
};

export default ResultsProfile;
