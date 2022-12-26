import { useState, useEffect, useCallback } from 'react';
// import axios from 'src/utils/axios';
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

function ManagementMember() {

  /*
  
    const [associated, setAssociated] = useState([]);
  
    const getAssociates = useCallback(async () => {
      try {
        const response = await axios.get('/api/associates');
  
        if (isMountedRef.current) {
          setAssociated(response.data.associates);
          console.log(response.data.associates);
        }
      } catch (err) {
        console.error(err);
      }
    }, [isMountedRef]);
  
    useEffect(() => {
      getAssociates();
    }, [getAssociates]);
  
    return (
      <>
        <Helmet>
          <title>Miembros AIM</title>
        </Helmet>
        <PageTitleWrapper>
          <PageHeader getAssociates={getAssociates} />
        </PageTitleWrapper>
  
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
            <Results associated={associated} />
          </Grid>
        </Grid>
        <Footer />
      </>
    );
  }
  
  export default ManagementMember;
  */
  const [tabValue, setTabValue] = useState('1');
  const isMountedRef = useRefMounted();
  const [numberOfResults, setNumberOfResults] = useState(0);
  const [member, setMember] = useState([]);


  const getMembers = useCallback(async (reqObj) => {
    try {
      // const response = await axios.get('/api/members');
      const response = await certifyAxios.post('/person/member/query', reqObj);
      console.log('Received Members: ');
      console.log(response.data);
      setNumberOfResults(response.data.total);

      if (isMountedRef.current) {
        if (response.data.list.length === 0 && response.data.total > 0) {
          // setMember(response.data.associates);
          // console.log(response.data.associates);
        } else {
          setMember(response.data.list);
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
      "fullName": "",
      "maxResults": 5,
      "suspended": 0
    }
    getMembers(reqObj);
  }, [getMembers]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const onPageParamsChange = (reqObj) => {
    getMembers(reqObj);
  }

  return (
    <>
      <Helmet>
        <title>Miembros AIM</title>
      </Helmet>

      <PageTitleWrapper>
        <PageHeader getMembers={getMembers} />
      </PageTitleWrapper>

      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 4 }}>
          <TabList onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            aria-label='lab API tabs example'>
            <Tab label='Activas' value='1' />
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
              <Results getMembers={getMembers} onPageParamsChange={onPageParamsChange} member={member} numberOfResults={numberOfResults} />
            </Grid>
          </Grid>
        </TabPanel>
        {/*
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
              <Results getMembers={getMembers} onPageParamsChange={onPageParamsChange} member={member} numberOfResults={numberOfResults}/>
            </Grid>
          </Grid>
        </TabPanel>
          */}
      </TabContext>

      <Footer />
    </>
  );
}

export default ManagementMember;
