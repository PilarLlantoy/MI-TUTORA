import { useState } from 'react';
import PropTypes from 'prop-types';
import certifyAxios from 'src/utils/aimAxios';
import useAuth from 'src/hooks/useAuth';
import DropzoneAIM from 'src/components/DropzoneAIM';
import { useDropzone } from 'react-dropzone';
import {
  Alert,
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
  useTheme,
  LinearProgress
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useSnackbar } from 'notistack';
import DeleteIcon from '@mui/icons-material/Delete';
import { FileUpload } from '@mui/icons-material';
import { 
  configS3, 
  createBackUrl, 
  getNewNameWithExtension, 
  renameFile,
  getNameAndUrlFromBack,
} from 'src/utils/awsConfig';
import { uploadFile } from 'react-s3';
import { formatNameCapitals } from 'src/utils/training';

export const uploadFileHandle = async (file, newFileName) => {
  if(file !== null){
      // Renombrar el archivo para que sea unico pls y guardalo en el s3
      const nombreOriginal = file.name
      const nuevoNombre = getNewNameWithExtension(newFileName, nombreOriginal)
      const nuevoArchivoRenombrado = renameFile(file, nuevoNombre)
      console.log("archivo renombrado: ", nuevoArchivoRenombrado)
      try {
          const response = await uploadFile(nuevoArchivoRenombrado, configS3)
          if(response){
              console.log("UPLOAD RESPONSE: ", response)
              return createBackUrl(nombreOriginal, response.location) 
          }
      } catch (err) {
          console.error("UPLOAD ERROR", err)
          return ""    
      }
  } else {
      return ""
  }
  return ""
}

const ResultsBooked = ( props ) => {
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [uploadPaymentDialogOpen, setUploadPaymentDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeReservation, setActiveReservation] = useState({});
  const [paymentFile, setPaymentFile] = useState({});
  const theme = useTheme();

  const paginatedReservations = props.reservations;

  const {
    isDragActive: isDragAcceptPayment,
    isDragAccept: isDragActivePayment,
    isDragReject: isDragRejectPayment,
    getRootProps: getRootPayment,
    getInputProps: getInputPayment
  } = useDropzone({
    accept: 'image/jpeg, image/png',
    maxFiles: 1,
    onDrop: (acceptedFile) => {
      if (acceptedFile[0] !== undefined)
        setPaymentFile(
          Object.assign(acceptedFile[0], {
            preview: URL.createObjectURL(acceptedFile[0])
          })
        );
    }
  });

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
      "clientId": user.person.id,
      "firstResult": newPage+1,
      "maxResults": limit,
      "partnerId": null,
      "type": 1
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
      "type": 1
    }
    props.onPageParamsChange(reqObj);
  };

  const handleOpenPayment = (res) => {
    setActiveReservation(res);
    setPaymentDialogOpen(true);
  }

  const handleOpenUploadPayment = (res) => {
    setActiveReservation(res);
    setUploadPaymentDialogOpen(true);
  }

  const handleClosePayment = () => {
    setPaymentDialogOpen(false);
  }

  const handleCloseUploadPayment = () => {
    setPaymentFile({});
    setUploadPaymentDialogOpen(false);
  }

  const handleOpenRejectDialog = (res) => {
    setActiveReservation(res);
    setRejectDialogOpen(true);
  }

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
    setCancellationReason('');
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

      console.log('reqObj: ', reqObj)
      const response = await certifyAxios.post('/reservationRequest/updateClient', reqObj);

      console.log(response.data);

      props.getReservations({
        "clientId": user.person.id,
        "firstResult": 1,
        "maxResults": 5,
        "partnerId": null,
        "type": 1
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

  const  generateRandomString = (num) => {     
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';     
    let result1= '';     const charactersLength = characters.length;     
    for ( let i = 0; i < num; i++ ) {         
      result1 += characters.charAt(Math.floor(Math.random() * charactersLength));     
    }      return result1; 
  }

  const uploadPaymentFile = async (selectedFile) => {
    const nombreEnS3 = selectedFile.name.concat(generateRandomString(7));
    const urlToSave = await uploadFileHandle(selectedFile, nombreEnS3)
    return urlToSave;
  }

  const handleSubmitPayment = async () => {
    console.log('current reservation: ', activeReservation);
    setIsSubmitting(true);
    try {

      const newPaymentUrl = await uploadPaymentFile(paymentFile);

      const reqObj = {
        // "endTime": "2022-11-09T03:19:49.032Z",
        "personId": user.person.id,
        "reservationId": activeReservation.reservationId,
        // "urlClass": "string",
        "urlPayment": newPaymentUrl,
        // "urlRecording": "string"
      };

      await certifyAxios.post('/reservationRequest/updateClient', reqObj);

      showSuccess();

      props.getReservations({
        "clientId": user.person.id,
        "firstResult": 1,
        "maxResults": 5,
        "partnerId": null,
        "type": 1
      });

      handleCloseUploadPayment();
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
                    <TableCell>Profesora</TableCell>
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
                          </TableCell> : 
                          
                          <TableCell>
                            <Button variant="outlined" size="small" color="secondary" startIcon={<FileUpload/>} onClick={() => handleOpenUploadPayment(reserv)}>
                              Subir Confirm. Pago
                            </Button>
                          </TableCell>
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
        maxWidth="md"
        open={uploadPaymentDialogOpen}
        onClose={handleCloseUploadPayment}
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
            Sube la confirmación del pago realizado por la clase
          </Typography>
        </DialogTitle>
        
        <DialogContent
          dividers
          sx={{
            p: 3
          }}
        >
          <Box>
            <Grid
              sx={{
                  mt: `${theme.spacing(1)}`,
                  mb: `${theme.spacing(3)}`,
                  mr:`${theme.spacing(1)}`,
              }}
              item
              xs={12}
              sm={12}
              md={12}
            >
              {!paymentFile.preview && <DropzoneAIM
                isDragAccept={isDragAcceptPayment}
                isDragActive={isDragActivePayment}
                isDragReject={isDragRejectPayment}
                getInputProps={getInputPayment}
                getRootProps={getRootPayment}
                acceptText=".jpeg .jpg .png"
                files={paymentFile}
                setNewFiles={setPaymentFile}
              />}
              <div style={{display: "flex", flexDirection:"column", paddingLeft: '2rem'}}>
                {paymentFile.preview && (
                  <>
                    <Alert
                      sx={{
                        py: 0,
                        mt: 2
                      }}
                      severity="success"
                    >
                      Has cargado el archivo exitosamente.
                    </Alert>
                    <Divider
                      sx={{
                        mt: 2
                      }}
                    />
                    
                    <div style={{position:"relative", display: "flex", flexDirection:"column", alignItems:"center"}}>
                      <IconButton aria-label="delete" color="error" onClick={() => setPaymentFile({})}>
                        <DeleteIcon />
                      </IconButton>
                      <img
                        style={{ height: "20rem", margin: "0"}}
                        src={paymentFile.preview}
                        alt="Foto"
                      />
                    </div>
                  </>)
                }
              </div>
            </Grid>
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
              onClick={handleCloseUploadPayment}
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
              disabled={!paymentFile}
              variant="contained"
              color="secondary"
              onClick={handleSubmitPayment}
              startIcon={
                isSubmitting ? <CircularProgress size="1rem" /> : null
              }
            >
              Subir confirm. pago
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
              Esta cancelación será notificada al administrador de AIM. En caso el administrador lo considere, su cuenta puede ser <b>bloqueada</b>.
            </Typography>
          </Box>

          <Box sx={{py: 1}}>
            ¿Seguro(a) que desea cancelar la reserva de clase?
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

ResultsBooked.propTypes = {
  reservations: PropTypes.array.isRequired,
  onPageParamsChange: PropTypes.func,
  numberOfResults: PropTypes.number,
  getReservations: PropTypes.func
};

ResultsBooked.defaultProps = {
  reservations: [],
  onPageParamsChange: () => {},
  numberOfResults: 555,
  getReservations: () => {}
};

export default ResultsBooked;
