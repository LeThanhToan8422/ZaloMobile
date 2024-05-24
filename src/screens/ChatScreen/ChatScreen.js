import { FlashList } from '@shopify/flash-list';
import { Buffer } from 'buffer';
import dayjs from 'dayjs';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import {
   ActivityIndicator,
   Image,
   Keyboard,
   KeyboardAvoidingView,
   Platform,
   Text,
   TextInput,
   TouchableOpacity,
   TouchableWithoutFeedback,
   View,
} from 'react-native';
import { FileIcon, defaultStyles } from 'react-native-file-icon';
import FileViewer from 'react-native-file-viewer';
import RNFS, { stat } from 'react-native-fs';
import ImageView from 'react-native-image-viewing';
import { Button, Icon, IconButton, Modal, PaperProvider, Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../../components/Message';
import {
   addMessage,
   deleteMessage,
   fetchChats,
   fetchMessages,
   setMessages,
   updateMessage,
} from '../../features/chat/chatSlice';
import { fetchDetailChat, fetchMembersInGroup } from '../../features/detailChat/detailChatSlice';
import { socket } from '../../utils/socket';
import { getData } from '../../utils/storage';
import styles from './styles';
import axios from 'axios';
import Constants from 'expo-constants';

/**
 * ChatScreen component. This component is used to render the chat screen.
 *
 * @param {Object} route - The route object containing navigation parameters.
 * @returns {JSX.Element} The rendered ChatScreen component.
 */
export const ChatScreen = ({ navigation, route }) => {
   const inputRef = useRef(null);
   const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
   const checkImage = /(jpg|jpeg|png|bmp|bmp)$/i;
   const insets = useSafeAreaInsets();
   const [chatInfo] = useState(route.params);
   const [message, setMessage] = useState('');
   const [visible, setVisible] = useState(false);
   const [replyVisible, setReplyVisible] = useState(false);
   const [modalData, setModalData] = useState(null);
   const [imagesView, setImagesView] = useState([]);
   const [visibleImage, setIsVisibleImage] = useState(false);
   const [page, setPage] = useState(20);
   const [recording, setRecording] = useState();
   const [permissionResponse, requestPermission] = Audio.usePermissions();
   const [loading, setLoading] = useState(false);
   const SERVER_HOST = Constants.expoConfig.extra.SERVER_HOST;

   const dispatch = useDispatch();
   const user = useSelector((state) => state.user.user);
   const { id, messages } = useSelector((state) => state.chat.currentChat);
   const { chats } = useSelector((state) => state.chat);
   const emoji = [{ like: '👍' }, { love: '❤️' }, { haha: '😂' }, { wow: '😮' }, { sad: '😭' }, { angry: '😡' }];
   const checkVoice = /(m4a|wav|aac|flac|ogg)$/i.test(message.split('.').pop());

   useEffect(() => {
      setLoading(false);
   }, [messages]);

   useEffect(() => {
      (async () => {
         const messages = await getData(`@${chatInfo.id}`);
         dispatch(setMessages({ id: chatInfo.id, messages: messages }));
         if (chatInfo.quantity) {
            if (chatInfo.leader) {
               await axios.post(`${SERVER_HOST}/wait-message/update/${user.id}/Group/${chatInfo.id}`);
            } else {
               await axios.post(`${SERVER_HOST}/wait-message/update/${chatInfo.id}/${user.id}`);
            }
            dispatch(fetchChats());
         }
      })();
      const params = { page: page };
      chatInfo.leader ? (params.groupId = chatInfo.id) : (params.chatId = chatInfo.id);
      dispatch(fetchMessages(params));
      const flag = chats.some((chat) => chatInfo.leader && chat.id === chatInfo.id);
      dispatch(fetchDetailChat({ id: chatInfo.id, type: flag ? 'group' : 'user' }));
      flag && dispatch(fetchMembersInGroup(chatInfo.id));
   }, []);

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
      let filename = file.fileName || file.name || localUri.split('/').pop();
      let type = file.type ? `${file.type}/${localUri.split('.').pop()}` : file.mimeType;
      const fileContent = await RNFS.readFile(localUri, 'base64');
      const buffer = Buffer.from(fileContent, 'base64');

      const data = {
         originalname: filename,
         encoding: '7bit',
         mimetype: type,
         buffer: buffer,
         size: file.fileSize || (file.width * file.height * 4) / 3,
      };

      const params = {
         idTemp: dayjs().valueOf(),
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
      params.message = localUri;
      delete params.file;
      dispatch(addMessage(params));
      setLoading(true);
   };

   const sendMessage = () => {
      const params = {
         idTemp: dayjs().valueOf(),
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
      replyVisible && (params.chatReply = modalData.id) && setReplyVisible(false);
      socket.emit('Client-Chat-Room', params);
      dispatch(addMessage(params));
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
      if (status === 'delete') dispatch(deleteMessage({ id: chat }));
      else socket.emit(`Client-Status-Chat`, params);
      hideModal();
   };

   const handleReactMessage = (type, chat, chatRoom) => {
      socket.emit(`Client-Emotion-Chats`, {
         type,
         implementer: user.id,
         chat,
         chatRoom,
      });
      dispatch(updateMessage({ id: chat, emojis: type }));
   };

   const handlePressMessage = async (item) => {
      if (urlRegex.test(item.message)) {
         if (checkImage.test(item.message.split('.').pop())) {
            setImagesView([{ uri: item.message }]);
            setIsVisibleImage(true);
         } else {
            function getUrlExtension(url) {
               return url.split(/[#?]/)[0].split('.').pop().trim();
            }
            const extension = getUrlExtension(item.message);
            const localFile = `${RNFS.DocumentDirectoryPath}/${item.message.split('--').slice(1)}`;
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
                  Toast.show({
                     type: 'error',
                     text1: 'Không thể mở file. Vui lòng cài thêm ứng dụng hỗ trợ',
                     position: 'bottom',
                  });
               });
         }
      }
   };

   const hideModal = () => setVisible(false);

   const showModal = (item) => {
      setModalData(item);
      setVisible(true);
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
                           checkImage.test(modalData?.message.split('.').pop()) ? (
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
                           <View style={styles.emojiContainer}>
                              {emoji.map((item, index) => (
                                 <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                       handleReactMessage(
                                          (type = Object.keys(item)[0]),
                                          (chat = modalData.id),
                                          (chatRoom = chatInfo.leader
                                             ? chatInfo.id
                                             : id < user.id
                                             ? `${id}${user.id}`
                                             : `${user.id}${id}`)
                                       );
                                       hideModal();
                                    }}
                                 >
                                    <Text style={styles.emoji}>{Object.values(item)}</Text>
                                 </TouchableOpacity>
                              ))}
                           </View>
                           <Button
                              icon={() => <Icon source="reply" size={24} color="#457DF6" />}
                              contentStyle={{ flexDirection: 'row-reverse' }}
                              labelStyle={{ color: '#000' }}
                              onPress={() => {
                                 setVisible(false);
                                 setReplyVisible(true);
                                 inputRef.current.focus();
                              }}
                           >
                              Trả lời
                           </Button>
                           <Button
                              icon={() => <Icon source="message-arrow-right-outline" size={24} color="#457DF6" />}
                              contentStyle={{ flexDirection: 'row-reverse' }}
                              labelStyle={{ color: '#000' }}
                              onPress={() => {
                                 navigation.navigate('ManageGroupAndChatScreen', {
                                    data: modalData,
                                    type: 'forward',
                                 });
                              }}
                           >
                              Chuyển tiếp
                           </Button>
                           <Button
                              icon={() => <Icon source="delete-outline" size={24} color="#D41E19" />}
                              contentStyle={{ flexDirection: 'row-reverse' }}
                              labelStyle={{ color: '#000' }}
                              onPress={() => handleClickStatusChat('delete', modalData?.id)}
                           >
                              Xóa
                           </Button>
                           {user?.id === modalData?.sender && dayjs().diff(modalData?.dateTimeSend, 'hour') < 24 && (
                              <Button
                                 icon={() => <Icon source="backup-restore" size={24} color="#F07F2D" />}
                                 contentStyle={{ flexDirection: 'row-reverse' }}
                                 labelStyle={{ color: '#000' }}
                                 onPress={() => handleClickStatusChat('recalls', modalData?.id)}
                              >
                                 Thu hồi
                              </Button>
                           )}
                        </View>
                     </Modal>
                  </Portal>
                  <View style={{ backgroundColor: '#E2E8F1', flexGrow: 1 }}>
                     <FlashList
                        inverted
                        data={messages}
                        estimatedItemSize={10}
                        overrideProps={{ isInvertedVirtualizedList: true }}
                        onEndReached={() => {
                           setPage((prevPage) => prevPage + 10);
                           const params = { page: page };
                           chatInfo.leader ? (params.groupId = chatInfo.id) : (params.chatId = chatInfo.id);
                           dispatch(fetchMessages(params));
                        }}
                        onEndReachedThreshold={0.7} // Adjust this value as needed
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item }) => (
                           <Message
                              data={{ ...item, imageFriend: chatInfo.image }}
                              localUserID={user?.id}
                              handleModal={showModal}
                              onPress={() => handlePressMessage(item)}
                              handleReactMessage={handleReactMessage}
                              replyInfo={Object.entries(messages.find((message) => message.id === item.chatReply) || {})
                                 .filter(([key]) => key === 'message' || key === 'name')
                                 .reduce((acc, [key, value]) => {
                                    acc[key] = value;
                                    return acc;
                                 }, {})}
                           />
                        )}
                     />
                     {loading && (
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                           <Text style={{ color: '#333' }}>Đang gửi... </Text>
                           <ActivityIndicator size="small" color="#666" />
                        </View>
                     )}
                  </View>
               </PaperProvider>
               {replyVisible && (
                  <View style={styles.replyModalContainer}>
                     <View>
                        <View style={{ flexDirection: 'row' }}>
                           <Text style={{ fontSize: 14 }}>Đang trả lời </Text>
                           <Text style={{ fontSize: 14, fontWeight: '500' }}>{modalData?.name}</Text>
                        </View>
                        <Text style={{ fontSize: 13, color: '#666' }}>{modalData?.message}</Text>
                     </View>
                     <IconButton
                        icon="close"
                        size={20}
                        onPress={() => {
                           setReplyVisible(false);
                        }}
                     />
                  </View>
               )}
               <View style={[styles.chatContainer, { paddingBottom: insets.bottom }]}>
                  <IconButton icon="sticker-emoji" size={28} iconColor="#333" />
                  <TextInput
                     ref={inputRef}
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
                        <IconButton icon="file-document" size={32} iconColor="#333" onPress={pickFile} />
                        <IconButton
                           icon={recording ? 'microphone-off' : 'microphone-outline'}
                           size={32}
                           iconColor="#333"
                           onPress={recording ? stopRecording : startRecording}
                        />
                        <IconButton icon="image" size={32} iconColor="#333" onPress={pickImage} />
                     </>
                  ) : (
                     <IconButton icon="send-circle" size={36} iconColor="#4D9DF7" onPress={sendMessage} />
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
