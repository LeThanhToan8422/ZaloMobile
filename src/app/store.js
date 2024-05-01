import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import friendReducer from '../features/friend/friendSlice';
import chatReducer from '../features/chat/chatSlice';
import detailChatReducer from '../features/detailChat/detailChatSlice';
import friendRequestReducer from '../features/friendRequest/friendRequestSlice';

const rootReducer = {
   user: userReducer,
   friend: friendReducer,
   chat: chatReducer,
   detailChat: detailChatReducer,
   friendRequest: friendRequestReducer,
};

export const store = configureStore({
   reducer: rootReducer,
});

export default store;
