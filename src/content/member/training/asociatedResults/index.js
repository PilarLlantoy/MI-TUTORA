import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import { useCallback, useEffect, useState } from 'react';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Grid,
  Typography,
  IconButton,
  DialogContent,
  Paper,
  useTheme,
  CircularProgress,
  Card,
  Stack,
  Box, 
} from '@mui/material';
import { useSnackbar, withSnackbar } from 'notistack';
import certifyAxios from 'src/utils/aimAxios';
import useRefMounted from 'src/hooks/useRefMounted';
import { useLocation, useNavigate } from 'react-router-dom';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import AssignmentIcon from '@mui/icons-material/Assignment';
// import GroupsIcon from '@mui/icons-material/Groups';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Levels from './Levels';
import Results from './Results';

function addEditModules(props) {
  const [module, setModule] = useState(undefined);
  const [niveles, setNiveles] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState({});
  const [indexSelected, setIndexSelected] = useState(0);
  const navigate = useNavigate();
  const isMountedRef = useRefMounted();
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [trainings, setTrainings] = useState([])
  const [otraInfo, setOtraInfo] = useState({average: 0, quizScore: 0, totalQuizPartners: 0})
  const [numberOfResults, setNumberOfResults] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(0);

  const defaultObj = {
    "firstResult": 1,
    "maxResults": 10,
    "levelId": 0,
    "type": 0
  }

  const getModuleById = useCallback(
    async (reqObj) => {
      try {
        const response = await certifyAxios.post(
          `/trainingModule/find`,
          reqObj
        );
        if (isMountedRef.current) {
          if (response.data) {
            // console.log('MODULE FIND: ', response.data);
            setModule(response.data);
            setNiveles(response.data.levels);
            if(response.data.levels.length>0){
              if(response.data.levels[0] && response.data.levels[0].levelId){
                setSelectedLevel(response.data.levels[0])
                let requestResult = defaultObj;
                requestResult.levelId = response.data.levels[0].levelId
                getResults(requestResult)
              }
            } else {
              setSelectedLevel(-1)
            }
          }
        }
      } catch (err) {
        console.error(err);
        setModule({});

        if (err.response) {
          console.log(err.response);
        } else if (err.request) {
          console.error(err.request);
        } else {
          console.error('Servicio encontró un error');
        }
        enqueueSnackbar('El servicio ha encontrado un error', {
          variant: 'error'
        });
      }
      setLoading(false)
    },
    [isMountedRef]
  );

  useEffect(() => {
    const request = {
      id: location.state.moduleId
    };
    setLoading(true);
    getModuleById(request);
  }, [getModuleById]);

  const getResults = async (reqObj) => {
    try {
        const response = await certifyAxios.post(`/trainingModule/level/partner/query`, reqObj);
        if (response.data) {
          if(response.data.list.length === 0 && response.data.total > 0) {
              const lastPage = Math.ceil(response.data.total / reqObj.maxResults);
              reqObj.firstResult = lastPage;
              setPageNumber(lastPage - 1);
              getResults(reqObj);
          }
          else {
              setOtraInfo({
                average: response.data.average,
                quizScore: response.data.quizScore,
                totalQuizPartners: response.data.totalQuizPartners
              })
              setTrainings(response.data.list);
              setNumberOfResults(response.data.total || 0);
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
  }

  const onPageParamsChange = (reqObj) => {
    if(reqObj.maxResults &&  pageSize !== reqObj.maxResults){
      setPageSize(reqObj.maxResults) // "limit" en Results.js
    }
    getResults(reqObj)
  }

  const returnToCapacitations = () => {
    setNiveles([]);
    setTrainings([])
    setOtraInfo({average: 0, quizScore: 0, totalQuizPartners:0})
    navigate('/aim/member/capacitations');
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
                                <Typography variant="h3" component="h3" gutterBottom>
                                    {module?.name && `Resultados de ${module.name}`|| "Resultados de capacitación"}
                                </Typography>
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
                            { niveles !== undefined && 
                            <Grid item xs={12} sm={12} md={8} sx={{pr:`${theme.spacing(2)}`}}>
                                <Paper style={{height:"100%"}} elevation={0}>
                                    {selectedLevel.levelId === -1 &&
                                      <div style={{ display: 'grid', justifyContent: 'center', paddingTop:"6rem" }}>
                                        Sin estadíticas por mostrar
                                      </div>
                                    }
                                    {loading && 
                                        <div style={{ display: 'grid', justifyContent: 'center', paddingTop:"6rem" }}>
                                            <CircularProgress color="secondary" sx={{mb: "1rem", ml:"1.5rem"}}/>
                                        </div>
                                    }
                                    {!loading && selectedLevel.levelId !== undefined && <Grid
                                        container
                                        spacing={0}
                                        direction="column"
                                        paddingLeft={2}
                                        alignContent="stretch" 
                                    > 
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
                                            <div style={{display: 'none'}}>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom:1 }}>
                                                    <h3><b>Resultados de los examenes del módulo</b> </h3>
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'center', marginLeft:3, marginRight:3 }}>
                                                    Seleccione un nivel para ver los resultados de las asociadas
                                                </div>
                                            </div>
                                            
                                            <div style={{ display: 'flex', justifyContent: 'center'}}>
                                                <h2>Examen del Nivel {indexSelected + 1|| 1}</h2>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'center',  marginBottom: '20px'}}>
                                              <Card elevation={0} sx={{backgroundColor:"#f7f7f7"}}>
                                                <Stack
                                                  direction="row"
                                                  justifyContent="space-evenly"
                                                  alignItems="stretch"
                                                  spacing={0}
                                                >
                                                  <Box py={4} px={2} display="flex" alignItems="flex-start">
                                                      <AssignmentIcon fontSize="large" sx={{color:"secondary.main"}}/>
                                                    <Box ml={1}>
                                                      <div>
                                                        Puntaje total: {otraInfo.quizScore || 0} <br/>
                                                        Promedio de notas: {otraInfo.average || 0}
                                                      </div>
                                                    </Box>
                                                  </Box>
                                                  <Box py={4} px={2} display="flex" alignItems="flex-start">
                                                      <AccountCircleIcon fontSize="large" sx={{color:"#ff980f"}}/>
                                                    <Box ml={1} sx={{display:"flex", alignSelf:"center"}}>
                                                      <div>
                                                      Asociadas con puntaje: {otraInfo.totalQuizPartners || 0}
                                                      </div>
                                                    </Box>
                                                  </Box>
                                                </Stack>
                                              </Card>
                                            </div>
                                            <div>
                                                <Results
                                                  trainings={trainings} 
                                                  navigateToModules={returnToCapacitations}
                                                  onPageParamsChange={onPageParamsChange}
                                                  numberOfResults={numberOfResults}
                                                  pageNumber={pageNumber}
                                                  setPageNumber={setPageNumber}
                                                  getTrainings={getResults}
                                                  selectedLevel={selectedLevel}
                                                />
                                            </div>
                                            
                                        </Grid>  
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
                                    <Grid
                                        container
                                        spacing={0}
                                        direction="column"
                                        justifyContent="flex-start"
                                        alignItems="center"
                                        paddingLeft={0}
                                        paddingRight={1}
                                        minHeight="75vh"
                                        >
                                        <Grid
                                            sx={{
                                                mb: `${theme.spacing(2)}`,
                                                pl:`${theme.spacing(2)}`,
                                                alignSelf:"normal"
                                            }}
                                            item
                                            xs={12}
                                            sm={12}
                                            md={12}
                                        >
                                            <Levels 
                                                niveles ={niveles} 
                                                selectedLevel={selectedLevel} 
                                                setSelectedLevel={setSelectedLevel}
                                                getResults={getResults}
                                                setIndexSelected={setIndexSelected}
                                            />
                                        </Grid>

                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                       
                    </DialogContent>
                </form>
        } 
        <Footer />
    </>
)
}

export default withSnackbar(addEditModules);
