/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import axios from 'src/utils/axios';
import certifyAxios from 'src/utils/aimAxios';
import { addHours } from 'date-fns';

const color_availabilities = "#4dae20";
const color_reservations = "#00b5e2";

const initialState = {
  events: [],
  otros:[],
  horario:[],
  celda:[],
  isDrawerOpen: false,
  selectedEventId: null,
  selectedRange: null,
  option: "VIEW",
  selectable: false,
  hasPreviousEvents: false,
  weekNumber: 0
};

const slice = createSlice({
  name: 'calendarAvailability',
  initialState,
  reducers: {
    getHorario(state,action){
      return state.horario
    }
    ,
    getOtros(state, action) {
      const { otros } = action.payload;
      state.otros = [...otros];
    },
    getEvents(state, action) {
      const { events, weekNumber } = action.payload;
      state.hasPreviousEvents = events.length > 0;
      state.weekNumber = weekNumber;
      state.events = [...events];
    },
    deleteEvent(state, action) {
      const { eventId } = action.payload;
      state.events = state.events.filter( event => event.id != eventId );
    },
    changeColor(state, action) {
      const { eventId,color } = action.payload;
      //console.log(state);
      let event = state.events.find((e) => e.availabilityId === eventId);
      state.events = state.events.filter( event => event.availabilityId != eventId );
      if(color === "anterior"){
        event.color = color_availabilities;
      }
      else{
        event.color = "#FFD133";
      }
      state.events = [...state.events, event];
      // Bien CSMR XD
      //event.color = "#FFD133";
      //state.events = state.events.filter( event => event.id != eventId );
    }
    ,
    selectRange(state, action) {
      const { start, end, availabilityId } = action.payload;

      let event = {
        id: uuidv4(),
        allDay: false,
        color: color_availabilities,
        description: 'DISPONIBLE',
        end: end,
        start: start,
        title: 'DISPONIBLE',
        free: true,
        availabilityId: availabilityId,
        isCellAvailability: true
      };
      console.log("event",event);
      state.events = [...state.events, event];
    },
    changeOption(state, action) {
      const { option } = action.payload;
      switch(option){
        case "SAVE":
          state.selectable = false;
          state.option = "VIEW";
          break;
        case "CANCEL":
          state.selectable = false;
          state.option = "VIEW";
          break;
        case "EDIT":
          state.selectable = true;
          state.option = "EDIT";
          break;
      }
    },
    setHorario(state,action){
      const { horario } = action.payload;
      state.horario = horario;
    },
    setCelda(state,action){
      const { celda } = action.payload;
      state.celda = celda;
    }
  }
});

const prevEvents = [
  {
    id: uuidv4(),
    allDay: false,
    color: '#00c6f7', //'#57CA22',
    description: '',
    end: new Date(2022, 10, 6, 12, 0, 0),
    start: new Date(2022, 10, 6, 11, 0, 0),
    title: 'DISPONIBLE',
  }
];



export const getEvents = (id, weekNumber=0) => async (dispatch) => {
  console.log('2. getEvents');
  try {
    let body = { partnerId: id, weekNumber};
    const result = await certifyAxios.post("/availability/query",body);
    const data = result.data;

    let listAvailabilities =  data.availabilities.list;
    let messageAvailabilities = data.availabilities.message;
    let resultCodeAvailabilities = data.availabilities.resultCode;
    let totalAvailabilities = data.availabilities.total;

    let listReservations =  data.reservations.list;
    let messageReservations = data.reservations.message;
    let resultCodeReservations = data.reservations.resultCode;
    let totalReservations = data.reservations.total;

    let events = [];
    let otros = [];
    if(totalAvailabilities > 0){
      // Process list to events
      events = Array.from(listAvailabilities).map( obj => {
        return {
          id: uuidv4(),
          allDay: false,
          color: color_availabilities,
          description: '',
          title: 'DISPONIBLE',
          start: new Date(obj.date).getTime(),
          end: addHours(new Date(obj.date), 1).getTime(),
          free: obj.free,
          availabilityId: obj.availabilityId,
          isCellAvailability: true
        };
      });
      otros = events;
    }

    if(totalReservations > 0){
      let reservations = Array.from(listReservations).map( obj => {
        return {
          id: uuidv4(),
          allDay: obj.allDay,
          color: color_reservations,
          description: obj.description,
          title: obj.title,
          start: (new Date(obj.start)).getTime(),
          end: (new Date(obj.end)).getTime(),
          free: false,
          reservationsId: obj.id,
          isCellAvailability: false
        };
      });
      events = events.concat(reservations);
    }

    dispatch(slice.actions.getEvents({ events, weekNumber }));
    dispatch(slice.actions.getOtros({ otros}));
  } catch (e) {
    console.error(e);
  }
};

export const selectEvent = (eventId) => async (dispatch) => {
  console.log('2. selectEvent');
  try {
    dispatch(slice.actions.deleteEvent({ eventId }));
  } catch (e) {
    console.error(e);
  }
};

export const selectRange = (start, end, availabilityId) => async (dispatch) => {
  console.log('2. selectRange');
  console.log(start, end, availabilityId);
  try {
    dispatch(
      slice.actions.selectRange({
        start,
        end,
        availabilityId
      })
    );
  } catch (e) {
    console.log(e);
  }
};

export const changeOptionEdit = () => (dispatch) => {
  console.log("2. change");
  try {
    dispatch(slice.actions.changeOption({option: "EDIT"}));
  } catch (error) {
    console.error(error);
  }
}

export const changeOptionSave = () => (dispatch) => {
  console.log("2. change");
  try {
    dispatch(slice.actions.changeOption({option: "SAVE"}));
  } catch (error) {
    console.error(error);
  }
}

export const changeOptionCancel = () => (dispatch) => {
  console.log("2. change");
  try {
    dispatch(slice.actions.changeOption({option: "CANCEL"}));
  } catch (error) {
    console.error(error);
  }
}

export const changeOption = (option) => (dispatch) => {
  console.log("2. change");
  try{
    dispatch(slice.actions.changeOption({option}));
  }catch(e){
    console.log(e);
  }
}
export const changeColor = (eventId,color) => async(dispatch) => {
  //console.log('2. selectEvent');
  //console.log("Asdasd");
  //console.log(state.events);
  try {
    dispatch(slice.actions.changeColor({ eventId,color }));
  } catch (e) {
    console.error(e);
  }
};

export const setHorario = (horario) => async(dispatch) => {

  try {
    dispatch(slice.actions.setHorario({ horario }));
  } catch (e) {
    console.error(e);
  }
};

export const setCelda = (celda) => async(dispatch) => {

  try {
    dispatch(slice.actions.setCelda({ celda }));
  } catch (e) {
    console.error(e);
  }
};


export const getHorario = () => async(dispatch) => {

  try {
    dispatch(slice.actions.getHorario());
  } catch (e) {
    console.error(e);
  }
};

export const reducer = slice.reducer;

/* eslint-enable */
