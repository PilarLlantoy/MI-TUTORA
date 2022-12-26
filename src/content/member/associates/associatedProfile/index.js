import { Helmet } from 'react-helmet-async';
import { Grid } from '@mui/material';
import { useParams } from 'react-router';
import { useEffect, useState } from 'react';

import axios from 'src/utils/aimAxios';
import Footer from 'src/components/Footer';
import SummaryProfile from './SummaryProfile';
import ExtendedProfile from './ExtendedProfile';

function ManagementProjects() {
  const [associated, setAssociated] = useState();
  const { idAssociated } = useParams();

  const getAssociated = async () => {
    try {
      console.log(idAssociated);
      const response = await axios.post('/person/client/partner/find', {
        id: idAssociated
      });
      console.log(idAssociated);
      console.log('data', response.data);
      setAssociated(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAssociated();
  }, []);

  return (
    <>
      <Helmet>
        <title>Perfil de la asociada</title>
      </Helmet>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
        sx={{ mt: 1 }}
      >
        {associated && (
          <>
            <Grid item xs={3} sm={3} md={3}  style={{background: 'white'}}>
              <SummaryProfile associated={associated} />
            </Grid>
            <Grid item xs={9} sm={9} md={9}>
              <ExtendedProfile associated={associated} />
            </Grid>
          </>
        )}
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementProjects;
