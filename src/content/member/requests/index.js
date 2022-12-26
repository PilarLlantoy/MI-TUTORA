import { useState, useEffect, useCallback } from 'react';
import certifyAxios from 'src/utils/aimAxios';

import { Helmet } from 'react-helmet-async';
import { Grid, Tab, Box } from '@mui/material';

import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import useRefMounted from 'src/hooks/useRefMounted';

import PageHeader from './PageHeader';

import Results from './Results';

// import requestsJSON from './requests.json';


function ManagementRequests() {
  const [tabValue, setTabValue] = useState('1');
  const isMountedRef = useRefMounted();
  const [numberOfResults, setNumberOfResults] = useState(0);

  const [requests, setRequests] = useState([]);

  // const [associated, setAssociated] = useState();

  const getRequests = useCallback(async (reqObj) => {
    try {
      const response = await certifyAxios.post('/request/complaint/query', reqObj);
      setNumberOfResults(response.data.total);
      console.log(response.data);
      if (isMountedRef.current) {
        if (response.data.list.length === 0 && response.data.total > 0) {

          setRequests(response.data.list);
          console.log(response.data);
        } else {
          setRequests(response.data.list);
        }
      }
    } catch (err) {
      console.error(err);

      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.error(err.request);
      } else {
        console.error('Some other unknown error');
      }
    }
  }, [isMountedRef]);

  useEffect(() => {
    const reqObj = {
      "firstResult": 1,
      "maxResults": 5,
      "partnerName": "",
      "requestType": 2,
      "state": 0
    }

    getRequests(reqObj);
    // setRequests(requestsJSON);
  }, [getRequests]);


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const onPageParamsChange = (reqObj) => {

    getRequests(reqObj);
  };


  return (
    <>
      <Helmet>
        <title>Solicitudes</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader getRequests={getRequests} />
      </PageTitleWrapper>

      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 4 }}>
          <TabList onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            aria-label='lab API tabs example'>
            <Tab label='Nuevas' value='1' />
            <Tab label='Procesadas' value='2' />
          </TabList>
        </Box>

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
              <Results onPageParamsChange={onPageParamsChange} requests={requests} setNumberOfResults={numberOfResults} />
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
              <Results onPageParamsChange={onPageParamsChange} requests={requests} setNumberOfResults={numberOfResults} />
            </Grid>
          </Grid>
        </TabPanel>
      </TabContext>
      <Footer />
    </>
  );
}

export default ManagementRequests;
