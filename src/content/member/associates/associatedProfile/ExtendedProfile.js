import {
  Box, Typography, Button, Dialog, DialogContent, Grid
  , InputLabel, Select,
  MenuItem, FormControl, Slide, Alert
} from '@mui/material';
import { formatNameCapitals } from 'src/utils/training';
import StarIcon from '@mui/icons-material/Star';
import { useEffect, useState } from 'react';
import * as React from 'react';
import certifyAxios from 'src/utils/aimAxios';
import { useSnackbar } from 'notistack';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import useAuth from 'src/hooks/useAuth';
import { useDispatch, useSelector } from 'src/store';
import Calendario from './Calendario'
import {
  getEvents,
} from './CalendarComponent/slice/calendar';


import CalendarioModalReserva from './CalendarioModalReserva';
// import { iniciarChat } from '../../chat/Chat';
// import { set } from 'nprogress';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  }
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`
//   };
// }




function ExtendedProfile(props) {
  const [associated] = useState(props.associated);
  const [expanded, setExpanded] = React.useState('panel1');

  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const { enqueueSnackbar } = useSnackbar();
  // const [value, setValue] = React.useState(0);
  // const [value1, setValue1] = React.useState(0);
  // const [value2, setValue2] = React.useState(0);
  // const handleTabChange = (event, newValue) => {
  //   setValue(newValue);
  // };
  // const handleTabChange1 = (event, newValue) => {
  //   setValue1(newValue);
  // };
  // const handleTabChange2 = (event, newValue) => {
  //   setValue2(newValue);
  // };

  const [openModalInicial, setOpenModalInicial] = useState(false);

  const [openModalReserva, setOpenModalReserva] = useState(false);

  const handleOpenModalInicial = () => {
    setOpenModalInicial(true);
  }

  const handleCloseModalInicial = () => {
    setOpenModalInicial(false);
  }

  const handleOpenModalReserva = () => {
    setOpenModalInicial(false);
    setOpenModalReserva(true);
  }

  const handleCloseModalReserva = () => {
    setOpenModalReserva(false);
  }


  const handleCloseReservaLlamadoAPI = async () => {

    // console.log(categoria);// categoria.categoryId
    // console.log(tema); // tema.subjectId
    // console.log(horario); // horario.inicio ,horario.fin
    // let horario = [];
    // let schedule = JSON.parse(horario); // Lo pasamos a json de nuevo xd
    try {
      let body = {
        categoryId: categoria.categoryId,
        clientId: user.person.id,
        endTime: new Date(celda.end),
        partnerId: associated.id,
        price: 9999, // Arreglar porque ahora esta en null el precio de la socia
        requestDate: new Date(celda.start),
        scheduledDate: new Date(celda.start),
        startTime: new Date(celda.start),
        state: 0,
        subjectId: tema.subjectId
      };

      await certifyAxios.post("/reservationRequest/register", body);

      /* crea chat o envia mensaje */
      // iniciarChat(`Hola, estoy reservando una clase para el ${(new Date(celda.start)).toLocaleDateString()}.`,
      //  user.person.id, associated.id);

      handleAcceptReportClientSuccess();
      setOpenModalReserva(false);
    } catch (e) {
      console.error(e);
    }
  }

  const handleAcceptReportClientSuccess = () => {
    enqueueSnackbar('Solicitud de reserva enviada con éxito', {
      variant: 'success',
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'right'
      },
      autoHideDuration: 3500,
      TransitionComponent: Slide
    });
  }


  const meritOptions = [
    {
      id: 1,
      name: 'Medio Superior'
    },
    {
      id: 2,
      name: 'Tercio Superior'
    },
    {
      id: 3,
      name: 'Quinto Superior'
    },
    {
      id: 4,
      name: 'Décimo Superior'
    }
  ];

  const getMerit = () => {
    let merit = meritOptions.find(merit => merit.id === associated.merit);
    return merit.name;
  }

  useEffect(() => {
    getMerit();
  }, [associated]);


  const [categoria, setCategoria] = React.useState('');
  const [tema, setTema] = React.useState(0);
  const [actual, setActual] = React.useState(0);
  // const [horario, setHorario] = React.useState('');

  // let horario = [];

  const handleCategoria = (event) => {
    setCategoria(event.target.value);
    for (let i = 0; i < associated.categories.length; i++) {
      if (associated.categories[i] === event.target.value) {
        setActual(i);
        break;
      }
    }
    // setTema(event.target.value.subjects[0]);
  };

  // const handleDisponibilidades = (event) => {
  //   console.log(event.target.value);
  //   setHorario(event.target.value);
  // };



  const handleTema = (event) => {
    setTema(event.target.value);
  };

  const { user } = useAuth();

  const dispatch = useDispatch();

  let { otros, horario, celda } = useSelector(
    (state) => state.calendarReserva
    // Este saca los states del puto reducer
  )

  useEffect(() => {
    dispatch(getEvents(associated.id));
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(getHorario());
  // }, [dispatch]);



  //  console.log(otros); 
  let fechasDisponibles = [];
  // console.log(events);
  // Cargamos fechas de disponibles
  otros.forEach(key => {
    fechasDisponibles.push({
      id: key.id,
      inicio: new Date(key.start),
      fin: new Date(key.end)
    });
  })

  fechasDisponibles.sort(function (a, b) {
    // Turn your strings into dates, and then subtract them
    // to get a value that is either negative, positive, or zero.
    return new Date(a.inicio) - new Date(b.inicio);
  });


  //  let temas = [];
  // console.log(fechasDisponibles);

  return (
    <>
      <Grid container xs={12}>
        <Grid container xs={12} md={6}>
          <Typography variant="h3" component="h3" gutterBottom>
            {formatNameCapitals(associated.fullName).replace(',', '')}
          </Typography>
        </Grid>
        <Grid container xs={12} md={4} alignItems='center'>
          <Typography variant="h5" component="h5" gutterBottom mr={1}>
            Puntaje:
          </Typography>
          {[...Array(parseInt('5'))].map(() => {
            return <StarIcon color="warning" />;
          })}
        </Grid>
      </Grid>
      <Grid alignItems='center'>
        <Typography variant="subtitle2" display='flex'>
          Sobre mí: &nbsp;
          {associated.description ||
            `Donec sed erat ut magna suscipit mattis. Aliquam erat volutpat. Morbi in
          orci risus. Donec pretium fringilla blandit. Etiam ut accumsan leo.
          Aliquam id mi quam. Vivamus dictum ut erat nec congue. Etiam facilisis
          lacus ut arcu vulputate, non pellentesque sem convallis. Proin tempus
          sapien nisl, nec varius risus tristique a. Etiam ligula lacus, ultricies
          at cursus id, fringilla nec nulla. Fusce pretium laoreet diam a mollis.
          In finibus purus sed tortor fringilla, eu luctus lorem sodales.Ut
          dignissim ante ac augue vulputate tristique. Mauris venenatis tincidunt
          nibh, sit amet fringilla augue malesuada a. Mauris a nunc congue,
          viverra lectus sed, imperdiet quam. Aenean tempor sem sed lorem
          ultricies lacinia.`}
        </Typography>
      </Grid>
      <Typography variant="h4" component="h4" sx={{ my: 2 }} gutterBottom>
        ¿Qué aprenderás?
      </Typography>
      <div>

        {
          associated.categories.map(option => {
            return (
              <Accordion
                expanded={expanded === 'panel1'}
                onChange={handleChange('panel1')}
              >
                <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
                  <Typography>{formatNameCapitals(option.name)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    <Box sx={{ width: '100%' }}>
                      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs
                          value={option.subjects}

                          aria-label="basic tabs example"
                        >
                          {/* <Tab label="Aritmética" {...a11yProps(0)} />
                        <Tab label="Geometría" {...a11yProps(1)} />
                        <Tab label="Trigonometría" {...a11yProps(2)} /> */}

                          {
                            option.subjects.map(subject => {
                              return (
                                <Tab label={formatNameCapitals(subject.name)} value={" "}>
                                  <TabPanel >
                                    {subject.description}
                                  </TabPanel>
                                </Tab>
                              )
                            })

                          }
                        </Tabs>

                      </Box>
                    </Box>
                  </Typography>
                </AccordionDetails>
              </Accordion>
            )
          })
        }


      </div>

      <Grid container xs={12} alignItems='center' my={1}>
        <Grid xs={6} md={4}>
          <Typography variant="h4" component="h4" sx={{ my: 2 }}>
            Elige tu horario de clase
          </Typography>
        </Grid>

        <Grid xs={6} md={4}>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => { handleOpenModalInicial() }}
          >
            Solicitar Reserva
          </Button>
        </Grid>
      </Grid>

      {/* Aqui deberia ir el calendario */}
      {/* <Typography variant="h4" component="h4" sx={{my: 2}} gutterBottom>
          Aqui va el calendario
        </Typography> */}

      <br />
      <Calendario id={associated.id} />

      {/* Modal Inicial Wizard */}
      <Dialog
        fullWidth
        maxWidth="md"
        open={openModalInicial}
        onClose={handleCloseModalInicial}
      >
        {/* <DialogTitle
                sx={{ p: 3 }}
            >
                <Typography variant="h4" gutterBottom>
                    Prueba Final del Nivel
                </Typography>
            </DialogTitle> */}
        <DialogContent
          dividers
          sx={{
            p: 3,
            background: "#F9F9F9"
          }}
        >
          <Typography variant="h1" component="h4" sx={{ my: 2 }} align="center" gutterBottom>
            ¿Cómo funciona?
          </Typography>
          <br />
          <div>
            <Typography variant="h4" sx={{ my: 2 }}>
              Paso 1. Solicitar reserva
            </Typography>

            <Typography variant="h4" sx={{ my: 5 }}>
              Paso 2. Esperar respuesta de la socia
            </Typography>

            <Typography variant="h4" sx={{ my: 4 }}>
              Paso 3. Asistir a la clase
            </Typography>
          </div>

          <Button
            sx={{ ml: 45 }}
            size="medium"
            variant="contained"
            color="secondary"
            onClick={() => { handleOpenModalReserva() }}
          >
            Continuar
          </Button>
        </DialogContent>
      </Dialog>

      {/* Modal de reserva de clase */}
      <Dialog
        fullWidth
        maxWidth="lg"
        open={openModalReserva}
        onClose={handleCloseModalReserva}
      >
        {/* <DialogTitle
                sx={{ p: 3 }}
            >
                <Typography variant="h4" gutterBottom>
                    Prueba Final del Nivel
                </Typography>
            </DialogTitle> */}
        <DialogContent
          dividers
          sx={{
            p: 1,
            background: "#F9F9F9"
          }}
        >
          {/* SummaryProfile */}
          <Grid
            container
            spacing={2}
          >
            <Grid item xs={3} style={{ textAlign: 'center', background: 'white' }}>
              <img alt='foto' src={associated.photoUrl !== null ? (associated.photoUrl.split('#').length > 1 ? associated.photoUrl.split('#')[1] : associated.photoUrl) : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'} style={{ marginTop: '30px', borderRadius: '10%', width: '80%', height: '130px', objectFit: 'cover' }} />
              <Grid container justifyContent='center'>
                <Typography variant="h3" component="h3" sx={{ pt: 1 }}>
                  {formatNameCapitals(associated.fullName.replace(',', ''))}
                </Typography>
                <Grid container xs={12} justifyContent='center'>
                  <Typography variant="h5" component="h5" sx={{ pt: 2, pb: 1 }}>
                    Precio por hora:
                    <Button
                      sx={{
                        ml: 3, color: '#ffffff', backgroundColor: '#00ab41', borderColor: 'transparent',
                        "&:hover": { backgroundColor: "#00ab41" }
                      }}
                      size="small"
                      variant="contained"
                      color="secondary"
                    >
                      S/ {associated.price || '15.00'}
                    </Button>
                  </Typography>
                </Grid>
                <Grid container xs={0.5} />
                <Grid container xs={11}>
                  <Alert color='info' style={{ color: '#6495ED' }} severity="info">Las clases tienen una duración de 60 minutos</Alert>
                </Grid>

              </Grid>
            </Grid>

            {/* Parte de la derecha del modal de reserva */}

            <Grid item sm={8} >
              <Typography variant="h2" component="h2" sx={{ my: 2 }} align="center" gutterBottom>
                Solicitud de reserva
              </Typography>
              <Typography variant="h4" component="h4">
                Seleccione su tema de preferencia
              </Typography>
              <br />

              <FormControl style={{ minWidth: 140 }}>
                <InputLabel id="demo-simple-select-label">Categoría</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={categoria}
                  label="Categoría"
                  size='small'
                  onChange={handleCategoria}
                >
                  {/* <MenuItem value={10}>Matemática</MenuItem> */}
                  {
                    associated.categories.map(option => {
                      return (
                        <MenuItem value={option}>{formatNameCapitals(option.name)}</MenuItem>
                      )
                    })
                  }
                </Select>
              </FormControl>
              {/* No encontre mejor forma XD */}
              <span style={{ display: 'inline' }}>&nbsp;</span>
              <span style={{ display: 'inline' }}>&nbsp;</span>
              <span style={{ display: 'inline' }}>&nbsp;</span>
              <span style={{ display: 'inline' }}>&nbsp;</span>
              <FormControl style={{ minWidth: 140 }}>
                <InputLabel id="demo-simple-select-label">Tema</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={tema}
                  size='small'
                  label="Tema"
                  onChange={handleTema}
                >
                  {
                    associated.categories.length !== 0 ?
                      ((associated.categories[actual].subjects).map(option => {
                        return (
                          <MenuItem value={option}>{formatNameCapitals(option.name)}</MenuItem>
                        )
                      })) : (<></>)
                  }
                </Select>
              </FormControl>
              <Typography variant="h4" component="h4">
                <br />
                Seleccione un horario según la disponibilidad de la asociada
                {/* {user.id} */}
              </Typography>

              <br />
              <Box component="span"
                sx={{
                  display: 'block',
                  p: 0.5,
                  m: 0.5,
                  mb: 2,
                  bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#101010' : '#fff'),
                  color: (theme) =>
                    theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
                  border: '2px solid',
                  borderColor: (theme) =>
                    theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: '700',
                }}>
                <Typography variant="h4" component="h4">
                  {horario}
                </Typography>
              </Box>

              {/* <FormControl style={{minWidth: 450}}>
          <InputLabel id="demo-simple-select-label">Fecha de reserva</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Categoría"
            onChange={handleDisponibilidades}
            defaultValue="" 
          >
           {fechasDisponibles.map(option => {
            return (
              <MenuItem
              key={option.id}
              value={JSON.stringify({
                id: option.id,
                inicio: option.inicio,
                fin: option.fin
              })}
            >
                Inicio: {option.inicio.toLocaleString() }  &nbsp; &nbsp; Fin: {option.fin.toLocaleString() }
              </MenuItem>
            )
            })}
          </Select>
          </FormControl> */}

              <CalendarioModalReserva id={associated.id} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
              }}>
                <Button
                  sx={{ ml: 67 }}
                  size="medium"
                  variant="contained"
                  color="secondary"
                  onClick={() => { handleCloseModalReserva() }}
                >
                  Cancelar
                </Button>
                <Button
                  sx={{ ml: 2 }}
                  size="medium"
                  variant="contained"
                  color="secondary"
                  onClick={() => { handleCloseReservaLlamadoAPI() }}
                >
                  Solicitar
                </Button>
              </div>

            </Grid>

          </Grid>
        </DialogContent>
      </Dialog>


    </>
  );
}

export default ExtendedProfile;