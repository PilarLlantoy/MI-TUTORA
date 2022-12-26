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

// const profPic = 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=164&h=164&fit=crop&auto=format'

function ManagementAssociated() {
  const [tabValue, setTabValue] = useState('1');
  const isMountedRef = useRefMounted();

  const [numberOfResultsActive, setNumberOfResultsActive] = useState(0);
  const [numberOfResultsInactive, setNumberOfResultsInactive] = useState(0);

  const [associated, setAssociated] = useState({});

  const getAssociates = useCallback(async (reqObj) => {
    try {
      console.log(reqObj);
      reqObj.suspended = "0"; // Active
      // Active Associates
      const responseActive = await certifyAxios.post('/person/partner/query', reqObj);
      setNumberOfResultsActive(responseActive.data.total);
      console.log(responseActive.data.total);
      console.log(responseActive.data)
      console.log(numberOfResultsActive)

      // Inactive Associates
      reqObj.suspended = "1"; // Inactive
      const responseInactive = await certifyAxios.post('/person/partner/query', reqObj);
      setNumberOfResultsInactive(responseInactive.data.total);
      console.log(numberOfResultsInactive);

      if (isMountedRef.current) {
        if (responseActive.data.list.length === 0 && responseActive.data.total > 0) {
          // const lastPage = Math.ceil(response.data.total / pageSize);
          // reqObj.firstResult = lastPage;
          // setPageNumber(lastPage);
          // getAssociates(reqObj);
        }
        else {
          // console.log(response.data);
          setAssociated({
            active: responseActive.data.list,
            inactive: responseInactive.data.list
          });
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

  useEffect(() => { // initial render
    const reqObj = {
      "firstResult": 1,
      "fullName": "",
      "maxResults": 5,
      "suspended": 0
    }
    getAssociates(reqObj);
  }, [getAssociates]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    // const reqObj = {
    //   "firstResult": 1,
    //   "fullName": "",
    //   "maxResults": 5,
    //   "suspended": +newValue - 1
    // }

    // console.log(reqObj);
    // getAssociates(reqObj);
  };

  const onPageParamsChange = (reqObj) => {
    console.log("OnPageParamsChange called");
    getAssociates(reqObj);
  }

  return (
    <>
      <Helmet>
        <title>Asociadas</title>
      </Helmet>

      <PageTitleWrapper>
        <PageHeader getAssociates={getAssociates} />
      </PageTitleWrapper>

      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 4 }}>
          <TabList onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            aria-label='lab API tabs example'>
            <Tab label='Activas' value='1' />
            <Tab label='Inactivas' value='2' />
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
              <Results
                onPageParamsChange={onPageParamsChange}
                associated={associated.active}
                numberOfResults={numberOfResultsActive}
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
              <Results
                onPageParamsChange={onPageParamsChange}
                associated={associated.inactive}
                numberOfResults={numberOfResultsInactive} />
            </Grid>
          </Grid>
        </TabPanel>

      </TabContext>

      <Footer />
    </>
  );
}

export default ManagementAssociated;
