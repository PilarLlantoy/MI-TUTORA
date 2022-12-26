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
  // Zoom,
  Typography,
  // styled
  LinearProgress
} from '@mui/material';
import Chip from '@mui/material/Chip';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import IconButton from '@mui/material/IconButton';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { formatNameCapitals } from 'src/utils/training';

const ResultsPending = ( props ) => {
  const { user } = useAuth();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeReservation, setActiveReservation] = useState();

  const paginatedReservations = props.reservations;

  // const handleOpenAcceptDialog = (res) => {
  //   setActiveReservation(res);
  //   setAcceptDialogOpen(true);
  // }

  const handleOpenRejectDialog = (res) => {
    setActiveReservation(res);
    setRejectDialogOpen(true);
  }

  const handleCloseAcceptDialog = () => {
    setAcceptDialogOpen(false);
  }

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setCancellationReason('');
  }

  const handlePageChange = (_event, newPage) => {
    setPage(newPage);
    const reqObj = {
      "clientId": user.person.id,
      "firstResult": newPage+1,
      "maxResults": limit,
      "partnerId": null,
      "type": 0
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
      "type": 0
    }
    props.onPageParamsChange(reqObj);
  };

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

      // console.log('Active reservation: ', activeReservation)
      // console.log('cancellationReason: ', cancellationReason)
      console.log('reqObj: ', reqObj)
      const response = await certifyAxios.post('/reservationRequest/updateClient', reqObj);

      console.log(response.data);

      props.getReservations({
        "clientId": user.person.id,
        "firstResult": 1,
        "maxResults": 5,
        "partnerId": null,
        "type": 0
      });

      handleCloseRejectDialog();

    } catch (err) {
      
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

  const handleSubmitAcceptance = async () => {
    setIsSubmitting(true);
    try {

      const reqObj = {
        "cancelationReason": '',
        // "endTime": "2022-11-09T03:19:49.032Z",
        "personId": user.person.id,
        "reservationId": activeReservation.reservationId,
        "startTime": activeReservation.scheduleDate,
        "state": 1,
        // "urlClass": "string",
        "urlPayment": activeReservation.urlPayment,
        // "urlRecording": "string"
      };

      // console.log('Active reservation: ', activeReservation)
      // console.log('cancellationReason: ', cancellationReason)
      console.log('reqObj: ', reqObj)
      const response = await certifyAxios.post('/reservationRequest/updatePartner', reqObj);

      console.log(response.data);

      props.getReservations({
        "clientId": user.person.id,
        "firstResult": 1,
        "maxResults": 5,
        "partnerId": null,
        "type": 0
      });

      handleCloseRejectDialog();

    } catch (err) {
      
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
                    <TableCell>Tema</TableCell>
                    <TableCell>Profesora</TableCell>
                    <TableCell>Hora Solicitada</TableCell>
                    <TableCell>Estado</TableCell>
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
                        <TableCell>
                          <Chip icon={<PermIdentityIcon />} label="Pendiente"  variant="filled" />
                        </TableCell>
                        <TableCell>
                          {/* <IconButton aria-label="confirm" sx={{ color: "green" }} onClick={() => handleOpenAcceptDialog(reserv)}>
                            <CheckCircleOutlineIcon />
                          </IconButton> */}
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
        maxWidth="sm"
        open={acceptDialogOpen}
        onClose={handleCloseAcceptDialog}
      >
        <DialogTitle align="center">
          <Typography 
            variant="h3"
            gutterBottom
          >
            Agendar Reserva
          </Typography>
        </DialogTitle>
        
        
        <DialogContent
          dividers
          sx={{
            p: 3
          }}
        >
          <Typography sx={{
            pb: 3,
            textAlign: 'center'
          }}
            gutterBottom
          >
            ¿Segura que desea aceptar la petición de reserva de clase?
          </Typography> 
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
              onClick={handleCloseAcceptDialog}
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
              disabled={isSubmitting}
              variant="contained"
              color="secondary"
              onClick={handleSubmitAcceptance}
            >
              Aceptar reserva
            </Button>
          </Grid>
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
            Cancelar Reserva
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
              Esta cancelación será notificada al administrador de AIM. <b>En caso el administrador lo considere pertinente, su cuenta puede ser bloqueada.</b>
            </Typography>
          </Box>

          <Box sx={{py: 1}}>
            ¿Seguro que desea cancelar la reserva de clase?
          </Box> 

          <Box sx={{py: 1}}>
            <b>Recuerde:</b> Solo se puede cancelar una clase agendada con 2 horas de anticipación
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
              Atrás
            </Button>
            <Button
              sx={{
                mr: 2
              }}
              type="submit"
              startIcon={
                isSubmitting ? <CircularProgress size="1rem" /> : null
              }
              disabled={isSubmitting}
              variant="contained"
              color="error"
              onClick={handleSubmitCancellation}
            >
              Cancelar reserva
            </Button>
          </Grid>
        </DialogContent>
      </Dialog>
    </>
  );
};

ResultsPending.propTypes = {
  reservations: PropTypes.array.isRequired,
  onPageParamsChange: PropTypes.func,
  numberOfResults: PropTypes.number
};

ResultsPending.defaultProps = {
  reservations: [],
  onPageParamsChange: () => {},
  numberOfResults: 555
};

export default ResultsPending;
