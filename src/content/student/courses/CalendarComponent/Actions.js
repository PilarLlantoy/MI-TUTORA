import { format } from 'date-fns';
import PropTypes from 'prop-types';
import { Grid, Typography, Tooltip, IconButton } from '@mui/material';
import TodayTwoToneIcon from '@mui/icons-material/TodayTwoTone';
import ArrowBackTwoToneIcon from '@mui/icons-material/ArrowBackTwoTone';
import ArrowForwardTwoToneIcon from '@mui/icons-material/ArrowForwardTwoTone';
import { es } from 'date-fns/locale';

// const viewOptions = [
//   {
//     label: 'Month',
//     value: 'dayGridMonth',
//     icon: CalendarViewMonthTwoToneIcon
//   },
//   {
//     label: 'Week',
//     value: 'timeGridWeek',
//     icon: ViewWeekTwoToneIcon
//   },
//   {
//     label: 'Day',
//     value: 'timeGridDay',
//     icon: ViewDayTwoToneIcon
//   },
//   {
//     label: 'Agenda',
//     value: 'listWeek',
//     icon: ViewAgendaTwoToneIcon
//   }
// ];

const Actions = ({ date, onPrevious, onToday, onNext }) => {
  // const { t } = useTranslation();

  return (
    <Grid
      container
      spacing={3}
      alignItems="center"
      justifyContent="space-between"
    >
      <Grid item>
        <Tooltip arrow placement="top" title="Semana anterior">
          <IconButton color="primary" onClick={onPrevious}>
            <ArrowBackTwoToneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip arrow placement="top" title="Esta semana">
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
        <Tooltip arrow placement="top" title="Próxima semana">
          <IconButton color="primary" onClick={onNext}>
            <ArrowForwardTwoToneIcon />
          </IconButton>
        </Tooltip>
      </Grid>
      <Grid
        item
        sx={{
          display: { xs: 'none', sm: 'inline-block' }
        }}
      >
        <Typography variant="h5" color="text.primary">
          {format(date, 'MMMM yyyy', { locale: es })}
        </Typography>
      </Grid>
    </Grid>
  );
};

Actions.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired
  // changeView: PropTypes.func,
  // view: PropTypes.oneOf([
  //   'dayGridMonth',
  //   'timeGridWeek',
  //   'timeGridDay',
  //   'listWeek'
  // ])
};

Actions.defaultProps = {
  onNext: () => {},
  onPrevious: () => {},
  onToday: () => {},
  handleCreateEvent: () => {},
  changeView: () => {}
};

export default Actions;
