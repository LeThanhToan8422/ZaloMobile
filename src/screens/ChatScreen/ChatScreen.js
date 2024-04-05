import { PORT, SERVER_HOST } from '@env';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
   FlatList,
   Keyboard,
   KeyboardAvoidingView,
   Platform,
   Text,
   TextInput,
   TouchableWithoutFeedback,
   View,
} from 'react-native';
import { Button, Icon, IconButton, Modal, PaperProvider, Portal } from 'react-native-paper';
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
   const [image, setImage] = useState(null);
   const [visible, setVisible] = useState(false);
   const [modalData, setModalData] = useState(null);
   const hideModal = () => setVisible(false);
   const showModal = (item) => {
      setModalData(item);
      setVisible(true);
   };

   useEffect(() => {
      getUserID().then((id) => {
         getMessagesOfChat(userID, friendID);
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
   }, [socket, messages]);

   const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
         setImage(result.assets[0].uri);
      }
   };

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
               <PaperProvider>
                  <Portal>
                     <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                        <Text style={styles.messageContainer}>{modalData?.message}</Text>
                        <View style={styles.modalActionContainer}>
                           <Button
                              icon={() => <Icon source="delete" size={24} iconColor="#333" />}
                              contentStyle={{ flexDirection: 'row-reverse' }}
                              onPress={() => {}}
                           >
                              Xóa
                           </Button>
                           <Button
                              icon={() => <Icon source="backup-restore" size={24} iconColor="#333" />}
                              contentStyle={{ flexDirection: 'row-reverse' }}
                              onPress={() => {}}
                           >
                              Thu hồi
                           </Button>
                        </View>
                     </Modal>
                  </Portal>
                  <FlatList
                     inverted
                     data={messages}
                     style={{ flexGrow: 1, backgroundColor: '#E2E8F1' }}
                     renderItem={({ item, index }) => (
                        <Message data={item} index={index} localUserID={userID} handleModal={showModal} />
                     )}
                     keyExtractor={(_, index) => index.toString()}
                  />
               </PaperProvider>
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
                        <IconButton icon="file-image" size={32} iconColor="#333" onPress={pickImage} />
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
