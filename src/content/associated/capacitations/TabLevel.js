import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import useRefMounted from 'src/hooks/useRefMounted';
import certifyAxios from 'src/utils/aimAxios';
import { withSnackbar } from 'notistack';
import Results from './Results';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function BasicTabs(props) {
  const [value, setValue] = useState(0);
  const isMountedRef = useRefMounted();
  const [trainings, setTrainings] = useState([])
  const [numberOfResults, setNumberOfResults] = useState(0);
  const [userInfo, setUserInfo] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [pageNumber, setPageNumber] = useState(0);
  const [loading, setLoading] = useState(false)


  const defaultObj = {
    "firstResult": 1,
    "maxResults": 5,
    "partnerId": 0,
    "isFinished": 0,
    "isOptional": 0,
  }

  const getTrainings = useCallback(async (reqObj) => {
    try {
      const response = await certifyAxios.post(`/trainingModule/partner/module/query`, reqObj);
      if (isMountedRef.current) {
        if(response.data){
          if(response.data.progress !== undefined){
            if(response.data.progress === null){
              props.setProgress(null)
            } else if(response.data.progress !== 0){
              props.setProgress(Math.trunc(response.data.progress * 100))
            } else {
              props.setProgress(0)
            }
          }
          if(response.data.list.length === 0 && response.data.total > 0) {
            const lastPage = Math.ceil(response.data.total / reqObj.maxResults);
            reqObj.firstResult = lastPage;
            setPageNumber(lastPage - 1);
            getTrainings(reqObj);
          }
          else {
            setTrainings(response.data.list);
            setNumberOfResults(response.data.total);
          }
        }
        setLoading(false)
      }
    } catch (err) {
      console.error(err);
      
      if (err.response) {
        console.log(err.response);
      } else if (err.request) {
        console.error(err.request);
      } else {
        console.error('Servicio encontró un error');
      }
      props.enqueueSnackbar("El servicio ha encontrado un error", {variant:"error"})
      setLoading(false)
    }
  }, [isMountedRef])

  useEffect(() => {
    const userInfoId = JSON.parse(localStorage.getItem('user'))?.id
    setUserInfo(userInfoId)
    let reqObj = defaultObj;
    reqObj.partnerId = userInfoId
    getTrainings(reqObj);
  }, [getTrainings]);

  const onPageParamsChange = (reqObj) => {
    if(reqObj.maxResults &&  pageSize !== reqObj.maxResults){
      setPageSize(reqObj.maxResults) // "limit" en Results.js
    }
    reqObj.type=value
    getTrainings(reqObj)
  }

  const finalizadasParamsChange = (reqObj) => {
    getTrainings(reqObj)
  }

  const handleChange = (event, newValue) => {
    setLoading(true)
    setValue(newValue);
    const userInfoId = JSON.parse(localStorage.getItem('user'))?.id
    let reqObj = defaultObj;
    reqObj.partnerId = userInfoId
    reqObj.isOptional = newValue
    getTrainings(reqObj)
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Obligatorias" {...a11yProps(0)} />
          <Tab label="Electivas" {...a11yProps(1)} /> 
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}> 
        <Results 
          trainings = {trainings}
          onPageParamsChange={onPageParamsChange}
          numberOfResults={numberOfResults}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          userInfo={userInfo}
          loading={loading}
          isOptional={0}
          finalizadasParamsChange={finalizadasParamsChange}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Results 
        trainings = {trainings}
        onPageParamsChange={onPageParamsChange}
        numberOfResults={numberOfResults}
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        userInfo={userInfo}
        loading={loading}
        isOptional={1}
        finalizadasParamsChange={finalizadasParamsChange}
        />
      </TabPanel>
    </Box>
  );
}

export default withSnackbar(BasicTabs)