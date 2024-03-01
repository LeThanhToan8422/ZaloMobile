import axios from 'axios';
import React, { useEffect, useState } from 'react';
import ListChat from '../../../components/ListChat';

export const FocusedTab = ({ navigation }) => {
   const [data, setData] = useState([]);
   useEffect(() => {
      getApiChatsByUserId();
   }, []);

   // Func Call API to get data
   const getApiChatsByUserId = async (userID) => {
      const res = await axios.get(`http://localhost:8080/user/get-chats-by-id/1`);
      setData(res.data);
   };
   return <ListChat style={{ height: '100%' }} navigation={navigation} chats={data} />;
};
