import { PORT, SERVER_HOST } from '@env';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
   FlatList,
   Keyboard,
   KeyboardAvoidingView,
   Platform,
   TextInput,
   TouchableWithoutFeedback,
   View,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Message from '../../components/Message';
import { socket } from '../../utils/socket';
import { getUserID } from '../../utils/storage';
import styles from './styles';

/**
 * ChatScreen component. This component is used to render the chat screen.
 *
 * @param {Object} route - The route object containing navigation parameters.
 * @returns {JSX.Element} The rendered ChatScreen component.
 */
export const ChatScreen = ({ route }) => {
   const [userID, setUserID] = useState(1);
   const friendID = route.params.id;
   const [messages, setMessages] = useState([]);
   const insets = useSafeAreaInsets();
   const [message, setMessage] = useState('');

   useEffect(() => {
      getUserID().then((id) => {
         getMessagesOfChat(1, friendID);
         setUserID(id);
      });
   }, [userID, friendID]);

   useEffect(() => {
      const onChatEvents = (res) => {
         setMessages((prev) => [res.data, ...prev]);
      };
      const idRoom = userID < friendID ? `${userID}${friendID}` : `${friendID}${userID}`;

      socket.on(`Server-Chat-Room-${idRoom}`, onChatEvents);
      return () => socket.off(`Server-Chat-Room-${idRoom}`, onChatEvents);
   }, [socket]);

   /**
    * Sends a message.
    *
    * @returns {void}
    */
   const sendMessage = () => {
      socket.emit('Client-Chat-Room', {
         chatRoom: userID < friendID ? `${userID}${friendID}` : `${friendID}${userID}`,
         message: message.trim(),
         dateTimeSend: new Date(),
         sender: userID,
         receiver: friendID,
      });
      setMessage('');
   };

   /**
    * Gets the messages of a chat.
    *
    * @param {number} userID - The user ID.
    * @param {number} friendID - The friend ID.
    * @returns {void}
    */
   const getMessagesOfChat = async (userID, friendID) => {
      let datas = await axios.get(`${SERVER_HOST}:${PORT}/chats/content-chats-between-users/${userID}-and-${friendID}`);
      setMessages(datas.data.sort((a, b) => new Date(b.dateTimeSend) - new Date(a.dateTimeSend)));
   };

   return (
      <KeyboardAvoidingView
         enabled
         {...(Platform.OS === 'ios' && { behavior: 'padding', keyboardVerticalOffset: 60 })}
         style={{ flexGrow: 1 }}
      >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
               <FlatList
                  inverted
                  data={messages}
                  style={{ flexGrow: 1, backgroundColor: '#E2E8F1' }}
                  renderItem={({ item, index }) => <Message data={item} index={index} localUserID={userID} />}
                  keyExtractor={(_, index) => index.toString()}
               />
               <View style={[styles.chatContainer, { paddingBottom: insets.bottom }]}>
                  <IconButton icon="sticker-emoji" size={28} iconColor="#333" />
                  <TextInput
                     multiline
                     style={styles.input}
                     value={message}
                     placeholder="Message"
                     placeholderTextColor={'#888'}
                     underlineColorAndroid="transparent"
                     onChangeText={(text) => setMessage(text)}
                  />
                  {!message ? (
                     <>
                        <IconButton icon="dots-horizontal" size={32} iconColor="#333" />
                        <IconButton icon="microphone-outline" size={32} iconColor="#333" />
                        <IconButton icon="file-image" size={32} iconColor="#333" />
                     </>
                  ) : (
                     <IconButton icon="send-circle" size={32} iconColor="#4D9DF7" onPress={sendMessage} />
                  )}
               </View>
            </View>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
};
