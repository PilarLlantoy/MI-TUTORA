import { useState, useEffect, useCallback } from 'react';
import axios from 'src/utils/axios';

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

const profPic = 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?w=164&h=164&fit=crop&auto=format'

function ManagementStudents() {
  const [tabValue, setTabValue] = useState('1');
  const isMountedRef = useRefMounted();
  const [associated, setAssociated] = useState(
    {
      active: [
      {
        name: 'Fernando',
        fatherLastName: 'Galvan',
        motherLastName: 'Montaner',
        photo: profPic,
        active: 1,
        grade: 'Primaria',
        stats: {
          takenClasses: 14,
          cancelledClasses: 2,
          chosenCourses: 2,
          chosenTeachers: 2,
          complaints: 0,
        }
      },
      {
        name: 'Diego',
        fatherLastName: 'Ramirez',
        motherLastName: 'Saavedra',
        photo: profPic,
        active: 1,
        grade: 'Primaria',
        stats: {
          takenClasses: 14,
          cancelledClasses: 2,
          chosenCourses: 2,
          chosenTeachers: 2,
          complaints: 0,
        }
      },
      {
        name: 'Keith',
        fatherLastName: 'Johnson',
        motherLastName: 'Quispe',
        photo: profPic,
        active: 1,
        grade: 'Primaria',
        stats: {
          takenClasses: 14,
          cancelledClasses: 2,
          chosenCourses: 2,
          chosenTeachers: 2,
          complaints: 0,
        }
      }
    ],
    inactive: [
      {
        name: 'Paolo',
        fatherLastName: 'Herrera',
        motherLastName: 'Subasic',
        photo: profPic,
        active: 0,
        grade: 'Primaria',
        stats: {
          takenClasses: 14,
          cancelledClasses: 2,
          chosenCourses: 2,
          chosenTeachers: 2,
          complaints: 0,
        }
      },
      {
        name: 'Juan',
        fatherLastName: 'Uribe',
        motherLastName: 'Chumpitaz',
        photo: profPic,
        active: 0,
        grade: 'Primaria',
        stats: {
          takenClasses: 14,
          cancelledClasses: 2,
          chosenCourses: 2,
          chosenTeachers: 2,
          complaints: 0,
        }
      }
    ]});

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

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
              <Results associated={associated.active} />
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
              <Results associated={associated.inactive} />
            </Grid>
          </Grid>
        </TabPanel>
      </TabContext>     

      <Footer/>
    </>
  );
}

export default ManagementStudents;
