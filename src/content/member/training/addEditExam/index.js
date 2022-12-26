import { useEffect, useState } from 'react';
import {
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  Paper,
  TextField,
  Input,
  useTheme,
  Zoom
} from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import SaveIcon from '@mui/icons-material/Save';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import certifyAxios from 'src/utils/aimAxios';

const nuevaPregunta = {
  alternativeA: '',
  alternativeB: '',
  alternativeC: '',
  alternativeD: '',
  correctAnswer: 0,
  score: 0,
  statement: ''
};

const templatePreg = {
  alternativeA: 'A',
  alternativeB: 'B',
  alternativeC: 'C',
  alternativeD: 'D',
  correctAnswer: 0,
  score: 0,
  levelId: -1,
  statement: 'template'
};

function AddEditExam(props) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [examen, setExamen] = useState(
    props.currentExamen?.length > 0 ? props.currentExamen : [nuevaPregunta]
  );

  useEffect(() => {
    if (props.editMode) {
      if (props.currentExamen.length === 0) {
        agregarPregunta();
      } else {
        let cleanExam = [...props.currentExamen];
        cleanExam.forEach((e, index) => {
          let newItem = getPregunta(e);
          cleanExam[index] = newItem;
        });
        setExamen(cleanExam);
      }
    } else {
      setExamen(
        props.currentExamen.length > 0 ? props.currentExamen : [nuevaPregunta]
      );
    }
  }, [props.currentExamen]);

  const agregarPregunta = async () => {
    if (props.editMode) {
      try {
        let template = { ...templatePreg };
        template.levelId = props.nivelId;
        // console.log('REQUEST REGISTER PREG: ', template);
        const response = await certifyAxios.post(
          '/trainingModule/question/register',
          template
        );
        if (response?.data?.message === 'OK') {
          props.handleOpenEditExamen(props.indexNivel, props.nivelId, true);
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      let temp = [...examen];
      temp.push(nuevaPregunta);
      setExamen(temp);
    }
  };

  const eliminarPregunta = async (index) => {
    if (props.editMode) {
      try {
        const objId = {
          id: examen[index].questionId
        };
        // console.log('REQUEST DELETE PREG: ', objId);
        const response = await certifyAxios.post(
          '/trainingModule/question/delete',
          objId
        );
        if (response?.data?.message !== 'OK') {
          props.errorMessage('No se pudo eliminar la pregunta.');
        }
      } catch (error) {
        console.error(error);
        props.errorMessage('No se pudo eliminar la pregunta.');
      }
    }
    const temp = [...examen];
    temp.splice(index, 1);
    setExamen(temp);
  };

  const validationSchema = (number = false, index = -1) => {
    let valid = true;
    let pregErrors = 0;

    // Validar pregunta en especifico
    if (index !== -1) {
      const e = examen[index];
      if (
        e &&
        ((e.alternativeA && e.alternativeA.length === 0) ||
        (e.alternativeB && e.alternativeB.length === 0) ||
        (e.alternativeC && e.alternativeC.length === 0) ||
        (e.alternativeD && e.alternativeD.length === 0) ||
        (e.statement && e.statement.length === 0) || 
        (e.score === 0))
        ) {
          return false;
        }
        return true;
      }
      
      examen.forEach((e) => {
        if ( e &&
        ((e.alternativeA && e.alternativeA.length === 0) ||
          (e.alternativeB && e.alternativeB.length === 0) ||
          (e.alternativeC && e.alternativeC.length === 0) ||
          (e.alternativeD && e.alternativeD.length === 0) ||
          (e.statement && e.statement.length === 0) || 
          (e.score === 0))
      ) {
        valid = false;
        pregErrors += 1;
      }
    });
    if (number) {
      return pregErrors;
    }
    return valid;
  };

  const registrarExamenNivel = () => {
    if (validationSchema()) {
      props.registerExamen(examen);
    } else {
      enqueueSnackbar('Las preguntas deben tener los campos completos', {
        variant: 'error',
        TransitionComponent: Zoom
      });
    }
  };

  const getPregunta = (item) => {
    if (props.editMode) {
      let newCleanItem = { ...item };
      if (newCleanItem.alternativeA === templatePreg.alternativeA) {
        newCleanItem.alternativeA = '';
      }
      if (newCleanItem.alternativeB === templatePreg.alternativeB) {
        newCleanItem.alternativeB = '';
      }
      if (newCleanItem.alternativeC === templatePreg.alternativeC) {
        newCleanItem.alternativeC = '';
      }
      if (newCleanItem.alternativeD === templatePreg.alternativeD) {
        newCleanItem.alternativeD = '';
      }
      if (newCleanItem.statement === templatePreg.statement) {
        newCleanItem.statement = '';
      }
      return newCleanItem;
    }
    return item;
  };

  const getPuntajeTotal = () => {
    let puntajeTotal = 0;
    if(examen !== undefined && examen.length > 0){
      examen.forEach((item) => {
        if(item && item.score > 0){
          puntajeTotal += item.score
        }
      })
    }
    return puntajeTotal;
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h1>Prueba final</h1>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '5px'
        }}
      >
        Marque las opciones que contienen las respuestas a las preguntas
      </div>
      {validationSchema(true, -1) > 0 ? (
        <div
          style={{ display: 'flex', justifyContent: 'center', color: 'red' }}
        >
          Presenta {validationSchema(true, -1)} pregunta(s) por completar
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            color: '#52db33'
          }}
        >
          Cuestionario completo {examen?.length ? 'con' : ''}{' '}
          {examen?.length || ''} {examen?.length > 1 ? 'preguntas' : 'pregunta'}
        </div>
      )}

      <b
          style={{ display: 'flex', justifyContent: 'center', marginTop: "15px" }}
        >
        Puntaje total: {getPuntajeTotal()}
      </b>
      <List
        sx={{
          p: 1
        }}
        component="nav"
      >
        {examen &&
          examen.map((item, index) => {
            return (
              <ListItem key={index}>
                <PreguntaItem
                  key={index}
                  preg={getPregunta(item)}
                  index={index}
                  validatePreg={validationSchema}
                  exam={examen}
                  setExamen={setExamen}
                  eliminarPregunta={eliminarPregunta}
                  editMode={props.editMode}
                />
              </ListItem>
            );
          })}

        <ListItem sx={{ justifyContent: 'space-around' }}>
          <Button
            sx={{
              mt: { xs: 2, sm: 0 }
            }}
            onClick={agregarPregunta}
            variant="contained"
            size="small"
            startIcon={<AddTwoToneIcon fontSize="small" />}
          >
            Agregar Pregunta
          </Button>
        </ListItem>
      </List>
      {!props.editMode && (
        <Grid
          sx={{
            mt: `${theme.spacing(3)}`
          }}
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
            variant="contained"
            size="small"
            color="secondary"
            onClick={registrarExamenNivel}
          >
            Registrar
          </Button>
          <Button
            color="secondary"
            size="small"
            variant="outlined"
            onClick={props.handleCloseExam}
          >
            Cancelar
          </Button>
        </Grid>
      )}
    </>
  );
}

function PreguntaItem(props) {
  const [editPreg, setEditPreg] = useState(false);

  const getCurrent = () => {
    let nuevaPregunta = {
      alternativeA: props.preg.alternativeA || '',
      alternativeB: props.preg.alternativeB || '',
      alternativeC: props.preg.alternativeC || '',
      alternativeD: props.preg.alternativeD || '',
      correctAnswer: props.preg.correctAnswer || 0,
      statement: props.preg.statement || '',
      score: props.preg.score || 0
    };
    if (props.editMode) {
      nuevaPregunta.questionId = props.preg.questionId || -1;
    }
    return nuevaPregunta;
  };

  useEffect(() => {
    console.log("AIM")
  },[props.setExamen])
  
  const handleChangeExam = async (values) => {
    const examen = [...props.exam];
    const {
      pregunta,
      respuesta,
      opcion1,
      opcion2,
      opcion3,
      opcion4,
      puntaje
    } = values

    let preguntaObj = {
      alternativeA: opcion1 || '',
      alternativeB: opcion2 || '',
      alternativeC: opcion3 || '',
      alternativeD: opcion4 || '',
      correctAnswer: +respuesta || 0,
      statement: pregunta || '',
      score: puntaje || 0
    }
    if (props.editMode) {
      try {
        preguntaObj.questionId = props.preg.questionId || -1;
        // console.log('REQUEST UPDATE PREG: ', preguntaObj);
        const response = await certifyAxios.post(
          '/trainingModule/question/update',
          preguntaObj
        );
        if (response?.data?.message === 'OK') {
          console.log(response);
        }
      } catch (error) {
        console.error(error);
      }
    }
    examen[props.index] = preguntaObj;
    props.setExamen(examen);
  };

  const handleChangeExamRegister = (pregunta, examen) => {
    examen[props.index] = pregunta;
    props.setExamen(examen)
  } 

  const handleChangePregunta = (e) => {
    const pregunta = getCurrent();
    pregunta.statement = e.target.value;
    if (!props.editMode) {
      const temp = [...props.exam];
      handleChangeExamRegister(pregunta, temp)
    }
  };

  const handleChangeRespuesta = (e) => {
    const pregunta = getCurrent();
    pregunta.correctAnswer = e.target.value;
    if (!props.editMode) {
      const temp = [...props.exam];
      handleChangeExamRegister(pregunta, temp)
    }
  };

  const handleChangePuntaje = (e) => {
    const pregunta = getCurrent();
    pregunta.score = +e.target.value;
    if (!props.editMode) {
      const temp = [...props.exam];
      handleChangeExamRegister(pregunta, temp)
    }
  };

  const handleChangeOpciones = (e, tipo) => {
    const pregunta = getCurrent();
    switch (tipo) {
      case 0:
        pregunta.alternativeA = e.target.value;
        break;
      case 1:
        pregunta.alternativeB = e.target.value;
        break;
      case 2:
        pregunta.alternativeC = e.target.value;
        break;
      default:
        pregunta.alternativeD = e.target.value;
        break;
    }
    if (!props.editMode) {
      const temp = [...props.exam];
      handleChangeExamRegister(pregunta, temp)
    }
  };

  return (
    <Grid container justifyContent="center" key={props.index}>
      <Grid item xs={11} sm={11} md={10}>
        <Paper sx={{ my: 2, p: 2 }}>
          <Formik
            initialValues={{
              pregunta: props.preg?.statement || '',
              respuesta: props.preg?.correctAnswer || 0,
              opcion1: props.preg?.alternativeA || '',
              opcion2: props.preg?.alternativeB || '',
              opcion3: props.preg?.alternativeC || '',
              opcion4: props.preg?.alternativeD || '',
              puntaje: props.preg?.score || 0
            }}
            validationSchema={Yup.object().shape({
              pregunta: Yup.string().required('La pregunta es obligatorio')
            })}
            onSubmit={async (
              _values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                await handleChangeExam(_values)
                setEditPreg(false)
                setStatus({ success: true });
                setSubmitting(false);
              } catch (err) {
                console.error(err);
                resetForm()
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }}
          >
            {({ errors, handleBlur, handleChange, touched, values, resetForm, handleSubmit }) => (
              <form onSubmit={handleSubmit}>
              <div style={{ width: '100%' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingTop:"5px"
                  }}
                >
                  <b
                    style={
                      !props.validatePreg(false, props.index)
                        ? { color: 'red', alignSelf: "baseline" }
                        : { color: '#52db33', alignSelf: "baseline"}
                    }
                  >
                    {props.index >= 0 ? `${props.index + 1}.\u00A0` : ''}
                  </b>

                  <div style={{ width: '75%', paddingRight: '20px'}}>
                    <TextField
                      error={Boolean(touched.pregunta && errors.pregunta)}
                      fullWidth
                      size="small"
                      helperText={touched.pregunta && errors.pregunta}
                      name="pregunta"
                      placeholder="Pregunta"
                      label="Pregunta"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        handleChange(e);
                        handleChangePregunta(e);
                      }}
                      disabled={props.editMode && !editPreg}
                      value={values.pregunta}
                      variant="outlined"
                      maxRows={5}
                      multiline
                    />
                  </div>
                  
                  <div style={{ float: 'right',  width: '25%', display: 'flex', alignSelf: "baseline"}}>
                    <div style={{marginRight: '20px'}}>
                      <TextField
                        id="standard-number"
                        label="Puntaje"
                        type="number"
                        name='puntaje'
                        value={values.puntaje}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        InputProps={{
                          inputProps: { min: 0 }
                        }}
                        onChange={(e) => {
                          handleChange(e);
                          handleChangePuntaje(e);
                        }}
                        size="small"
                        variant="outlined"
                        disabled={props.editMode && !editPreg} 
                      />
                    </div>
                    
                    {props.editMode && !editPreg && (
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => {
                          setEditPreg(true)
                        }}
                        sx={{ borderRadius: 100 }}
                      >
                        <CreateRoundedIcon />
                      </IconButton>
                    )}
                    {props.editMode && editPreg && (
                        <IconButton
                          type="submit"
                          color="secondary"
                          size="small"
                          sx={{ borderRadius: 100 }}
                        >
                          <SaveIcon />
                        </IconButton>
                    )}
                    {props.editMode && editPreg && (
                        <IconButton
                        color="error"
                        size="small"
                        onClick={() => {
                          setEditPreg(false)
                          resetForm({
                            values:{
                              pregunta: props.preg?.statement || '',
                              respuesta: props.preg?.correctAnswer || 0,
                              opcion1: props.preg?.alternativeA || '',
                              opcion2: props.preg?.alternativeB || '',
                              opcion3: props.preg?.alternativeC || '',
                              opcion4: props.preg?.alternativeD || '',
                              puntaje: props.preg?.score || 0
                            }
                          });
                        }}
                        sx={{ borderRadius: 30 }}
                      >
                        <HighlightOffRoundedIcon />
                      </IconButton>
                    )}
                    {props.exam.length > 1 && (!props.editMode || !(props.editMode && editPreg)) && (
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => {
                          props.eliminarPregunta(props.index);
                        }}
                        sx={{ borderRadius: 30 }}
                      >
                        <DeleteRoundedIcon />
                      </IconButton>
                    )}
                  </div>
                </div>
                <div style={{ width: '100%' }}>
                  <FormControl style={{ width: '100%' }}>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      name="respuesta"
                      value={values.respuesta}
                      onChange={(e) => {
                        handleChange(e);
                        handleChangeRespuesta(e);
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%'
                        }}
                      >
                        <FormControlLabel
                          value={0}
                          control={<Radio />}
                          label=""
                          disabled={props.editMode && !editPreg}
                        />
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                          <Input
                            id="standard-adornment-amount"
                            name="opcion1"
                            value={values.opcion1}
                            onChange={(e) => {
                              handleChange(e);
                              handleChangeOpciones(e, 0);
                            }}
                            disabled={props.editMode && !editPreg}
                            placeholder="Opción 1"
                          />
                        </FormControl>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%'
                        }}
                      >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label=""
                          disabled={props.editMode && !editPreg}
                        />
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                          <Input
                            id="standard-adornment-amount"
                            name="opcion2"
                            value={values.opcion2}
                            onChange={(e) => {
                              handleChange(e);
                              handleChangeOpciones(e, 1);
                            }}
                            disabled={props.editMode && !editPreg}
                            placeholder="Opción 2"
                          />
                        </FormControl>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%'
                        }}
                      >
                        <FormControlLabel
                          value={2}
                          control={<Radio />}
                          label=""
                          disabled={props.editMode && !editPreg}
                        />
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                          <Input
                            id="standard-adornment-amount"
                            name="opcion3"
                            value={values.opcion3}
                            onChange={(e) => {
                              handleChange(e);
                              handleChangeOpciones(e, 2);
                            }}
                            disabled={props.editMode && !editPreg}
                            placeholder="Opción 3"
                          />
                        </FormControl>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%'
                        }}
                      >
                        <FormControlLabel
                          value={3}
                          control={<Radio />}
                          label=""
                          disabled={props.editMode && !editPreg}
                        />
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                          <Input
                            id="standard-adornment-amount"
                            name="opcion4"
                            value={values.opcion4}
                            onChange={(e) => {
                              handleChange(e);
                              handleChangeOpciones(e, 3);
                            }}
                            disabled={props.editMode && !editPreg}
                            placeholder="Opción 4"
                          />
                        </FormControl>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
              </form>
            )}
          </Formik>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AddEditExam;
