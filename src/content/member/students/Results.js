import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  Grid,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
  // IconButton,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Slide,
  Typography,
  // styled,
  // useTheme,
  TextField
} from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import BlockIcon from '@mui/icons-material/Block';
import Icon from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import { formatNameCapitals } from 'src/utils/training';
import useAuth from 'src/hooks/useAuth';
import InfoIcon from '@mui/icons-material/Info';
import NoAccountsIcon from '@mui/icons-material/NoAccounts';
import { useSnackbar } from 'notistack';
import Chip from '@mui/material/Chip';


import certifyAxios from 'src/utils/aimAxios';

const applyFilters = (associated, query, filters) => {

  return associated.filter((associated) => {
    let matches = true;

    if (query) {
      const properties = ['fullName'];
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

// const applyPagination = (associated, page, limit) => {
//   return associated.slice(page * limit, page * limit + limit);
// };

const Results = (props) => {
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  const [openDialogBlock, setOpenDialogBlock] = useState(false);
  const [openDialogDisable, setOpenDialogDisable] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [memberId, setMemberId] = useState(0);
  const [commentBlock, setCommentBlock] = useState('');
  const [commentDisable, setCommentDisable] = useState('');

  const [filters] = useState({
    status: null
  });
  const [openAccordion, setOpenAccordion] = useState(false);


  const { user } = useAuth();

  const handleChangeCommentBlock = (event) => {
    setCommentBlock(event.target.value);
  }

  const handleChangeCommentDisable = (event) => {
    setCommentDisable(event.target.value);
  }

  const handleOpenDisableModal = (client) => {
    setOpenDialogDisable(true);
    console.log("llego a la apertura del modal para Inhabilitar");
    console.log(client);
    console.log(client.clientId);
    setMemberId(client.clientId);
  };

  const handleCloseDisableModal = () => {
    setOpenDialogDisable(false);

  };

  const handleDisableAssociated = async () => {
    try {

      console.log("Funcion para inhabilitar asociada directamente");
      const request = {
        "memberId": user.person.id,
        "sanctionedId": memberId,
        "description": commentDisable,
        "type": 0
      };
      console.log(request);
      const response = await certifyAxios.post("/sanction/register", request);
      console.log(response.data);
      handleDisableSuccess();
    } catch (error) {
      handleDisableError(error.status);
      console.log(error);
    }
    setOpenDialogDisable(false);
  };

  const handleDisableSuccess = () => {
    console.log("Se inhabilitó correctamente");
    enqueueSnackbar('Se inhabilitó correctamente al cliente', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 3000,
      TransitionComponent: Slide
    });
  };

  const handleDisableError = (message) => {
    console.log("Error en la inhabilitación");
    enqueueSnackbar(`Hubo un error en la inhabilitación. Error ${message}`,
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Slide
      });
  };


  const handleOpenBlockModal = (client) => {
    setOpenDialogBlock(true);
    console.log("llego a la apaertura del modal para Bloquear");
    console.log(client);
    console.log(client.clientId);
    setMemberId(client.clientId);

  }

  const handleCloseBlockModal = () => {
    setOpenDialogBlock(false);
  }

  const handleBlockAssociated = async () => {
    try {
      console.log("Funcion para bloquear cliente directamente");
      const request = {
        "memberId": user.person.id,
        "sanctionedId": memberId,
        "description": commentBlock,
        "type": 1
      };
      console.log(request);
      const response = await certifyAxios.post("/sanction/register", request);
      console.log('Server response: ', response.data);
      console.log('Server: ', response);
      handleBlockSuccess();
    } catch (error) {
      handleBlockError(error.status);
      console.log(error);
    }
    setOpenDialogBlock(false);
  }
  const handleBlockSuccess = () => {
    console.log("Se bloqueó correctamente");
    enqueueSnackbar('Se bloqueó correctamente al cliente', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 3000,
      TransitionComponent: Slide
    });
  };

  const handleBlockError = (message) => {
    console.log("Error en el bloqueo");
    enqueueSnackbar(`Hubo un error en el bloqueo. Error ${message}`,
      {
        variant: 'error',
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right'
        },
        TransitionComponent: Slide
      });
  };

  const onRowsPerPageChange = (event) => {
    const obj = {
      firstResult: 1,
      maxResults: event.target.value
    }

    setPage(0);
    setLimit(event.target.value);

    props.onPageParamsChange(obj);
  }

  // const { user } = useAuth();

  const handleQueryChange = (event) => {
    event.persist();
    setQuery(event.target.value);
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);

    const reqObj = {
      "firstResult": newPage + 1,
      "maxResults": limit
    };

    props.onPageParamsChange(reqObj);
  };

  useEffect(() => {
    console.log('Received numberOfResults: ', props.numberOfResults);
  }, [props.numberOfResults])

  const filteredAssociated = applyFilters(props.associated, query, filters);
  const paginatedAssociated = filteredAssociated;

  return (
    <>
      {/* <Card
        sx={{
          p: 1,
          mb: 3
        }}
      > */}
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

              variant="outlined"
            />
          </Box>
        </Grid>
      </Grid>
      {/* </Card> */}

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
            <b>{paginatedAssociated.length}</b> <b>cliente(s)</b>
          </Box>
          <TablePagination
            component="div"
            count={props.numberOfResults}
            /*
            count={filteredAssociated.length}
            */
            onPageChange={handlePageChange}
            onRowsPerPageChange={onRowsPerPageChange}
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
              No se encontraron clientes
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='center'>Foto</TableCell>
                    <TableCell>Nombre(s) Completo / DNI</TableCell>
                    <TableCell>Correo / Teléfono</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedAssociated.map((associated, idx) => {
                    // console.log(associated)
                    return (
                      <>
                        <TableRow hover key={idx} onClick={() => setOpenAccordion(openAccordion === idx ? -1 : idx)} sx={{ cursor: 'pointer' }}>
                          <TableCell align='center'>
                            <img alt='foto' src={associated.photoUrl !== null ? (associated.photoUrl.split('#').length > 1 ? associated.photoUrl.split('#')[1] : associated.photoUrl) : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'} style={{ borderRadius: '50%', width: '45px', height: '45px', objectFit: 'cover' }} />
                          </TableCell>

                          <TableCell>
                            {(associated.stats.status === 2) ? (

                              <Typography
                                sx={{
                                  marginRight: '0.5rem'
                                }}
                                noWrap variant="h5">
                                {formatNameCapitals(associated.fullName.replace(',', ''))}
                                <Chip
                                  sx={{
                                    color: '#ffffff',
                                    backgroundColor: 'red',
                                    fontSize: '0.75rem',
                                    marginLeft: '3rem'
                                  }}
                                  label="Inhabilitado" size="small" />

                              </Typography>
                            ) : (
                              <Typography noWrap variant="h5">
                                {formatNameCapitals(associated.fullName.replace(',', ''))}
                              </Typography>
                            )}
                            <Typography
                              noWrap
                              variant="h6"
                              style={{
                                fontSize: "0.8rem"
                              }}
                            >
                              DNI: {associated.documentNumber ? associated.documentNumber : "Sin DNI"}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              noWrap
                              variant="h6"
                              style={{
                                textTransform: "lowerCase",
                                fontSize: "0.85rem",
                              }}
                            >
                              {associated.email ? associated.email : "correo electrónico no disponible"}
                            </Typography>
                            <Typography
                              noWrap
                              variant="h6"
                              style={{
                                fontSize: "0.8rem"
                              }}
                            >
                              Teléfono: {associated.phoneNumber ? associated.phoneNumber : "Sin Teléfono"}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Icon
                              aria-label="expand row"
                              size="small"
                              sx={{
                                width: "90%",
                                py: '1',
                                display: 'flex',
                                justifyContent: 'right',
                                alignItems: 'right',
                              }}
                              onClick={() => setOpenAccordion(openAccordion === idx ? -1 : idx)}
                            >
                              {openAccordion === idx ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </Icon>
                          </TableCell>
                        </TableRow>

                        <TableRow>
                          <TableCell sx={{ paddingBottom: 0, paddingTop: 0, px: 5 }} colSpan={6}>
                            <Collapse in={openAccordion === idx} timeout="auto" unmountOnExit>
                              <Box
                                sx={{
                                  width: "100%",
                                  py: '1',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                }}
                              >
                                <Box sx={{ p: { xs: 1, sm: 2 }, display: 'flex' }}>
                                  <Box sx={{
                                    p: { xs: 1, sm: 2 }
                                  }}>
                                    <Typography
                                      noWrap
                                      variant="h5"
                                      sx={{
                                        paddingBottom: 1,
                                      }}
                                    >Estadísticas de clases </Typography>

                                    &bull;&nbsp;Clases tomadas: {associated.stats.takenClasses !== null ? associated.stats.takenClasses : 0}<br />
                                    &bull;&nbsp;Clases canceladas: {associated.stats.cancelledClasses !== null ? associated.stats.cancelledClasses : 0}
                                  </Box>

                                  <Box sx={{ p: { xs: 1, sm: 2 } }}>
                                    <Typography
                                      noWrap
                                      variant="h5"
                                      sx={{
                                        paddingBottom: 1
                                      }}

                                    >Estadísticas de cursos </Typography>

                                    &bull;&nbsp;Cursos elegidos {associated.stats.chosenCourses !== null ? associated.stats.chosenCourses : 0}<br />
                                    &bull;&nbsp;Profesoras elegidas: {associated.stats.chosenTeachers !== null ? associated.stats.chosenTeachers : 0}
                                  </Box>

                                  <Box sx={{ p: { xs: 1, sm: 2 } }}>
                                    <Typography
                                      noWrap
                                      variant="h5"
                                      sx={{
                                        paddingBottom: 1
                                      }}
                                    >Comportamiento</Typography>

                                    &bull;&nbsp;Denuncias: {associated.stats.complaints !== null ? associated.stats.complaints : 0}<br />

                                  </Box>
                                </Box>
                                <Box sx={{ p: 2, display: 'flex', flexDirection: 'row' }}>
                                  {(associated.stats.status === 3) ? (
                                    <Button
                                      sx={{
                                        my: { xs: 1, sm: 1 },
                                        color: '#ffffff',
                                        backgroundColor: '#D40000',
                                        ':hover': {
                                          background: '#960202',
                                        },
                                      }}
                                      disabled
                                      onClick={() => console.log('Redirecting to Perfil Asociada...')}
                                      variant="contained"
                                      startIcon={<BlockIcon fontSize="small" />}
                                    >
                                      Desbloquear
                                    </Button>
                                  ) :
                                    ((associated.stats.status === 2) ? (
                                      <Button
                                        sx={{
                                          my: { xs: 1, sm: 1 },
                                          color: '#ffffff',
                                          backgroundColor: '#D40000',
                                          ':hover': {
                                            background: '#960202',
                                          },
                                        }}

                                        onClick={() => console.log('Redirecting to Perfil Asociada...')}
                                        variant="contained"
                                        startIcon={<BlockIcon fontSize="small" />}
                                      >
                                        Habilitar
                                      </Button>
                                    ) : (
                                      <>
                                        <Button
                                          sx={{
                                            my: { xs: 1, sm: 1 },
                                            marginRight: 2,

                                            color: '#ffffff',
                                            backgroundColor: '#D40000',
                                            ':hover': {
                                              background: '#960202',
                                            },
                                          }}
                                          onClick={() => {
                                            console.log('Redirecting to Inhabilitacion...');
                                            handleOpenDisableModal(associated);
                                          }}
                                          variant="contained"
                                          startIcon={<NoAccountsIcon fontSize="small" />}
                                        >
                                          Inhabilitar
                                        </Button>
                                        <Button
                                          sx={{
                                            my: { xs: 1, sm: 1 },
                                            marginLeft: 2,
                                            color: '#ffffff',
                                            backgroundColor: '#D40000',
                                            ':hover': {
                                              background: '#960202',
                                            },
                                          }}
                                          onClick={() => {
                                            console.log('Redirecting to Bloqueo...');
                                            handleOpenBlockModal(associated);
                                          }}
                                          variant="contained"
                                          startIcon={<BlockIcon fontSize="small" />}
                                        >
                                          Bloquear
                                        </Button>
                                      </>
                                    )
                                    )
                                  }
                                </Box>
                                <Dialog
                                  open={openDialogDisable}
                                  onClose={handleCloseDisableModal}
                                >
                                  <DialogTitle justifyContent="center" sx={{ p: 2 }}>
                                    <b>
                                      Inhabilitar Socia
                                    </b>
                                  </DialogTitle>
                                  <DialogContent>
                                    <DialogContentText
                                      sx={{
                                        my: { xs: 1, sm: 1 },
                                        color: "#000",
                                        backgroundColor: '#FFD6D6',
                                        p: 3,
                                      }}
                                    >
                                      Al inhabilitar a <b>{associated.fullName}</b>, esta pierde la posibilidad de solicitar clases nuevas a las asociadas. Sin embargo, aún podrá asistir a sus clases programadas previamente.
                                    </DialogContentText>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                      ¿Desea INHABILITAR al cliente: <b>{associated.fullName}</b>? No implica bloquearla.
                                    </Typography>
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
                                        <Tooltip
                                          title='El comentario ingresado será notificado al cliente inhabilitada.'>
                                          <InfoIcon />
                                        </Tooltip>
                                      </Box>

                                      <TextField
                                        sx={{ width: '100%' }}
                                        id="outlined-multiline-static"
                                        onChange={handleChangeCommentDisable}
                                        // value={commentRequest}
                                        multiline
                                        rows={4}
                                      />
                                    </Grid>
                                  </DialogContent>
                                  <DialogActions>
                                    <Button
                                      color="error"
                                      onClick={() => handleCloseDisableModal()}
                                    >
                                      Cancelar
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
                                        console.log('Redirecting to Inhabilitacion...');
                                        handleDisableAssociated(associated);
                                      }}
                                      variant="contained"
                                      startIcon={<NoAccountsIcon fontSize="small" />}
                                    >Inhabilitar
                                    </Button>

                                  </DialogActions>
                                </Dialog>
                                <Dialog
                                  open={openDialogBlock}
                                  onClose={handleCloseBlockModal}
                                >
                                  <DialogTitle justifyContent="center" sx={{ p: 2 }}>
                                    <b>
                                      Bloquear Socia
                                    </b>
                                  </DialogTitle>

                                  <DialogContent>
                                    <DialogContentText
                                      sx={{
                                        my: { xs: 1, sm: 1 },
                                        color: "#000",
                                        backgroundColor: '#FFD6D6',
                                        p: 3,
                                      }}
                                    >
                                      Al bloquear a <b>{associated.fullName}</b>, esta pierde la posibilidad de ingresar al sistema. NO podrá asistir a sus clases programadas previamente.
                                    </DialogContentText>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                      <b>Nota:</b> Esta acción no puede deshacerse.
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                      Clases agendadas del cliente: <b>{associated.stats.activeBookings ? 0 : associated.stats.activeBookings}</b><br />
                                      Solicitudes de clases pendientes: <b>{associated.stats.pendingBookings ? 0 : associated.stats.pendingBookings}</b>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                      ¿Desea BLOQUEAR al cliente: <b>{associated.fullName}</b>?
                                    </Typography>
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
                                        <Tooltip
                                          title='El comentario ingresado será notificado al cliente bloqueado.'>
                                          <InfoIcon />
                                        </Tooltip>
                                      </Box>

                                      <TextField
                                        sx={{ width: '100%' }}
                                        id="outlined-multiline-static"
                                        onChange={handleChangeCommentBlock}
                                        // value={commentRequest}
                                        multiline
                                        rows={4}
                                      />
                                    </Grid>

                                  </DialogContent>
                                  <DialogActions>
                                    <Button
                                      color="error"
                                      onClick={() => handleCloseBlockModal()}>Cancelar</Button>
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
                                        console.log('Redirecting to Bloqueo...');
                                        handleBlockAssociated(associated);
                                      }
                                      }
                                      variant="contained"
                                      startIcon={<BlockIcon fontSize="small" />}
                                    >Bloquear
                                    </Button>

                                  </DialogActions>
                                </Dialog>
                              </Box>
                            </Collapse>
                          </TableCell>
                        </TableRow>
                      </>
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
                onRowsPerPageChange={onRowsPerPageChange}
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
  associated: PropTypes.array.isRequired
};

Results.defaultProps = {
  associated: [],
  onPageParamsChange: () => { console.log("defaultProps") },
  numberOfResults: 555
};

export default Results;
