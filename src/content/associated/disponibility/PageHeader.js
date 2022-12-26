import { Typography, Button, Grid } from '@mui/material';
import EventTwoToneIcon from '@mui/icons-material/EventTwoTone';
import PropTypes from 'prop-types';

const PageHeader = ({ option, handleEditClick, handleSaveClick  }) => {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          Horario de disponibilidad
        </Typography>
      </Grid>
      <Grid item>
        {option === 'VIEW' ? (
          <Button
            sx={{
              mt: { xs: 2, md: 0 }
            }}
            onClick={handleEditClick}
            variant="contained"
            color="primary"
            startIcon={<EventTwoToneIcon fontSize="small" />}
          >
            Modificar
          </Button>
        ) : (
          <>
            <Button
              sx={{
                mt: { xs: 2, md: 0 }
              }}
              onClick={handleSaveClick}
              variant="contained"
              color="primary"
              startIcon={<EventTwoToneIcon fontSize="small" />}
            >
              Terminar
            </Button>
            {/* <Button
              sx={{
                mt: { xs: 2, md: 0 }
              }}
              onClick={handleCancelClick}
              variant="contained"
              color="primary"
              startIcon={<EventTwoToneIcon fontSize="small" />}
            >
              Cancelar
            </Button> */}
          </>
        )}
      </Grid>
    </Grid>
  );
};

PageHeader.propTypes = {
  handleEditClick: PropTypes.func,
  handleSaveClick: PropTypes.func,
};

PageHeader.defaultProps = {
  handleEditClick: () => {},
  handleSaveClick: () => {},
  handleCancelClick: () => {},
};

export default PageHeader;
