import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Paper,
  useMediaQuery,
  useTheme,
  Zoom
} from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import CheckIcon from '@mui/icons-material/Check';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CloseIcon from '@mui/icons-material/Close';
import certifyAxios from 'src/utils/aimAxios';
import { BoxItemWrapper } from 'src/content/dashboards/Healthcare/Appointments';
import { ExamenNoDisponible } from 'src/utils/assets';
import { formatNameCapitals } from 'src/utils/training';

function AddEditExam(props) {
  const { enqueueSnackbar } = useSnackbar();
  const [examen, setExamen] = useState(props.currentExamen?.length> 0? props.currentExamen : []);
  const [respuestas, setRespuestas] = useState([])
  const [openQuiz, setOpenQuiz] = useState(false);
  const [intento, setIntento] = useState(false);
  const [loading, setLoading] = useState(false);
  const [continuar, setcontinuar] = useState(false)
  const [primeraVez, setPrimeraVez] = useState(false)
  const isRowBased = useMediaQuery('(min-width: 500px)');

  useEffect(() => {
    setExamen(props.currentExamen.length> 0? props.currentExamen : [])
    if(validationSchema(props.currentExamen)){
      crearRespuestasVacias(props.currentExamen)
    }
  }, [props.currentExamen])

  const crearRespuestasVacias = (currentExamen) => {
    let respuestasTemp = []
    if(currentExamen !== undefined && currentExamen.length > 0){
      currentExamen.forEach((item) => {
        respuestasTemp.push({questionId: item.questionId, answer: -1})
      })
    }
    setRespuestas(respuestasTemp)
  }

  const validationSchema = (currentExamen, index = -1) => {
    let valid = true;
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
    
    currentExamen.forEach((e) => {
      if ( e &&
        ((e.alternativeA && e.alternativeA.length < 1) ||
        (e.alternativeB && e.alternativeB.length < 1) ||
        (e.alternativeC && e.alternativeC.length < 1) ||
        (e.alternativeD && e.alternativeD.length < 1) ||
        (e.statement && e.statement.length === 0) || 
        (e.score === 0))
        ) {
          valid = false;
        }
      });
    return valid;
  };


  const registrarExamenNivel = async () => {
    try {
      const registerAnswer = {
        answers: respuestas,
        partnerId: props.partnerId
      }
      setLoading(true)
      // console.log('REQUEST SAVE RESP: ', respuestas);
      const response = await certifyAxios.post(
        '/quiz/register',
        registerAnswer
        );
        if(response.data?.message === "OK"){
          // Obtenemos su puntaje por respuesta
          const request = {
            levelId: props.selectedNivel.levelId,
            partnerId:  props.partnerId
          }
          // console.log('REQUEST FIND RESULT: ', request);
          let info = {passed: 0, partnerScore: -1}
          const responseResult = await certifyAxios.post('/trainingModule/partner/quiz/results/find',request);
          if(responseResult.data && responseResult.data?.message === "OK"){
            if(responseResult.data.passed === 1){
              setcontinuar(true)
            } else {
              setcontinuar(false)
            }
            props.setSelectedExamen(responseResult.data.questions)
            info = {passed: responseResult.data.passed, partnerScore: responseResult.data.partnerScore}
            props.setExamenInfo(info)
          }
        }
        setLoading(false)
    } catch (error) {
      enqueueSnackbar("Ha ocurrido un error", {
        variant: 'error',
        TransitionComponent: Zoom
      });
      setLoading(false)
    }
  }

  const registerNewAttempt = (masDeUna=false) => {
    if(masDeUna){
      handlePrimeraVez(false)
    }
    registrarExamenNivel()
    handleOtroIntento()
  }
  
  const registerFirstAttempt = () => {
    handlePrimeraVez(true)
    registrarExamenNivel()
    handleOpenQuiz()
  }
  
  const continuarNivel = (masDeUna=false) => {
    setLoading(true)
    try {
      props.setLastStep(99)
      if(masDeUna){
        handlePrimeraVez(false)
      }
      const requestModule = {
        "moduleId": props.moduleId, 
        "partnerId": props.partnerId
      }
      props.getModuleById(requestModule);
      if(props.lastLevel){
        enqueueSnackbar("Capacitación finalizada exitosamente", {
          variant: 'success',
          TransitionComponent: Zoom
        });
      } else {
        enqueueSnackbar("Siguiente nivel desbloqueado", {
          variant: 'success',
          TransitionComponent: Zoom
        });
      }
    } catch (error){
      console.log(error)
    }
    setLoading(false)
  }

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

  const getEstadistica = () => {
    let correctas = 0;
    let errores = 0;
    if(examen !== undefined && examen.length > 0){
      examen.forEach((item) => {
        if(item && item.isCorrect !== undefined){
          if(item.isCorrect){
           correctas += 1
          } else {
            errores += 1
          }
        }
      })
    }
    return {correctas, errores};
  }

  const handlePrimeraVez = (value) => {
    setPrimeraVez(value || false)
  }

  const handleOpenQuiz = () => {
    setOpenQuiz(!openQuiz)
  }

  const handleOtroIntento = () => {
    setIntento(!intento)
  }
  
  return (
    <>
      {loading && <div style={{ display: 'grid', justifyContent: 'center', marginTop:"5rem" }}>
        <div>
          <CircularProgress color="secondary" sx={{mb: "1rem", ml:"1.5rem"}}/>
          </div>
          <div>
            Calculando ...
          </div>
      </div>}
      {props.selectedNivel !== undefined && !loading && 
      (props.selectedNivel.quizCompleted === null || props.selectedNivel.quizCompleted === 0) && primeraVez && 
        (continuar?
          /* Paso a la primera */
          <div>
            <ExamenResultado
              examen={examen}
              continuar={continuar}
              puntajeTotal={getPuntajeTotal()}
              estaditica={getEstadistica()}
              continuarNivel ={() => {continuarNivel(true)}}
              lastLevel={props.lastLevel}
              partnerScore={props.examenInfo?.partnerScore > 0 && props.examenInfo?.partnerScore || 0}
              />
            </div>
          :(intento? /* Necesita volver a intentar */
            <div>
              <ExamenPorResponder
                examen={examen}
                getPuntajeTotal={getPuntajeTotal}
                validationSchema={validationSchema}
                respuestas={respuestas}
                setRespuestas={setRespuestas}
                registrarExamenNivel={() => {registerNewAttempt(false)}}
                handleOpenQuiz={handleOtroIntento}
                />
            </div>
            :<div>
            <ExamenResultado
              examen={examen}
              nuevoIntento
              puntajeTotal={getPuntajeTotal()}
              estaditica={getEstadistica()}
              handleOtroIntento={handleOtroIntento}
              lastLevel={props.lastLevel}
              partnerScore={props.examenInfo?.partnerScore > 0 && props.examenInfo?.partnerScore || 0}
              />
          </div>
            )
        )
      }
      {props.selectedNivel !== undefined && !loading && (examen.length > 0 && examen[0].attempt === undefined) && 
      (props.selectedNivel.quizCompleted === null || props.selectedNivel.quizCompleted === 0) && !primeraVez &&
        (!validationSchema(examen)?
        <div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom:1 }}>
            <h3><b>Prueba final del Nivel</b> </h3>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginLeft:3, marginRight:3 }}>
            La prueba no se encuentra visible. Espere que un miembro AIM actualice el cuestionario.
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
              <img
                  style={{ width: isRowBased?"250px":"90%", height: "235px", margin: "0", display: "block" }}
                  src={ExamenNoDisponible || ""}
                  alt="Portada"
              />
          </div>
        </div>
        :(openQuiz? 
        <div>
          <ExamenPorResponder
          examen={examen}
          getPuntajeTotal={getPuntajeTotal}
          validationSchema={validationSchema}
          respuestas={respuestas}
          setRespuestas={setRespuestas}
          registrarExamenNivel={registerFirstAttempt}
          handleOpenQuiz={handleOpenQuiz}
          />
        </div>
      : <div>
        <div style={{ display: 'flex', justifyContent: 'center'}}>
          <h2 style={{margin: 0}}><b>Prueba Final del Nivel</b> </h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
                style={{ width: isRowBased?"250px":"90%", height: "235px", margin: "0", display: "block" }}
                src={ExamenNoDisponible || ""}
                alt="Portada"
            />
        </div>
        <div style={{ display: 'flex', justifyContent: 'left', marginLeft:"1rem", marginRight:"1rem"}}>
           Indicaciones Generales:
        </div>
        <ol>
          <li>
            <div style={{ display: 'flex', justifyContent: 'left', marginLeft:"1rem", marginRight:"1rem"}}>
              Presenta más de un intento para desarrollar la prueba sin tiempo límite. 
            </div>
          </li>
          <li>
            <div style={{ display: 'flex', justifyContent: 'left', marginLeft:"1rem", marginRight:"1rem", marginTop: "10px" }}>
              Para continuar con el siguiente nivel, la nota debe ser mayor al 70% del puntaje total.
            </div>
          </li>
        </ol> 
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button
              sx={{
                mr: 2,
                mt:2
              }}
              variant="contained"
              size="small"
              color="secondary"
              onClick={handleOpenQuiz}
              >
              Empezar
          </Button>
        </div>

       </div>
      ))}
      {props.selectedNivel !== undefined && !loading && (examen.length > 0  && examen[0].attempt !== undefined) && props.selectedNivel.quizCompleted === 1 &&
        ((props.selectedNivel.quizCompleted === null || props.selectedNivel.quizPassed === 0) || props.selectedNivel.quizPassed === null)  && 
        (intento? 
        <div>
          <ExamenPorResponder
            examen={examen}
            getPuntajeTotal={getPuntajeTotal}
            validationSchema={validationSchema}
            respuestas={respuestas}
            setRespuestas={setRespuestas}
            registrarExamenNivel={() => {registerNewAttempt(true)}}
            handleOpenQuiz={() => {handleOtroIntento(false)}}
            />
          </div>
        :<div>
          <ExamenResultado
            examen={examen}
            nuevoIntento={!continuar}
            continuar={continuar}
            puntajeTotal={getPuntajeTotal()}
            estaditica={getEstadistica()}
            handleOtroIntento={handleOtroIntento}
            continuarNivel ={() => {continuarNivel(true)}}
            lastLevel={props.lastLevel}
            partnerScore={props.examenInfo?.partnerScore > 0 && props.examenInfo?.partnerScore || 0}
          />
        </div> )}
      {props.selectedNivel !== undefined && !loading && (examen.length > 0 && examen[0].attempt !== undefined) && props.selectedNivel.quizCompleted === 1 &&
        props.selectedNivel.quizPassed === 1 && 
        <div>
          <ExamenResultado
            examen={examen}
            continuar={continuar || false}
            puntajeTotal={getPuntajeTotal()}
            estaditica={getEstadistica()}
            continuarNivel ={() => {continuarNivel(true)}}
            lastLevel={props.lastLevel}
            partnerScore={props.examenInfo?.partnerScore > 0 && props.examenInfo?.partnerScore || 0}
            />
        </div>
      }
    </>
  );
}

export function ExamenResultado({examen, nuevoIntento = false, puntajeTotal=0, partnerScore=0, 
  estaditica, handleOtroIntento, continuarNivel, continuar = false, lastLevel=false, miembro=false, selectedName=""}){
  const theme = useTheme();
  return(
  <div>
    <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h2><b>Resultados de la Prueba final del Nivel</b> </h2>
    </div>
    {miembro &&
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom:"10px" }}>
        Asociada: {formatNameCapitals(selectedName)}
      </div>
    }
    <Card
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        mx: 3
      }}
      >
      <Box py={2} px={2} display="flex" alignItems="center">
        <Box display="flex" alignItems="center">
            <AssignmentIcon sx={{fontSize: 25, color:"secondary.main"}} />
        </Box>
        <Box ml={1}>
          <div> Puntaje </div>
          <div>
            <b>{`${partnerScore} `}</b>{`de ${puntajeTotal} (`} <b>{`${Math.trunc(partnerScore/puntajeTotal*100)}`}</b> %)
          </div>
        </Box>
      </Box>
      <Box py={1} px={4} display="flex" alignItems="center">
        <Box display="flex" alignItems="center">
            <CheckCircleOutlineIcon sx={{fontSize: 25, color:theme.colors.success.main}} />
        </Box>
        <Box ml={1}>
          <div> Correctas </div>
          <div>
            {estaditica?.correctas || 0}
          </div>
        </Box>
      </Box>
      <Box py={1} px={5} display="flex" alignItems="center">
        <Box display="flex" alignItems="center">
            <HighlightOffIcon sx={{fontSize: 25, color:theme.colors.error.main}} />
        </Box>
        <Box ml={1}>
          <div> Incorrectas </div>
          <div>
            {estaditica?.errores || 0}
          </div>
        </Box>
      </Box>
    </Card>
    <div style={{marginTop:1, paddingRight:2, justifyContent:"center", display:"flex", alignItems:"center"}}>
        <Alert
          sx={{mx: 3, my:1}}
          severity={nuevoIntento? "error":"success"}
          >
          {nuevoIntento? 
          <div>Para continuar con el siguiente nivel, la nota debe ser mayor al <b>70%</b> del puntaje total</div>:
          <div>¡Nivel culminado satisfactoriamente!</div>}
        </Alert>
        { !miembro && nuevoIntento && <Button
          sx={{
            mr: 2
          }}
          variant="contained"
          size="small"
          color="secondary"
          onClick={handleOtroIntento}
          >
          Intentar de nuevo
        </Button>}
        {!miembro && continuar && <Button
          sx={{
            mr: 2
          }}
          variant="contained"
          size="small"
          color="secondary"
          onClick={continuarNivel}
          >
            {lastLevel? "Finalizar capacitación" : "Continuar siguiente nivel"}
        </Button>
        }
    </div>
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
                <PreguntaCard
                  preg={item}
                  index={index}
                  exam={examen}
                  />
              </ListItem>
            );
          })}
      </List>
    </div>
  )
}

function ExamenPorResponder({examen, getPuntajeTotal, validationSchema, respuestas, setRespuestas, registrarExamenNivel, handleOpenQuiz}){
  const theme = useTheme();
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <h3><b>Prueba final del Nivel</b> </h3>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        Marque las opciones que contienen las respuestas a las preguntas
      </div>
      <b
          style={{ display: 'flex', justifyContent: 'center', marginTop: "15px" }}
          >
        {getPuntajeTotal()} puntos
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
              validationSchema(examen, index) &&
              <ListItem key={index}>
                <PreguntaItem
                  preg={item}
                  index={index}
                  exam={examen}
                  respuestas={respuestas}
                  setRespuestas={setRespuestas}
                  />
              </ListItem>
            );
          })}
      </List>
      <Grid
        sx={{
          my: `${theme.spacing(2)}`
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
            color="error"
            onClick={handleOpenQuiz}
            >
            Cancelar
        </Button>
        <Button
            sx={{
              mr: 2
            }}
            variant="contained"
            size="small"
            color="secondary"
            onClick={registrarExamenNivel}
            >
            Terminar Examen
        </Button>
      </Grid>
    </div>
  )
}

function PreguntaItem(props) {
  
  const getCurrent = () => {
    const nuevaPregunta = {
      questionId: props.respuestas[props.index]?.questionId || 0,
      answer: props.respuestas[props.index]?.answer || -1
    };
    return nuevaPregunta;
  }
  const handleChangeExam = (pregunta, respuestas) => {
    respuestas[props.index] = pregunta;
    props.setRespuestas(respuestas)
  } 

  const handleChangeRespuesta = (e) => {
    const temp = [...props.respuestas];
    const pregunta = getCurrent();
    pregunta.answer = +e.target.value;
    handleChangeExam(pregunta, temp)
  }

  const styleLabel={wordWrap:"break-word", wordBreak: "break-word"}
  return (
    <Grid container justifyContent="center">
      <Grid item xs={11} sm={11} md={10}>
        <Paper sx={{ my: .5, p: 1 }} elevation={0}>
          <Formik
            initialValues={{
              pregunta: props.preg?.statement || '',
              respuesta: props.respuestas[props.index]?.answer || -1,
              opcion1: props.preg?.alternativeA || '',
              opcion2: props.preg?.alternativeB || '',
              opcion3: props.preg?.alternativeC || '',
              opcion4: props.preg?.alternativeD || ''
            }}
            validationSchema={Yup.object().shape({
              pregunta: Yup.string().required('La pregunta es obligatorio'),
            })}
            onSubmit={async (
              _values,
              { resetForm, setErrors, setStatus, setSubmitting }
            ) => {
              try {
                // await registerModule(_values);
                resetForm();
                setStatus({ success: true });
                setSubmitting(false);
                // handleCreateModuleSuccess();
              } catch (err) {
                console.error(err);
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            }}
          >
            {({ handleChange, values }) => (
              <div style={{width: '100%'}}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px'
                  }}
                >
                  <div
                    style={
                      {alignSelf: "baseline", fontWeight:'bold'}
                    }
                  >
                      {props.index >= 0 ? `${props.index + 1}.\u00A0` : ''}
                  </div>
                  <div>
                    <b>{`${values.pregunta}`}</b> <br/> {`(${props.preg.score} ${props.preg.score === 1? "punto":"puntos"})`}
                  </div>
                </div>
                <div style={{width: '100%', marginLeft:"14px"}}>
                  <FormControl style={{width: '100%'}}>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      name="respuesta"
                      value={values.respuesta}
                      onChange={(e) => {
                        handleChange(e)
                        handleChangeRespuesta(e);
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center', 
                          width: '96%'
                        }}
                      >
                        <FormControlLabel
                          value={0}
                          control={<Radio />}
                          label=""
                        />
                        <FormControl fullWidth sx={{ m: .5, ...styleLabel}} variant="standard"> 
                          <div>
                            {values.opcion1}
                          </div>
                        </FormControl>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center', 
                          width: '96%'
                        }}
                      >
                        <FormControlLabel
                          value={1}
                          control={<Radio />}
                          label=""
                        />
                        <FormControl fullWidth sx={{ m: .5, ...styleLabel }} variant="standard"> 
                          <div>
                            {values.opcion2}
                          </div>
                        </FormControl>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center', 
                          width: '96%'
                        }}
                      >
                        <FormControlLabel
                          value={2}
                          control={<Radio />}
                          label=""
                        />
                        <FormControl fullWidth sx={{ m: .5, ...styleLabel }} variant="standard"> 
                          <div>
                            {values.opcion3}
                          </div>
                        </FormControl>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center', 
                          width: '96%'
                        }}
                      >
                        <FormControlLabel
                          value={3}
                          control={<Radio />}
                          label=""
                        />
                        <FormControl fullWidth sx={{ m: .5, ...styleLabel }} variant="standard"> 
                          <div>
                            {values.opcion4}
                          </div>
                        </FormControl>
                      </div>
                    </RadioGroup>
                  </FormControl>
                </div>
              </div>
            )}
          </Formik>
        </Paper>
      </Grid>
    </Grid>
  );
}

function PreguntaCard(props){
  const iconSize={fontSize:18}

  const LabelRespuesta = ({nombre, index}) => {
    return <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      marginY={1}
    >
      <Grid item xs={1} md={1} lg={1}>
        <Radio 
          value={index}
          checked={index === props.preg.partnerAnswer}
          disabled
          size="small"
        />
      </Grid>
      <Grid item xs={9} md={9} lg={9}>
        <div style={{wordWrap:"break-word", wordBreak: "break-word"}}>
          {nombre}
        </div>
      </Grid>
      <Grid item xs={2} md={2} lg={2} sx={{display:"flex", justifyContent:"end"}}>
        { index === props.preg.partnerAnswer && (props.preg.isCorrect?
          <CheckIcon color="success" sx={iconSize}/>
          : <CloseIcon color="error" sx={iconSize}/>)
        }
      </Grid>
    </Grid>
  }

  return(<>
    <Grid container>
      <Grid item xs={12} md={12} lg={12}>
      <BoxItemWrapper className={props.preg.isCorrect && "wrapper-success"}>
        <Box flexGrow={1} mr={2}>
          <Chip
              sx={{
                mr: 0.5,
                bgcolor: '#608aff', color: 'white'
              }}
              size="small"
              label={`Pregunta ${props.index + 1}`}
              />
            <Grid container sx={{my: 2, justifyContent:"space-between"}}>
              <Grid item xs={12} md={9} lg={9} sx={{ml:2}}>
                <div style={{wordWrap:"break-word", wordBreak: "break-word"}}>
                  {props.preg.statement}
                </div>
              </Grid>
              <Grid item xs={12} md={2} lg={2}>
              <div style={{textAlign:"end"}}>
                {props.preg.isCorrect*props.preg.score || 0} / {props.preg.score}
              </div>
              </Grid> 
            </Grid> 
            <Grid item xs={11} md={11} lg={11} sx={{ml: 3, mt:1}}>
              <LabelRespuesta 
              nombre={props.preg.alternativeA}
              index={0}
              />
              <LabelRespuesta 
                nombre={props.preg.alternativeB}
                index={1}
                /> 
              <LabelRespuesta 
                nombre={props.preg.alternativeC}
                index={2}
                />
              <LabelRespuesta 
                nombre={props.preg.alternativeD}
                index={3}
                />
            </Grid>
          </Box>
        </BoxItemWrapper>
      </Grid>
    </Grid>
  </>)
}

export default AddEditExam;
