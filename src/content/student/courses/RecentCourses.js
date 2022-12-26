/* eslint-disable */
import { useState, useEffect, Fragment, useRef } from 'react';
import {
  Button,
  Card,
  Slider,
  CardContent,
  Box,
  CardHeader,
  Link,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  // Avatar,
  useTheme,
  Pagination,
  CardActions,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled,
  IconButton,
  Tooltip,
  ButtonGroup
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'src/store';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import axios from 'src/utils/aimAxios';
import { Link as RouterLink } from 'react-router-dom';
import {getNameAndUrlFromBack} from 'src/utils/awsConfig';
import StarIcon from '@mui/icons-material/Star';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { formatNameCapitals } from 'src/utils/training';
import Reports from './Reports';
import Calendario from './Calendario';
import { cleanEvents } from './CalendarComponent/slice/calendar';


// import { SettingsAccessibility } from '@mui/icons-material';
// import associatedData from './associated.json';

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

function RecentCourses() {
  const theme = useTheme();
  // const [associated] = useState(associatedData);
  const [associated, setAssociated] = useState([]);
  const [fullName, setFullName] = useState('');
  const [totalAssociated, setTotalAssociated] = useState(0);
  const [page, setPage] = useState(1);
  const [grade, setGrade] = useState('');
  const [grades, setGrades] = useState([]);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [subject, setSubject] = useState('');
  const [subjects, setSubjects] = useState([]);
  const disabledButton = useRef(false);

  const { events,horario, isDrawerOpen, selectedRange, option, selectable, hasPreviousEvents, weekNumber } = useSelector(
    (state) => state.calendarFiltros
  );

//  const [filters, setFilters] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getAssociated = async (_page = 1,version) => {
    try {
      // const pathWithOutFilters = '/person/partner/query';
      //console.log(events);
      
      const pathWithFilters = '/person/client/partner/query';
      const body = {
        firstResult: _page,
        fullName,
        maxResults: 5
      };
      let path;

      // if (true) {
      //   path = pathWithFilters;
      //   body.categoryId = null;
      //   body.gradeId = null;
      //   body.subjectId = null;
      //   body.priceMax = 100;
      //   body.priceMin = 0;
      //   body.availabilities=[];
      // } else {
      //   path = pathWithFilters;
      //   body.categoryId = category;
      //   body.gradeId = grade;
      //   body.subjectId = subject;
      //   body.priceMax = 999;
      //   body.priceMin = 0;
      //   body.availabilities=[];
      // }

      path = pathWithFilters;
      if(grade=='') body.gradeId = null;
       else body.gradeId = grade
      if(category=='') body.categoryId = null;
      else body.categoryId = category;
      if(subject=='') body.subjectId = null;
       else body.subjectId = subject;
      // body.categoryId = null;
      // body.subjectId = null;
      body.priceMax = priceValue[1];
      body.priceMin = priceValue[0];
      let disponi = [];
      let a ;
      for(let i = 0;i<events.length;i++){
        a = new Date(events[i].start);
        disponi.push(a);
      }
      
      body.availabilities=disponi;

      if(version=="inicial"){
        body.gradeId = null;
        body.categoryId = null;
        body.subjectId = null;
        body.priceMax = 100;
        body.priceMin = 0;
        body.availabilities = [];
      }
      console.log('Soy el body ', body);
      const response = await axios.post(path, body);

      setTotalAssociated(response.data.total);
      setAssociated(response.data.list);
      console.log(response.data.list);
    } catch (err) {
      console.error(err);
    }
  };

  const getGrades = async () => {
    try {
      const response = await axios.post('/common/classGrade/query');
      setGrades(response.data.list);
    } catch (err) {
      console.error(err);
    }
  };

  const getCategories = async () => {
    try {
      const response = await axios.post('/common/classCategory/query');
      setCategories(response.data.list);
    } catch (err) {
      console.error(err);
    }
  };

  const getSubjects = async (id) => {
    try {
      const response = await axios.post('/common/classSubject/query', { id });
      setSubjects(response.data.list);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGradeChange = (e) => {
    setGrade(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    getSubjects(e.target.value);
    setSubject('');
    // disabledButton.current = true;
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
    // disabledButton.current = false;
  };

  const resetFilters = () => {
    // disabledButton.current = true;
    setGrade('');
    setCategory('');
    setSubject('');
    setPriceValue([0,100]);
    dispatch(cleanEvents());
    getAssociated(1,"inicial");
  };

  useEffect(() => {
    getAssociated(1,"");
    getGrades();
    getCategories();
    return () => {
      setAssociated([]);
      setGrades([]);
      setCategories([]);
      setSubjects([]);
    };
  }, []);

  const userName = "Esto es una prueba";
  const clientId = 1;
  const partnerId = 1;
  
  const handleChangeSlider = (event, newValue, activeThumb) => {
    const minDistance = 5;
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setPriceValue([
        Math.min(newValue[0], priceValue[1] - minDistance),
        priceValue[1]
      ]);
    } else {
      setPriceValue([
        priceValue[0],
        Math.max(newValue[1], priceValue[0] + minDistance)
      ]);
    }
  };
const [priceValue, setPriceValue] = useState([0, 100]);

// const handleSubmit = async () => {

//   try {
//     navigate('/aim/student/profile/'+a.partnerId);

//   } catch (err) {
//     //handleFailure(err.message);
//     console.error(err);
    
//     if (err.response) {
//       console.log(err.response);
//     } else if (err.request) {
//       console.error(err.request);
//     } else {
//       console.error('Some other unknown error');
//     }
//   }
// }

  return (
    <div style={{display:"flex"}}>
      {/* Este Grid es para el lado de la izquierda */}
      <Grid container xs={5} md={5} sm={5} sx={{paddingRight:"15px"}}>
        <Card>  
        <CardContent>
          <Card elevation={0} sx={{border: "1px solid #E8E8E8", padding:"15px", marginBottom:"1rem"}}>
              <Typography sx={{ fontSize: 15 }} color="black" gutterBottom >
                Precio
              </Typography>
               <Grid
                container>
                <Grid item xs={12} md={12} sm={12} sx={{paddingX:"10px"}}>
                  <Slider
                  getAriaLabel={() => 'Temperature range'}
                  value={priceValue}
                  onChange={handleChangeSlider}
                  min={0}
                  max={100}
                  step={5}
                  size="small"
                  marks
                  valueLabelDisplay="off"
                  disableSwap
                  />
                </Grid>
                <Grid item xs={12} md={11} sm={11} display="flex" justifyContent="center" paddingLeft="5px">
                  <TextField
                  
                  value={priceValue[0]}
                  name="names"
                  placeholder="mín."
                  variant="outlined"
                  size='small'
                  disabled
                  sx={{marginRight:"1rem"}}
                  />
                  <TextField
                    value={priceValue[1]}
                    name="names"
                    placeholder="máx."
                    variant="outlined"
                    size='small'
                    disabled/>
                </Grid>
                <Grid item xs={4} md={4} sm={5}>
                  </Grid>
              </Grid>
          </Card>  
              {/* Aqui va el calendario de disponibilidades */}
              <Calendario id={associated.id} />
          </CardContent>
          {/* <CardActions>
              <Button size="small">Learn More</Button>
          </CardActions> */}
        </Card>
      </Grid>
    <Card sx={{ width: '100%' }}>
      <CardHeader title="Asociadas" />

      <Divider />

      {/* <Reports userName={userName} clientId={clientId} partnerId={partnerId} /> */}
       
      <Grid container spacing={2} xs>

        <Grid item xs={12} md={2} sm={2}>
          <Box pt={1} pl={1}>
            <FormControl variant="outlined" fullWidth size='small'>
              <InputLabel>Grado</InputLabel>
              <Select
                value={grade}
                onChange={handleGradeChange}
                label="Grado"
                placeholder="Seleccione el grado"
              >
                {grades.map((g) => (
                  <MenuItem key={g.key} value={g.key}>
                    {formatNameCapitals(g.value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={12} md={2} sm={2}>
          <Box pt={1}>
            <FormControl sx={{ minWidth: 'calc(100%)' }} size='small'>
              <InputLabel style={{margin:0, padding:0}}>Categoria</InputLabel>
              <Select
                value={category}
                onChange={handleCategoryChange}
                label="Categorias"
                placeholder="Seleccione el curso"
              >
                {categories.map((c) => (
                  <MenuItem key={c.key} value={c.key}>
                    {formatNameCapitals(c.value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={3} md={3} sm={3}>
          <Box pt={1}>
            <FormControl sx={{ minWidth: 'calc(100%)' }} size='small'>
              <InputLabel>Tema</InputLabel>
              <Select
                value={subject}
                onChange={handleSubjectChange}
                label="Tema"
                placeholder="Seleccione el tema"
              >
                {subjects.map((s) => (
                  <MenuItem key={s.key} value={s.key}>
                    {formatNameCapitals(s.value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
        <Grid item xs={3} md={3} sm={3}>
          <Box pt={1}>
            <TextField
              sx={{
                m: 0
              }}
              size='small'
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nombre completo"
              label="Nombre completo"
              value={fullName}
              fullWidth
              variant="outlined"
            />
          </Box>
        </Grid>
        <Grid item xs={2} md={2} sm={2}>
          <Box pt={1}>
            <Button
              size='small'
              variant="contained"
              onClick={() => getAssociated(1,"")}
              color="secondary"
              disabled={disabledButton.current}
            >
              Buscar
            </Button>
            <Tooltip title="Limpiar filtros" arrow pl={2}>
              <IconButtonWrapper
                sx={{
                  ml: 1,
                  backgroundColor: `${theme.colors.secondary.lighter}`,
                  color: `${theme.colors.secondary.main}`,
                  transition: `${theme.transitions.create(['all'])}`,

                  '&:hover': {
                    backgroundColor: `${theme.colors.secondary.main}`,
                    color: `${theme.palette.getContrastText(
                      theme.colors.secondary.main
                    )}`
                  }
                }}
                onClick={() => resetFilters()}
              >
                <RestartAltIcon fontSize="small" />
              </IconButtonWrapper>
            </Tooltip>
          </Box>
        </Grid>
      </Grid>

      <>
        <List disablePadding>
          {associated.length === 0
            ? ''
            : associated.map((a) => (
                <Fragment key={a.id}>
                  <ListItem
                    sx={{
                      display: { xs: 'block', md: 'flex' },
                      py: 3,
                      px: 4
                    }}
                    key={a.id}
                  >
                    <ListItemAvatar
                      sx={{
                        mr: 2,
                      }}
                    >

                        <img
                          // src={a.photoUrl}
                          src={(a.urlPhoto!=null && a.urlPhoto!=="") ? getNameAndUrlFromBack(a.urlPhoto).urlS3 :
                            "http://localhost:3000/image/associated.jpg"}
                          alt="..."
                          style={{
                            height: '100px',
                            width: '150px',
                            borderRadius: '15%',
                            objectFit: 'cover'
                          }}
                        />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <>
                          <Typography
                            color="black"
                            variant='h4'
                          >
                            {formatNameCapitals(a.fullName).replace(',', '')}
                          </Typography>
                          
                          {/* {a.university !== null ? (
                            <Typography variant="h4">
                              {a.university} ({a.career})
                            </Typography>
                          ) : (
                            ''
                          )} */}
                          <Box
                            sx={{
                              pb: 1,
                              mt:1
                            }}
                          >
                            {a.qualification !== null ? ( [...Array(parseInt(a.qualification))].map(() => {
                              return <StarIcon color="warning" />;
                            })
                            ):(
                              <Typography variant="h5">Sin calificación</Typography>                              
                            )}
                          </Box>
                          {a.university !== null  && a.major !== null ? (
                          <Grid display='flex' alignItems='center'>
                            <SchoolRoundedIcon style={{height: '18px', marginRight: '5px', color: 'black'}}/> 
                            <Typography variant="h5">{formatNameCapitals(a.university + ' - ' + a.major)}</Typography>
                          </Grid>)
                          :(<></>)}
                        </>
                      }
                      primaryTypographyProps={{ variant: 'h4' }}
                      secondary={
                        <Grid display='flex' alignItems='center'>
                          <AssignmentIndIcon style={{height: '18px', marginRight: '5px', color: 'black'}}/>
                          {a.description || ''}
                        </Grid>
                      }
                      secondaryTypographyProps={{
                        variant: 'h5',
                        sx: {
                          pt: 1
                        }
                      }}
                    />
                    
                      <Box
                        sx={{
                          p: 3,
                          display: 'flex',
                          justifyContent: 'center'
                        }}
                      >
                        <ButtonGroup
                          orientation="vertical"
                          aria-label="vertical outlined button group"
                          style={{justifyContent:'center'}}
                        >
                          <Button
                                sx={{ mb: 2, width: '90px',
                                  color: '#ffffff', backgroundColor: '#00ab41',borderColor: 'transparent',
                                  "&:hover": {backgroundColor: "#00ab41", cursor:"default"}}}
                                size="small"
                                variant="contained"
                                
                              //   style={{
                              //     borderRadius: 35,
                              //     backgroundColor: "#21b6ae",
                              //     padding: "18px 36px",
                              //     fontSize: "18px"
                              // }}
                              >
                                S/ {a.price || '15.00'}
                            </Button>
                           <Button
                              sx={{
                                mb: 2,borderColor: 'transparent', width:'90px'
                              }}
                              size="small"
                              component={RouterLink}
                              to={`/aim/student/profile/${a.partnerId}`}
                              variant="contained"
                              color="secondary"
                              // onClick={()=>navigate('/aim/student/profile/'+a.partnerId)}
                            >
                              Reservar
                            </Button>
                            
                        </ButtonGroup>
                      </Box>
                  </ListItem>

                  <Divider component="li" />
                </Fragment>
              ))}
        </List>
        <CardActions
          disableSpacing
          sx={{
            p: 3,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Pagination
            size="large"
            count={Math.ceil(totalAssociated / 5)}
            color="primary"
            page={page}
            onChange={(e, v) => {
              setPage(v);
              getAssociated(v,"");
            }}
          />
        </CardActions>
      </>
    </Card>
    </div>
  );
}

export default RecentCourses;
