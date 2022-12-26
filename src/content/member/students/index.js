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

function ManagementStudents() {
  const [tabValue, setTabValue] = useState('1');
  const isMountedRef = useRefMounted();

  const [numberOfResultsActive, setNumberOfResultsActive] = useState(0);
  const [numberOfResultsInactive, setNumberOfResultsInactive] = useState(0);

  const [associated, setAssociated] = useState({});

  const getAssociates = useCallback(async (reqObj) => {
    try {
      reqObj.status = 4; // Active

      const responseActive = await certifyAxios.post('/person/client/stats', reqObj);

      console.log("======Active======");
      // console.log(reqObj);
      // console.log(responseActive);
      console.log(responseActive.data.list);
      setNumberOfResultsActive(responseActive.data.total);

      reqObj.status = 3; // Inactive

      const responseInactive = await certifyAxios.post('/person/client/stats', reqObj);

      console.log("======Inactive======");
      // console.log(reqObj);
      // console.log(responseInactive);
      console.log(responseInactive.data.list);
      setNumberOfResultsInactive(responseInactive.data.total);

      if (isMountedRef.current) {
        if (responseActive.data.list.length === 0 && responseActive.data.total > 0 && responseInactive.data.list.length === 0 && responseInactive.data.total > 0) {
          // const lastPage = Math.ceil(response.data.total / pageSize);
          // reqObj.firstResult = lastPage;
          // setPageNumber(lastPage);
          // getAssociates(reqObj);
        }
        else {
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

  useEffect(() => {
    console.log("Hola");
    const reqObj = {
      "firstResult": 1,
      "maxResults": 5
    }
    getAssociates(reqObj);
  }, [getAssociates]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const onPageParamsChange = (reqObj) => {
    // console.log(`Parent received: reqObj = `, reqObj);

    // const {
    //   curPageNumberFromObj,
    //   fullNameFromObj,
    //   pageSizeFromObj,
    //   suspendedFromObj
    // } = reqObj;

    // setPageNumber(curPageNumberFromObj);
    // setPageSize(pageSizeFromObj);
    // setFullName(fullNameFromObj);
    // setSuspended(suspendedFromObj);

    // console.log('ignore this: ', fullName, suspended);

    getAssociates(reqObj);
    // setPageNumber(pageNumberP);
  }

  return (
    <>
      <Helmet>
        <title>Clientes</title>
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
            <Tab label='Activos' value='1' />
            <Tab label='Inactivos' value='2' />
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
                numberOfResults={numberOfResultsActive} />
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

export default ManagementStudents;
