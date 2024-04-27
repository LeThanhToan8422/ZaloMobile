import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import friendReducer from '../features/friend/friendSlice';
import chatReducer from '../features/chat/chatSlice';

const rootReducer = {
   user: userReducer,
   friend: friendReducer,
   chat: chatReducer,
};

export const store = configureStore({
   reducer: rootReducer,
});

export default store;
