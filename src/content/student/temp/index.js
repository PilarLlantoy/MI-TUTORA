
/* 
  Este componente pertenece a la página de registro de feedback por parte de un cliente a una asociada inmediatamente después de acabada una clase.
*/

import 'react-quill/dist/quill.snow.css';
import { useEffect, useState,
  // useCallback 
} from 'react';
import ReactStars from "react-rating-stars-component";
import certifyAxios from 'src/utils/aimAxios';

import { Helmet } from 'react-helmet-async';
import {
  Grid,
  Typography,
  Box,
  Card,
  TextField,
  Button,
  Zoom,
} from '@mui/material';
import { useSnackbar } from 'notistack';
import {getNameAndUrlFromBack} from 'src/utils/awsConfig';
import { useNavigate } from 'react-router-dom';


function FeedbackPostClass() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [ enteredFeedback, setEnteredFeedback ] = useState('');
  const [ enteredStars, setEnteredStars ] = useState(0);
  const [ reservationRequestId, setReservationRequestId ] = useState();
  const [ reporteSesion, setReporteSesion ] = useState({});

  const [starsEditable, setStarsEditable] = useState(true);
  const [feedbackDisabled, setFeedbackDisabled] = useState(false);

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

  const handleSubmit = async () => {

    try {
      const request = {
        'feedback': enteredFeedback,
        'rating': enteredStars,
        'reservationRequestId': reservationRequestId
      };
      
      await certifyAxios.post('/reservationRequest/registerFeedback', request);

      navigate('/aim/student/classes');

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

  // On first render, obtenemos el id de la clase desde el url
  useEffect(() => {
    const pathname = window.location.pathname;
    const resId = parseInt(pathname.split("/")[4]);
    setReservationRequestId(resId);
    getClassReport(resId);
  }, [])


  // hack para que se muestren las estrellas obtenidas del servicio (en caso hayan).
  const [starKeyForce, setStarKeyForce] = useState(0)
  useEffect(() => {
    setStarKeyForce(prev => prev + 1)
  }, [enteredStars])
  // fin del hack.

  return (
    <>
      <Helmet>
        <title>Reporte de Sesión</title>
      </Helmet>

      <Box sx={{ maxWidth: '100%', textAlign:'center', p: '2rem' }}>
          <Typography variant="h3" component="h3" gutterBottom>
            Reporte de Sesión
          </Typography>
          
          {/* <Box sx={{py: '1rem'}}>

            <Card sx={{ py: '2rem', display: 'flex', justifyContent: 'space-around' }}>
              <Grid sx={{'textAlign':'left', py: '0.5rem'}}>
                <Grid>
                  <Typography sx={{'textAlign':'center', py: '0.5rem'}} variant="h4" component="h4" gutterBottom>
                    Temas Tratados
                  </Typography>
                  {reporteSesion.subjectsCovered}
                </Grid>
              </Grid>

              <Grid sx={{'textAlign':'left', py: '0.5rem', maxWidth: '30%'}}>
                <Typography sx={{'textAlign':'center', py: '0.5rem'}} variant="h4" component="h4" gutterBottom>
                  Comentario
                </Typography>
                {reporteSesion.comment}
              </Grid>

              <Grid sx={{'textAlign':'left', py: '0.5rem', maxWidth: '30%'}}>
                <Grid>
                  <Typography sx={{'textAlign':'center', py: '0.5rem'}} variant="h4" component="h4" gutterBottom>
                    Grabación de la clase
                  </Typography>
                  {reporteSesion.urlRecording}
                </Grid>
              </Grid>
            </Card>
          </Box> */}


          <Box sx={{py: '1rem'}}>
            <Grid sx={{'textAlign': 'left', py: '0.5rem'}}>
              <Typography variant="h4" component="h4" gutterBottom>
                Califica a tu profesora
              </Typography>
            </Grid>

            <Card sx={{ p: '2rem', display: 'flex' }}>
              <Grid  container spacing={3} sx={{ justifyContent:'center' }}>

                <Grid item xs="auto" >
                  <Box sx={{p: '1rem'}}>
                    <img alt='foto de la profesora' src={reporteSesion.urlPhotoPartner} width={200} height={150}/>
                    <Typography variant="h5" component="h5" gutterBottom sx={{'textAlign':'center'}}>
                      {reporteSesion.partnerName}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs="auto" sx={{minWidth: '50vw', width: '50vw'}}>
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

      </Box>
    </>
  );
}

export default FeedbackPostClass;
