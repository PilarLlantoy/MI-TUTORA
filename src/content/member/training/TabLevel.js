/* eslint-disable */
import { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
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

function BasicTabs({
    trainings, navigateToModules, onPageParamsChange,
    numberOfResults, pageNumber, 
    setPageNumber, deleteModuleById, getTrainings
}) {
  const [value, setValue] = useState(0);
  const [publicado, setPublicado] = useState(1); // 1: publicado 0: no publicado

  const defaultObj = {
    "firstResult": 1,
    "description": "",
    "maxResults": 10,
    "isOptional": 0,
    "isVisible": 0 
  }

  const handleChange = (event, newValue) => {
    // setLoading(true)
    setPublicado(1)
    setValue(newValue);
    let reqObj = defaultObj;
    // TODO: ver si isOptional
    reqObj.isOptional = newValue
    reqObj.isVisible = 1
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
          trainings={trainings} 
          navigateToModules={navigateToModules}
          onPageParamsChange={onPageParamsChange}
          numberOfResults={numberOfResults}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          deleteModuleById={deleteModuleById}
          getTrainings={getTrainings}
          isOptional={0}
          publicado={publicado}
          setPublicado={setPublicado}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Results 
          trainings={trainings} 
          navigateToModules={navigateToModules}
          onPageParamsChange={onPageParamsChange}
          numberOfResults={numberOfResults}
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
          deleteModuleById={deleteModuleById}
          getTrainings={getTrainings}
          isOptional={1}
          publicado={publicado}
          setPublicado={setPublicado}
        />
      </TabPanel>
    </Box>
  );
}

export default withSnackbar(BasicTabs)