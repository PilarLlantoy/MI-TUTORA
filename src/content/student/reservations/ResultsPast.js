import { useState, useEffect } from 'react';
import ReactStars from "react-rating-stars-component";
import certifyAxios from 'src/utils/aimAxios';
import PropTypes from 'prop-types';
// import certifyAxios from 'src/utils/aimAxios';
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
  LinearProgress
} from '@mui/material';
import { useSnackbar } from 'notistack';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import {
  getNameAndUrlFromBack,
} from 'src/utils/awsConfig';
import { formatNameCapitals } from 'src/utils/training';

const ResultsPast = ( props ) => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [ page, setPage ] = useState(0);
  const [ limit, setLimit ] = useState(5);
  const [ paymentDialogOpen, setPaymentDialogOpen ] = useState(false);
  const [ enteredFeedback, setEnteredFeedback ] = useState('');
  const [ enteredStars, setEnteredStars ] = useState(0);
  const [ reservationRequestId, setReservationRequestId ] = useState();
  const [ reporteSesion, setReporteSesion ] = useState({});
  const [ reportDialogOpen, setReportDialogOpen ] = useState(false);
  const [activeReservation, setActiveReservation] = useState({});
  
  const [starsEditable, setStarsEditable] = useState(true);
  const [feedbackDisabled, setFeedbackDisabled] = useState(false);

  const paginatedReservations = props.reservations;

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

  const handleFeedbackChange = (event) => {
    setEnteredFeedback(event.target.value);
  }

  const handleStarsChange = (newRating) => {
    setEnteredStars(newRating);
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
      "clientId": user.person.id,
      "firstResult": newPage+1,
      "maxResults": limit,
      "partnerId": null,
      "type": 2
    }
    props.onPageParamsChange(reqObj);
  };

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value));
    const reqObj = {
      "clientId": user.person.id,
      "firstResult": page+1,
      "maxResults": event.target.value,
      "partnerId": null,
      "type": 2
    }
    props.onPageParamsChange(reqObj);
  };

  const handleSubmit = async () => {

    try {
      const request = {
        'feedback': enteredFeedback,
        'rating': enteredStars,
        'reservationRequestId': reservationRequestId
      };

      await certifyAxios.post('/reservationRequest/registerFeedback', request);

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

  const getClassReport = async (resId) => {
    try{
      const request = {
        'id': resId
      }

      const response = await certifyAxios.post('/reservationRequest/findReport', request);

      // console.log('getClassReport. The server says: ', response);
      setReporteSesion({
        'comment': response.data.comment,
        'partnerName': response.data.partnerName,
        'subjectsCovered': response.data.subjectsCovered,
        'urlPhotoPartner': getNameAndUrlFromBack(response.data.urlPhotoPartner).urlS3,
        'urlRecording': response.data.urlRecording
      })

      if(response.data.feedback !== null) {
        setFeedbackDisabled(true);
        setEnteredFeedback(response.data.feedback);
      }

      if(response.data.rating !== null){
        setStarsEditable(false);
        setEnteredStars(response.data.rating);
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
    setReservationRequestId(res.reservationId);
    getClassReport(res.reservationId);
  }

  const handleCloseReport = () => {
    setEnteredFeedback('');
    setEnteredStars(0);
    setStarsEditable(true);
    setFeedbackDisabled(false);
    setReportDialogOpen(false);
  }

  // hack para que se muestren las estrellas obtenidas del servicio (en caso hayan).
  const [starKeyForce, setStarKeyForce] = useState(0)
  useEffect(() => {
    setStarKeyForce(prev => prev + 1)
  }, [enteredStars])
  // fin del hack.

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
                    <TableCell>Profesora</TableCell>
                    <TableCell>Hora Reservada</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell sx={{display: 'flex', justifyContent: 'center'}}>Evidencia de pago</TableCell>
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
                          <Typography noWrap variant="h6h5">
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
            p: 2
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
          <Box sx={{ maxWidth: '100%', textAlign:'center', py: '1rem' }}>            
            {reporteSesion && 
              <Box>

                  <Grid sx={{'textAlign': 'left', py: '1rem'}}>
                    <Typography variant="h4" component="h4" gutterBottom>
                      Resumen de la clase
                    </Typography>
                  </Grid>

                  <Card sx={{ py: '2rem', display: 'flex', justifyContent: 'space-around' }}>
                    <Grid sx={{'textAlign':'left', py: '0.5rem'}}>
                      <Grid>
                        <Typography sx={{'textAlign':'center', py: '0.5rem'}} variant="h4" component="h4" gutterBottom>
                          Temas Tratados
                        </Typography>
                        {reporteSesion.subjectsCovered || 'Aún no hay temas especificados'}
                      </Grid>
                    </Grid>

                    <Grid sx={{'textAlign':'left', py: '0.5rem', maxWidth: '30%'}}>
                      <Typography sx={{'textAlign':'center', py: '0.5rem'}} variant="h4" component="h4" gutterBottom>
                        Comentario
                      </Typography>
                      {reporteSesion.comment || 'Aún no hay comentarios disponibles'}
                    </Grid>

                    <Grid sx={{'textAlign':'left', py: '0.5rem', maxWidth: '30%'}}>
                      <Grid>
                        <Typography sx={{'textAlign':'center', py: '0.5rem'}} variant="h4" component="h4" gutterBottom>
                          Grabación de la clase
                        </Typography>
                        {reporteSesion.urlRecording || 'Aún no hay un link disponible'}
                      </Grid>
                    </Grid>
                  </Card>
                
                  <Grid sx={{'textAlign': 'left', py: '1rem'}}>
                    <Typography variant="h4" component="h4" gutterBottom>
                      Su calificación sobre la profesora
                    </Typography>
                  </Grid>

                  <Card sx={{ p: '1rem', display: 'flex' }}>
                    <Grid  container spacing={3} sx={{ justifyContent:'center' }}>

                      <Grid item xs="auto" >
                        <Box sx={{p: '1rem'}}>
                          
                          <img alt='foto de la profesora' src={reporteSesion.urlPhotoPartner} width={200} height={150} style={{objectFit: 'cover', borderRadius:'15%'}}/>
                          <Typography variant="h5" component="h5" gutterBottom sx={{'textAlign':'center'}}>
                            {formatNameCapitals(reporteSesion.partnerName).replace(',', '')}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs="auto" >
                        <Box sx={{display:'flex', justifyContent: 'space-between'}}>
                          <Typography variant="h5" component="h5" gutterBottom>
                            Comentario
                          </Typography>
                          <ReactStars 
                            key={starKeyForce}
                            value={enteredStars}
                            count={5}
                            onChange={handleStarsChange}
                            size={29}
                            activeColor="#ffd700"
                            edit={starsEditable}
                          />
                        </Box>
                        <TextField
                          sx={{width:'100%'}}
                          id="outlined-multiline-static"
                          label="Déjanos tu opinión sobre la profesora."
                          multiline
                          rows={4}
                          value={enteredFeedback || ''}
                          onChange={handleFeedbackChange}
                          disabled={feedbackDisabled}
                        />
                        <Box sx={{display:'flex', justifyContent: 'end', m: '1rem'}}>
                          {starsEditable && <Button
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
                      </Grid>

                    </Grid>
                  </Card>
                </Box>
            }
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
