import { SERVER_HOST } from '@env';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
   FlatList,
   Image,
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
import { FileIcon, defaultStyles } from 'react-native-file-icon';
import ImageView from 'react-native-image-viewing';

/**
 * ChatScreen component. This component is used to render the chat screen.
 *
 * @param {Object} route - The route object containing navigation parameters.
 * @returns {JSX.Element} The rendered ChatScreen component.
 */
export const ChatScreen = ({ route }) => {
   const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
   const [userID, setUserID] = useState(1);
   const friendID = route.params.id;
   const [messages, setMessages] = useState([]);
   const insets = useSafeAreaInsets();
   const [message, setMessage] = useState('');
   const [image, setImage] = useState(null);
   const [visible, setVisible] = useState(false);
   const [modalData, setModalData] = useState(null);
   const [imagesView, setImagesView] = useState([]);
   const [visibleImage, setIsVisibleImage] = useState(false);

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
      socket.on(`Server-Status-Chat-${idRoom}`, (res) => {
         setMessages((prev) => prev.filter((prev) => prev.id !== res.data.id));
         hideModal();
      });
      return () => {
         socket.off(`Server-Chat-Room-${idRoom}`, onChatEvents);
         socket.off(`Server-Status-Chat-${idRoom}`);
      };
   }, [socket, messages]);

   const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         aspect: [4, 3],
         quality: 1,
         allowsMultipleSelection: true,
      });

      if (!result.canceled) {
         result.assets.forEach((image) => handleSendFile(image));
      }
   };

   const pickFile = async () => {
      let result = await DocumentPicker.getDocumentAsync({
         type: '*/*',
         multiple: true,
      });

      if (!result.canceled) {
         result.assets.forEach((file) => handleSendFile(file));
      }
   };

   const handleSendFile = async (file) => {
      let localUri = file.uri;
      let filename = file.fileName || file.name;
      let type = file.type ? `${file.type}/${localUri.split('.').pop()}` : file.mimeType;
      const buffer = await axios.get(localUri, { responseType: 'arraybuffer' }).then((res) => res.data);

      const data = {
         originalname: filename,
         encoding: '7bit',
         mimetype: type,
         buffer: buffer,
         size: file.fileSize,
      };

      socket.emit('Client-Chat-Room', {
         chatRoom: userID < friendID ? `${userID}${friendID}` : `${friendID}${userID}`,
         file: data,
         sender: userID,
         receiver: friendID,
      });
   };

   const handleClickStatusChat = (status, userId, chat) => {
      socket.emit(`Client-Status-Chat`, {
         status: status,
         implementer: userId,
         chat: chat,
         chatRoom: userId > friendID ? `${friendID}${userId}` : `${userId}${friendID}`,
         objectId: friendID,
      });
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
      let datas = await axios.get(`${SERVER_HOST}/chats/content-chats-between-users/${userID}-and-${friendID}`);
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
                        {urlRegex.test(modalData?.message) ? (
                           modalData?.message.split('.').pop() === ('jpg' || 'png') ? (
                              <Image source={{ uri: modalData?.message }} style={styles.imageMessage} />
                           ) : (
                              <View
                                 style={[
                                    styles.messageContainer,
                                    {
                                       width: 150,
                                       height: 200,
                                       justifyContent: 'space-around',
                                    },
                                 ]}
                              >
                                 <View style={{ width: 100, height: 120 }}>
                                    <FileIcon
                                       extension={modalData?.message.split('.').pop()}
                                       {...defaultStyles[modalData?.message.split('.').pop()]}
                                    />
                                 </View>
                                 <Text>{modalData?.message.split('--').slice(1)}</Text>
                              </View>
                           )
                        ) : (
                           <Text style={styles.messageContainer}>{modalData?.message}</Text>
                        )}
                        <View style={styles.modalActionContainer}>
                           <Button
                              icon={() => <Icon source="delete" size={24} iconColor="#333" />}
                              contentStyle={{ flexDirection: 'row-reverse' }}
                              onPress={() => handleClickStatusChat('delete', userID, modalData?.id)}
                           >
                              Xóa
                           </Button>
                           {userID === modalData?.sender && (
                              <Button
                                 icon={() => <Icon source="backup-restore" size={24} iconColor="#333" />}
                                 contentStyle={{ flexDirection: 'row-reverse' }}
                                 onPress={() => handleClickStatusChat('recalls', userID, modalData?.id)}
                              >
                                 Thu hồi
                              </Button>
                           )}
                        </View>
                     </Modal>
                  </Portal>
                  <FlatList
                     inverted
                     data={messages}
                     style={{ flexGrow: 1, backgroundColor: '#E2E8F1' }}
                     renderItem={({ item, index }) => (
                        <Message
                           data={item}
                           index={index}
                           localUserID={userID}
                           handleModal={showModal}
                           onPress={() => {
                              console.log('Press image');
                              setImagesView([{ uri: item.message }]);
                              setIsVisibleImage(true);
                           }}
                        />
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
                        <IconButton icon="file" size={32} iconColor="#333" onPress={pickFile} />
                        <IconButton icon="microphone-outline" size={32} iconColor="#333" />
                        <IconButton icon="image" size={32} iconColor="#333" onPress={pickImage} />
                     </>
                  ) : (
                     <IconButton icon="send-circle" size={32} iconColor="#4D9DF7" onPress={sendMessage} />
                  )}
               </View>
               <ImageView
                  images={imagesView}
                  imageIndex={0}
                  visible={visibleImage}
                  onRequestClose={() => setIsVisibleImage(false)}
               />
            </View>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
};
