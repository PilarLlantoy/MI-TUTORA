import ReactPlayer from 'react-player'
import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Grid, 
    DialogContent,
    Box,
    Typography, 
    useTheme,
    IconButton,
    Paper,
    LinearProgress,
    useMediaQuery,
    CircularProgress,
    styled,
    Button
} from '@mui/material';


import { useSnackbar } from 'notistack';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
// import certifyAxios from 'src/utils/aimAxios';
import Scrollbar from 'src/components/Scrollbar'; 
import certifyAxios from 'src/utils/aimAxios';
import useRefMounted from 'src/hooks/useRefMounted';
import { ExamenNoDisponible } from 'src/utils/assets';
import { getNameAndUrlFromBack } from 'src/utils/awsConfig';
import Levels from './Levels';
import TabLevel from './TabLevel';
import AddEditExam from '../addEditExam';

const LabelWrapper = styled(Box)(
    ({ theme }) => `
      font-size: ${theme.typography.pxToRem(10)};
      font-weight: bold;
      text-transform: uppercase;
      border-radius: ${theme.general.borderRadiusSm};
      padding: ${theme.spacing(0.5, 1)};
    `
  );

function addEditModules() {

    const [module, setModule] = useState(undefined);
    const [niveles, setNiveles] = useState([]);
    const [currentLevel, setCurrentLevel] = useState(-1); // Index del nivel actual de la asociada
    const [selectedLevel, setSelectedLevel] = useState(0); // Index Nivel seleccionado, por default el current
    const [selectedTaller, setSelectedTaller] = useState({}); // taller seleccionado
    const [videoType, setVideoType] = useState(0); // 0: url de youtube, 1: archivo mp4 de s3
    const [selectedExamen, setSelectedExamen] = useState([]); // examen seleccionado
    const [examenInfo, setExamenInfo] = useState({passed: -1, partnerScore: 0}); // nota de la asociada
    const [successVideo, setSuccessVideo] = useState(false);
    const [finalizado, setFinalizado] = useState(false);
    const [userInfo, setUserInfo] = useState(-1); // partner info
    const [loading, setLoading] = useState(false);
    const [lastStep, setLastStep] = useState(99);
    const [showFinish, setShowFinish] = useState(false);



    const theme = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const isMountedRef = useRefMounted();
    const { enqueueSnackbar } = useSnackbar();
    const isRowBased = useMediaQuery('(min-width: 500px)');

    const getModuleById  = useCallback(async (reqObj) => {
        try {
            const response = await certifyAxios.post(`/trainingModule/partner/module/find`, reqObj);
            if (isMountedRef.current) {
                if(response  && response.data){
                    if( response.data.levels && response.data.currentLevel && 
                        response.data.currentLevel >= response.data.levels.length){
                        setCurrentLevel(0)
                        setFinalizado(true)
                        setShowFinish(true)
                    } else {
                        setCurrentLevel(response.data?.currentLevel || 0)
                        setSelectedLevel(response.data.currentLevel || 0)
                    }
                    setModule(response.data)
                    setNiveles(response.data.levels || [])
                    setSelectedExamen([])
                }
            }
        }catch (err) {
            console.error(err);
            setModule({})
            
            if (err.response) {
                console.log(err.response);
            } else if (err.request) {
                console.error(err.request);
            } else {
                console.error('Servicio encontró un error');
            }
            enqueueSnackbar("El servicio ha encontrado un error", {variant:"error"})
        }

    }, [isMountedRef])

    useEffect(()=>{
        // console.log("STATE LOCATION - ", location.state)
        const userInfo = JSON.parse(localStorage.getItem('user'))
        setUserInfo(userInfo.id)
        if(userInfo && userInfo.id !== null && userInfo.id !== undefined){
            if(location.state.moduleId !== -1){
                setLoading(true)
                const request = {
                    "moduleId": location.state.moduleId, 
                    "partnerId": userInfo.id
                }
                getModuleById(request);
            } else {
                setModule({})
                setNiveles([])
            }
        } else {
            enqueueSnackbar("No se ha encontrado información de su usuario", {variant:"error"})
        }
    }, [getModuleById])

    const getVideoUrlb2f = (urlVideo) => {
        if(videoType === 0){ // link youtube
          return urlVideo.substr(8, urlVideo.length)
        } 
    
        return urlVideo.substr(8, urlVideo.length)
      }
    
    const returnToCapacitations = () => {
        setNiveles([])
        navigate('/aim/associated/capacitations');
    };
    
    return (
        <>
            <Helmet>
                <title>Module</title>
            </Helmet>

            { module !== undefined &&
                    <form>
                        <PageTitleWrapper>
                            <Grid container alignItems="center">
                                <Grid item xs={2} md={.5} sm = {.5}>
                                    <IconButton size="small" onClick={returnToCapacitations}>
                                        <KeyboardArrowLeftRoundedIcon/>
                                    </IconButton>
                                </Grid>
                                <Grid item xs={10} md={10} sm={10} alignItems="left">
                                    <div style={{display:"flex", alignItems:"center", justifyContent:"left"}}>
                                        <Typography variant="h3" component="h3" gutterBottom>
                                            {module?.moduleName || "Módulo de capacitación"}
                                        </Typography>
                                        <LabelWrapper
                                            ml={1}
                                            mr={2}
                                            component="span"
                                            sx={{
                                                background: module?.isOptional === 0? "rgb(255 71 71 / 62%)": "rgb(245 207 0)",
                                                color: `#fff`
                                            }}
                                            >
                                            {module?.isOptional === 1? "Electiva": "Obligatoria"}
                                        </LabelWrapper>
                                    </div>
                                </Grid>
                            </Grid>
                        </PageTitleWrapper>
                        <DialogContent
                            sx={{
                                p: 3
                            }}
                        >
                            
                            <Grid container
                                spacing={1}
                                paddingLeft={2}
                                paddingRight={0}
                            >
                                { niveles !== undefined && <Grid item xs={12} sm={12} md={8} sx={{pr:`${theme.spacing(2)}`}}>
                                    <Paper style={{height:"100%"}}>
                                        {loading &&
                                            <div style={{ display: 'grid', justifyContent: 'center', paddingTop:"6rem" }}>
                                                <CircularProgress color="secondary" sx={{mb: "1rem", ml:"1.5rem"}}/>
                                            </div>
                                        }
                                        {showFinish && location.state.finalizadaSelected === 0 &&
                                            <div>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom:1, paddingTop: "3.5rem" }}>
                                                    <CheckCircleOutlineRoundedIcon sx={{ fontSize: 80, color:"#8fd68f" }}/>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom:1, paddingTop: ".5rem" }}>
                                                    <h3><b>Capacitación finalizada</b> </h3>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginLeft:3, marginRight:3,marginBottom:"3rem" }}>
                                                    Ha culminado satisfactoriamente esta capacitación
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginLeft:3, marginRight:3 }}>
                                                    <Button
                                                        variant="contained"
                                                        size="small"
                                                        color="secondary"
                                                        onClick={returnToCapacitations}
                                                        >
                                                        Volver a mis capacitaciones
                                                    </Button>
                                                </div>
                                            </div>

                                        }
                                        {!loading && !(showFinish && location.state.finalizadaSelected === 0) && <Grid
                                            container
                                            spacing={0}
                                            direction="column"
                                            paddingLeft={2}
                                            alignContent="stretch" 
                                        >
                                            <Grid
                                                item
                                                xs={12}
                                                sm={4}
                                                md={3}
                                                justifyContent="flex-end"
                                                textAlign={{ sm: 'left' }}
                                            >
                                                <Box
                                                    pr={3}
                                                    sx={{
                                                        mt: `${theme.spacing(1)}`,
                                                        mb: `${theme.spacing(.5)}`,
                                                    }}
                                                    alignSelf="center"
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                >
                                                    <h3 style={{marginBottom:0}}>
                                                        {selectedExamen.length > 0?
                                                            (<b> Nivel {selectedLevel + 1}</b>)
                                                            : (<b> Nivel {selectedLevel + 1} {selectedTaller && selectedTaller.name && ` - ${selectedTaller.name}` || ""}</b>)
                                                        }
                                                    </h3>
                                                </Box>
                                            </Grid> 
                                            {niveles.length > 0 && selectedExamen !== undefined && selectedExamen !== null && selectedTaller.idStep === undefined &&
                                             selectedExamen.length === 0 &&
                                            <Grid
                                                sx={{
                                                    my: `${theme.spacing(1)}`,
                                                    mr:`${theme.spacing(1)}`,
                                                    paddingRight: 3
                                                }}
                                                item
                                                xs={12}
                                                sm={8}
                                                md={8}
                                            >
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
                                            </Grid> 
                                            }
                                            {selectedExamen !== undefined && selectedExamen !== null && selectedExamen.length > 0? 
                                            <Grid
                                                sx={{
                                                    my: `${theme.spacing(1)}`,
                                                    mr:`${theme.spacing(1)}`,
                                                    paddingRight: 3
                                                }}
                                                item
                                                xs={12}
                                                sm={8}
                                                md={8}
                                            >
                                                <AddEditExam 
                                                    currentExamen={selectedExamen}
                                                    lastLevel={niveles && selectedLevel === (niveles.length -1)}
                                                    setSelectedExamen={setSelectedExamen}
                                                    selectedNivel={niveles[selectedLevel]}
                                                    setSelectedLevel={setSelectedLevel}
                                                    partnerId = {userInfo || -1}
                                                    examenInfo={examenInfo}
                                                    moduleId={location?.state?.moduleId || -1}
                                                    setExamenInfo={setExamenInfo}
                                                    getModuleById={getModuleById}
                                                    setNiveles={setNiveles}
                                                    setModule={setModule}
                                                    setLastStep={setLastStep}
                                                />
                                            </Grid> 
                                            : ( selectedLevel !== undefined && selectedTaller.idStep !== undefined&& <Grid
                                                sx={{
                                                    my: `${theme.spacing(1)}`,
                                                    mr:`${theme.spacing(1)}`,
                                                    paddingRight: 3
                                                }}
                                                item
                                                xs={12}
                                                sm={8}
                                                md={8}
                                            > 
                                                <div style={{height: (!successVideo && selectedTaller.urlVideo !== "")?"20px":isRowBased?"360px":"180px"}}>
                                                    {!successVideo && selectedTaller.urlVideo !== "" &&
                                                        <LinearProgress sx={{width: "100%"}}/>
                                                    } 
                                                    { selectedTaller.name !== undefined && (selectedTaller.urlVideo !== ""?<ReactPlayer url={selectedTaller.urlVideo? 
                                                        getVideoUrlb2f(selectedTaller.urlVideo):
                                                        'https://www.youtube.com/watch?v=Hc_kwCGNhn0'} 
                                                        width='100%'
                                                        height='100%'
                                                        onReady={() => {setSuccessVideo(true)}}/>
                                                        :(selectedTaller.urlVideoS3 !== "" && <video controls width='100%' height='100%'>
                                                            <source
                                                                src={getNameAndUrlFromBack(selectedTaller.urlVideoS3).urlS3} type="video/mp4"
                                                            />
                                                            <track kind="captions" label='hola'/>
                                                        </video>)
                                                        )
                                                    }
                                                </div>
                                                <div 
                                                    style={{
                                                        marginTop: `${theme.spacing(2)}`,
                                                        marginRight:`${theme.spacing(1)}`,
                                                        paddingRight: 3
                                                    }}
                                                >
                                                    <TabLevel selectedTaller = {selectedTaller}/>   
                                                </div>
                                            </Grid>) }
                                        </Grid>}
                                    </Paper>
                                </Grid>}
                                <Grid
                                    item
                                    xs={11.5}
                                    sm={11.5}
                                    md={4}
                                >
                                <Paper sx={{
                                    height:"100%",
                                    minHeight:"75vh",
                                    overflow:"hidden",
                                    mb: `${theme.spacing(1)}`
                                }}>
                                    <Scrollbar autoHide={false}>
                                        <Grid
                                            container
                                            spacing={0}
                                            direction="column"
                                            justifyContent="flex-start"
                                            alignItems="stretch"
                                            paddingLeft={2}
                                            paddingRight={1}
                                            minHeight="75vh"
                                            >
                                            <Grid
                                                sx={{
                                                    mb: `${theme.spacing(2)}`
                                                }}
                                                item
                                                xs={12}
                                                sm={12}
                                                md={9}
                                            >
                                                <Levels 
                                                    userInfo={userInfo}
                                                    niveles ={niveles} 
                                                    setNiveles={setNiveles}
                                                    currentLevel={currentLevel}
                                                    selectedTaller={selectedTaller}
                                                    setSelectedTaller={setSelectedTaller}
                                                    setSelectedExamen={setSelectedExamen}
                                                    setSuccessVideo={setSuccessVideo}
                                                    setVideoType={setVideoType}
                                                    selectedLevel={selectedLevel}
                                                    setSelectedLevel={setSelectedLevel}
                                                    setExamenInfo={setExamenInfo}
                                                    moduleId={location?.state?.moduleId || -1}
                                                    getModuleById={getModuleById}
                                                    finalizado={finalizado}
                                                    setLoadingTaller = {setLoading}
                                                    lastStep = {lastStep}
                                                    setLastStep = {setLastStep}
                                                    setShowFinish={setShowFinish}
                                                    showFinish = {showFinish}
                                                />
                                            </Grid>

                                        </Grid>
                                    </Scrollbar>                        
                                    </Paper>
                                </Grid>
                            </Grid>
                           
                        </DialogContent>
                    </form>
            } 
            <Footer />
        </>
    )
};

export default addEditModules;