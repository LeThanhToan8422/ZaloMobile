import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import ListChat from '../../../components/ListChat';
import styles from './styles';

export const GroupTab = ({ navigation }) => {
   const dispatch = useDispatch();
   const { chats } = useSelector((state) => state.chat);

   const getGroupChats = () => {
      return chats.filter((chat) => chat.leader);
   };

   return (
      <View>
         <Button
            mode="text"
            icon={() => <AntDesign style={styles.iconAdd} name="addusergroup" size={24} color="#4885FE" />}
            contentStyle={styles.addBtnContent}
            labelStyle={styles.addBtnLabel}
            style={styles.addBtn}
            onPress={() => navigation.navigate('ManageGroupAndChatScreen', { type: 'addGroup' })}
         >
            Create New Group
         </Button>

         <ListChat
            style={{ height: '100%', backgroundColor: '#fff' }}
            chats={getGroupChats()}
            navigation={navigation}
         />
      </View>
   );
};
