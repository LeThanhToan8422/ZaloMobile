import { SERVER_HOST } from '@env';
import axios from 'axios';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
   ActivityIndicator,
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
import { FileIcon, defaultStyles } from 'react-native-file-icon';
import FileViewer from 'react-native-file-viewer';
import RNFS, { stat } from 'react-native-fs';
import ImageView from 'react-native-image-viewing';
import { Button, Icon, IconButton, Modal, PaperProvider, Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Message from '../../components/Message';
import { socket } from '../../utils/socket';
import styles from './styles';
import dayjs from 'dayjs';
import { Audio } from 'expo-av';
import { useDispatch, useSelector } from 'react-redux';
import { deleteMessage, fetchMessages } from '../../features/chat/chatSlice';

/**
 * ChatScreen component. This component is used to render the chat screen.
 *
 * @param {Object} route - The route object containing navigation parameters.
 * @returns {JSX.Element} The rendered ChatScreen component.
 */
export const ChatScreen = ({ navigation, route }) => {
   const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
   const insets = useSafeAreaInsets();
   const [chatInfo, setChatInfo] = useState(route.params);
   const [message, setMessage] = useState('');
   const [image, setImage] = useState(null);
   const [visible, setVisible] = useState(false);
   const [modalData, setModalData] = useState(null);
   const [imagesView, setImagesView] = useState([]);
   const [visibleImage, setIsVisibleImage] = useState(false);
   const [loading, setLoading] = useState(false);
   const [page, setPage] = useState(10); // Keep track of the current page
   const [sound, setSound] = useState();
   const [recording, setRecording] = useState();
   const [permissionResponse, requestPermission] = Audio.usePermissions();

   const dispatch = useDispatch();
   const user = useSelector((state) => state.user.user);
   const messages = useSelector((state) => state.chat.currentChat.messages);
   const { chats } = useSelector((state) => state.chat);

   useEffect(() => {
      const params = { page: page };
      chatInfo.leader ? (params.groupId = chatInfo.id) : (params.chatId = chatInfo.id);
      dispatch(fetchMessages(params));
   }, []);

   useEffect(() => {
      // return sound
      //    ? () => {
      //         console.log('Unloading Sound');
      //         sound.unloadAsync();
      //      }
      //    : undefined;
   }, [sound]);

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

      const params = {
         file: data,
         dateTimeSend: dayjs().format('YYYY-MM-DD HH:mm:ss'),
         sender: user.id,
         chatRoom: chatInfo.leader
            ? chatInfo.id
            : user.id > chatInfo.id
            ? `${chatInfo.id}${user.id}`
            : `${user.id}${chatInfo.id}`,
      };
      chatInfo.leader ? (params.groupChat = chatInfo.id) : (params.receiver = chatInfo.id);
      socket.emit('Client-Chat-Room', params);
   };

   const sendMessage = () => {
      const params = {
         message: message.trim(), // thông tin message
         dateTimeSend: dayjs().format('YYYY-MM-DD HH:mm:ss'),
         sender: user.id, // id người gửi
         chatRoom: chatInfo.leader
            ? chatInfo.id
            : user.id > chatInfo.id
            ? `${chatInfo.id}${user.id}`
            : `${user.id}${chatInfo.id}`,
      };
      chatInfo.leader ? (params.groupChat = chatInfo.id) : (params.receiver = chatInfo.id);
      socket.emit('Client-Chat-Room', params);
      setMessage('');
   };

   const handleClickStatusChat = (status, chat) => {
      const params = {
         status: status,
         implementer: user.id,
         chat: chat,
         chatRoom: chatInfo.leader
            ? chatInfo.id
            : user.id > chatInfo.id
            ? `${chatInfo.id}${user.id}`
            : `${user.id}${chatInfo.id}`,
      };
      !chatInfo.leader && (params.objectId = chatInfo.id);
      socket.emit(`Client-Status-Chat`, params);
      hideModal();
      if (status === 'delete') {
         dispatch(deleteMessage({ id: chat }));
      }
   };

   const handlePressMessage = async (item) => {
      if (urlRegex.test(item.message)) {
         if (item.message.split('.').pop() === ('jpg' || 'png')) {
            setImagesView([{ uri: item.message }]);
            setIsVisibleImage(true);
         } else {
            function getUrlExtension(url) {
               return url.split(/[#?]/)[0].split('.').pop().trim();
            }
            const extension = getUrlExtension(item.message);
            const localFile = `${RNFS.DocumentDirectoryPath}/${item.message.split('--').slice(1)}.${extension}`;
            const options = {
               fromUrl: item.message,
               toFile: localFile,
            };
            RNFS.downloadFile(options)
               .promise.then(() => FileViewer.open(localFile))
               .then(() => {
                  // success
               })
               .catch((error) => {
                  // error
               });
         }
      }
   };

   const hideModal = () => setVisible(false);

   const showModal = (item) => {
      setModalData(item);
      setVisible(true);
   };

   const playSound = async () => {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync();
      setSound(sound);
      console.log('Playing Sound');
      await sound.playAsync();
   };

   const startRecording = async () => {
      try {
         if (permissionResponse.status !== 'granted') {
            await requestPermission();
         }
         await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
         });
         const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
         setRecording(recording);
      } catch (err) {
         console.error('Failed to start recording', err);
      }
   };

   const stopRecording = async () => {
      setRecording(undefined);
      await recording.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
         allowsRecordingIOS: false,
      });
      const uri = recording.getURI();
      const filename = uri.split('/').pop();
      const mimeType = recording._options.web.mimeType + ';codecs=opus';
      const fileSize = (await stat(uri)).size;
      const file = {
         uri: uri,
         name: filename,
         mimeType: mimeType,
         fileSize: fileSize,
      };
      handleSendFile(file);
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
                              onPress={() => handleClickStatusChat('delete', modalData?.id)}
                           >
                              Xóa
                           </Button>
                           {user.id === modalData?.sender && (
                              <Button
                                 icon={() => <Icon source="backup-restore" size={24} iconColor="#333" />}
                                 contentStyle={{ flexDirection: 'row-reverse' }}
                                 onPress={() => handleClickStatusChat('recalls', modalData?.id)}
                              >
                                 Thu hồi
                              </Button>
                           )}
                           <Button
                              icon={() => <Icon source="message-arrow-right-outline" size={24} iconColor="#333" />}
                              contentStyle={{ flexDirection: 'row-reverse' }}
                              onPress={() => {
                                 navigation.navigate('ManageGroupAndChatScreen', {
                                    data: modalData,
                                    type: 'forward',
                                 });
                              }}
                           >
                              Chuyển tiếp
                           </Button>
                        </View>
                     </Modal>
                  </Portal>
                  <FlatList
                     inverted
                     data={messages}
                     style={{ flexGrow: 1, backgroundColor: '#E2E8F1' }}
                     onEndReached={() => {
                        if (!loading) {
                           setLoading(true);
                           setPage((prevPage) => prevPage + 10);
                           const params = { page: page };
                           chatInfo.leader ? (params.groupId = chatInfo.id) : (params.chatId = chatInfo.id);
                           dispatch(fetchMessages(params));
                           setLoading(false);
                        }
                     }}
                     onEndReachedThreshold={0.05} // Adjust this value as needed
                     keyExtractor={(_, index) => index.toString()}
                     renderItem={({ item, index }) => (
                        <Message
                           data={{ ...item, imageFriend: chatInfo.image }}
                           index={index}
                           localUserID={user.id}
                           handleModal={showModal}
                           onPress={() => handlePressMessage(item)}
                        />
                     )}
                     ListFooterComponent={() =>
                        // Render a loading indicator at the bottom of the list
                        loading && <ActivityIndicator size="large" color="#ccc" />
                     }
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
                        <IconButton
                           icon={recording ? 'microphone-off' : 'microphone-outline'}
                           size={32}
                           iconColor="#333"
                           onPress={recording ? stopRecording : startRecording}
                        />
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
