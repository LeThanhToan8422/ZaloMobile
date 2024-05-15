import { Audio, ResizeMode, Video } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { FileIcon, defaultStyles } from 'react-native-file-icon';
import { IconButton } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { formatTime } from '../../utils/func';
import styles from './styles';

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
export const Message = ({ data, localUserID, replyInfo, handleModal, onPress, handleReactMessage }) => {
   const { id, message, dateTimeSend, chatReply, name, emojis, isRecalls, imageUser, imageFriend } = data;
   const userId = data.sender;
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
   const [sound, setSound] = useState(null);
   const [isPlaying, setIsPlaying] = useState(false);
   const [duration, setDuration] = useState(0);

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

   const handlePlaySound = async () => {
      if (sound) {
         await sound.unloadAsync();
      }
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: message }, { shouldPlay: true });
      setSound(newSound);
      try {
         setIsPlaying(true);
      } catch (error) {
         console.log('Error playing sound:', error);
      }
   };

   const handleStopSound = async () => {
      try {
         if (sound) {
            await sound.stopAsync();
            await sound.unloadAsync();
            setSound(null);
            setIsPlaying(false);
         }
      } catch (error) {
         console.log('Error stopping sound:', error);
      }
   };

   const formatDuration = (duration) => {
      const time = Math.floor(duration / 1000);
      const minutes = Math.floor(time / 60);
      const seconds = time - minutes * 60;
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
   };

   const getSoundDuration = async (sound) => {
      const status = await sound.getStatusAsync();
      setDuration(status.durationMillis);
   };

   useEffect(() => {
      setTimeout(
         () => {
            if (isPlaying) {
               if (duration <= 0) {
                  setIsPlaying(false);
                  getSoundDuration(sound);
               }
               setDuration((prev) => (prev < 1000 ? setDuration(prev - prev) : setDuration(prev - 1000)));
            }
         },
         duration > 1000 ? 1000 : duration
      );
   }, [duration, isPlaying]);

   return (
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
            <FastImage
               source={{ uri: imageUser ? imageUser : imageFriend, priority: FastImage.priority.normal }}
               style={styles.avatar}
            />
         ) : null}
         {isRecalls ? (
            <View style={[styles.messageContainer, userId === localUserID ? { backgroundColor: '#CFF0FF' } : {}]}>
               {name && userId !== localUserID && <Text style={styles.name}>{name}</Text>}
               <Text style={[styles.content, { color: '#333' }]}>Tin nhắn đã được thu hồi</Text>
               <Text style={styles.time}>{dateTimeSend && formatTime(dateTimeSend)}</Text>
            </View>
         ) : (
            <Pressable onPress={onPress} onLongPress={() => handleModal(data)}>
               {urlRegex.test(message) || message.split(':')[0] === 'file' ? (
                  checkImage ? (
                     <View>
                        {name && userId !== localUserID && <Text style={styles.name}>{name}</Text>}
                        <FastImage
                           source={{ uri: message, priority: FastImage.priority.normal }}
                           style={styles.imageMessage}
                        />
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
                           checkVoice && userId === localUserID
                              ? {
                                   backgroundColor: '#CFF0FF',
                                }
                              : {
                                   width: 150,
                                   height: 200,
                                   justifyContent: 'space-around',
                                },
                        ]}
                     >
                        {name && userId !== localUserID && <Text style={styles.name}>{name}</Text>}
                        {checkVoice ? (
                           <View>
                              {name && userId !== localUserID && <Text style={styles.name}>{name}</Text>}
                              <View style={styles.audioContainer}>
                                 <IconButton
                                    icon={isPlaying ? 'stop' : 'play'}
                                    size={20}
                                    onPress={isPlaying ? handleStopSound : handlePlaySound}
                                 />
                                 <Text>{formatDuration(duration)}</Text>
                              </View>
                           </View>
                        ) : (
                           <View style={{ width: 100, height: 120 }}>
                              <FileIcon
                                 extension={message.split('.').pop()}
                                 {...defaultStyles[message.split('.').pop()]}
                              />
                              <Text style={{ marginTop: 2 }}>
                                 {message.split('/').pop().substring(0, 9) + '...' + message.split('.').pop()}
                              </Text>
                           </View>
                        )}
                        <Text style={[styles.time, checkVoice && { marginTop: 0 }]}>
                           {dateTimeSend && formatTime(dateTimeSend)}
                        </Text>
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
                        <FastImage
                           source={{ uri: imageUser ? imageUser : imageFriend, priority: FastImage.priority.normal }}
                           style={{ width: 20, height: 20, borderRadius: 10, marginRight: 8 }}
                        />
                     )}
                     {name && userId !== localUserID && <Text style={styles.name}>{name}</Text>}
                     {replyInfo?.name && (
                        <View style={styles.replyContainer}>
                           <View
                              style={{
                                 position: 'absolute',
                                 top: 0,
                                 bottom: 0,
                                 left: -2,
                                 borderWidth: 1,
                                 borderColor: '#FF5F00',
                                 borderRadius: 2,
                              }}
                           ></View>
                           <Text style={{ fontSize: 12 }}>{replyInfo.name}</Text>
                           <Text style={{ fontSize: 11, color: '#666' }}>
                              {/(jpg|jpeg|png|bmp|bmp)$/i.test(replyInfo.message.split('.').pop())
                                 ? '[Hình ảnh]'
                                 : /(mp4|avi|mkv|mov|wmv|flv|webm)$/i.test(replyInfo.message.split('.').pop())
                                 ? '[Video]'
                                 : /(m4a|wav|aac|flac|ogg)$/i.test(replyInfo.message.split('.').pop())
                                 ? '[Ghi âm]'
                                 : replyInfo.message.length > 30
                                 ? replyInfo.message.substring(0, 30) + '...'
                                 : replyInfo.message}
                           </Text>
                        </View>
                     )}
                     <Text style={styles.content}>{message}</Text>
                     {!resultTestNotify && <Text style={styles.time}>{dateTimeSend && formatTime(dateTimeSend)}</Text>}
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
                        userId === localUserID ? { left: -50 } : { right: -50 },
                     ]}
                     onPress={() => handleReactMessage('love', (chat = id), (chatRoom = currentChat.id))}
                  />
               )}
            </Pressable>
         )}
      </View>
   );
};
