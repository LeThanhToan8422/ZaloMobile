import { PORT, SERVER_HOST } from '@env';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ListChat } from '../../components/ListChat/ListChat';
import { getUserID } from '../../utils/storage';

export const MessageScreen = ({ navigation }) => {
   const [data, setData] = useState([]);

   useEffect(() => {
      getUserID().then((userID) => {
         getApiChatsByUserId(userID);
      });
   }, []);

   /**
    * Calls the API to get chat data by user ID.
    * @param {number} userID - The user ID.
    * @returns {Promise<void>} A Promise that resolves when the API call is complete.
    */
   const getApiChatsByUserId = async (userID) => {
      const res = await axios.get(`${SERVER_HOST}:${PORT}/users/get-chats-by-id/${userID}`);
      setData(res.data);
   };

   return <ListChat style={{ height: '100%' }} navigation={navigation} chats={data} />;
};
