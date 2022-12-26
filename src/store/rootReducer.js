import { combineReducers } from '@reduxjs/toolkit';
import { reducer as calendarReducer } from 'src/slices/calendar';
import { reducer as calendarReducerReserva } from 'src/content/student/associatedProfile/CalendarComponent/slice/calendar';
import { reducer as projectsBoardReducer } from 'src/slices/projects_board';
import { reducer as mailboxReducer } from 'src/slices/mailbox';
import { reducer as calendarReducerStudent } from 'src/content/student/classes/slice/calendar';
import { reducer as calendarAvailabilityReducer } from 'src/content/associated/disponibility/slice/calendar';
import { reducer as calendarReducerFiltros } from  'src/content/student/courses/CalendarComponent/slice/calendar';

const rootReducer = combineReducers({
  calendar: calendarReducer,
  projectsBoard: projectsBoardReducer,
  mailbox: mailboxReducer,
  calendarStudent: calendarReducerStudent,
  calendarAvailability: calendarAvailabilityReducer,
  calendarReserva:  calendarReducerReserva,
  calendarFiltros : calendarReducerFiltros
});

export default rootReducer;
