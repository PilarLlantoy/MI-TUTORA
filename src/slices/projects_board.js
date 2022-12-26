import { createSlice } from '@reduxjs/toolkit';

import _ from 'lodash';

import axios from 'src/utils/axios';
import objectArray from 'src/utils/objectArray';

const initialState = {
  isLoaded: false,
  lists: {
    byId: {},
    allIds: []
  },
  tasks: {
    byId: {},
    allIds: []
  },
  members: {
    byId: {},
    allIds: []
  }
};

const slice = createSlice({
  name: 'projects_board',
  initialState,
  reducers: {
    getBoard(state, action) {
      const { project } = action.payload;

      state.lists.byId = objectArray(project.lists);
      state.lists.allIds = Object.keys(state.lists.byId);
      state.tasks.byId = objectArray(project.tasks);
      state.tasks.allIds = Object.keys(state.tasks.byId);
      state.members.byId = objectArray(project.members);
      state.members.allIds = Object.keys(state.members.byId);
      state.isLoaded = true;
    },
    updateList(state, action) {
      const { list } = action.payload;

      state.lists.byId[list.id] = list;
    },

    moveTask(state, action) {
      const { taskId, position, listId } = action.payload;
      const { listId: sourceListId } = state.tasks.byId[taskId];

      _.pull(state.lists.byId[sourceListId].taskIds, taskId);
      if (listId) {
        state.tasks.byId[taskId].listId = listId;
        state.lists.byId[listId].taskIds.splice(position, 0, taskId);
      } else {
        state.lists.byId[sourceListId].taskIds.splice(position, 0, taskId);
      }
    }
  }
});

export const reducer = slice.reducer;

export const getBoard = () => async (dispatch) => {
  const response = await axios.get('/api/projects_board/board');

  dispatch(slice.actions.getBoard(response.data));
};

export const updateList = (listId, update) => async (dispatch) => {
  const response = await axios.post('/api/projects_board/list/update', {
    listId,
    update
  });

  dispatch(slice.actions.updateList(response.data));
};

export const moveTask = (taskId, position, listId) => async (dispatch) => {
  await axios.post('/api/projects_board/tasks/move', {
    taskId,
    position,
    listId
  });

  dispatch(
    slice.actions.moveTask({
      taskId,
      position,
      listId
    })
  );
};

export default slice;
