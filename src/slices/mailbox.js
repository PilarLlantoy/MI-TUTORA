import { createSlice } from '@reduxjs/toolkit';

import axios from 'src/utils/axios';
import objectArray from 'src/utils/objectArray';

const initialState = {
  mails: {
    byId: {},
    allIds: []
  },
  tags: [],
  sidebarOpen: false
};

const slice = createSlice({
  name: 'mail',
  initialState,
  reducers: {
    getTags(state, action) {
      const { tags } = action.payload;

      state.tags = tags;
    },
    getMails(state, action) {
      const { mails } = action.payload;

      state.mails.byId = objectArray(mails);
      state.mails.allIds = Object.keys(state.mails.byId);
    },
    getMail(state, action) {
      const { mail } = action.payload;

      state.mails.byId[mail.id] = mail;

      if (!state.mails.allIds.includes(mail.id)) {
        state.mails.allIds.push(mail.id);
      }
    },
    openSidebar(state) {
      state.sidebarOpen = true;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    }
  }
});

export const reducer = slice.reducer;

export const getTags = () => async (dispatch) => {
  const response = await axios.get('/api/mailbox/tags');

  dispatch(slice.actions.getTags(response.data));
};

export const getMails = (params) => async (dispatch) => {
  const response = await axios.get('/api/mailbox/mails', {
    params
  });

  dispatch(slice.actions.getMails(response.data));
};

export const getMail = (mailboxCategory) => async (dispatch) => {
  const response = await axios.get('/api/mailbox/mail', {
    params: {
      mailboxCategory
    }
  });

  dispatch(slice.actions.getMail(response.data));
};

export const openSidebar = () => async (dispatch) => {
  dispatch(slice.actions.openSidebar());
};

export const closeSidebar = () => async (dispatch) => {
  dispatch(slice.actions.closeSidebar());
};

export default slice;
