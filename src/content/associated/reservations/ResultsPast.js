import { useState } from 'react';
import PropTypes from 'prop-types';
import certifyAxios from 'src/utils/aimAxios';
import useAuth from 'src/hooks/useAuth';
import {
  Box,
  Card,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  // Tooltip,
  // IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Button,
  Zoom,
  Typography,
  // styled,
  TextField,
  LinearProgress,
  useTheme
} from '@mui/material';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { useSnackbar } from 'notistack';
import {
  getNameAndUrlFromBack,
} from 'src/utils/awsConfig';
import { formatNameCapitals } from 'src/utils/training';


const ResultsPast = ( props ) => {
  const { user } = useAuth();
  const theme = useTheme();
  
  const { enqueueSnackbar } = useSnackbar();
  const [ page, setPage ] = useState(0);
  const [ limit, setLimit ] = useState(5);
  const [ paymentDialogOpen, setPaymentDialogOpen ] = useState(false);
  // const [ reservationRequestId, setReservationRequestId ] = useState();
  const [ reporteSesion, setReporteSesion ] = useState({});
  const [ reportDialogOpen, setReportDialogOpen ] = useState(false);
  const [activeReservation, setActiveReservation] = useState({});

  const [ enteredSubjectsCovered, setEnteredSubjectsCovered ] = useState('');
  const [ enteredComments, setEnteredComments ] = useState('');
  const [ subjectsDisabled, setSubjectsDisabled ] = useState(false);
  const [ commentsDisabled, setCommentsDisabled ] = useState(false);

  const handleSuccess = () => {
    enqueueSnackbar('Se ha enviado el feedback satisfactoriamente', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };
  
  const paginatedReservations = props.reservations;

  // const showSuccess = () => {
  //   enqueueSnackbar('La operación se ha realizado correctamente.', {
  //     variant: 'success',
  //     anchorOrigin: {
  //       vertical: 'top',
  //       horizontal: 'right'
  //     },
  //     TransitionComponent: Zoom
  //   });
  // };

  const handleFailure = (message) => {
    enqueueSnackbar(`Hubo un error: ${message}`, {
      variant: 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };
  
  const handleOpenPayment = (res) => {
    setActiveReservation(res);
    setPaymentDialogOpen(true);
  }

  const handleClosePayment = () => {
    setPaymentDialogOpen(false);
  }

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
    const reqObj = {
      "clientId": null,
      "firstResult": newPage+1,
      "maxResults": limit,
      "partnerId": user.person.id,
      "type": 2
    }
    props.onPageParamsChange(reqObj);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    const reqObj = {
      "clientId": null,
      "firstResult": page+1,
      "maxResults": event.target.value,
      "partnerId": user.person.id,
      "type": 2
    }
    props.onPageParamsChange(reqObj);
  };

  const getClassReport = async (resId) => {
    try{
      const request = {
        'id': resId
      }

      const response = await certifyAxios.post('/reservationRequest/findReport', request);

      setReporteSesion({
        'comment': response.data.comment,
        'partnerName': response.data.partnerName,
        'subjectsCovered': response.data.subjectsCovered,
        'urlPhotoPartner': getNameAndUrlFromBack(response.data.urlPhotoPartner).urlS3,
        'urlRecording': response.data.urlRecording
      })

      if(response.data.subjectsCovered !== null) {
        setSubjectsDisabled(true);
        setEnteredSubjectsCovered(response.data.subjectsCovered);
      }
      if(response.data.comment !== null) {
        setCommentsDisabled(true);
        setEnteredComments(response.data.comment);
      }

    }
    catch(err){
      handleFailure(err.message);
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

  const handleOpenReport = (res) => {
    setReportDialogOpen(true);
    setActiveReservation(res);
    getClassReport(res.reservationId);
  }

  const handleCloseReport = () => {
    setSubjectsDisabled(false);
    setCommentsDisabled(false);
    setEnteredSubjectsCovered('');
    setEnteredComments('');
    setReportDialogOpen(false);
  }

  const handleSubmit = async () => {

    try {
      const request = {
        'comment': enteredComments,
        'subjectsCovered': enteredSubjectsCovered,
        'reservationId': activeReservation.reservationId,
        'personId': user.person.id,
        'state': 2
      };

      console.log('my request is: ', request);

      await certifyAxios.post('/reservationRequest/updatePartner', request);

      handleCloseReport();

      handleSuccess();

    } catch (err) {
      handleFailure(err.message);
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
            <b>{paginatedReservations.length}</b> <b>reservas</b>
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
        {props.loading &&
              <LinearProgress color="secondary" sx={{width:"90%", mx:"2rem", my:"2rem"}}/>
        }
        {!props.loading && paginatedReservations.length === 0 ? (
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
              No se encontraron reservas
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Categoría</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Hora Reservada</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Evidencia de pago</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedReservations.map((reserv, idx) => {
                    let formattedDate = new Date(reserv.scheduleDate);
                    return (
                      <TableRow hover key={idx}>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {formatNameCapitals(reserv.subjectName)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {formatNameCapitals(reserv.personName).replace(',', '')}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography noWrap variant="h5">
                            {`${formattedDate.toLocaleDateString('es-ES')} ${formattedDate.toLocaleTimeString('es-ES')} hrs.`}
                          </Typography>
                        </TableCell>

                        {reserv.state === 2 ? (
                          <>
                            <TableCell>
                              <Chip icon={<PlaylistAddCheckIcon />} label="Dictada" variant="outlined" color="success" sx={{color: "green"}}/>
                            </TableCell>

                            {reserv.urlPayment ? 
                              <TableCell sx={{display: 'flex', justifyContent: 'center'}}>                          
                                <IconButton aria-label="delete" sx={{ color: "green" }} onClick={() => handleOpenPayment(reserv)}>
                                  <RequestQuoteIcon />
                                </IconButton>
                              </TableCell> : 
                              
                              <TableCell/>
                            }

                            <TableCell>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                color="secondary"
                                onClick={() => handleOpenReport(reserv)}
                              >Ver Reporte</Button>
                            </TableCell>
                          </>
                        ) : 
                        (
                          <>
                            <TableCell>
                              <Chip icon={<HighlightOffIcon />} label="Cancelada" color="error" variant="outlined" />
                            </TableCell>
                            {reserv.urlPayment ? 
                              <TableCell sx={{display: 'flex', justifyContent: 'center'}}>                          
                                <IconButton aria-label="delete" sx={{ color: "green" }} onClick={() => handleOpenPayment(reserv)}>
                                  <RequestQuoteIcon />
                                </IconButton>
                              </TableCell> : 
                              
                              <TableCell/>
                            }
                            <TableCell/>
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

      <Dialog
        fullWidth
        maxWidth="md"
        open={paymentDialogOpen}
        onClose={handleClosePayment}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
          align="center"
        >
          <Typography 
            variant="h3" 
            gutterBottom
          >
            Conformidad de pago
          </Typography>
        </DialogTitle>
        <DialogContent
          dividers
          sx={{
            p: 3
          }}
        >
          <Box sx={{display: 'flex', justifyContent: 'center', py: '1rem'}}>
            {activeReservation.urlPayment && 
            <img 
              style={{ height: "25rem", margin: "0", objectFit: 'cover', borderRadius:'15%'}}
              alt='confirmacion' 
              src={getNameAndUrlFromBack(activeReservation.urlPayment).urlS3 || ""}  
            />}
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="md"
        open={reportDialogOpen}
        onClose={handleCloseReport}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
          align="center"
        >
          <Typography 
            variant="h3" 
            gutterBottom
          >
            Reporte de Sesión
          </Typography>
        </DialogTitle>
        
        
        <DialogContent
          dividers
          sx={{
            p: 3
          }}
        >
          <Box sx={{ maxWidth: '100%', textAlign:'center' }}>            
            {reporteSesion && 
            <Box sx={{pb: '1rem'}}>
              <Grid sx={{'textAlign': 'left', py: '1rem'}}>
                <Typography variant="h4" component="h4" gutterBottom>
                  Resumen de la clase
                </Typography>
              </Grid>

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
                    sx={{width:'100%'}}
                    id="outlined-multiline-static"
                    label="Temas Tratados."
                    multiline
                    rows={4}
                    value={enteredSubjectsCovered || ''}
                    onChange={(e) => setEnteredSubjectsCovered(e.target.value)}
                    disabled={subjectsDisabled}
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
                    sx={{width:'100%'}}
                    id="outlined-multiline-static"
                    label="Comentario sobre la clase."
                    multiline
                    rows={4}
                    value={enteredComments || ''}
                    onChange={(e) => setEnteredComments(e.target.value)}
                    disabled={commentsDisabled}
                  />
                </Grid>
              </Grid>

              {/* <Card sx={{ py: '2rem', display: 'box', justifyContent: 'space-around' }}>
                <Grid sx={{'textAlign':'left', py: '0.5rem'}}>
                    <Typography sx={{'textAlign':'center', py: '0.5rem'}} variant="h4" component="h4" gutterBottom>
                      Temas Tratados
                    </Typography>

                    <TextField
                      sx={{width:'100%'}}
                      id="outlined-multiline-static"
                      label="Temas Tratados."
                      multiline
                      rows={4}
                      value={enteredSubjectsCovered || ''}
                      onChange={(e) => setEnteredSubjectsCovered(e.target.value)}
                      disabled={subjectsDisabled}
                    />
                </Grid>

                <Grid sx={{'textAlign':'left', py: '0.5rem', maxWidth: '30%'}}>
                  <Typography sx={{'textAlign':'center', py: '0.5rem'}} variant="h4" component="h4" gutterBottom>
                    Comentario sobre la clase
                  </Typography>

                  <TextField
                    sx={{width:'100%'}}
                    id="outlined-multiline-static"
                    label="Comentario sobre la clase."
                    multiline
                    rows={4}
                    value={enteredComments || ''}
                    onChange={(e) => setEnteredComments(e.target.value)}
                    disabled={commentsDisabled}
                    />
                </Grid>

                <Grid sx={{'textAlign':'left', py: '0.5rem', maxWidth: '30%'}}>
                  <Grid>
                    <Typography sx={{'textAlign':'center', py: '0.5rem'}} variant="h4" component="h4" gutterBottom>
                      Grabación de la clase
                    </Typography>
                    {reporteSesion.urlRecording || 'Aún no hay un link disponible'}
                  </Grid>
                </Grid>
              </Card> */}

              <Box sx={{display:'flex', justifyContent: 'end', m: '1rem'}}>
                {(!commentsDisabled || !subjectsDisabled) && <Button
                  // startIcon={
                  //   isSubmitting ? <CircularProgress size="1rem" /> : null
                  // }
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={handleSubmit}
                >
                  Enviar
                </Button>}
              </Box>
            </Box>}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

ResultsPast.propTypes = {
  reservations: PropTypes.array.isRequired,
  onPageParamsChange: PropTypes.func,
  numberOfResults: PropTypes.number
};

ResultsPast.defaultProps = {
  reservations: [],
  onPageParamsChange: () => {},
  numberOfResults: 555
};


export default ResultsPast;
