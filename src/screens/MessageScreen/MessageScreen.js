import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ListChat } from '../../components/ListChat/ListChat';
import { clearCurrentChat } from '../../features/chat/chatSlice';

export const MessageScreen = ({ navigation }) => {
   const dispatch = useDispatch();
   const chats = useSelector((state) => state.chat.chats);

   useEffect(() => {
      navigation.addListener('focus', () => {
         dispatch(clearCurrentChat());
      });
   }, [navigation]);

   return <ListChat style={{ height: '100%' }} navigation={navigation} chats={chats} />;
};
