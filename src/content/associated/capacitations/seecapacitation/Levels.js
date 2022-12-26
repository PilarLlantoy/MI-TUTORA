import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  useTheme,
  Step,
  Stepper,
  StepButton,
  StepLabel,
  Grid,
  StepIcon,
  alpha
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEffect, useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import certifyAxios from 'src/utils/aimAxios';
import { useSnackbar } from 'notistack';
import styled from '@emotion/styled';

const LabelWrapper = styled(Box)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(10)};
    font-weight: bold;
    text-transform: uppercase;
    border-radius: ${theme.general.borderRadiusSm};
    padding: ${theme.spacing(0.5, 1)};
  `
);

function Levels({ niveles = [], currentLevel = 0, userInfo, setSelectedTaller, setSelectedExamen, setSuccessVideo, 
  setVideoType, setSelectedLevel, selectedLevel, setExamenInfo, finalizado = false, setLoadingTaller, lastStep, setLastStep, showFinish, setShowFinish}) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(-1)
  const { enqueueSnackbar } = useSnackbar();
  const examenIndex = 9999

  useEffect(() => {
    // calculate activeStep 
    if(niveles !== undefined && niveles.length > 0){
      let lastStepLevel = 0;
      if(niveles[currentLevel]?.steps?.length > 0){
        const stepSize = niveles[currentLevel]?.steps?.length || 0
        for (let i = 1; i < stepSize; i++) {
          if(niveles[currentLevel].steps[i].visited === 1){
            lastStepLevel += 1;
          } else {
            break;
          }
        }
        if(!finalizado || (finalizado && !showFinish)){
          changeActiveStep(0,currentLevel, niveles[currentLevel].steps[0].stepId)
        } else {
          setLoadingTaller(false)
        }
      } else {

        changeActiveStepExam(niveles[currentLevel].levelId, currentLevel)
      }
      setLastStep(lastStepLevel)
    }

  }, [niveles, currentLevel])

  useEffect(() => {
    console.log("AIM")
  }, [setLastStep])

  useEffect(() => {
  }, [setActiveStep])

  const getTipoArchivoVideo = (urlVideo) => {
    if(urlVideo.length>0){
      if(urlVideo.substr(0,8) === "youtube-"){
        setVideoType(0) // link de youtube
      } else if(urlVideo.substr(0,7) === "archivo-"){
        setVideoType(1) // video m4 -> s3
      }
    }
  }
  
  const changeActiveStep = async (index, indexNivel, stepId) => {
    try {
      const reqObj = {
        partnerId: userInfo,
        stepId
      }
      if(showFinish){
        setShowFinish(false)
      }
      setActiveStep(index)
      setSelectedLevel(indexNivel)
      const response = await certifyAxios.post(`/trainingModule/partner/step/find`, reqObj);
      if(response && response.data){
        getTipoArchivoVideo(response.data.urlVideo)
        setSelectedTaller(response.data)
        setSelectedExamen([])
        try{
          /* if( (currentLevel !== undefined || currentLevel !== null) && indexNivel === currentLevel && 
          ((index===0 && (lastStep===99 || lastStep===0) && niveles[indexNivel]?.steps && niveles[indexNivel]?.steps[index]?.visited !== undefined  &&
            niveles[indexNivel]?.steps[index]?.visited === 0)|| 
            index > lastStep || 
            (index > lastStep && niveles[indexNivel]?.steps && niveles[indexNivel]?.steps[index]?.visited !== undefined  &&
              niveles[indexNivel]?.steps[index]?.visited === 0))){ */
            const visitResponse = await certifyAxios.post(`/trainingModule/partner/step/visit`, reqObj);
            if(visitResponse.data.message && visitResponse.data.message==="OK"){
              if(lastStep === 99){
                setLastStep(0)
              } else {
                setLastStep(lastStep + 1)
              }
            }
            console.log("VISIT REQ", visitResponse)
          
        } catch (e){
          // ignore
        }
      }
    } catch (error) {
      console.error(error)
      enqueueSnackbar("No se ha podido encontrar el taller. Inténtelo de nuevo", {variant:"error"})
      setSelectedTaller({})
    }
    setLoadingTaller(false)
  }
  
  const changeActiveStepExam = async (levelId, indexNivel) => {
    try {
      const reqObj = {
        partnerId: userInfo,
        levelId
      }
      if(showFinish){
        setShowFinish(false)
      }
      let info = {passed: 0, partnerScore: -1}
      // QuizCompleted = false -> examen por responder
      // QuizCompleted = true y QuizPassed = false -> resultado de su examen -> examen por responder (otro intento)
      // QuizCompleted = true y QuizPassed = true -> resultado de su examen
      if(niveles[indexNivel] && niveles[indexNivel].quizCompleted !== undefined){
        if(niveles[indexNivel].quizCompleted === null || niveles[indexNivel].quizCompleted === 0){
          const response = await certifyAxios.post(`/trainingModule/partner/quiz/find`, reqObj);
          if(response && response.data){
            setActiveStep(0)
            setSelectedTaller({})
            setSelectedExamen(response.data.list)
          }
        } else{
          const responseResult = await certifyAxios.post(`/trainingModule/partner/quiz/results/find`, reqObj);
          if(responseResult && responseResult.data && responseResult.data.message === "OK"){
            setSelectedTaller({})
            setActiveStep(0)
            setSelectedExamen(responseResult.data.questions)
            info = {passed: responseResult.data.passed, partnerScore: responseResult.data.partnerScore}
          }
        }
        setExamenInfo(info)
      }
    } catch (error) {
      console.error(error)
      enqueueSnackbar("No se ha podido encontrar el examen. Inténtelo de nuevo", {variant:"error"})
    }
    if(niveles[indexNivel]?.steps?.length > 0){
      setActiveStep(niveles[indexNivel]?.steps?.length + 1)
    }
    setSuccessVideo(false)
    setSelectedLevel(indexNivel)
    setLoadingTaller(false)
  }
  
  const getCurrentColor = (index, indexLevel) => {
    const current = {
      // color:"#63ACFF",
      color:"#ffa359",
      filter:"drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))"
    }
    const visited = {
      color: "rgb(250 231 221)",
      filter:"drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))"
    }
    const notVisited = {
      color: "#FFFF",
      filter:"drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))"
    }
    const disabled = {
      color: "#E1E1E1",
      filter:"drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))"
    }
    
    if(finalizado){
      if(indexLevel === selectedLevel && activeStep === index){
        return current;
      } 
      return visited;
    }

    if(!finalizado && indexLevel > currentLevel){
      return disabled;
    }
    
    // Steps
    if(indexLevel < currentLevel){
      if(indexLevel === selectedLevel && activeStep === index){
        return current;
      } 
      return visited;
    }
    if(niveles !== undefined && niveles[selectedLevel]?.steps){
      if(indexLevel === selectedLevel && activeStep === index){
        return current;
      } 
      const tallerVisitado = niveles[currentLevel]?.steps[index]?.visited || 0
      if(tallerVisitado || index <= lastStep){
        return visited;
      } 

      if(indexLevel === selectedLevel && lastStep + 1 === index){
        return notVisited;
      }
       
      return disabled
    }
    return disabled
  }

  const getDisabled = (index, indexLevel) => {
    
    if(finalizado){
      if(indexLevel === selectedLevel && activeStep === index){
        return false;
      } 
      return false;
    }

    if(!finalizado && indexLevel > currentLevel){
      return true;
    }
    // Steps
    if(indexLevel < currentLevel){
      if(indexLevel === selectedLevel && activeStep === index){
        return false;
      } 
      return false;
    }
    
    if(niveles !== undefined && niveles[selectedLevel]?.steps){
      if(indexLevel === selectedLevel && activeStep === index){
        return false;
      }
      if(indexLevel === selectedLevel && lastStep  + 1 === index){
        return false;
      }      
      const tallerVisitado = niveles[currentLevel]?.steps[index]?.visited || 0
      if(tallerVisitado || index <= lastStep){
        return false;
      } 
      return true
    }
    return true
  }

  const getDisabledExam = (indexLevel) => {
    const steps = niveles[indexLevel].steps
    if(steps && steps.length > 0){
      const stepSize = niveles[currentLevel]?.steps?.length || 0
      for (let i = 1; i < stepSize; i++) {
        if(niveles[currentLevel].steps[i].visited === 0){
          return true
        }
      }
      return false
    } 
    return false
  }
  
  const stepIconComponent = (index, indexLevel) => {

    if(finalizado){
      return <StepIcon icon={<CheckCircleIcon sx={{fontSize:27, color:"#8aca8a"}}/>} />
    }

    if(indexLevel > currentLevel && !finalizado){
      return <StepIcon icon={<PanoramaFishEyeIcon sx={{fontSize:27, color:"#E1E1E1"}}/>} />;
    }

    if(indexLevel < currentLevel && !finalizado){
      return <StepIcon icon={<CheckCircleIcon sx={{fontSize:27, color:"#8aca8a"}}/>} />;
    }

    const isDisabled = getDisabledExam(indexLevel)

    return (
      <div>
        {index === examenIndex && (
          (!isDisabled && indexLevel === currentLevel)?
          <StepIcon icon={<PanoramaFishEyeIcon sx={{fontSize:27, color:"#f1d300"}}/>} />
          : isDisabled ? 
          <PanoramaFishEyeIcon sx={{fontSize:27, color:"#E1E1E1"}}/> 
          : <StepIcon icon={<CheckCircleIcon sx={{fontSize:27, color:"#8aca8a"}}/>} />
          )}
      </div>
    );
  };

  return (
    <div>
      <Grid container>
        <Grid 
          item 
          xs={12}
          sm={12}
          md={12}
          sx={{
            px: `${theme.spacing(1)}`,
            pb: `${theme.spacing(1)}`,
          }}
        >
      <Box
        pr={1}
        sx={{
          pt: `${theme.spacing(2)}`,
          pb: { xs: 1, md: 0 }
        }}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <div style={{display:"flex", alignItems:"center"}}>
          <b>Niveles del módulo</b>
        </div>
        <div style={{display:"flex", alignItems:"center"}}>
        {finalizado && <LabelWrapper
              ml={1}
              mr={2}
              component="span"
              sx={{
                background: `${alpha(theme.colors.success.light, 0.2)}`,
                color: `${theme.colors.success.main}`
              }}
              >
              Completo
          </LabelWrapper>}
        </div>
      </Box>
      <div>
        {niveles && niveles.map((nivel, index) => ( currentLevel !== -1 && 
          <Accordion key={index} sx={{ background: '#F9F9F9' }} defaultExpanded={!finalizado? index === currentLevel: index===0}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              id={index}
              key={index}
              sx={{ 
                background: '#F9F9F9', 
                marginTop: '10px', 
                '.css-o4b71y-MuiAccordionSummary-content': {
                  display:"flex", 
                  justifyContent:"space-between"
                }
              }}
            >
              <div style={{display:"flex", alignItems:"center"}}>
                  Nivel {index + 1}
              </div>
              <div style={{display:"flex", alignItems:"center"}}>
                {!finalizado && <LabelWrapper
                  ml={1}
                  mr={2}
                  component="span"
                  sx={{
                    background: `${index === currentLevel && !finalizado? alpha(theme.colors.warning.light, 0.2): ( index > currentLevel && !finalizado && alpha("#8A8A8A", 0.2) || alpha(theme.colors.success.light, 0.2))}`,
                    color: `${index === currentLevel && !finalizado? theme.colors.warning.main : ( index > currentLevel && !finalizado && "#8A8A8A" || theme.colors.success.main)}`
                  }}
                >
                  {index === currentLevel? "En progreso": (index > currentLevel)? "Bloqueado":"Completo"}
                </LabelWrapper>}
              </div>
            </AccordionSummary>
            <AccordionDetails
              sx={{ background: '#F9F9F9', marginBottom: '10px', px:5 }}
            >
                <Box sx={{ maxWidth: 400 }}>
                <Stepper nonLinear key={index} 
                  activeStep={index < currentLevel? activeStep : -1} 
                  orientation="vertical" 
                  sx={{
                    paddingTop:0, 
                    backgroundColor:'#F9F9F9',
                  }}
                >
                  {nivel.steps && nivel.steps.map((item, indexTaller) => (
                      <Step key={item.stepId}
                        sx={{paddingTop:0, backgroundColor:'#F9F9F9'}}
                        disabled={(index > currentLevel && !finalizado) || getDisabled(indexTaller, index)}
                        >
                        <StepButton 
                          key={item.stepId}
                          sx={{paddingY:0, background:'#F9F9F9'}}
                          onClick={() => {changeActiveStep(indexTaller, index, item.stepId)}}
                          disabled={(index > currentLevel && !finalizado) || getDisabled(indexTaller, index)}
                        >
                          <StepLabel
                            key = {item.stepId}
                            StepIconProps={{style: getCurrentColor(indexTaller, index)}}
                            disabled={(index > currentLevel  && !finalizado) || getDisabled(indexTaller, index)}
                          >
                            { index === selectedLevel && activeStep === indexTaller?
                              <b style={{color:"rgb(208 93 0)"}}>{item.stepName}</b>
                              : <div style={{color:"#000"}}>{item.stepName}</div>
                            }
                          </StepLabel>
                        </StepButton>
                      </Step>
                  ))}
                  <Step 
                    key={index}
                    sx={{paddingTop:0, backgroundColor:'#F9F9F9'}}
                    disabled={(index > currentLevel && !finalizado) || getDisabledExam(index)}
                  >
                    <StepButton 
                      key={index}
                      sx={{paddingY:0, background:'#F9F9F9'}}
                      onClick={() => changeActiveStepExam(nivel.levelId, index)}
                      disabled={(index > currentLevel && !finalizado) || getDisabledExam(index)}
                    >
                      <StepLabel
                        key = {nivel.levelId}
                        StepIconComponent={() => stepIconComponent(examenIndex, index)}
                        disabled={(index > currentLevel && !finalizado) || getDisabledExam(index)}
                      >
                        { index === selectedLevel && ((niveles[index].steps.length > 0 && activeStep === niveles[index].steps.length + 1) ||
                          niveles[index].steps.length === 0
                        )?
                          <b style={{color:"#000"}}>Prueba final</b>
                          : <div  style={{color:"#000"}}>Prueba final</div>
                        }
                      </StepLabel>
                    </StepButton>
                  </Step>
                </Stepper>
                </Box>
            </AccordionDetails>
          </Accordion>
        ))}
        {niveles?.length === 0 &&
          <div style={{
            display:"flex", 
            justifyContent:"center",
            color:"gray",
            paddingTop:`${theme.spacing(15)}`
          }}> 
            Sin niveles 
          </div>
        }
      </div>
      </Grid>
      </Grid>
    </div>

    
  );
}

export default Levels;
