import { useEffect, useState } from 'react';
import {
    Grid, 
    Paper, 
    Typography
  } from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { MedallaProgreso } from 'src/utils/assets';
import useAuth from 'src/hooks/useAuth';
import certifyAxios from 'src/utils/aimAxios';
import TabLevel from './TabLevel';

function ManagementProjects() {

  const [progress, setProgress] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const functionXd = async () => {
      console.log("capa")
      const isEnable = await isEnableAssociated()
      if(localStorage.getItem('firstTime') !== null || localStorage.getItem('firstTime') !== undefined){
        console.log("antes", isEnable, localStorage.getItem('firstTime')==='false')
        if(isEnable && localStorage.getItem('firstTime') === 'false'){
            localStorage.setItem('firstTime', 'true')
            window.location.reload();
        } else if (!isEnable) {
          localStorage.setItem('firstTime', 'false')
        }
      }
    }
    functionXd()
  }, [])
  
  const isEnableAssociated = async () => {
    try {
      const reqObj = {
        "id": user.person.id 
      }
      const response = await certifyAxios.post(`/trainingModule/partner/isDone`, reqObj);
      if(response.data){
        // 0 cuando no termina capacitaciones o no hay
        if (response.data.isDone === 0 || response.data.isDone === null){
          return false
        }
        return true
      }
    } catch (error) {
      // ignore
    }
    // Por defecto solo se mostrará SOLO la opción de "Capacitaciones"
    return false
  }

  return (
    <>
      <Helmet>
        <title>Capacitations - Management</title>
      </Helmet>
      <PageTitleWrapper>
        <Grid container justifyContent="space-between">
          <Grid item xs={12} sm={12} md={7}>
            <Typography variant="h3" component="h3" gutterBottom>
              Capacitaciones
            </Typography>
            <Typography variant="subtitle2">
              Listado de mis capacitaciones
            </Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={4}
            sx={{
              display:"flex",
              justifyContent:"end",
              marginRight:3.5
            }}
          >
            <Paper sx={{padding:2, pr:3}} elevation={0}>

            <div style={{width:"18rem"}}>
            <div style={{fontWeight: 700}}>
            {`${progress || 0} % completado` }
            </div>
            <div style={{width:"18rem", marginTop:"5px", marginBottom:"9px", 
            boxShadow: "0px 1px 4px rgb(0 0 0 / 25%)", borderRadius:"10px"}}>
              <ProgressBar
                percent={progress || 0}
                filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
                unfilledBackground="#fff"
                stepPositions={[100]}
                >
              <Step transition="scale">
              { /* accomplished */ }
                {() => (
                  <img
                  /* style={{ filter: `grayscale(${accomplished ? 0 : 80}%)` }} */
                  width="30"
                  src={MedallaProgreso || ""}
                  alt="progress"
                  />
                  )}
              </Step>
              </ProgressBar>
            </div>
            <div>
              {progress === 100? "¡Felicidades, puedes empezar a enseñar!" : progress === null?
                "":
                "Termina todos las obligatorias para empezar o continuar a enseñar"}
            </div>
            </div>
            </Paper>
          </Grid>
        </Grid>
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
        style={{
            width:"100%", 
            margin: 3
        }}
      >
        <TabLevel setProgress={setProgress}/>  
      </Grid>   

      <Footer />
    </>
  );
}

export default ManagementProjects;
