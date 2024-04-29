import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { SERVER_HOST } from '@env';

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
            state.friend = action.payload.filter((item) => !item.leader);
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
