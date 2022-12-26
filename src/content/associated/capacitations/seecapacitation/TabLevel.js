import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import FileDownloadRoundedIcon from '@mui/icons-material/FileDownloadRounded';
import { Alert, IconButton, List, ListItem } from '@mui/material';
import { getNameAndUrlFromBack } from 'src/utils/awsConfig';
import { downloadFileHandle } from 'src/content/awstest';

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

export default function BasicTabs(props) {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const downloadFile = (urlBack) => {
    const url = getNameAndUrlFromBack(urlBack)
    downloadFileHandle(url.urlS3, url.nombreOriginal)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Descripción" {...a11yProps(0)} />
          {props.selectedTaller && (props.selectedTaller.resource1 !== "" || props.selectedTaller.resource2 !== "" 
        || props.selectedTaller.resource3 !== "") && <Tab label="Recursos" {...a11yProps(1)} /> }
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {props.selectedTaller?.description || ""}
      </TabPanel>
      {props.selectedTaller && (props.selectedTaller.resource1 !== "" || props.selectedTaller.resource2 !== "" 
        || props.selectedTaller.resource3 !== "") &&
        <TabPanel value={value} index={1}>
          Material adicional de para este taller
          <List disablePadding component="div">
            {props.selectedTaller && props.selectedTaller.resource1 !== "" && <ListItem disableGutters component="div" key={1}>
              <Alert
                  sx={{
                      py: 0,
                      mt: 2,
                      color: "#000"
                  }}
                  icon={<InsertDriveFileOutlinedIcon fontSize="inherit" />}
                  severity="info"
                  variant="outlined"
              >
                <div style={{display:"flex"}}>
                  <div>
                    {getNameAndUrlFromBack(props.selectedTaller.resource1).nombreOriginal}
                  </div>
                  <IconButton onClick={() => {downloadFile(props.selectedTaller.resource1)}} sx={{padding: 0, color: "rgb(98 94 135)", ml: "1rem"}}>
                    <FileDownloadRoundedIcon/> 
                  </IconButton>
                </div>
              </Alert>
            </ListItem>}
            {props.selectedTaller && props.selectedTaller.resource2 !== "" && <ListItem disableGutters component="div" key={2}>
              <Alert
                  sx={{
                      py: 0,
                      mt: 2,
                      color: "#000"
                  }}
                  icon={<InsertDriveFileOutlinedIcon fontSize="inherit" />}
                  severity="info"
                  variant="outlined"
              >
                <div style={{display:"flex"}}>
                  <div>
                    {getNameAndUrlFromBack(props.selectedTaller.resource2).nombreOriginal}
                  </div>
                  <IconButton onClick={() => {downloadFile(props.selectedTaller.resource2)}} sx={{padding: 0, color: "rgb(98 94 135)", ml: "1rem"}}>
                    <FileDownloadRoundedIcon/> 
                  </IconButton>
                </div>
              </Alert>
            </ListItem>}
            { props.selectedTaller && props.selectedTaller.resource3 !== "" && <ListItem disableGutters component="div" key={3}>
              <Alert
                  sx={{
                      py: 0,
                      mt: 2,
                      color: "#000"
                  }}
                  icon={<InsertDriveFileOutlinedIcon fontSize="inherit" />}
                  severity="info"
                  variant="outlined"
              >
                <div style={{display:"flex"}}>
                  <div>
                    {getNameAndUrlFromBack(props.selectedTaller.resource3).nombreOriginal}
                  </div>
                  <IconButton onClick={() => {downloadFile(props.selectedTaller.resource3)}} sx={{padding: 0, color: "rgb(98 94 135)", ml: "1rem"}}>
                    <FileDownloadRoundedIcon/> 
                  </IconButton>
                </div>
              </Alert>
            </ListItem>}
          </List>
        </TabPanel>
      }
    </Box>
  );
}
