import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import styles from './styles';
import { IconButton } from 'react-native-paper';
import { socket } from '../../utils/socket';
import { useSelector } from 'react-redux';

export const SearchItem = ({ navigation, data }) => {
   const { user } = useSelector((state) => state.user);
   const { id, image, name, leader } = data;
   const [isFriend, setIsFriend] = useState(false);
   const [isSendRequest, setIsSendRequest] = useState(false);

   useEffect(() => {});

   const handleAddFriend = async () => {
      socket.emit(`Client-Make-Friends`, {
         content: 'Mình kết bạn với nhau nhé!!!',
         giver: user.id, // id user của mình
         recipient: id, // id của user muốn kết bạn hoặc block
         chatRoom: user.id > id ? `${id}${user.id}` : `${user.id}${id}`,
      });
      setIsSendRequest(!isSendRequest);
   };

   return (
      <Pressable
         style={styles.container}
         onPress={() => {
            navigation.goBack();
            leader ? navigation.navigate('ChatScreen', data) : navigation.navigate('ProfileScreen', { friend: id });
         }}
      >
         <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image source={{ uri: image }} style={styles.avatar} />
            <Text style={styles.name}>{name}</Text>
         </View>
         {user.id !== id && (
            <View style={{ flexDirection: 'row' }}>
               {!isFriend && (
                  <IconButton
                     mode="contained-tonal"
                     icon={isSendRequest ? 'account-off-outline' : 'account-plus'}
                     color="#000"
                     size={20}
                     onPress={() => {}}
                  />
               )}
               <IconButton mode="contained-tonal" icon="chat-plus-outline" color="#000" size={20} onPress={() => {}} />
            </View>
         )}
      </Pressable>
   );
};
