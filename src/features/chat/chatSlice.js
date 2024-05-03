import { createAsyncThunk, createReducer, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from 'expo-constants';

const SERVER_HOST = Constants.expoConfig.extra.SERVER_HOST;

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
      addMessage(state, action) {
         if (state.currentChat.id === action.payload.chatRoom || action.payload.chatRoom.includes(state.currentChat.id))
            state.currentChat.messages.unshift(action.payload);
      },
      updateMessage(state, action) {
         state.currentChat.messages.map((message) => {
            if (message.id === action.payload.id) {
               message.message = action.payload.message;
               message.dateTimeSend = action.payload.dateTimeSend;
               message.isRecalls = action.payload.isRecalls;
            }
         });
      },
      recallMessage(state, action) {
         state.currentChat.messages.map((message) => {
            if (message.id === action.payload.id) {
               message.isRecalls = 1;
            }
         });
      },
      deleteMessage(state, action) {
         state.currentChat.messages = state.currentChat.messages.filter((message) => message.id !== action.payload.id);
      },
      clearMessages(state) {
         state.currentChat.messages = [];
      },
   },
   extraReducers: (builder) => {
      builder
         // Chat
         .addCase(fetchChats.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(fetchChats.fulfilled, (state, action) => {
            state.chats = action.payload.sort((a, b) => new Date(b.dateTimeSend) - new Date(a.dateTimeSend));
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
export const { addMessage, updateMessage, recallMessage, deleteMessage, clearMessages } = actions;
export { fetchChats, fetchMessages };
export default reducer;
