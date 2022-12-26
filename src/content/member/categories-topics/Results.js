import { useState,forwardRef } from 'react';
// import * as Yup from 'yup';
// import { Formik } from 'formik';
import { formatNameCapitals } from 'src/utils/training';

import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import certifyAxios from 'src/utils/aimAxios';
import {
  Box,
  Card,
  Grid,
  Divider,
  InputAdornment,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  // TableHead,
  TablePagination,
  TableContainer,
  // CircularProgress,
  TableRow,
  // Zoom,
  Button,
  Typography,
  styled,
  Dialog,
  useTheme,
  TextField,
  Slide,
  IconButton
} from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
// import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
// import AddIcon from '@mui/icons-material/Add';
import { useTranslation } from 'react-i18next';
import InsertCategorie from './InsertCategorie';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import StarIcon from '@mui/icons-material/Star';

const DialogWrapper = styled(Dialog)(
  () => `
      .MuiDialog-paper {
        overflow: visible;
      }
`
);

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

 const IconButtonWrapper = styled(IconButton)(
   ({ theme }) => `
     transition: ${theme.transitions.create(['transform', 'background'])};
     transform: scale(1);
     transform-origin: center;

     &:hover {
         transform: scale(1.1);
     }
   `
 );

/* const applyFilters = (categories, query, filters) => {
  return categories.filter((categories) => {
    let matches = true;

    if (query) {
      const properties = ['name'];
      let containsQuery = false;

      properties.forEach((property) => {
        if (categories[property].toLowerCase().includes(query.toLowerCase())) {
          containsQuery = true;
        }
      });

      if (filters.status && categories.status !== filters.status) {
        matches = false;
      }

      if (!containsQuery) {
        matches = false;
      }
    }

    Object.keys(filters).forEach((key) => {
      const value = filters[key];

      if (value && categories[key] !== value) {
        matches = false;
      }
    });

    return matches;
  });
};

const applyPagination = (categories, page, limit) => {
  return categories.slice(page * limit, page * limit + limit);
}; */


const Results = ({ categories, openCreate, handleCreateProjectClose,onPageParamsChange,numberOfResults,pageNumber,setPageNumber,getCategories,openEdit,setOpenEdit,setCloseEdit}) => {
  // const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [query, setQuery] = useState('');
  // const [close, setClose] = useState(false);
  // const [dataTopics, setDataTopics] = useState([]);
  const { t } = useTranslation();
  // const [addRow, setAddRow] = useState(false);
  const [selectedCategorie, setSelectedCategorie] = useState({
    "idCategory" : '',
    "name":'',
    "subjects":[],
    "id":[]
  });
  // const [open, setOpen] = useState(false);
  const theme = useTheme();
  /* const [filters] = useState({
    status: null
  });  */
  const { enqueueSnackbar } = useSnackbar();

  // const { user } = useAuth();

  /* const registerCategories = async (_values) => {
    console.log('values', _values);
    const {
      categorie,
      topics
    } = _values;
    await axios.post('/api/associated/register', {
      categorie,
      topics
    });
  }; */

  const [openConfirmDelete, setOpenConfirmDelete] = useState(false);
  const [toDelete,setToDelete] = useState({
    "id":'',
    "idSubjects":[]
  });

  const handleConfirmDelete = (idCat,idsEdits) => {
    setOpenConfirmDelete(true);
    /* setToDelete({
      id:idCat,
      idSubjects:idsEdits
    }); */
    console.log("CONFIRM DELETE....");
    console.log(idCat);
    console.log(idsEdits);
    // console.log(toDelete.idSubjects.length);
  };

  const closeConfirmDelete = () => {
    setOpenConfirmDelete(false);
  };

  const deleteSubjects = async(requestS) => {
    try{
      console.log(" DELETE SUBJECTS....");
      const responseSub = await certifyAxios.post('/category/subject/find', requestS);
      console.log(responseSub);
    }catch (err) {
      console.error(err);
      
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.error(err.request);
      } else {
        console.error('Servicio encontró un error');
      }
      enqueueSnackbar("El servicio ha encontrado un error", {variant:"error"})
    }
  }

  const handleDeleteCompleted = async(toDelete) => {
    try{
      console.log("COMPLETE DELETE....");
      const request = {
        "id": toDelete.id
      }
      const response = await certifyAxios.post('/category/delete', request);
      console.log(response);

      if(response.status === 200){

        let i = 0;
        while(i<toDelete.idSubjects.length){
          const requestS = {
            "id": toDelete.idSubjects[i]
          }
          deleteSubjects(requestS);
          i+=1;
        }
      }

      setOpenConfirmDelete(false);
      setCloseEdit();
      handleChangeAdd();
      setSelectedCategorie({
        "idCategory" : '',
        "name":'',
        "subjects":[],
        "id":[]
      });
      setToDelete({
        "id":'',
        "idSubjects":[]
      });
    }catch (err) {
      console.error(err);
      
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.error(err.request);
      } else {
        console.error('Servicio encontró un error');
      }
      enqueueSnackbar("El servicio ha encontrado un error", {variant:"error"})
    }
  } 

  /* const handleSuccessBox = () => {
    enqueueSnackbar('Se ha registrado una nueva categoría satisfactoriamente', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });

    setOpenEdit(false);
  }; */

  const handleQueryChange = (event) => {
    /* event.persist();
    setQuery(event.target.value); */

    event.persist();
    setQuery(event.target.value);
    if(event?.target?.value && event.target.value.length >= 3){
      setPageNumber(0);
      const reqObj = {
        "firstResult": 1,
        "description": event.target.value,
        "maxResults": limit,
      };
      onPageParamsChange(reqObj);
    }
  }; 

  const handlePageChange = (_event, newPage) => {
    // setPage(newPage);

    setPageNumber(newPage);

    const reqObj = {
      "firstResult": newPage + 1,
      "description": "",
      "maxResults": limit,
    };

    onPageParamsChange(reqObj) 
  };

  const handleChangeAdd = () => {
    setPageNumber(0)
    const reqObj = {
      "firstResult": 1,
      "description": "",
      "maxResults": limit,
    } 

    onPageParamsChange(reqObj);
  }

  const handleLimitChange = (event) => {
   //  setLimit(parseInt(event.target.value));

    setLimit(parseInt(event.target.value));
    setPageNumber(0) // Retorna a la pagina 1 cuando cambia de limit

    const reqObj = {
      "firstResult": 1,
      "description": "",
      "maxResults": event.target.value,
    } 

    onPageParamsChange(reqObj);
  };

  /* const handleCloseCreate = () =>{
    // setClose(true);
    openCreate = false;
  } */

   const handleOpenBox = async(categorie) => {

    try {
      if(!openCreate){
        // console.log("AQUIIII CATT  : ", selectedCategorie);
      // setOpenEdit(true);
      // console.log(categorie);
      const request = {
        "id": categorie.categoryId
      }

      const response = await certifyAxios.post('/category/find', request);
      console.log(response.data.subjects);

      const subj = [];
      const ids = [];

      // console.log(response.data.subjects.length);
      let i = 0;

      while(i<response.data.subjects.length){
        // console.log(response.data.subjects[i]);
        subj.push({"name":response.data.subjects[i].name,
      "urlPhoto":response.data.subjects[i].urlPhoto});
        ids.push(response.data.subjects[i].subjectId);
        i += 1;
      }

      // console.log(subj);
      // console.log(ids);

      setToDelete({
        "id":categorie.categoryId,
        "idSubjects":ids
      });

      const cat = {
        "idCategory" : categorie.categoryId,
        "name" : categorie.name,
        "subjects" : subj,
        "id" : ids
      };

      // console.log("AQUIIII: ", cat);
      setSelectedCategorie(cat);
      setOpenEdit();
      // console.log(openEdit);
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
      enqueueSnackbar("El servicio ha encontrado un error", {variant:"error"})
    }
  }; 

  const handleCloseBox = () => {
    setCloseEdit();
    // setEditMode(false);
    setSelectedCategorie({
      "idCategory" : '',
      "name":'',
      "subjects":[],
      "id":[]
    });
  };

  const handleCloseCreate = () => {
    handleCreateProjectClose();
  }

  // const filteredCategories = applyFilters(categories, query, filters);
  // const paginatedCategories = applyPagination(filteredCategories, pageNumber, limit);
  const paginatedCategories = categories;

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
                placeholder="Busque por categoría"
                value={query}
                fullWidth
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Card
         style={{
          display:"flex",
          // alignItems:"center",
          // justifyContent:"center"
        }}
      >
        <Box
          width="40%"
          height="100%">
        <Box
          p={2}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box>
            <Typography component="span" variant="subtitle1"
            sx={{
              color:'black',
              fontSize: '16px',
              fontWeight: 'bold'
            }}>
              Categoría
            </Typography>
          </Box>
        </Box>
        <Divider />

        { paginatedCategories.length === 0 ? (
          <>
            <Typography
              sx={{
                py: 10
              }}
              variant="h4"
              fontWeight="normal"
              color="text.secondary"
              align="center"
            >
              No existen categorías registradas
            </Typography>
          </>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableBody>
                  {paginatedCategories.map((categories, idx) => {
                    return (
                      <TableRow hover key={idx} 
                      sx={{
                        // height:"50 px"
                      }}>
                        <TableCell>
                          <Typography noWrap variant="h6"
                          sx={{
                            color:'black',
                            pl: '40px',
                            fontSize: '14px'
                          }}>
                            {formatNameCapitals(categories.name)}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <TableCell
                            sx={{
                              whiteSpace: 'nowrap',
                              display:'block',
                              align: 'left',
                              border:0
                            }}
                          >
                            <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'row-reverse'
                            }}>
                              <Tooltip title="Ver Más" arrow
                              >
                                <IconButtonWrapper
                                  sx={{
                                    ml: 1,
                                    // backgroundColor: `${theme.colors.info.lighter}`,
                                    color: 'black', // `${theme.colors.info.main}`,
                                    transition: `${theme.transitions.create([
                                      'all'
                                    ])}`,

                                    '&:hover': {
                                      // backgroundColor: `${theme.colors.info.main}`,
                                      color: `${theme.palette.getContrastText(
                                        theme.colors.info.main
                                      )}`
                                    }
                                  }}
                                  onClick={() => handleOpenBox(categories)}
                                >
                                  <ArrowForwardIosIcon fontSize="small" />
                                </IconButtonWrapper>
                              </Tooltip>
                            </Box>
                          </TableCell>
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
                count={numberOfResults}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleLimitChange}
                page={pageNumber}
                rowsPerPage={limit}
                rowsPerPageOptions={[5, 10, 15]}
              />
            </Box>
          </>
        )}
        </Box>

        <Divider orientation="vertical" flexItem />
        
        <Box
          width="60%"
          height="100%"
        > 
        
          { openCreate === true || openEdit === true ? (
            <>
            <InsertCategorie 
            handleCloseBox={handleCloseCreate} 
            handleCloseEdit={handleCloseBox}
            selectedCategorie={selectedCategorie}
            getCategories={getCategories} 
            handleChangeAdd={handleChangeAdd}
            openEdit={openEdit}
            openCreate={openCreate}
            handleConfirmDelete={handleConfirmDelete}
            />
            </>
          ) : (
          <>
          <Box
          p={2}>
            <Typography 
            component="span" 
            variant="subtitle1"
            textAlign = "center"
            width="100%">
              Seleccione una categoría...
            </Typography>
            </Box>
          </>
          )}

        </Box>
      </Card>

      <DialogWrapper
        open={openConfirmDelete}
        // maxWidth="30%"
        // fullWidth
        TransitionComponent={Transition}
        keepMounted
        onClose={closeConfirmDelete}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          width="500px"
          p={3}
        >

          <Typography
          width="100%"
            align="left"
            sx={{
              // pt: 4,
              // px: 6
            }}
            variant="h3"
          >
            {t('Eliminar categoría')}
          </Typography>

          <Typography
            width="100%"
            align="left"
            sx={{
              pt: 3,
              pb: 3,
              // px: 6
            }}
            fontWeight="normal"
            color="text.secondary"
            variant="h4"
          >
            {t("¿Seguro que desea eliminar la categoría?")}
          </Typography>
            <Grid
            sx={{
              display: 'flex',
              flexDirection: 'row-reverse',
              // mb: `${theme.spacing(3)}`
            }}
            container
            margin="auto"
            item
            xs={12}>
          <Box>
            <Button
              variant="outlined"
              size="large"
              sx={{  
                mx: 1,
                color:"red",
                mr: 2,
                borderColor: "red",
                '&:hover':{
                  color:"gray",
                  borderColor:"gray"
                }
              }}
              onClick={closeConfirmDelete}
            >
              {t('Cancelar')}
            </Button>
            <Button
              color="secondary"
              variant="outlined"
              onClick={() => handleDeleteCompleted(toDelete)}
              size="large"
              sx={{
                mx: 1,
                px: 3,
                  '&:hover':{
                    color:"gray",
                    borderColor:"gray"
                  }
              }}
            >
              {t('Aceptar')}
            </Button>
          </Box>
          </Grid>
        </Box>
      </DialogWrapper>
    </>
  );
};

Results.propTypes = {
  categories: PropTypes.array.isRequired
};

Results.defaultProps = {
  categories: []
};

export default Results;
