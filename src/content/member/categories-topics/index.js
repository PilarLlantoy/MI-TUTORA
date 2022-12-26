import { useState, useEffect, useCallback } from 'react';
// import axios from 'src/utils/axios';
// import { backendURL } from 'src/config';
import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import {
  Grid,
  Typography,
  Button
} from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import useRefMounted from 'src/hooks/useRefMounted';
import certifyAxios from 'src/utils/aimAxios';

import Results from './Results';
// import requestsJSON from './requests.json';

function ManagementCategories(props) {
  const isMountedRef = useRefMounted();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [numberOfResults, setNumberOfResults] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  // const [editMode, setEditMode] = useState(false);
  // const [add,setAdd] = useState(false);

  //
  /* const getCategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/associates');

      if (isMountedRef.current) {
        setCategories(response.data.categories);
        console.log(response.data.categories);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]); */ 

  const handleCreateProjectOpen = () => {
    if(!openEdit){
    // setEditMode(false);
    setOpen(true);
    }
  };

  const handleEditProjectOpen = () => {
    // setEditMode(false);
    setOpenEdit(true);
  };

  const handleEditProjectClose = () => {
    // setEditMode(false);
    setOpenEdit(false);
  };

  const handleCreateProjectClose = () => {
    setOpen(false);
    // console.log(open);
  };

  /* useEffect(() => {
    // getCategories();
    setCategories(requestsJSON);
  }, [/* getCategories  ]); 
  */


  // GET CATEGORIES:

  
  const getCategories = useCallback(async (reqObj) => {
    try {
      const response = await certifyAxios.post(`/category/query`, reqObj);
      console.log(response);
      if (isMountedRef.current) {
        if(response.data.list.length === 0 && response.data.total > 0) {
          const lastPage = Math.ceil(response.data.total / reqObj.maxResults);
          reqObj.firstResult = lastPage;
          setPageNumber(lastPage - 1);
          getCategories(reqObj);
        }
        else {
          setCategories(response.data.list);
          // console.log(categories);
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
    const reqObj = {
      "firstResult": 1,
      "description": "name",
      "maxResults": 5,
    } 
    getCategories(reqObj);
  }, [getCategories]); 
  
  const onPageParamsChange = (reqObj) => {
    if(reqObj.maxResults &&  pageSize !== reqObj.maxResults){
      setPageSize(reqObj.maxResults) // "limit" en Results.js
    }
    getCategories(reqObj)
  }

  return (
    <>
      <Helmet>
        <title>Gestor de categorías</title>
      </Helmet>
      <PageTitleWrapper>
        { // <PageHeader /* getCategories={getCategories} */ /> 
        }
        <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Gestor de categorías
          </Typography>
        </Grid>
        <Grid item>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 },
              bgcolor : '#0077FF',
              color: '#FFFFFF'
            }}
            onClick={handleCreateProjectOpen}
            variant="contained"
            startIcon={<AddTwoToneIcon fontSize="small" 
            />}
          >
            Nueva Categoría
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
          <Results 
          categories={categories} 
          openCreate={open} 
          handleCreateProjectClose={handleCreateProjectClose}
          onPageParamsChange={onPageParamsChange}
          numberOfResults={numberOfResults}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          getCategories={getCategories}
          openEdit={openEdit}
          setOpenEdit={handleEditProjectOpen}
          setCloseEdit={handleEditProjectClose}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementCategories;
