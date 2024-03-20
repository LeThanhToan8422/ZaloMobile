import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ListChat from '../../../components/ListChat';

/**
 * Represents the FocusedTab component.
 *
 * @component
 * @param {object} navigation - The navigation object.
 * @returns {JSX.Element} The FocusedTab component.
 */
export const FocusedTab = ({ navigation }) => {
   const [data, setData] = useState([]);

   useEffect(() => {
      getApiChatsByUserId();
   }, []);

   /**
    * Calls the API to get chat data by user ID.
    * @param {number} userID - The user ID.
    * @returns {Promise<void>} A Promise that resolves when the API call is complete.
    */
   const getApiChatsByUserId = async (userID) => {
      const res = await axios.get(`http://localhost:8080/user/get-chats-by-id/1`);
      setData(res.data);
   };

   return <ListChat style={{ height: '100%' }} navigation={navigation} chats={data} />;
};
