import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import ListChat from '../../../components/ListChat';
import styles from './styles';
import { SERVER_HOST, PORT } from '@env';
import { getUserID } from '../../../utils/storage';

export const GroupTab = ({ navigation }) => {
   const [data, setData] = useState([]);
   useEffect(() => {
      getUserID().then((userID) => {
         getApiChatsByUserId(userID);
      });
   }, []);

   // Func Call API to get data
   const getApiChatsByUserId = async (userID) => {
      const res = await axios.get(`${SERVER_HOST}:${PORT}/user/get-chats-by-id/${userID}`);
      setData(res.data);
   };
   return (
      <View>
         <Button
            mode="text"
            icon={() => <AntDesign style={styles.iconAdd} name="addusergroup" size={24} color="#4885FE" />}
            contentStyle={styles.addBtnContent}
            labelStyle={styles.addBtnLabel}
            style={styles.addBtn}
            onPress={() => console.log('Pressed')}
         >
            Create New Group
         </Button>

         <ListChat style={{ height: '100%', backgroundColor: '#fff' }} chats={data} navigation={navigation} />
      </View>
   );
};
