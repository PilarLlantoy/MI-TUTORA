import {
  Button,
  Box,
  Badge,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  styled,
} from '@mui/material';
import Gauge from 'src/components/Gauge';
import { DefaultTraining } from 'src/utils/assets';
import { buildStyles } from 'react-circular-progressbar';
import { useNavigate } from 'react-router-dom';
import { getNameAndUrlFromBack } from 'src/utils/awsConfig';

const AvatarWrapper = styled(Avatar)(
  ({ theme }) => `
      width: ${theme.spacing(9)};
      height: ${theme.spacing(9)};
  `
);

function Doctors({module, finalizada = false, finalizadaSelected = 0}) {
  const navigate = useNavigate();
  const urlS3 = module.photoUrl && module.photoUrl.length > 0 && getNameAndUrlFromBack(module.photoUrl).urlS3 || ""

  const goToSeeCapacitation = (id) => {
    navigate('/aim/associated/capacitations/seeCapacitation', {
      state: { moduleId: id, finalizadaSelected }
    });
  };

  return (
    <div style={{ width: '100%', marginBottom: '2px' }}>
      <List>
        {module !== undefined && 
        <ListItem
          sx={{
            py: 1
          }}
          alignItems="flex-start"
        >
          <ListItemAvatar>
            <Badge
              overlap="rectangular"
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <AvatarWrapper
                variant="rounded"
                alt="Capacitation Image"
                sx={{width:"135px"}}
                src={urlS3 !== ""? urlS3 : DefaultTraining}
              />
            </Badge>
          </ListItemAvatar>
          <ListItemText
            sx={{
              pl: 2
            }}
            style={{ alignContent: 'left' }}
            primary={
              <>
                <Typography variant="h4" gutterBottom>
                  {module?.moduleName || ""}
                </Typography>
              </>
            }
            secondary={
              <>
                <div style={{maxWidth:"30rem"}}>
                  {module?.moduleDescription || ""}
                </div> 
              </>
            }
            secondaryTypographyProps={{ variant: 'subtitle2' }}
          />
          {!finalizada && <Box alignSelf="center" style={{paddingRight: '80px', paddingLeft: '50px'}}>
            <Gauge
              circleRatio={1}
              styles={buildStyles({ rotation: 0 })}
              value={module?.progress*100 || 0}
              strokeWidth={10}
              text={`${module?.progress && Math.trunc(module?.progress*100) || 0}%`}
              color="primary"
              size="medium"
            />
          </Box>}
          <Box alignSelf="center">
            <Button
              sx={{
                mt: { xs: 2, sm: 0 }
              }}
              size="small"
              variant="outlined"
              onClick={() => goToSeeCapacitation(module.moduleId)}
            >
              {module?.progress === 0? "Comenzar": finalizada? "Ver Capacitación" : "Continuar"}
            </Button>
          </Box>
          
        </ListItem>}
      </List>
      <Divider />
    </div>
  );
}

export default Doctors;
