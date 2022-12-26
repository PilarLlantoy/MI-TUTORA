import { useState, useEffect, useCallback } from 'react';
import certifyAxios from 'src/utils/aimAxios';
import useAuth from 'src/hooks/useAuth';

import { Helmet } from 'react-helmet-async';
import { Grid,
   Tab,
  Typography,
  Box,
} from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Footer from 'src/components/Footer';
import useRefMounted from 'src/hooks/useRefMounted';

import ResultsPending from './ResultsPending';
import ResultsBooked from './ResultsBooked';
import ResultsPast from './ResultsPast';

// const dummyReservations = {
//   'list':  [
//       {
//       "personName": "string",
//       "reservationId": 0,
//       "scheduleDate": "2022-11-03T18:51:15.783Z",
//       "state": 0,
//       "subjectName": "string",
//       "urlPayment": "string"
//     },
//     {
//       "personName": "string",
//       "reservationId": 0,
//       "scheduleDate": "2022-11-03T18:51:15.783Z",
//       "state": 1,
//       "subjectName": "string",
//       "urlPayment": "string"
//     },

//     {
//       "personName": "string",
//       "reservationId": 0,
//       "scheduleDate": "2022-11-03T18:51:15.783Z",
//       "state": 2,
//       "subjectName": "string",
//       "urlPayment": "string"
//     }
//   ],
//   "message": "string",
//   "resultCode": 0,
//   "total": 0
// }

function ManagementAssociated() {
  const { user } = useAuth();
  const isMountedRef = useRefMounted();
  const [tabValue, setTabValue] = useState('0');
  const [reservations, setReservations] = useState([]);
  const [numberOfResults, setNumberOfResults] = useState(0);
  const [loading, setLoading] = useState(false)

  const handleTabChange = (event, newValue) => {
    setLoading(true);
    setTabValue(newValue);
    const reqObj = {
      "clientId": user.person.id,
      "firstResult": 1,
      "maxResults": 5,
      "partnerId": null,
      "type": parseInt(newValue)
    }
    getReservations(reqObj);
  };

  const getReservations = useCallback(async (reqObj) => {
    try {
      setLoading(true);
      
      const response = await certifyAxios.post('/reservationRequest/history/query', reqObj);

      // setReservations(response.data.list);

      if (isMountedRef.current) {
        setReservations(response.data.list);
        setNumberOfResults(response.data.total);
      }
      setLoading(false);
    } catch (err) {
      
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.error(err.request);
      } else {
        console.error('Some other unknown error');
      }
      setLoading(false);
    }
  }, [isMountedRef]);

  useEffect(() => {
    setLoading(true);
    const reqObj = {
      "clientId": user.person.id,
      "firstResult": 1,
      "maxResults": 5,
      "partnerId": null,
      "type": 0
    }
    getReservations(reqObj);
  }, [getReservations]);

  const onPageParamsChange = (reqObj) => {
    getReservations(reqObj);
  }

  return (
    <>
      <Helmet>
        <title>Reservas</title>
      </Helmet>

      <Grid 
        sx={{ p: 3 }} 
        container 
        justifyContent="space-between" 
        alignItems="center"
      >
        <Grid item>
          <Typography variant="h3" component="h3" gutterBottom>
            Mis Solicitudes de Reserva
          </Typography>
        </Grid>
      </Grid>

      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 2, borderColor: 'divider', px: 4 }}>
          <TabList onChange={handleTabChange} 
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'secondary',
                borderColor: '#1890ff',
                boxShadow: '0px 0px white',
              },
            }}
              textColor="secondary"
              centered
              indicatorColor="secondary" 
              aria-label='lab API tabs example'>
            <Tab label='Pendientes' value='0' />
            <Tab label='Agendadas' value='1' />
            <Tab label='Anteriores' value='2' />
          </TabList>
        </Box>

        <TabPanel value='0'>
          <Grid
            sx={{
              px: 4
            }}
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={4}
          >
            <Grid item xs={12}>
              <ResultsPending 
                onPageParamsChange={onPageParamsChange} 
                reservations={reservations.filter(r => r.state === 0)} 
                numberOfResults={numberOfResults}
                getReservations={getReservations}
                loading={loading}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value='1'>
          <Grid
            sx={{
              px: 4
            }}
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={4}
          >
            <Grid item xs={12}>
              <ResultsBooked 
                onPageParamsChange={onPageParamsChange} 
                reservations={reservations.filter(r => r.state === 1)} 
                numberOfResults={numberOfResults}
                getReservations={getReservations}
                loading={loading}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value='2'>
          <Grid
            sx={{
              px: 4
            }}
            container
            direction="row"
            justifyContent="center"
            alignItems="stretch"
            spacing={4}
          >
            <Grid item xs={12}>
              <ResultsPast 
                onPageParamsChange={onPageParamsChange} 
                reservations={reservations.filter(r => r.state > 1 )} 
                numberOfResults={numberOfResults}
                getReservations={getReservations}
                loading={loading}
              />
            </Grid>
          </Grid>
        </TabPanel>
      </TabContext>

      <Footer />
    </>
  );
}

export default ManagementAssociated;
