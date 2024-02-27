import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import styles from './styles';

export const ChatItem = ({ navigation, data }) => {
   const { name, member, message, dateTimeSend } = data;
   const [numberMessageUnread, setNumberMessageUnread] = useState(data.numberMessageUnread || 0);
   const image = 'https://picsum.photos/200';
   return (
      <Pressable style={styles.container} onPress={() => navigation.navigate('ChatScreen', data)}>
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
