import { PORT, SERVER_HOST } from '@env';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { formatTime } from '../../utils/func';
import styles from './styles';
import { getUserID } from '../../utils/storage';

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
export const Message = ({ data, index, localUserID, handleModal }) => {
   const { message, dateTimeSend } = data;
   const id = data.sender;
   const friendId = data.receiver;
   const [avtFriend, setAvtFriend] = useState(null);
   // const id = data.sender;
   const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/;

   useEffect(() => {
      getUserID().then((localUserId) => {
         localUserID === friendId && getAvatarFriend(id);
      });
   }, []);

   const getAvatarFriend = async (id) => {
      try {
         const response = await axios.get(`${SERVER_HOST}:${PORT}/users/${id}`);
         setAvtFriend(response.data.image);
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <Pressable onLongPress={() => handleModal(data)}>
         <View
            style={[
               styles.container,
               id === localUserID ? { alignSelf: 'flex-end' } : {},
               index === 0 ? { marginBottom: 20 } : {},
            ]}
         >
            {id !== localUserID ? <Image source={{ uri: avtFriend }} style={styles.avatar} /> : null}

            {urlRegex.test(message) ? (
               <Image source={{ uri: message }} style={styles.imageMessage} />
            ) : (
               <View style={[styles.messageContainer, id === localUserID ? { backgroundColor: '#CFF0FF' } : {}]}>
                  <Text style={styles.content}>{message}</Text>
                  <Text style={styles.time}>{dateTimeSend ? formatTime(dateTimeSend) : formatTime(new Date())}</Text>
               </View>
            )}
         </View>
      </Pressable>
   );
};
