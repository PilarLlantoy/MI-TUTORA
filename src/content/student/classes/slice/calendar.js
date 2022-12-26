/* eslint-disable */

import { createSlice } from '@reduxjs/toolkit/dist';
const initialState = {
    events: [],
    otros:[],
    isDrawerOpen: false,
    selectedEventId: null,
    selectedRange: null
  };
 const slice =  createSlice({
    name: 'calendarStudent',
    initialState,
    reducers: {
      getEvents(state, action) {
        const { events } = action.payload;
        state.events =  action.payload;
      },
      updateEvent(state, action) {
        const { event } = action.payload;
  
        state.events = _.map(state.events, (_event) => {
          if (_event.id === event.id) {
            return event;
          }
  
          return _event;
        });
      },
      selectRange(state, action) {
        const { start, end } = action.payload;
  
        state.isDrawerOpen = true;
        state.selectedRange = {
          start,
          end
        };
      },
      selectEvent(state, action) {
        const { eventId = null } = action.payload;
  
        state.isDrawerOpen = true;
        state.selectedEventId = eventId;
      },
      openDrawerPanel(state) {
        state.isDrawerOpen = true;
      },
      closeDrawerPanel(state) {
        state.isDrawerOpen = false;
        state.selectedEventId = null;
        state.selectedRange = null;
      }
    }
  });

  let eventosGa = [
    {
      id: '1',
      allDay: false,
      color: '#FF1943',
      description: '',
      end: new Date(2022,10,8,13,0,0,0) ,
      start: new Date(2022,10,8,9,0,0,0) ,
      title: 'avance de tesis',
      reunionUrl : "/room/01-01012022",
      name : 'Aragod',
      career : 'niño de primaria',
      avatar : 'https://drive.google.com/file/d/1HqfgVkSFWFm2kOeJmskmOhOVody2Xx_U/view?usp=sharing'
    },
  ]

  export const getEventsMock = () => async (dispatch) => {
    try {
      dispatch(slice.actions.getEvents({events: eventosGa}));

    } catch (e) {
      console.error(e);
    }
  };

  export const getEvents = (response) => async (dispatch) => {
    try {
      dispatch(slice.actions.getEvents(response.data.list));

    } catch (e) {
      console.error(e);
    }
  };

  export const updateEvent = (eventId, update) => async (dispatch) => {
    const response = await axios.post('/api/calendar/meetings/update', {
      eventId,
      update
    });
  
    dispatch(slice.actions.updateEvent(response.data));
  };
  
  export const selectEvent = (eventId) => async (dispatch) => {
    dispatch(slice.actions.selectEvent({ eventId }));
  };

  export const selectRange = (start, end) => (dispatch) => {
    dispatch(
      slice.actions.selectRange({
        start: start.getTime(),
        end: end.getTime()
      })
    );
  };
  
  export const openDrawerPanel = () => (dispatch) => {
    dispatch(slice.actions.openDrawerPanel());
  };
  
  export const closeDrawerPanel = () => (dispatch) => {
    dispatch(slice.actions.closeDrawerPanel());
  };

  export const reducer = slice.reducer;
  export default slice;
  /* eslint-enable */
