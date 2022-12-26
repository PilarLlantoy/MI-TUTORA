
import PropTypes from 'prop-types';
import { Grid, IconButton, Tooltip } from '@mui/material';

import { useTranslation } from 'react-i18next';
import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';

const Actions = ({  onNext, onPrevious, onToday }) => {
  const { t } = useTranslation();

  return (
    <Grid
      container
      spacing={3}
      alignItems="center"
      justifyContent="space-between"
    >
      <Grid item>
        <Tooltip arrow placement="top" title={t('Semana previa')}>
          <IconButton color="primary" onClick={onPrevious}>
            <ArrowBackTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top" title={t('Esta semana')}>
          <IconButton
            color="primary"
            sx={{
              mx: 1
            }}
            onClick={onToday}
          >
            <TodayTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top" title={t('Siguiente semana')}>
          <IconButton color="primary" onClick={onNext}>
            <ArrowForwardTwoToneIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};

Actions.propTypes = {
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
  onToday: PropTypes.func,
};

Actions.defaultProps = {
  onNext: () => {},
  onPrevious: () => {},
  onToday: () => {},
  handleCreateEvent: () => {},
  changeView: () => {}
};

export default Actions;
