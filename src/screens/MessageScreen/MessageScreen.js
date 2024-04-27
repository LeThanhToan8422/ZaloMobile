import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListChat } from '../../components/ListChat/ListChat';
import { fetchChats } from '../../features/chat/chatSlice';
import { socket } from '../../utils/socket';

export const MessageScreen = ({ navigation }) => {
   const dispatch = useDispatch();
   const user = useSelector((state) => state.user.user);
   const chats = useSelector((state) => state.chat.chats);

   useEffect(() => {}, [socket]);

   return <ListChat style={{ height: '100%' }} navigation={navigation} chats={chats} />;
};
