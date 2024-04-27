import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SERVER_HOST } from '@env';
import axios from 'axios';
import reactNativeBcrypt from 'react-native-bcrypt';

const initialState = {
   user: null,
   status: 'idle',
   error: null,
};

const login = createAsyncThunk('user/login', async ({ phone, password }) => {
   const response = await axios.get(`${SERVER_HOST}/accounts/phone/${phone}`);
   if (!(response.data && reactNativeBcrypt.compareSync(password, response.data.password))) {
      return null;
   }
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
         });
   },
});

const { actions, reducer } = userSlice;
export const { logout } = actions;
export { login, register };
export default reducer;
