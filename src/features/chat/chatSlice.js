import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from 'expo-constants';
import { multiStoreData, storeData } from '../../utils/storage';

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

/**
 * Fetch messages of a chat
 * @param {Object} param0 - The chatId or groupId of the chat.
 * @param {string} param0.chatId - The chatId of the chat. Id of the user.
 * @param {string} param0.groupId - The groupId of the chat.
 * @param {number} param0.page - The page number of the messages.
 */
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

const fetchMessagesOfChats = createAsyncThunk('chat/fetchMessagesOfChats', async (_, { getState, dispatch }) => {
   await dispatch(fetchChats()).unwrap();
   const userID = getState().user.user.id;
   const listChat = getState().chat.chats.map(async (chat) => {
      const response = !chat.leader
         ? await axios.get(`${SERVER_HOST}/chats/content-chats-between-users/${userID}-and-${chat.id}/20`)
         : await axios.get(`${SERVER_HOST}/group-chats/content-chats-between-group/${chat.id}/${userID}/20`);
      return {
         id: chat.id,
         messages: response.data,
      };
   });
   return await Promise.all(listChat).then((values) => {
      return values;
   });
});

const chatSlice = createSlice({
   name: 'chat',
   initialState,
   reducers: {
      setChat: (state, action) => {
         state.chats = action.payload;
      },
      setMessages: (state, action) => {
         state.currentChat.id = action.payload.id;
         state.currentChat.messages = action.payload.messages;
      },
      addMessage(state, action) {
         if (state.currentChat.id === action.payload.chatRoom || action.payload.chatRoom.includes(state.currentChat.id))
            state.currentChat.messages.unshift(action.payload);
      },
      updateMessage(state, action) {
         state.currentChat.messages.map((message) => {
            if (message.id === action.payload.id) {
               message.message = action.payload.message || message.message;
               message.dateTimeSend = action.payload.dateTimeSend || message.dateTimeSend;
               message.isRecalls = action.payload.isRecalls || message.isRecalls;
               !message.emojis
                  ? (message.emojis = action.payload.emojis)
                  : (message.emojis += `,${action.payload.emojis}`);
            }
         });
      },
      recallMessage(state, action) {
         state.currentChat.messages.map((message) => {
            if (message.id === action.payload) {
               message.isRecalls = 1;
            }
         });
      },
      deleteMessage(state, action) {
         state.currentChat.messages = state.currentChat.messages.filter((message) => message.idTemp !== action.payload);
      },
      clearMessages(state) {
         state.currentChat.messages = [];
      },
      clearCurrentChat(state) {
         state.currentChat = {
            id: null,
            messages: [],
         };
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
            storeData('@chats', state.chats);
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
         })
         .addCase(fetchMessagesOfChats.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(fetchMessagesOfChats.fulfilled, (state, action) => {
            const dataSet = action.payload.map((chat) => {
               return [
                  `@${chat.id}`,
                  chat.messages.sort((a, b) => new Date(b.dateTimeSend) - new Date(a.dateTimeSend)),
               ];
            });
            multiStoreData(dataSet);
         })
         .addCase(fetchMessagesOfChats.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
   },
});

const { actions, reducer } = chatSlice;
export const {
   setChat,
   setMessages,
   addMessage,
   updateMessage,
   recallMessage,
   deleteMessage,
   clearMessages,
   clearCurrentChat,
} = actions;
export { fetchChats, fetchMessages, fetchMessagesOfChats };
export default reducer;
