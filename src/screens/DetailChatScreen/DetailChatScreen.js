import { SERVER_HOST } from '@env';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { PressableItem } from '../../components/PressableItem/PressableItem';
import { getUserID } from '../../utils/storage';
import styles from './styles';
import { socket } from '../../utils/socket';
import Toast from 'react-native-toast-message';
import Dialog from 'react-native-dialog';

export const DetailChatScreen = ({ navigation, route }) => {
   const [userID, setUserID] = useState('');
   const { id, member } = route.params;
   const [info, setInfo] = useState({});
   const [visibleLeave, setVisibleLeave] = useState(false);
   const [visibleDisband, setVisibleDisband] = useState(false);

   useEffect(() => {
      getUserID().then((id) => {
         setUserID(id);
         getInformationOfChat();
      });
   }, []);

   useEffect(() => {
      const unsubscribe = navigation.addListener('focus', () => {
         getInformationOfChat();
      });
      return unsubscribe;
   }, [navigation]);

   useEffect(() => {
      socket.on(`Server-Group-Chats-${userID}`, (dataGot) => {
         console.log(dataGot);
      });
      return () => {
         socket.off(`Server-Group-Chats-${userID}`);
      };
   }, [socket]);

   const handleLeaveGroup = () => {
      socket.emit(`Client-Update-Group-Chats`, {
         group: info,
         mbs: userID,
      });
      navigation.navigate('AppTabs');
   };

   const handleDisbandGroup = () => {
      socket.emit(`Client-Dessolution-Group-Chats`, {
         group: info,
      });
      navigation.navigate('AppTabs');
   };

   const getInformationOfChat = async () => {
      const res = member
         ? await axios.get(`${SERVER_HOST}/group-chats/${id}`)
         : await axios.get(`${SERVER_HOST}/chats/${id}`);
      if (res.data) {
         setInfo(res.data);
      }
   };

   return (
      <View>
         <Dialog.Container visible={visibleLeave}>
            <Dialog.Title>Bạn có chắc muốn rời nhóm?</Dialog.Title>
            <Dialog.Description>Bạn có chắc muốn rời nhóm? Bạn không thể hoàn tác</Dialog.Description>
            <Dialog.Button label="Hủy" onPress={() => setVisibleLeave(false)} />
            <Dialog.Button label="Rời nhóm" onPress={handleLeaveGroup} />
         </Dialog.Container>
         <Dialog.Container visible={visibleDisband}>
            <Dialog.Title>Bạn có chắc muốn giải tán nhóm?</Dialog.Title>
            <Dialog.Description>Bạn không thể khôi phục nhóm và các đoạn chat</Dialog.Description>
            <Dialog.Button label="Hủy" onPress={() => setVisibleDisband(false)} />
            <Dialog.Button label="Giải tán" onPress={handleDisbandGroup} />
         </Dialog.Container>

         <Image source={{ uri: info.image }} style={styles.avatar} />
         <Text style={styles.name}>{info.name}</Text>
         <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
            <TouchableOpacity style={{ flexDirection: 'column', alignItems: 'center' }} onPress={() => {}}>
               <Icon source={'comment-search'} size={24} />
               <Text>Tìm tin nhắn</Text>
            </TouchableOpacity>
            <TouchableOpacity
               style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}
               onPress={() =>
                  navigation.navigate('ManageGroupAndChatScreen', { data: route.params, type: 'addMember' })
               }
            >
               <Icon source={'account-plus-outline'} size={24} />
               <Text>Thêm thành viên</Text>
            </TouchableOpacity>
         </View>
         <PressableItem
            icon="account-multiple-outline"
            iconStyle={{ color: '#000' }}
            title={`Xem thành viên (${info.members ? info.members.length : 0})`}
            navigation={navigation}
            navParams={{ screen: 'MembersChatScreen', params: { data: info } }}
         />
         <PressableItem
            icon="trash-can-outline"
            iconStyle={{ color: '#000' }}
            title="Xóa lịch sử trò chuyện"
            action={() => {}}
         />
         {userID === info.leader && (
            <PressableItem
               icon="logout"
               iconStyle={{ color: 'red' }}
               title="Giải tán nhóm"
               titleStyle={{ color: 'red' }}
               action={() => setVisibleDisband(true)}
            />
         )}
         {userID !== info.leader && (
            <PressableItem
               icon="logout"
               iconStyle={{ color: 'red' }}
               title="Rời khỏi nhóm"
               titleStyle={{ color: 'red' }}
               action={() => setVisibleLeave(true)}
            />
         )}
      </View>
   );
};
