/* eslint-disable */
import { useState, useRef, useEffect } from 'react';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { Helmet } from 'react-helmet-async';
import Footer from 'src/components/Footer';
import FullCalendar, { rangeContainsMarker } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import useAuth from 'src/hooks/useAuth';
import esLocale from '@fullcalendar/core/locales/es';
import {
  Grid,
  Box,
  Card,
  Divider,
  useMediaQuery,
  styled,
  useTheme,
  Typography
} from '@mui/material';

import { useDispatch, useSelector } from 'src/store';
import {
  getEvents,
  selectEvent,
  selectRange,
  changeOption,
  changeOptionSave,
  changeOptionEdit,
  changeOptionCancel,
  changeColor,
  setHorario,
  setCelda,
  AddDisponibility,
  getEventos,
  deleteEvent
} from './CalendarComponent/slice/calendar';
import PageHeader from './CalendarComponent/PageHeader';

import Actions from './CalendarComponent/Actions';
import certifyAxios from 'src/utils/aimAxios';
// import useAuth from 'src/hooks/useAuth';

const FullCalendarWrapper = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(3)};

    & .fc-license-message {
      display: none;
    }
    .fc {

      .fc-col-header-cell {
        padding: ${theme.spacing(.5)};
        color: #666666;
        background: white;
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
        border: 1px 0px 0px solid ${theme.colors.alpha.black[10]};
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
  const { events, selectedEventId } = state.calendarFiltros;

  if (selectedEventId) {
    return events.find((_event) => _event.id === selectedEventId);
  }
  return null;
};

function Calendario({id}) {
  const theme = useTheme();

  const calendarRef = useRef(null);
  const mobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const { events,horario, isDrawerOpen, selectedRange, option, selectable, hasPreviousEvents, weekNumber } = useSelector(
    (state) => state.calendarFiltros
  );
  const selectedEvent = useSelector(selectedEventSelector);
  const [date, setDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState(mobile ? 'timeGridWeek' : 'timeGridWeek');
  const { user } = useAuth();

  const [last,setLast] = useState("");


  const handleAddClick = () => {
    alert(option);
    // dispatch(openDrawerPanel());
  };

  /**
   * Agregar una nueva disponibilidad
   * @param {*} arg 
   */
  const handleRangeSelect = async(arg) => {
    // console.log("Se selecciono disponibilidad");

    let cell = arg;
    
    //let cell = events.find((e) => e.id === arg.event.id);
    // Check if it is free
    //if(cell.isCellAvailability) return;
    // Check if it has an id
    //if(cell.availabilityId == undefined) return;
    // Check if it's lower than current date
    if(cell.start < Date.now()) return;
    console.log(arg);
    dispatch(
    AddDisponibility(
      new Date(cell.start).getTime(),new Date(cell.end).getTime()
    ));
    //cell.color = "#FFD133";
    // Change color of current cell
    //return;
    // if(last === ""){
    //   dispatch(
    //     changeColor(
    //       cell.availabilityId,"marcado"
    //     )
    //   );
    //   setLast(cell.availabilityId);
    //   console.log(cell);
    //   let inicio = new Date(cell.start);
    //   let fin = new Date(cell.end);
    //   let horarioEnviar =  "Inicio: " + inicio.toLocaleString() + " Fin: " + fin.toLocaleString();
    //   console.log(horarioEnviar);
    //   dispatch(setHorario(horarioEnviar));
    //   dispatch(setCelda(cell));
    // }
    // else{
    //   dispatch(
    //     changeColor(
    //       last,"anterior"
    //     )
    //   );
    //   setLast( cell.availabilityId);
    //   dispatch(
    //     changeColor(
    //       cell.availabilityId,"marcado"
    //     )
    //   );
      
      //console.log('asdsadsad');
      // console.log(cell);
      // let inicio = new Date(cell.start);
      // let fin = new Date(cell.end);
      // // console.log(new Date(cell.start));
      // // console.log(new Date(cell.end));
      // let horarioEnviar =  "Inicio: " + inicio.toLocaleString() + "  Fin: " + fin.toLocaleString();
      // console.log(horarioEnviar);
      // dispatch(setHorario(horarioEnviar));
      // dispatch(setCelda(cell));

      // const calItem = calendarRef.current;
      // console.log(calItem);
      // if(arg.start.getTime() < Date.now()) return;
 
  };

  /**
   * Selecciona un evento disponible
   * @param {*} arg 
   * @returns 
   */
  const handleEventSelect = async(arg) => {
    console.log("1. Deseleccionar evento");
    

      // Find cell
      // console.log("asdasdsad");
      let cell = events.find((e) => e.id === arg.event.id);
      console.log(cell);
      dispatch(
        changeColor(
         cell.id,"black"
      ));
      // Check if it is free
      // if(cell.isCellAvailability) return;
      // // Check if it has an id
      // if(cell.availabilityId == undefined) return;
      // // Check if it's lower than current date
      // if(cell.start < Date.now()) return;
      // //cell.color = "#FFD133";
      // // Change color of current cell
      // if(last === ""){
      //   dispatch(
      //     changeColor(
      //       cell.availabilityId,"marcado"
      //     )
      //   );
      //   setLast(cell.availabilityId);
      //   console.log(cell);
      //   let inicio = new Date(cell.start);
      //   let fin = new Date(cell.end);
      //   let horarioEnviar =  "Inicio: " + inicio.toLocaleString() + " Fin: " + fin.toLocaleString();
      //   console.log(horarioEnviar);
      //   dispatch(setHorario(horarioEnviar));
      //   dispatch(setCelda(cell));
      // }
      // else{
      //   dispatch(
      //     changeColor(
      //       last,"anterior"
      //     )
      //   );
      //   setLast( cell.availabilityId);
      //   dispatch(
      //     changeColor(
      //       cell.availabilityId,"marcado"
      //     )
      //   );
        
      //   //console.log('asdsadsad');
      //   console.log(cell);
      //   let inicio = new Date(cell.start);
      //   let fin = new Date(cell.end);
      //   // console.log(new Date(cell.start));
      //   // console.log(new Date(cell.end));
      //   let horarioEnviar =  "Inicio: " + inicio.toLocaleString() + "  Fin: " + fin.toLocaleString();
      //   console.log(horarioEnviar);
      //   dispatch(setHorario(horarioEnviar));
      //   dispatch(setCelda(cell));
      // }

      // Call api
      // let availabilityId = cell.availabilityId;
      // try {
      //   console.log("Event id to be deleted: ", availabilityId);
      //   const body = {availabilityId};
      //   const result = await certifyAxios.post("/availability/update",body);
      //   if(result.status == 200){
      //     const data = result.data;
      //     console.log(data);
      //     dispatch(selectEvent(arg.event.id));
      //   }
      // } catch (e) {
      //   console.error(e);
      // }
  };

  const handleEditClick = () => {
    dispatch(changeOptionEdit());
  }

  const handleSaveClick = () => {
    dispatch(changeOptionSave());
  }

  const handleCancelClick = () => {
    dispatch(changeOptionCancel());
  }
  
  useEffect(() => {
    dispatch(getEvents(id));
  }, [dispatch]);

  useEffect(() => {
    const calItem = calendarRef.current;

    if (calItem) {
      const calApi = calItem.getApi();
      const changedView = mobile ? 'timeGridWeek' : 'timeGridWeek';

      calApi.changeView(changedView);
      setView(changedView);
    }
  }, [mobile]);


  const handleDateToday = () => {
    const calItem = calendarRef.current;

    if (calItem) {
      const calApi = calItem.getApi();
      calApi.today();
      setDate(calApi.getDate());

      dispatch(getEvents(id));
    }
  };

  const handleDatePrev = () => {
    const calItem = calendarRef.current;

    if (calItem) {
      const calApi = calItem.getApi();

      calApi.prev();
      setDate(calApi.getDate());

      dispatch(getEvents(id, weekNumber-1));
    }
  };

  const handleDateNext = () => {
    const calItem = calendarRef.current;

    if (calItem) {
      const calApi = calItem.getApi();

      calApi.next();
      setDate(calApi.getDate());

      dispatch(getEvents(id, weekNumber+1));
    }
  };


  return (
    <>
      <Helmet>
        <title>Calendar - Applications</title>
      </Helmet>
      {/* <PageTitleWrapper>
        <PageHeader handleCreateEvent={handleAddClick} option={option}
        handleEditClick = {handleEditClick}
        handleSaveClick = {handleSaveClick}
        handleCancelClick = {handleCancelClick}
        />
      </PageTitleWrapper> */}
      <Grid >
        <Grid item xs={12}>
          <Card elevation={0} sx={{border: "1px solid #E8E8E8"}}>
            <Typography sx={{ fontSize: 15, paddingTop:"15px", paddingLeft:"15px"}} color="black" gutterBottom >
                Disponibilidad
            </Typography>
            <Box p={1} paddingRight="25px">
              <Actions
                date={date}
                view={view}
                onNext={handleDateNext}
                onPrevious={handleDatePrev}
                onToday={handleDateToday}
              />
            </Box>
            <FullCalendarWrapper>
              <FullCalendar
                displayEventTime={false} 
                allDaySlot = {false}
                slotMinTime = "08:00:00"
                slotMaxTime = "22:00:00"
                slotDuration= "01:00:00"
                snapDuration= "01:00:00"
                locale={esLocale}
                dayHeaderFormat={{ weekday: 'short', day: '2-digit' }}
                firstDay={1}
                expandRows
                initialDate={date}
                initialView={view}
                // droppable
                // eventDisplay="block"
                dragScroll={false}
                eventClick={handleEventSelect}
                // eventDrop={handleEventDrop}
                // dayMaxEventRows={4}
                // eventResizableFromStart
                // eventResize={handleEventResize}
                events={events}
                headerToolbar={false}
                height={400}
                ref={calendarRef}
                rerenderDelay={10}
                select={handleRangeSelect}
                selectable={true}
                weekends
                selectLongPressDelay={10}
                selectAllow={
                  (selectInfo) => {
                    let {start, end} = selectInfo;
                    let selection = end.getTime() - start.getTime();
                    selection = selection / 1000;
                    selection = selection / 3600;
                    return selection == 1;
                  }
                }
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
      {/* <Footer /> */}
    </>
  );
}

export default Calendario;
/* eslint-enable */