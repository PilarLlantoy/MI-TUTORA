import { Typography, Grid, Button, Alert, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { formatNameCapitals } from 'src/utils/training';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
// import Legend from './LegendReservas.png';
import { Legend2 } from 'src/utils/assets';

function RecentCourses(props) {
  const [associated] = useState(props.associated);
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

  useEffect(() => {
    getMerit();
  }, [associated]);

  const getMerit = () => {
    let merit = meritOptions.find(merit=> merit.id === associated.merit);
    return merit.name;
  }
  return (
    <Grid container justifyContent='center'>
      <img alt='foto' src={associated.photoUrl !== null ? (associated.photoUrl.split('#').length > 1 ? associated.photoUrl.split('#')[1] : associated.photoUrl) : 'https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png'} style={{marginTop: 0, borderRadius: '10%', width:'80%', height: '130px', objectFit: 'cover'}}/>
      <Grid container xs={12}>
        <Grid container justifyContent='center' xs={12} paddingX=".5rem">
          <Typography variant="h4" component="h4" sx={{ pt: 1 }} fontWeight={640} style={{textAlign: 'center'}}>
            {formatNameCapitals(associated.fullName.replace(',', ''))}
          </Typography>
          <Grid container xs={12} justifyContent='center' alignItems='center' my={1} paddingTop="1rem">
              <SchoolRoundedIcon style={{fontSize: 40, padding:"5px", background:"#E4F1FF", color:"#1965FF", borderRadius:"100%"}}/>
          </Grid>
          <Grid container xs={12} justifyContent='center' sx={{paddingX:"10px"}}>
            <Typography overflow='hidden' variant="h4" component="h4" pb={1} justifySelf='center'  fontWeight={500} style={{textAlign: 'center'}}>
              {formatNameCapitals(associated.university)}
            </Typography>
          </Grid>
          <Grid container xs={0.5}/>
          <Grid xs={11} mb={1}>
            <Divider style={{width:'100%'}}/>
          </Grid>
          <Grid container xs={12} justifyContent='center'>
            <Typography variant="h5" component="h5" color="#909090" fontWeight={500}>
              {associated.career !== null ? formatNameCapitals(associated.career) : 'No presenta información académica'}
            </Typography>
          </Grid>
          <Grid container xs={12} justifyContent='center'>
            <Typography variant="h5" component="h5" color="#909090" fontWeight={500}>
              {associated.phase}° ciclo
            </Typography>
          </Grid>

          <Typography variant="h5" component="h5" color="#909090" fontWeight={500}>
            { getMerit() }
          </Typography>
          <Grid container xs={12} justifyContent='center' alignItems='center' my={1} paddingTop="2rem">
              <AutoStoriesIcon style={{fontSize: 40, padding:"5px", background:"#E4F1FF", color:"#1965FF", borderRadius:"100%"}}/>
          </Grid>
          <Grid container xs={12} justifyContent='center'>
            <Typography variant="h5" component="h5" sx={{ pt: 2, pb: 1 }}>
              Precio por hora:
              <Button
                sx={{ ml: 3 ,color: '#ffffff', backgroundColor: '#00ab41',borderColor: 'transparent',
                "&:hover": {backgroundColor: "#00ab41", cursor:"default"}}}
                size="small"
                variant="contained"
                color="secondary"
              >
                S/ {associated.price || '15.00'}
              </Button>
            </Typography>
          </Grid>
          <Grid container xs={0.5}/>
          <Grid container xs={11}>
            <Alert color='info' icon={false} style={{color: '#6495ED'}} severity="info">Las clases tienen una duración de 60 minutos</Alert>
          </Grid>
          <Grid container xs={11} marginTop={2} paddingTop="2rem">
            <img alt='foto' src={Legend2} width="90%"/>
          </Grid>
          {/* <Grid>
            <Typography variant="h4" component="h4">
              Capacitaciones
              <ul>
                <li>Pedagogía</li>
                <li>Comunicación efectiva</li>
                <li>Expresión oral</li>
              </ul>
            </Typography>
          </Grid> */}
          {/* <Grid>
            <Typography variant="h4" component="h4">
              Certificados
              <ul>
                <li>Inglés avanzado</li>
                <li>Métodos de estudios</li>
                <li>Excel avanzado</li>
              </ul>
            </Typography>
          </Grid> */}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default RecentCourses;
