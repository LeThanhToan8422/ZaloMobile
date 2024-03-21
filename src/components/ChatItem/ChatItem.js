import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import styles from './styles';

/**
 * Represents a chat item component.
 *
 * @component
 * @param {Object} props
 * @param {object} props.navigation - The navigation object.
 * @param {object} props.data - The data object containing chat information.
 * @param {number} props.data.id - The ID of the chat.
 * @param {string} props.data.name - The name of the chat.
 * @param {string} props.data.member - The member of the chat.
 * @param {string} props.data.message - The message of the chat.
 * @param {Date} props.data.dateTimeSend - The time when the message was sent.
 * @param {number} props.data.numberMessageUnread - The number of unread messages.
 * @returns {JSX.Element} The rendered chat item component.
 */
export const ChatItem = ({ navigation, data }) => {
   const { name, member, message, dateTimeSend } = data;
   const [numberMessageUnread, setNumberMessageUnread] = useState(data.numberMessageUnread || 0);
   const image = 'https://picsum.photos/200';
   return (
      <Pressable style={styles.container} onPress={() => navigation.push('ChatScreen', data)}>
         <Image source={{ uri: image }} style={styles.image} />
         <View style={styles.contentContainer}>
            <View style={{ flex: 1, marginLeft: 10, rowGap: 4 }}>
               <Text style={styles.name}>{name}</Text>
               <Text ellipsizeMode="tail" numberOfLines={1} style={styles.message}>
                  {message}
               </Text>
            </View>
            <View style={{ alignItems: 'center', rowGap: 4 }}>
               <Text style={styles.time}>{dateTimeSend.split(' ')[1].split(':', 2).join(':')}</Text>
               {numberMessageUnread ? (
                  <View
                     style={{
                        backgroundColor: '#EF4D48',
                        borderRadius: 10,
                        justifyContent: 'center',
                        width: 28,
                        height: 18,
                     }}
                  >
                     <Text style={styles.qtyNotification}>{numberMessageUnread >= 5 ? '5+' : numberMessageUnread}</Text>
                  </View>
               ) : (
                  ''
               )}
            </View>
         </View>
      </Pressable>
   );
};
