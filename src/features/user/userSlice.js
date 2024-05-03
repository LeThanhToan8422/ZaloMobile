import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Constants from 'expo-constants';
import axios from 'axios';
import bcrypt from 'react-native-bcrypt';

const SERVER_HOST = Constants.expoConfig.extra.SERVER_HOST;

const initialState = {
   user: null,
   status: 'idle',
   error: null,
};

const login = createAsyncThunk('user/login', async ({ phone, password }) => {
   const response = await axios.get(`${SERVER_HOST}/accounts/phone/${phone}`);
   if (!(response.data && bcrypt.compareSync(password, response.data.password))) {
      return null;
   }
   const user = await axios.get(`${SERVER_HOST}/users/${response.data.user}`);
   return { ...response.data, ...user.data };
});

const fetchUser = createAsyncThunk('user/fetchUser', async ({ phone }) => {
   const response = await axios.get(`${SERVER_HOST}/accounts/phone/${phone}`);
   if (!response.data) return null;
   const user = await axios.get(`${SERVER_HOST}/users/${response.data.user}`);
   return { ...response.data, ...user.data };
});

const register = createAsyncThunk('user/register', async (user) => {
   const response = await axios.post(`${SERVER_HOST}/accounts`, user);
   return response.data;
});

const userSlice = createSlice({
   name: 'user',
   initialState,
   reducers: {
      updateUser(state, action) {
         state.user = action.payload;
      },
      logout: (state) => {
         state.user = null;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(login.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(login.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.user = action.payload;
         })
         .addCase(login.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })
         .addCase(fetchUser.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(fetchUser.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.user = action.payload;
         })
         .addCase(fetchUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
   },
});

const { actions, reducer } = userSlice;
export const { updateUser, logout } = actions;
export { login, register, fetchUser };
export default reducer;
