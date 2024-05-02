import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from 'expo-constants';

const SERVER_HOST = Constants.manifest.extra.SERVER_HOST;

const initialState = {
   friend: [],
   status: 'idle' | 'loading' | 'succeeded' | 'failed',
   error: null,
};

const fetchFriend = createAsyncThunk('friend/fetchFriend', async (userID) => {
   const response = await axios.get(`${SERVER_HOST}/users/friends/${userID}`);
   return response.data;
});

const friendSlice = createSlice({
   name: 'friend',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchFriend.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(fetchFriend.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.friend = action.payload;
         })
         .addCase(fetchFriend.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
   },
});

const { actions, reducer } = friendSlice;
export const {} = actions;
export default reducer;
export { fetchFriend };
