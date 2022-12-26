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

import useAuth from 'src/hooks/useAuth';

import PageHeader from './PageHeader';
import ResultsReport from './ResultsReport';
import ResultsProfile from './ResultsProfile';
import ResultsSubject from './ResultsSubject';

// import requestsJSON from './requests.json';


function ManagementRequests() {
  const [tabValue, setTabValue] = useState('1');
  const isMountedRef = useRefMounted();
  const [numberOfResultsReport, setNumberOfResultsReport] = useState(0);
  const [numberOfResultsSubject, setNumberOfResultsSubject] = useState(0);
  const [numberOfResultsProfile, setNumberOfResultsProfile] = useState(0);

  const { user } = useAuth();

  const [requestsReport, setRequestsReport] = useState([]);
  const [requestsSubject, setRequestsSubject] = useState([]);
  const [requestsProfile, setRequestsProfile] = useState([]);
  // const [person, setPerson] = useState(JSON.parse(localStorage.getItem('person')));
  // const [associated, setAssociated] = useState();

  const getRequests = useCallback(async (reqObj) => {
    try {

      reqObj.partner_id = user.person.id;
      reqObj.requestType = 2;
      console.log(reqObj);
      // console.log(user);
      const responseReport = await certifyAxios.post('/request/complaint/query', reqObj);
      setNumberOfResultsReport(responseReport.data.total);
      console.log(responseReport.data);

      reqObj.requestType = 0;
      console.log(reqObj);
      const responseSubject = await certifyAxios.post('/request/subject/query', reqObj);
      setNumberOfResultsSubject(responseSubject.data.total);
      console.log(responseSubject.data);

      reqObj.requestType = 1;
      const responseProfile = await certifyAxios.post('/request/profile/query', reqObj);
      setNumberOfResultsProfile(responseProfile.data.total);
      console.log(responseProfile.data);
      console.log(reqObj);
      if (isMountedRef.current) {
        if (responseReport.data.list.length === 0 && responseReport.data.total > 0) {

          setRequestsReport(responseReport.data.list);
          setRequestsProfile(responseProfile.data.list);
          setRequestsSubject(responseSubject.data.list);
          // console.log(response.data);
        } else {
          setRequestsReport(responseReport.data.list);
          setRequestsProfile(responseProfile.data.list);
          setRequestsSubject(responseSubject.data.list);
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
      "partner_id": user.person.id,
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
        <title>Solicitudes de Socia</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader getRequests={getRequests} />
      </PageTitleWrapper>

      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 4 }}>
          <TabList
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: 'secondary',
                borderColor: '#1890ff',
                boxShadow: '0px 0px white',
              },
            }}
            centered
            indicatorColor="secondary"
            aria-label='lab API tabs example'>
            <Tab label='Cambio de Datos Perfil' value='1' />
            <Tab label='Selección de Temas' value='2' />
            <Tab label='Reportes' value='3' />
          </TabList>
        </Box>

        <TabPanel value='3'>
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
              <ResultsReport
                onPageParamsChange={onPageParamsChange}
                requests={requestsReport}
                numberOfResults={numberOfResultsReport}
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
              <ResultsSubject
                onPageParamsChange={onPageParamsChange}
                requests={requestsSubject}
                numberOfResults={numberOfResultsSubject}
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
              <ResultsProfile
                onPageParamsChange={onPageParamsChange}
                requests={requestsProfile}
                numberOfResults={numberOfResultsProfile}
              />
            </Grid>
          </Grid>
        </TabPanel>
      </TabContext>
      <Footer />
    </>
  );
}

export default ManagementRequests;
