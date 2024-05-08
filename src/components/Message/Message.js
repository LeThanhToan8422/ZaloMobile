import { ResizeMode, Video } from 'expo-av';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { FileIcon, defaultStyles } from 'react-native-file-icon';
import { formatTime } from '../../utils/func';
import styles from './styles';
import { IconButton } from 'react-native-paper';
import { socket } from '../../utils/socket';
import { useSelector } from 'react-redux';

/**
 * Message component. This component is used to render a message.
 *
 * @component
 * @param {Object} props - The props for the Message component.
 * @param {Object} props.data - The data for the message.
 * @param {string} props.data.user - The user who sent the message.
 * @param {Date} props.data.dateTimeSend - The time when the message was sent.
 * @param {string} props.data.message - The content of the message.
 * @param {number} props.index - The index of the message.
 * @returns {JSX.Element} The rendered Message component.
 */
export const Message = ({ data, index, localUserID, handleModal, onPress }) => {
   const { id, name, message, emojis, dateTimeSend, isRecalls, imageUser, imageFriend } = data;
   const userId = data.sender;
   const friendId = data.receiver;
   const { currentChat } = useSelector((state) => state.chat);
   const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;
   const emoji = { like: '👍', love: '❤️', haha: '😂', wow: '😮', sad: '😭', angry: '😡' };
   const resultTestNotify =
      message.match(/(.+) đã thêm (.+) vào nhóm\./) ||
      message.match(/(.+) đã xóa (.+) khỏi nhóm\./) ||
      message.match('Chào mừng đến với nhóm (.+)');
   const checkImage = /(jpg|jpeg|png|bmp|bmp)$/i.test(message.split('.').pop());
   const checkVideo = /(mp4|avi|mkv|mov|wmv|flv|webm)$/i.test(message.split('.').pop());
   const checkVoice = /(m4a|wav|aac|flac|ogg)$/i.test(message.split('.').pop());

   const handleSortEmoji = (emojis) => {
      const wordsArray = emojis.split(',');
      const wordCount = {};
      wordsArray.forEach((word) => {
         wordCount[word] = (wordCount[word] || 0) + 1;
      });
      const sortedWords = wordsArray.sort((a, b) => {
         const countComparison = wordCount[b] - wordCount[a];
         if (countComparison !== 0) {
            return countComparison;
         }
         return wordsArray.indexOf(a) - wordsArray.indexOf(b);
      });
      return Array.from(new Set(sortedWords.slice(0, 4)));
   };

   const handleLoveMessage = () => {
      socket.emit(`Client-Emotion-Chats`, {
         type: 'love',
         implementer: userId,
         chat: id,
         chatRoom: currentChat.id,
      });
   };

   return (
      <Pressable
         onPress={isRecalls || resultTestNotify ? null : onPress}
         onLongPress={isRecalls || resultTestNotify ? null : () => handleModal(data)}
      >
         <View
            style={[
               styles.container,
               resultTestNotify
                  ? { alignSelf: 'center', maxWidth: '94%' }
                  : userId === localUserID
                  ? { alignSelf: 'flex-end' }
                  : {},
               emojis ? { marginBottom: 12 } : {},
            ]}
         >
            {userId !== localUserID ? (
               <Image source={{ uri: imageUser ? imageUser : imageFriend }} style={styles.avatar} />
            ) : null}
            {isRecalls ? (
               <View style={[styles.messageContainer, userId === localUserID ? { backgroundColor: '#CFF0FF' } : {}]}>
                  {name && userId !== localUserID && <Text style={styles.name}>{name}</Text>}
                  <Text style={[styles.content, { color: '#333' }]}>Tin nhắn đã được thu hồi</Text>
                  <Text style={styles.time}>{dateTimeSend && formatTime(dateTimeSend)}</Text>
               </View>
            ) : (
               <View>
                  {urlRegex.test(message) ? (
                     checkImage ? (
                        <View>
                           {name && userId !== localUserID && <Text style={styles.name}>{name}</Text>}
                           <Image source={{ uri: message }} style={styles.imageMessage} />
                           <Text style={styles.time}>{dateTimeSend && formatTime(dateTimeSend)}</Text>
                        </View>
                     ) : checkVideo ? (
                        <View>
                           {name && userId !== localUserID && <Text style={styles.name}>{name}</Text>}
                           <View style={{ backgroundColor: '#000', borderRadius: 10 }}>
                              <Video
                                 source={{ uri: message }}
                                 style={styles.imageMessage}
                                 resizeMode={ResizeMode.CONTAIN}
                              />
                           </View>
                           <Text style={styles.time}>{dateTimeSend && formatTime(dateTimeSend)}</Text>
                        </View>
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
                           {name && userId !== localUserID && <Text style={styles.name}>{name}</Text>}
                           <View style={{ width: 100, height: 120 }}>
                              <FileIcon
                                 extension={message.split('.').pop()}
                                 {...defaultStyles[message.split('.').pop()]}
                              />
                           </View>
                           <View>
                              {checkVoice ? <Text>Tin nhắn thoại</Text> : <Text>{message.split('--').slice(1)}</Text>}
                           </View>
                           <Text style={styles.time}>{dateTimeSend && formatTime(dateTimeSend)}</Text>
                        </View>
                     )
                  ) : (
                     <View
                        style={[
                           styles.messageContainer,
                           resultTestNotify
                              ? { flexDirection: 'row', alignItems: 'center', borderRadius: 20 }
                              : userId === localUserID
                              ? { backgroundColor: '#CFF0FF' }
                              : {},
                        ]}
                     >
                        {resultTestNotify && (
                           <Image
                              source={{ uri: imageUser ? imageUser : imageFriend }}
                              style={{ width: 20, height: 20, borderRadius: 10, marginRight: 8 }}
                           />
                        )}
                        {name && userId !== localUserID && <Text style={styles.name}>{name}</Text>}
                        <Text style={styles.content}>{message}</Text>
                        {!resultTestNotify && (
                           <Text style={styles.time}>{dateTimeSend && formatTime(dateTimeSend)}</Text>
                        )}
                     </View>
                  )}
                  {emojis && !isRecalls && (
                     <View style={[styles.emojiContainer, checkImage && { bottom: 12 }]}>
                        {handleSortEmoji(emojis).map((e, i) => (
                           <Text key={i} style={styles.emoji}>
                              {emoji[e]}
                           </Text>
                        ))}
                        <Text style={{ fontSize: 14, color: '#444' }}>{emojis.split(',').length}</Text>
                     </View>
                  )}
                  {!isRecalls && (
                     <IconButton
                        mode="contained-tonal"
                        icon="heart-outline"
                        size={20}
                        style={[
                           { position: 'absolute', top: '50%', transform: [{ translateY: -25 }] },
                           userId === localUserID ? { left: -60 } : { right: -60 },
                        ]}
                        onPress={handleLoveMessage}
                     />
                  )}
               </View>
            )}
         </View>
      </Pressable>
   );
};
