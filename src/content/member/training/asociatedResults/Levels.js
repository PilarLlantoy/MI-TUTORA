import {
  Box,
  Grid,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemText
} from '@mui/material';
import Scrollbar from 'src/components/Scrollbar';

function Levels({ niveles = [], setSelectedLevel, selectedLevel, getResults, setIndexSelected}) {
  const theme = useTheme();
  const defaultObj = {
    "firstResult": 1,
    "maxResults": 10,
    "levelId": 0,
    "type": 0
  }

  const changeLevel = (nivel, index) => {
    setSelectedLevel(nivel)
    setIndexSelected(index)
    let requestResult = defaultObj;
    requestResult.levelId = nivel.levelId
    getResults(requestResult)
  }


  return (
    <div>
      <Grid container>
        <Grid 
          item 
          xs={12}
          sm={12}
          md={12}
          sx={{
            px: `${theme.spacing(1)}`
          }}
        >
          <Box
            pr={0.5}
            sx={{
              pt: `${theme.spacing(2)}`,
              pb: { xs: 1, md: 0 }
            }}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            >
            <b>Niveles del módulo</b>      
            
          </Box>
        </Grid>
        
        <Grid 
          item 
          xs={12}
          sm={12}
          md={12}
          sx={{minHeight:"75vh"}}
        >
        <Scrollbar autoHide={false}>
        <Grid
          container
          spacing={0}
          paddingLeft={0}
          paddingRight={1.5}
          minHeight="75vh"
          >
          <Grid
              item
              xs={12}
              sm={12}
              md={12}
          >

        <List>
          {niveles && niveles.map((nivel, index) => (
            <ListItem key={index} disablePadding sx={{mt:1}}>
              <ListItemButton
                selected={selectedLevel && selectedLevel.levelId === nivel.levelId}              
                onClick={() => {changeLevel(nivel, index)}}
                sx={{
                  "&.Mui-selected" :{
                    backgroundColor:"rgb(146 146 146 / 10%)",
                    '&:hover':{
                      backgroundColor:"rgb(182 223 255 / 10%)",
                    }
                  },
                  '&:hover':{
                    backgroundColor:"rgb(182 223 255 / 10%)",
                  }
                }}
              >
                <ListItemText primary={`Nivel ${index + 1}`} />
              </ListItemButton>
            </ListItem>
))}
          {niveles?.length === 0 &&
            <div style={{
              display:"flex", 
              justifyContent:"center",
              color:"gray",
              paddingTop:`${theme.spacing(15)}`
            }}> 
              Sin niveles 
            </div>
          }
        </List>
        
        </Grid>
        </Grid>
        </Scrollbar>
        </Grid>
      </Grid>
    </div>

    
  );
}

export default Levels;
