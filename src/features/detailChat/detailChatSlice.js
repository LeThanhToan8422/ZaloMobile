import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from 'expo-constants';

const SERVER_HOST = Constants.manifest.extra.SERVER_HOST;

const initialState = {
   info: {},
   membersInGroup: [],
   status: 'idle',
   error: null,
};

const fetchDetailChat = createAsyncThunk('detailChat/fetchDetailChat', async ({ id, type }) => {
   const response =
      type === 'group'
         ? await axios.get(`${SERVER_HOST}/group-chats/${id}`)
         : await axios.get(`${SERVER_HOST}/users/${id}`);
   return response.data;
});

const fetchMembersInGroup = createAsyncThunk('detailChat/fetchMembersInGroup', async (id) => {
   const res = await axios.get(`${SERVER_HOST}/users/get-members-in-group/${id}`);
   return res.data;
});

const detailChatSlice = createSlice({
   name: 'detailChat',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchDetailChat.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(fetchDetailChat.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.info = action.payload;
         })
         .addCase(fetchDetailChat.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })
         .addCase(fetchMembersInGroup.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(fetchMembersInGroup.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.membersInGroup = action.payload;
         })
         .addCase(fetchMembersInGroup.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
   },
});

const { actions, reducer } = detailChatSlice;
export const {} = actions;
export { fetchDetailChat, fetchMembersInGroup };
export default reducer;
