import { useCallback, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import useRefMounted from 'src/hooks/useRefMounted';
import certifyAxios from 'src/utils/aimAxios';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import { useNavigate } from 'react-router-dom';
import { withSnackbar } from 'notistack';


import {
  Button, Grid, Typography 
} from '@mui/material';
import TabLevel from './TabLevel';

function TrainingManagement(props) {
  
  const navigate = useNavigate();
  const isMountedRef = useRefMounted();
  const [trainings, setTrainings] = useState([])
  const [numberOfResults, setNumberOfResults] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);

  const defaultObj = {
    "firstResult": 1,
    "description": "",
    "maxResults": 10,
    "isOptional": 0,
    "isVisible": 1  
  }

  const getTrainings = useCallback(async (reqObj) => {
    try {
      const response = await certifyAxios.post(`/trainingModule/query`, reqObj);
      if (isMountedRef.current) {
        if(response.data.list.length === 0 && response.data.total > 0) {
          const lastPage = Math.ceil(response.data.total / reqObj.maxResults);
          reqObj.firstResult = lastPage;
          setPageNumber(lastPage - 1);
          getTrainings(reqObj);
        }
        else {
          setTrainings(response.data.list);
          setNumberOfResults(response.data.total);
        }
      }
    } catch (err) {
      console.error(err);
      
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.error(err.request);
      } else {
        console.error('Servicio encontró un error');
      }
      props.enqueueSnackbar("El servicio ha encontrado un error", {variant:"error"})
    }
  }, [isMountedRef])

  useEffect(() => {
    const reqObj = defaultObj;
    getTrainings(reqObj);
  }, [getTrainings]);

  const onPageParamsChange = (reqObj) => {
    if(reqObj.maxResults &&  pageSize !== reqObj.maxResults){
      setPageSize(reqObj.maxResults) // "limit" en Results.js
    }
    getTrainings(reqObj)
  }

  const deleteModuleById = async (moduleId, afterDelete) => {
    try {
      const reqObj = {
        id: moduleId
      }
      const response = await certifyAxios.post(`/trainingModule/delete`, reqObj);
      if(response.data?.message === "OK"){
        getTrainings(defaultObj)
        props.enqueueSnackbar("Módulo eliminado satisfactoriamente", {variant:"success"})
      }
    } catch (error) {
      console.error(error)
      props.enqueueSnackbar("No se ha podido eliminar el módulo. Inténtelo de nuevo", {variant:"error"})
    }
    afterDelete()
  }

  const navigateToModules = (id, isOptional) => {
    navigate('/aim/member/modules', {state:{moduleId: id, isOptional}});
  };

  return (
    <>
      <Helmet>
        <title>Capacitaciones</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="h3" component="h3" gutterBottom>
              Capacitaciones
            </Typography>
          </Grid>
          <Grid item>
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              onClick={() => navigateToModules(-1)}
              variant="contained"
              startIcon={<AddTwoToneIcon fontSize="small" />}
            >
              Nueva Capacitación
            </Button>
          </Grid>
        </Grid>
      </PageTitleWrapper>

      <Grid
        sx={{
          px: 4
        }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={4}
      >
        <Grid item xs={12}>
        <TabLevel 
          trainings={trainings} 
          navigateToModules={navigateToModules}
          onPageParamsChange={onPageParamsChange}
          numberOfResults={numberOfResults}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          deleteModuleById={deleteModuleById}
          getTrainings={getTrainings}
        />
        </Grid>
      </Grid>
      <Footer />
    </>
  )
};

export default withSnackbar(TrainingManagement);