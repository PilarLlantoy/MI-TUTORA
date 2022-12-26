/* eslint-disable */
import { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import certifyAxios from 'src/utils/aimAxios';
import Actions from './Actions';
import useAuth from 'src/hooks/useAuth';
import {
  Grid,
  Drawer,
  Box,
  Divider,
  Card,
  useMediaQuery,
  styled,
  useTheme
} from '@mui/material';

import { useDispatch, useSelector } from './../../../store';

import {
  updateEvent,
  selectEvent,
  selectRange,
  closeDrawerPanel,
  getEvents
} from './slice/calendar';

import PageHeader from './PageHeader';

import EventDrawer from './EventDrawer';
import PageTitleWrapper from './PageTitleWrapper';
import Footer from './Footer';
import { Legend2 } from 'src/utils/assets';

const FullCalendarWrapper = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(3)};

    & .fc-license-message {
      display: none;
    }
    .fc {

      .fc-col-header-cell {
        padding: ${theme.spacing(1)};
        background: ${theme.colors.alpha.black[5]};
      }

      .fc-scrollgrid {
        border: 2px solid ${theme.colors.alpha.black[10]};
        border-right-width: 1px;
        border-bottom-width: 1px;
      }

      .fc-cell-shaded,
      .fc-list-day-cushion {
        background: ${theme.colors.alpha.black[5]};
      }

      .fc-list-event-graphic {
        padding-right: ${theme.spacing(1)};
      }

      .fc-theme-standard td, .fc-theme-standard th,
      .fc-col-header-cell {
        border: 1px solid ${theme.colors.alpha.black[10]};
      }

      .fc-event {
        padding: ${theme.spacing(0.1)} ${theme.spacing(0.3)};
      }

      .fc-list-day-side-text {
        font-weight: normal;
        color: ${theme.colors.alpha.black[70]};
      }

      .fc-list-event:hover td,
      td.fc-daygrid-day.fc-day-today {
        background-color: ${theme.colors.primary.lighter};
      }

      td.fc-daygrid-day:hover,
      .fc-highlight {
        background: ${theme.colors.alpha.black[10]};
      }

      .fc-daygrid-dot-event:hover, 
      .fc-daygrid-dot-event.fc-event-mirror {
        background: ${theme.colors.primary.lighter};
      }

      .fc-daygrid-day-number {
        padding: ${theme.spacing(1)};
        font-weight: bold;
      }

      .fc-list-sticky .fc-list-day > * {
        background: ${theme.colors.alpha.black[5]} !important;
      }

      .fc-cell-shaded, 
      .fc-list-day-cushion {
        background: ${theme.colors.alpha.black[10]} !important;
        color: ${theme.colors.alpha.black[70]} !important;
      }

      &.fc-theme-standard td, 
      &.fc-theme-standard th,
      &.fc-theme-standard .fc-list {
        border-color: ${theme.colors.alpha.black[30]};
      }
    }
`
);

const selectedEventSelector = (state) => {
  const { events, selectedEventId } = state.calendarStudent;
  if (selectedEventId) {
    return events.find((_event) => _event.id == selectedEventId);
  }
  return null;
};

function ApplicationsCalendar() {
  const theme = useTheme();

  const calendarRef = useRef(null);
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { events, isDrawerOpen, selectedRange } = useSelector(
    (state) => state.calendarStudent
  );
  const selectedEvent = useSelector(selectedEventSelector);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState(mobile ? 'listWeek' : 'timeGridWeek');

  const handleRangeSelect = (arg) => {
    const calItem = calendarRef.current;

    if (calItem) {
      const calApi = calItem.getApi();

      calApi.unselect();
    }

    dispatch(selectRange(arg.start, arg.end));
  };

  const handleEventSelect = async(arg) => {

    let cell = events.find((e) => e.id == arg.event.id);
   // Cambio: RECORDAR DESCOMENTAR ESTA PARTE DEL CÓDIGO
    // if(new Date(cell.end).getTime() >= Date.now()
    //     && new Date(cell.start).getTime()-300000 <= Date.now()) {
    //   dispatch(selectEvent(arg.event.id));
    // }
    dispatch(selectEvent(arg.event.id));
  };

  const handleEventResize = async ({ event }) => {
    try {
      await dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const { user } = useAuth();

  const handleDateNext = () => {
    const calItem = calendarRef.current;

    if (calItem) {
      const calApi = calItem.getApi();

      calApi.next();
      setDate(calApi.getDate());
      let reqObj = {
        "firstResult": 1,
        "maxResults": 10,
        "clientId": user.person.id,
        "requestDate": calApi.getDate(),
        "state":1
      };
      
      certifyAxios.post('/reservationRequest/queryFilterState', reqObj)
            .then(
                (response) => {
                  dispatch(getEvents(response));
                }
            )
    }
  };

  const handleDatePrev = () => {
    const calItem = calendarRef.current;

    if (calItem) {
      const calApi = calItem.getApi();

      calApi.prev();
      setDate(calApi.getDate());
      let reqObj = {
        "firstResult": 1,
        "maxResults": 10,
        "clientId": user.person.id,
        "requestDate": calApi.getDate(),
        "state":1
      };
      
      certifyAxios.post('/reservationRequest/queryFilterState', reqObj)
            .then(
                (response) => {
                  dispatch(getEvents(response));
                }
            )
    }
  };

  const handleDateToday = () => {
    const calItem = calendarRef.current;

    if (calItem) {
      const calApi = calItem.getApi();

      calApi.today();
      setDate(calApi.getDate());
      let reqObj = {
        "firstResult": 1,
        "maxResults": 10,
        "clientId": user.person.id,
        "requestDate": calApi.getDate(),
        "state":1
      };
      
      certifyAxios.post('/reservationRequest/queryFilterState', reqObj)
            .then(
                (response) => {
                  dispatch(getEvents(response));
                }
            )
    }
  };

  const handleEventDrop = async ({ event }) => {
    try {
      dispatch(
        updateEvent(event.id, {
          allDay: event.allDay,
          start: event.start,
          end: event.end
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  const closeDrawer = () => {
    dispatch(closeDrawerPanel());
  };

  useEffect(() => {

    let reqObj = {
      "firstResult": 1,
      "maxResults": 10,
      "clientId": user.person.id,
      "requestDate": new Date(),
      "state":1
    };
    
    certifyAxios.post('/reservationRequest/queryFilterState', reqObj)
          .then(
              (response) => {
                dispatch(getEvents(response));
              }
          )
  }, [dispatch]);

  useEffect(() => {
    const calItem = calendarRef.current;

    if (calItem) {
      const calApi = calItem.getApi();
      const changedView = mobile ? 'listWeek' : 'timeGridWeek';

      calApi.changeView(changedView);
      setView(changedView);
    }
  }, [mobile]);

  return (
    <>
      <PageTitleWrapper>
        <PageHeader/>
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
          <Card>
            <Box p={3}>
              <Actions
                date={date}
                onNext={handleDateNext}
                onPrevious={handleDatePrev}
                onToday={handleDateToday}
              />
            </Box>
            <Divider />
            <Box p={3}>
              <img style={{display: 'block', width: '200px'}} alt='leyenda-disponibilidad' src={Legend2}/>
            </Box>
            <Divider />
            <FullCalendarWrapper>
              <FullCalendar locale={esLocale}
                allDaySlot = {false}
                slotMinTime = "08:00:00"
                slotMaxTime = "22:00:00"
                slotDuration= "01:00:00"
                snapDuration= "01:00:00"
                expandRows
                initialDate={date}
                initialView={view}
                droppable={false}
                eventDisplay="block"
                eventClick={handleEventSelect}
                eventDrop={handleEventDrop}
                dayMaxEventRows={4}
                eventResizableFromStart
                eventResize={handleEventResize}
                events={events}
                headerToolbar={false}
                height={660}
                ref={calendarRef}
                rerenderDelay={10}
                select={handleRangeSelect}
                selectAllow={
                  (selectInfo) => {
                    let {start, end} = selectInfo;
                    let selection = end.getTime() - start.getTime();
                    selection = selection / 1000;
                    selection = selection / 3600;
                    return selection == 1;
                  }
                }
                weekends
                plugins={[
                  dayGridPlugin,
                  timeGridPlugin,
                  interactionPlugin,
                  listPlugin
                ]}
              />
            </FullCalendarWrapper>
          </Card>
        </Grid>
      </Grid>
      <Footer />
      <Drawer
        variant="temporary"
        anchor={theme.direction === 'rtl' ? 'left' : 'right'}
        onClose={closeDrawer}
        open={isDrawerOpen}
        elevation={9}
      >
        {isDrawerOpen && (
          <EventDrawer
            event={selectedEvent}
            range={selectedRange}
            onAddComplete={closeDrawer}
            onCancel={closeDrawer}
            onDeleteComplete={closeDrawer}
            onEditComplete={closeDrawer}
          />
        )}
      </Drawer>
    </>
  );
}

export default ApplicationsCalendar;
/* eslint-enable */