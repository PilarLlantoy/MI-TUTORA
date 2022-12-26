import React,{useState} from 'react';
import * as Yup from 'yup';
import { Formik,FieldArray, Field} from 'formik';
// import PropTypes from 'prop-types';
// import axios from 'src/utils/axios';
import certifyAxios from 'src/utils/aimAxios';
import { useSnackbar } from 'notistack';
import {
  Box,
  // Card,
  Grid,
  Divider,
  // Modal,
  // InputAdornment,
  // Tooltip,
  Table,
  TableBody,
  TableCell,
  // TableHead,
  // TablePagination,
  TableContainer,
  CircularProgress,
  TableRow,
  Zoom,
  Button,
  Typography,
  // styled,
  // Dialog,
  useTheme,
  TextField,
  // Slide,
  IconButton
} from '@mui/material';
// import useAuth from 'src/hooks/useAuth';
import AddIcon from '@mui/icons-material/Add';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import { formatNameCapitals } from 'src/utils/training';
// import { useTranslation } from 'react-i18next';


export default function InsertCategorie(props)  {
const theme = useTheme();

const [idCat,setIdCat] = useState(props.selectedCategorie.idCategory);
const [cat,setCat] = useState(props.selectedCategorie.name);

// LOS TEMAS POR DEFECTO QUE TIENE UNA CATEGORIA EN MODO EDIT:

const [subj,setSubj] = useState(props.selectedCategorie.subjects);
// const [idSubj,setIdSubj] = useState(idsEdits);


// PARA ELIMINAR ESTADOS O INSERTAR EN DISABLE Y DELETE: 
const [idsEdits,setIdsEdits] = useState(props.selectedCategorie.id);
// const [subjsEdits,setSubjsEdits] = useState(subj);

const [disable,setDisable] = useState(subj.map(() => true
  ));

const [subjsDelete, setSubjsDelete] = useState([]);
// console.log(idCat);
// console.log("ID EDITS:",idsEdits);
// console.log(subjsEdits);
// console.log(disable);
// console.log(idSubj);
// console.log(subjsDelete);
// const [open, setOpen] = useState(false);
const { enqueueSnackbar } = useSnackbar();

const disableChange = (index) => {
  const temp = [...disable];
  temp[index] = false
  setDisable(temp);
  // console.log(disable);
};

const handleSuccessBox = () => {
  if(props.openEdit){
    enqueueSnackbar('Se ha actualizado la categoría satisfactoriamente', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      TransitionComponent: Zoom
    });
  }
  else{
  enqueueSnackbar('Se ha registrado una nueva categoría satisfactoriamente', {
    variant: 'success',
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right'
    },
    TransitionComponent: Zoom
  });
}

  // setOpen(false);
};

/* const handleClose = () => {
  props.handleCloseBox();
} */

/* const addTopic = () =>{
  // console.log(value);
  const temp = [...temas];
  temp.push("");
  setTemas(temp);
  console.log(temas);
} */

/* const deleteTopic = (id)=>{
  const temp = [...temas];
  temp.splice(id,1);
  setTemas(temp);
} */

/* const handleTema = (topic,id)=>{
  const temp = [...temas];
  temp[id] = topic;
  setTemas(temp);
  return topic;
} */

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

const updateSubjects = async(requestU) => {
  try{
    console.log(" UPDATE SUBJECTS....");
    const responseSub = await certifyAxios.post('/category/subject/update', requestU);
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

const registerSubjects = async(requestU) => {
  try{
    console.log(" REGISTER NEW SUBJECTS....");
    const responseSub = await certifyAxios.post('/common/classSubject/register', requestU);
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

const updateCategorie = async(_values) => {
  try{
    console.log("EDIIIIIIIIIIIIT");
    // console.log(disable);
    // console.log(_values);

    const {
      name,
      subjects
    } = _values;

    const editCatRequest = {
      "categoryId": idCat,
      "name": formatNameCapitals(name)
    }

    console.log("REQUEST EDIT MODULE: ", editCatRequest);
    const response = await certifyAxios.post('/category/update', editCatRequest);
    console.log(response);

    if(subjsDelete.length>0){
      // ELiMINAR TEMAS QUE SE ELIMINARON EN FRONT
      let i = 0;
      while(i<subjsDelete.length){
        const requestS = {
          "id": subjsDelete[i]
        }
        deleteSubjects(requestS);
        i+=1;
      }
    }

    // MODIFICAR TEMAS:
    if(idsEdits.length>0){
      let i = 0;
      while(i<idsEdits.length){
        const requestU = {
          "name":subjects[i].name.toUpperCase(),
          "subjectId": idsEdits[i],
          "urlPhoto":subjects[i].urlPhoto
        }
        updateSubjects(requestU);
        i+=1;
      }
    }

    // REGISTRAR NUEVOS TEMAS:
    if(subjects.length > idsEdits.length){
    let j = idsEdits.length;
    while(j<subjects.length){
      const requestU = {
        "classCategoryId": idCat,
        "name": subjects[j].name.toUpperCase(),
        "urlPhoto": subjects[j].urlPhoto
      }
      registerSubjects(requestU);
      j+=1;
    }
    }

    // setIdCat('');
    // setCat('');
    // setSubj([]);
    // setIdSubj([]);
    // setSubjsEdits([]);
    setIdsEdits([]);
    props.handleChangeAdd();
    setCat(name);
    setSubj(subjects);
    closeWindowEdit();

  } catch(err) {
    if(err.resultCode === "1001"){
        enqueueSnackbar("...", {variant:"error"})
    } else{
        enqueueSnackbar("Ha ocurrido un error", {variant:"error"})
    }
    console.error(err);
  }
}

const removeSubject = (remove,index) =>{
  // console.log("REMOVE SUBJECT ....")
  remove(index);
  
  const tempdis = [...disable];
  tempdis.splice(index,1);
  setDisable(tempdis);

  const temp = [...subjsDelete];
  // console.log("ANTES: ",temp);
  temp.push(idsEdits[index]);
  // console.log("DESPUES: ",temp);
  setSubjsDelete(temp);

  const tempid = [...idsEdits];
  tempid.splice(index,1);
  setIdsEdits(tempid);

  // console.log("DISABLE: ",disable);
  // console.log("ID EDITS: ",idsEdits);
  // console.log("TO DELETE: ",subjsDelete);
}

const registerCategorie = async (_values) => {
  // console.log('values', _values);
  /* const {
    name,
    subjects
  } = _values;
  await axios.post('/category/register', {
    name,
    subjects
  }); */

  try {
    /* if (validateModuleRegister()){ */
        const {
            name,
            subjects
        } = _values;

        const request = {
            "name": name.toUpperCase(),
            "subjects": subjects
        }

        console.log("REQUEST ADD MODULE: ", request);
        const response = await certifyAxios.post('/category/register', request);
        console.log("BACK ADD MODULE: ", response)
        setIdCat('');
        setCat('');
        setSubj([]);
        // setIdSubj([]);
        // setSubjsEdits([]);
        setIdsEdits([]);
        props.handleChangeAdd();
        closeWindowAdd();
        // handleModuleSuccess('Se ha registrado el módulo satisfactoriamente');
        // returnToCapacitations();
    

  } catch (err) {
    if(err.resultCode === "1001"){
        enqueueSnackbar("...", {variant:"error"})
    } else{
        enqueueSnackbar("Ha ocurrido un error", {variant:"error"})
    }
    console.error(err);
  }
};

const closeWindowEdit = () => {
  setIdCat('');
  setCat('');
  setSubj([]);
  setDisable([]);
  // setIdSubj([]);
  // setSubjsEdits([]);
  setIdsEdits([]);
  props.handleCloseEdit();
};

const closeWindowAdd = () => {
  setIdCat('');
  setCat('');
  setSubj([]);
  setDisable([]);
  // setIdSubj([]);
  // setSubjsEdits([]);
  setIdsEdits([]);
  props.handleCloseBox();
};

return(
<>

        
          
          <Box
          p={2}
          display="flex"
          flexDirection="column">
          <Typography 
            component="span" 
            variant="h4"
            textAlign = "center"
            width="100%"
            sx={{
              color:"black"
            }}
            >
              Detalles de la categoría
          </Typography>

          <Formik
            initialValues={{
              name : cat,
              subjects: subj,
              submit: null
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('Debe ingresar el nombre de la categoría'),
            subjects: Yup.array(
              Yup.object({
                name: Yup.string().required('Debe ingresar el nombre del tema'),
                urlPhoto:Yup.string()
              })
            ).min(1, 'Debe ingresar al menos un tema')
            // .test('len', 'El DNI debe tener 8 caracteres', val => val.toString().length === 8),
          })}
          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            try {
              // console.log('viva cristo');
              if(props.openEdit){
                await updateCategorie(_values);
                console.log("EDIIIIIT");
              } else {
                await registerCategorie(_values);
                console.log("ADDDD");
              }
              // console.log(_values);
              resetForm();
              setStatus({ success: true });
              setSubmitting(false);
              handleSuccessBox();
              // props.getCategories();
            } catch (err) {
              console.error(err);
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }}
          >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values
            
          }) => (
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 4 }}>
                  <Grid // xs={6} sm={6} md={6}
                  sx={{
                    maxWidth:'100%'
                  }}>
                    <Grid
                      container
                      spacing={0}
                      direction="column"
                      justifyContent="center"
                      paddingLeft={2}
                      paddingRight={2}
                    >

                      <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        justifyContent="flex-end"
                        textAlign={{ sm: 'left' }}
                        sx={{
                          mb: 1
                        }}
                      >
                        <Box
                          pr={3}
                          sx={{
                            pt: `${theme.spacing(2)}`,
                            pb: { xs: 1, md: 0 }
                          }}
                          alignSelf="center"
                        >
                          <b>Nombre de la categoría</b>
                        </Box>
                      </Grid>
                      <Grid
                        sx={{
                          mb: `${theme.spacing(3)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <TextField
                          error={Boolean(touched.name && errors.name)}
                          fullWidth
                          helperText={touched.name && errors.name}
                          name="name"
                          placeholder="Ingresar nombre de categoría"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.name.toUpperCase()}
                          variant="outlined"
                          sx={{
                            width:'50%'
                          }}
                        />

                        { props.openEdit === true ? (
                          <>
                          <Box
                        // pr={3}
                        sx={{
                          // pt: `${theme.spacing(2)}`,
                          pb: { xs: 1, md: 0 },
                          maxWidth: "100%"
                        }}>
                          <IconButton 
                          onClick={() => props.handleConfirmDelete(idCat,idsEdits)}
                          color="error" sx={{borderRadius:30}}>
                            <DeleteRoundedIcon/>                          
                          </IconButton>
                        </Box>
                          </>
                        ): null}
                      </Grid>


                      <FieldArray name="subjects">
                        {({push, remove}) => (
                         <React.Fragment>
                          <Grid
                        item
                        xs={12}
                        sm={4}
                        md={3}
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        textAlign={{ sm: 'left' }}
                        sx={{
                          mb: 1
                        }}
                      >
                        <Box
                          pr={3}
                          sx={{
                            pt: `${theme.spacing(2)}`,
                            pb: { xs: 1, md: 0 }
                          }}
                          alignSelf="center"
                        >
                          <b>Temas Asociados</b>
                        </Box>
                        <Box
                        pr={3}
                        sx={{
                          pt: `${theme.spacing(2)}`,
                          pb: { xs: 1, md: 0 }
                        }}>
                          <IconButton 
                          color="secondary" 
                          // onClick={addRowTopic}
                          sx={{
                              borderRadius:30, 
                              // marginRight:"15px"
                          }}
                          onClick={() => push({"name": '',"urlPhoto":''})}>
                            <AddIcon/>
                          </IconButton>
                        </Box>
                          </Grid>
                      
                          <Divider />

                          <Grid
                        sx={{
                          mb: `${theme.spacing(3)}`
                        }}
                        item
                        xs={12}
                        sm={8}
                        md={9}
                        // Aqui los temas (tabla...):
                      > 
                      <Box
                      sx={{
                        // maxWidth: "100%",
                        // overflow: "hidden",
                        // overflowY: "scroll"
                      }}>
                      <TableContainer>
                      <Table>
                        <TableBody>
                          {values.subjects.map((t,index) => (
                            <TableRow hover key={index}>
                            <TableCell>
                              <Field
                                name = {`subjects.${index}.name`}
                                as={TextField}
                                label="Nombre de Tema"
                                sx={{
                                  color:'black',
                                  pb: '20px',
                                  fontSize: '14px',
                                  width:'80%'
                                  }}
                                  placeholder="Ingresar tema"
                                  disabled={Object.values(subj).includes(t) ? disable[index] : false}
                                />

                                <Field
                                name = {`subjects.${index}.urlPhoto`}
                                as={TextField}
                                label="URL Foto"
                                sx={{
                                  color:'black',
                                  // pl: '40px',
                                  fontSize: '14px',
                                  width:'80%'
                                  }}
                                  placeholder="Ingresar URL de foto del tema"
                                  disabled={Object.values(subj).includes(t) ? disable[index] : false}
                                />
                            </TableCell>


                            <TableCell align="center">
                            <Box
                            // pr={3}
                            sx={{
                              // pt: `${theme.spacing(2)}`,
                              pb: { xs: 1, md: 0 },
                              }}
                              display="flex"
                              alignItems="center"
                              justifyContent="space-between"
                              >
                              {props.openEdit === true ? (
                              <>
                                <IconButton 
                                  color="secondary" 
                                  onClick={() => disableChange(index)}
                                  sx={{
                                  borderRadius:30, 
                                  marginRight:"15px"
                                }}>
                                  <CreateRoundedIcon/>
                              </IconButton>
                              </>
                              ) : null}
                              <IconButton 
                              onClick={() => removeSubject(remove,index)}
                              color="error" sx={{borderRadius:30}}
                              disabled={Object.values(subj).includes(t) ? disable[index] : false}>
                                <DeleteRoundedIcon/>                          
                              </IconButton>
                            </Box>
                            </TableCell>
                            </TableRow>
                          ))}
                          
                          </TableBody>
                          </Table>
                          </TableContainer>
                          </Box>
                          </Grid>
                          <Grid item>
                        {typeof errors.subjects === 'string' ? (
                          <Typography color="error">
                            <b>{errors.subjects}</b>
                          </Typography>
                        ) : null}
                      </Grid>
                        </React.Fragment>

                        )}
                      </FieldArray>
                      
                    </Grid>
                  </Grid>
                </Box>
                <Grid
                  sx={{
                    display: 'flex',
                    flexDirection: 'row-reverse',
                    mb: `${theme.spacing(3)}`
                  }}
                  container
                  margin="auto"
                  item
                  xs={12}
                  // sm={8}
                  // md={9}
                >
                  <Box
                  sx={{
                    mr:5
                  }}>
                  <Button
                  sx={{
                    color:"red",
                    mr: 2,
                    borderColor: "red",
                    '&:hover':{
                      color:"gray",
                      borderColor:"gray"
                    }
                  }}
                    color="secondary"
                    size="large"
                    variant="outlined"
                    onClick={props.openEdit ? (closeWindowEdit):(closeWindowAdd)}
                  >
                    Descartar
                  </Button>

                  <Button
                    color="secondary"
                    variant="outlined"
                    type="submit"
                    // onClick={}
                    startIcon={
                      isSubmitting ? <CircularProgress size="1rem" /> : null
                    }
                    disabled={Boolean(errors.submit) || isSubmitting}
                    size="large"
                    sx={{
                      
                      '&:hover':{
                        color:"gray",
                        borderColor:"gray"
                      }
                    }}
                  >
                    Guardar
                  </Button>
                  </Box>
                </Grid>
                {// <pre>{JSON.stringify({values,errors},null,4)}</pre>
}
            </form>
          )}

          </Formik>

          </Box>
         
         
    </>
);
}