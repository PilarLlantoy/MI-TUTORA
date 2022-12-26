import { useState, useEffect, useCallback } from 'react';
import axios from 'src/utils/axios';

import { Helmet } from 'react-helmet-async';
import { Grid } from '@mui/material';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import useRefMounted from 'src/hooks/useRefMounted';

import PageHeader from './PageHeader';

import Results from './Results';

function ManagementProjects() {
  const isMountedRef = useRefMounted();
  const [projects, setProjects] = useState([]);

  const getProjects = useCallback(async () => {
    try {
      const response = await axios.get('/api/projects');

      if (isMountedRef.current) {
        setProjects(response.data.projects);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isMountedRef]);

  useEffect(() => {
    getProjects();
  }, [getProjects]);

  return (
    <>
      <Helmet>
        <title>Projects - Management</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader />
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
          <Results projects={projects} />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

export default ManagementProjects;
