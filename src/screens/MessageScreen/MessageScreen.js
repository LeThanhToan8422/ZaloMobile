import { PORT, SERVER_HOST } from '@env';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ListChat } from '../../components/ListChat/ListChat';
import { getUserID } from '../../utils/storage';
import { socket } from '../../utils/socket';

export const MessageScreen = ({ navigation }) => {
   const [userID, setUserID] = useState(null);
   const [data, setData] = useState([]);

   useEffect(() => {
      getUserID().then((id) => {
         getApiChatsByUserId(id);
         setUserID(id);
      });
   }, []);

   useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
         !userID ? getUserID().then((id) => getApiChatsByUserId(id)) : getApiChatsByUserId(userID);
      });
      return unsubscribe;
   }, [navigation]);

   useEffect(() => {
      !userID ? getUserID().then((id) => getApiChatsByUserId(id)) : getApiChatsByUserId(userID);
   }, [socket]);

   /**
    * Calls the API to get chat data by user ID.
    * @param {number} userID - The user ID.
    * @returns {Promise<void>} A Promise that resolves when the API call is complete.
    */
   const getApiChatsByUserId = async (userID) => {
      const res = await axios.get(`${SERVER_HOST}/users/get-chats-by-id/${userID}`);
      if (res.data) setData(res.data.sort((a, b) => new Date(b.dateTimeSend) - new Date(a.dateTimeSend)));
   };

   return <ListChat style={{ height: '100%' }} navigation={navigation} chats={data} />;
};
