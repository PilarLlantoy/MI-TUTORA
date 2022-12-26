import { Typography, Grid, Button, Alert, Divider } from '@mui/material';
import { useEffect, useState } from 'react';
import { formatNameCapitals } from 'src/utils/training';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';

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
        <Grid container justifyContent='center' xs={12}>
          <Typography variant="h3" component="h3" sx={{ pt: 1 }} style={{textAlign: 'center'}}>
            {formatNameCapitals(associated.fullName.replace(',', ''))}
          </Typography>
          <Grid container xs={12} justifyContent='center' alignItems='center' my={1}>
              <SchoolRoundedIcon style={{height:'20px', color:'black'}}/>
          </Grid>
          <Grid container xs={12}>
            <Typography overflow='hidden' variant="h4" component="h4" pb={1} justifySelf='center' style={{textAlign: 'center'}}>
              {formatNameCapitals(associated.university)}
            </Typography>
          </Grid>
          <Grid container xs={0.5}/>
          <Grid xs={11} mb={1}>
            <Divider style={{width:'100%'}}/>
          </Grid>
          <Grid container xs={12} justifyContent='center'>
            <Typography variant="h5" component="h5">
              {associated.career !== null ? formatNameCapitals(associated.career) : 'No presenta información académica'}
            </Typography>
          </Grid>
          <Grid container xs={12} justifyContent='center'>
            <Typography variant="h5" component="h5">
              {associated.phase}° ciclo
            </Typography>
          </Grid>

          <Typography variant="h5" component="h5">
            { getMerit() }
          </Typography>
          <Grid container xs={12} justifyContent='center'>
            <Typography variant="h5" component="h5" sx={{ pt: 2, pb: 1 }}>
              Precio por hora:
              <Button
                sx={{ ml: 3 ,color: '#ffffff', backgroundColor: '#00ab41',borderColor: 'transparent',
                "&:hover": {backgroundColor: "#00ab41"}}}
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
            <Alert color='info' style={{color: '#6495ED'}} severity="info">Las clases tienen una duración de 60 minutos</Alert>
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
