import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
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
export const Message = ({ data, index, localUserID }) => {
   const { dateTimeSend, message } = data;
   const id = data.sender;

   const avatar = 'https://picsum.photos/200';
   return (
      <TouchableOpacity>
         <View
            style={[
               styles.container,
               id === localUserID ? { alignSelf: 'flex-end' } : {},
               index === 0 ? { marginBottom: 20 } : {},
            ]}
         >
            {id !== localUserID ? <Image source={{ uri: avatar }} style={styles.avatar} /> : null}
            <View style={[styles.messageContainer, id === localUserID ? { backgroundColor: '#CFF0FF' } : {}]}>
               <Text style={styles.content}>{message}</Text>
               <Text style={styles.time}>{formatTime(dateTimeSend)}</Text>
            </View>
         </View>
      </TouchableOpacity>
   );
};
