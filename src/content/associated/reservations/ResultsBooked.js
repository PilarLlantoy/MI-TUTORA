import { useState } from 'react';
import PropTypes from 'prop-types';
import certifyAxios from 'src/utils/aimAxios';
import useAuth from 'src/hooks/useAuth';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Grid,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  // Tooltip,
  // IconButton,
  // InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableContainer,
  TableRow,
  Zoom,
  Typography,
  // styled,
  // useTheme,
  TextField,
  LinearProgress
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useSnackbar } from 'notistack';
import { 
  getNameAndUrlFromBack,
} from 'src/utils/awsConfig';
import { formatNameCapitals } from 'src/utils/training';

const ResultsBooked = ( props ) => {
  const { user } = useAuth();

  const { enqueueSnackbar } = useSnackbar();
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeReservation, setActiveReservation] = useState({});

  const paginatedReservations = props.reservations;

  const showSuccess = () => {
    enqueueSnackbar('La operación se ha realizado correctamente.', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  const showFailure = (message) => {
    enqueueSnackbar(`Hubo un error en la operación. Error: ${message}`, {
      variant: 'error',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  };

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
    const reqObj = {
      "clientId": null,
      "firstResult": newPage+1,
      "maxResults": limit,
      "partnerId": user.person.id,
      "type": 1
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
      "type": 1
    }
    props.onPageParamsChange(reqObj);
  };

  const handleOpenPayment = (res) => {
    setActiveReservation(res);
    setPaymentDialogOpen(true);
  }

  const handleClosePayment = () => {
    setPaymentDialogOpen(false);
  }

  const handleOpenRejectDialog = (res) => {
    setActiveReservation(res);
    setRejectDialogOpen(true);
  }

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setCancellationReason('');
  }

  const handleCancellationReasonChange = (e) => {
    setCancellationReason(e.target.value);
  }

  const handleSubmitCancellation = async () => {
    setIsSubmitting(true);
    try {

      const reqObj = {
        "cancelationReason": cancellationReason,
        // "endTime": "2022-11-09T03:19:49.032Z",
        "personId": user.person.id,
        "reservationId": activeReservation.reservationId,
        "startTime": activeReservation.scheduleDate,
        "state": 3,
        // "urlClass": "string",
        "urlPayment": activeReservation.urlPayment,
        // "urlRecording": "string"
      };

      // console.log('reqObj: ', reqObj)
      await certifyAxios.post('/reservationRequest/updatePartner', reqObj);

      // console.log(response.data);

      props.getReservations({
        "clientId": null,
        "firstResult": 1,
        "maxResults": 5,
        "partnerId": user.person.id,
        "type": 1
      });

      handleCloseRejectDialog();
      showSuccess();

    } catch (err) {

      showFailure(err.message);
      
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.error(err.request);
      } else {
        console.error('Some other unknown error');
      }
    }
    setIsSubmitting(false);
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
                        {reserv.urlPayment ? 
                          <TableCell sx={{display: 'flex', justifyContent: 'center'}}>                          
                            <IconButton aria-label="delete" sx={{ color: "green" }} onClick={() => handleOpenPayment(reserv)}>
                              <RequestQuoteIcon />
                            </IconButton>
                          </TableCell> : <TableCell/>
                        }
                        <TableCell>
                          <IconButton aria-label="delete" sx={{ color: "red" }} onClick={() => handleOpenRejectDialog(reserv)}>
                            <HighlightOffIcon />
                          </IconButton>
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
              style={{ height: "25rem", margin: "0"}}
              alt='confirmacion' 
              src={getNameAndUrlFromBack(activeReservation.urlPayment).urlS3 || ""}  
            />}
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={rejectDialogOpen}
        onClose={handleCloseRejectDialog}
      >
        <DialogTitle align="center">
          <Typography 
            variant="h3"
            gutterBottom
          >
            Rechazar Reserva
          </Typography>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            p: 3
          }}
        >
          <Box sx={{display:'flex', alignItems: 'center', p: 2, backgroundColor: '#FFD6D6'}}>
            <WarningAmberIcon htmlColor='red'/>
            <Typography sx={{
              px: 1,
              textAlign: 'left'
            }}
            >
              Esta cancelación será notificada al administrador de AIM. Además, tendrá que efectuar la <b>devolución del pago</b>. Un miembro de AIM se contactará contigo a la brevedad.
            </Typography>
          </Box>

          {activeReservation && <Box sx={{py: 1}}>
            <b>Detalles de la reserva:</b>
            <ul>
              <li>Cliente: {formatNameCapitals(activeReservation.personName).replace(',', '')}</li>
              <li>Tema: {formatNameCapitals(activeReservation.subjectName)}</li>
              <li>Horario solicitado: {new Date(activeReservation.scheduleDate).toLocaleDateString('es-ES')} {new Date(activeReservation.scheduleDate).toLocaleTimeString('es-ES')} hrs.</li>
            </ul>
          </Box>}
          
          <Box sx={{pb: 1}}>
            <TextField 
              margin="dense"
              required
              id="outlined-required"
              label="Motivo de la cancelación"
              value={cancellationReason} 
              onChange={handleCancellationReasonChange} 
              multiline 
              rows={4}
              fullWidth
              placeholder='Ingrese aquí sus motivos'
            />
          </Box>
          
          
          <Grid
            container
            justifyContent="center"
            margin="auto"
            item
            xs={12}
            sm={8}
            md={9}
          >
            <Button
              sx={{
                mr: 2
              }}
              type="submit"
              onClick={handleCloseRejectDialog}
              variant="outlined"
              color="error"
            >
              Cancelar
            </Button>
            <Button
              sx={{
                mr: 2
              }}
              type="submit"
              startIcon={
                isSubmitting ? <CircularProgress size="1rem" /> : null
              }
              disabled={!cancellationReason.length || isSubmitting}
              variant="contained"
              color="error"
              onClick={handleSubmitCancellation}
            >
              Rechazar reserva
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

ResultsBooked.propTypes = {
  reservations: PropTypes.array.isRequired,
  onPageParamsChange: PropTypes.func,
  numberOfResults: PropTypes.number
};

ResultsBooked.defaultProps = {
  reservations: [],
  onPageParamsChange: () => {},
  numberOfResults: 555
};

export default ResultsBooked;
