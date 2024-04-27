import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { SERVER_HOST } from '@env';

const initialState = {
   chats: [],
   currentChat: {
      id: null,
      messages: [],
   },
   status: 'idle',
   error: null,
};

const fetchChats = createAsyncThunk('chat/fetchChats', async (_, { getState }) => {
   const userID = getState().user.user.user;
   const response = await axios.get(`${SERVER_HOST}/users/get-chats-by-id/${userID}`);
   return response.data;
});

const fetchMessages = createAsyncThunk('chat/fetchMessages', async ({ chatId, groupId, page }, { getState }) => {
   const userID = getState().user.user.id;
   const response = chatId
      ? await axios.get(`${SERVER_HOST}/chats/content-chats-between-users/${userID}-and-${chatId}/${page}`)
      : await axios.get(`${SERVER_HOST}/group-chats/content-chats-between-group/${groupId}/${userID}/${page}`);
   return {
      id: chatId ? chatId : groupId,
      messages: response.data,
   };
});

const chatSlice = createSlice({
   name: 'chat',
   initialState,
   reducers: {
      addMessage: (state, action) => {
         state.messages.push(action.payload);
      },
      clearMessages: (state) => {
         state.messages = [];
      },
   },
   extraReducers: (builder) => {
      builder
         // Chat
         .addCase(fetchChats.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(fetchChats.fulfilled, (state, action) => {
            state.chats = action.payload;
         })
         .addCase(fetchChats.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })
         // Messages
         .addCase(fetchMessages.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(fetchMessages.fulfilled, (state, action) => {
            state.currentChat.id = action.payload.id;
            state.currentChat.messages = action.payload.messages.sort(
               (a, b) => new Date(b.dateTimeSend) - new Date(a.dateTimeSend)
            );
         })
         .addCase(fetchMessages.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
   },
});

const { actions, reducer } = chatSlice;
export const { addMessage, clearMessages } = actions;
export { fetchChats, fetchMessages };
export default reducer;
