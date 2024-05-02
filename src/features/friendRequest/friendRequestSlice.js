import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import Constants from 'expo-constants';

const SERVER_HOST = Constants.manifest.extra.SERVER_HOST;

const initialState = {
   friendRequests: [],
   state: 'idle',
   error: null,
};

const fetchFriendRequests = createAsyncThunk('friendRequest/fetchFriendRequests', async (_, { getState }) => {
   const { user } = getState().user;
   const response = await axios.get(`${SERVER_HOST}/make-friends/givers/${user.id}`);
   return response.data;
});

const friendRequestSlice = createSlice({
   name: 'friendRequest',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase('friendRequest/fetchFriendRequests/pending', (state) => {
            state.state = 'loading';
         })
         .addCase('friendRequest/fetchFriendRequests/fulfilled', (state, action) => {
            state.state = 'succeeded';
            state.friendRequests = action.payload;
         })
         .addCase('friendRequest/fetchFriendRequests/rejected', (state, action) => {
            state.state = 'failed';
            state.error = action.error.message;
         });
   },
});

const { actions, reducer } = friendRequestSlice;
export const {} = actions;
export { fetchFriendRequests };
export default reducer;
