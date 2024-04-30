import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import Dialog from 'react-native-dialog';
import { Icon } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { PressableItem } from '../../components/PressableItem/PressableItem';
import { socket } from '../../utils/socket';
import styles from './styles';

export const DetailChatScreen = ({ navigation, route }) => {
   const { id } = route.params;
   const [visibleRemoveHistory, setVisibleRemoveHistory] = useState(false);
   const [visibleLeave, setVisibleLeave] = useState(false);
   const [visibleDisband, setVisibleDisband] = useState(false);
   const dispatch = useDispatch();
   const { user } = useSelector((state) => state.user);
   const { info } = useSelector((state) => state.detailChat);

   const handleRemoveHistoryChat = async () => {
      socket.emit(`Client-Delete-Chat`, {
         dateTimeSend: dayjs().format('YYYY-MM-DD HH:mm:ss'),
         implementer: user.id,
         chat: !info?.leader ? info?.id : null,
         groupChat: info?.leader ? info?.id : null,
      });
      navigation.navigate('AppTabs');
   };

   const handleLeaveGroup = () => {
      if (info?.leader === user.id) {
         alert('Bạn không thể rời nhóm vì bạn là người tạo nhóm');
         return;
      }
      socket.emit(`Client-Update-Group-Chats`, {
         group: info,
         mbs: user.id,
      });
      navigation.navigate('AppTabs');
   };

   const handleDisbandGroup = () => {
      socket.emit(`Client-Dessolution-Group-Chats`, {
         group: info,
      });
      navigation.navigate('AppTabs');
   };

   return (
      <View>
         <Dialog.Container visible={visibleRemoveHistory}>
            <Dialog.Title>Bạn có chắc muốn xóa cuộc trò chuyện này?</Dialog.Title>
            <Dialog.Description>Bạn không thể khôi phục các tin nhắn</Dialog.Description>
            <Dialog.Button label="Hủy" onPress={() => setVisibleRemoveHistory(false)} />
            <Dialog.Button label="Xóa" onPress={handleRemoveHistoryChat} />
         </Dialog.Container>
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

         <Image source={{ uri: info?.image }} style={styles.avatar} />
         <Text style={styles.name}>{info?.name}</Text>
         <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 20 }}>
            <TouchableOpacity
               style={{ flexDirection: 'column', alignItems: 'center', marginBottom: 12 }}
               onPress={() => {}}
            >
               <Icon source={'comment-search'} size={24} />
               <Text>Tìm tin nhắn</Text>
            </TouchableOpacity>
            {info?.members && (
               <TouchableOpacity
                  style={{ flexDirection: 'column', alignItems: 'center' }}
                  onPress={() =>
                     navigation.navigate('ManageGroupAndChatScreen', { data: route.params, type: 'addMember' })
                  }
               >
                  <Icon source={'account-plus-outline'} size={24} />
                  <Text>Thêm thành viên</Text>
               </TouchableOpacity>
            )}
         </View>
         {info?.members && (
            <PressableItem
               icon="account-multiple-outline"
               iconStyle={{ color: '#000' }}
               title={`Xem thành viên (${info?.members && info?.members.length})`}
               navigation={navigation}
               navParams={{ screen: 'MembersChatScreen', params: { data: info } }}
            />
         )}
         <PressableItem
            icon="trash-can-outline"
            iconStyle={{ color: '#000' }}
            title="Xóa lịch sử trò chuyện"
            action={() => setVisibleRemoveHistory(true)}
         />
         {info.leader && (
            <PressableItem
               icon="logout"
               iconStyle={{ color: 'red' }}
               title="Rời khỏi nhóm"
               titleStyle={{ color: 'red' }}
               action={() => setVisibleLeave(true)}
            />
         )}
         {user.id === info?.leader && (
            <PressableItem
               icon="logout"
               iconStyle={{ color: 'red' }}
               title="Giải tán nhóm"
               titleStyle={{ color: 'red' }}
               action={() => setVisibleDisband(true)}
            />
         )}
      </View>
   );
};
