import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import styles from './styles';

/**
 * Message component. This component is used to render a message.
 *
 * @param {Object} props - The props for the Message component.
 * @param {Object} props.data - The data for the message.
 * @param {string} props.data.user - The user who sent the message.
 * @param {string} props.data.time - The time when the message was sent.
 * @param {string} props.data.content - The content of the message.
 * @param {number} props.index - The index of the message.
 * @returns {JSX.Element} The rendered Message component.
 */
export const Message = ({ data, index }) => {
   const { user, time, content } = data;
   const avatar = 'https://picsum.photos/200';
   return (
      <TouchableOpacity>
         <View
            style={[styles.container, !user ? { alignSelf: 'flex-end' } : {}, index === 0 ? { marginBottom: 20 } : {}]}
         >
            {user ? <Image source={{ uri: avatar }} style={styles.avatar} /> : null}
            <View style={[styles.messageContainer, !user ? { backgroundColor: '#CFF0FF' } : {}]}>
               <Text style={styles.content}>{content}</Text>
               <Text style={styles.time}>{time}</Text>
            </View>
         </View>
      </TouchableOpacity>
   );
};
