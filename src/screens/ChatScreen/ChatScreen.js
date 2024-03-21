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
import styles from './styles';
import axios from 'axios';
import { getUserID } from '../../utils/storage';
import client from '../../utils/socket';

/**
 * ChatScreen component. This component is used to render the chat screen.
 *
 * @param {Object} route - The route object containing navigation parameters.
 * @returns {JSX.Element} The rendered ChatScreen component.
 */
export const ChatScreen = ({ route }) => {
   const [userID, setUserID] = useState();
   const friendID = route.params.id;
   const [messages, setMessages] = useState([]);
   const insets = useSafeAreaInsets();
   const [message, setMessage] = useState('');

   useEffect(() => {
      getUserID().then((id) => {
         getMessagesOfChat(id, friendID);
         setUserID(id);
      });

      client.subscribe(
         `/topic/messages/${userID < friendID ? `${userID}${friendID}` : `${friendID}${userID}`}`,
         (message) => {
            const receivedmessage = JSON.parse(message.body);
            setMessages((prev) => [...prev, receivedmessage]);
         }
      );
   }, [JSON.stringify(messages)]);

   /**
    * Sends a message.
    *
    * @returns {void}
    */
   const sendMessage = () => {
      client.send(
         `/app/chat/${userID < friendID ? `${userID}${friendID}` : `${friendID}${userID}`}`,
         {},
         JSON.stringify({
            message: message,
            sender: userID,
            receiver: friendID,
         })
      );
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
      let datas = await axios.get(`http://localhost:8080/chat/content-chats-between-users/${userID}-and-${friendID}`);
      setMessages(datas.data);
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
