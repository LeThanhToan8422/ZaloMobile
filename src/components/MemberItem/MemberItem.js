import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Icon, IconButton, Menu } from 'react-native-paper';
import styles from './styles';
import { socket } from '../../utils/socket';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDetailChat, fetchMembersInGroup } from '../../features/detailChat/detailChatSlice';

export const MemberItem = ({ item }) => {
   const group = useSelector((state) => state.detailChat.info);
   const { user } = useSelector((state) => state.user);
   const dispatch = useDispatch();
   const [visible, setVisible] = useState(false);

   const handleRemoveMember = () => {
      socket.emit(`Client-Update-Group-Chats`, {
         group,
         mbs: item.id,
         implementer: user.id,
      });
      setVisible(false);
   };

   const handlePassLeader = () => {
      group.leader = item.id;
      group.deputy = group.leader === group.deputy ? null : group.deputy;
      socket.emit(`Client-Change-Leader-And-Deputy-Group-Chats`, {
         group,
      });
      onFreshMember();
      setVisible(false);
   };

   const handleAddDeputy = () => {
      group.deputy = item.id;
      socket.emit(`Client-Change-Leader-And-Deputy-Group-Chats`, {
         group,
      });
      onFreshMember();
      setVisible(false);
   };

   return (
      <Pressable
         style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 8,
         }}
         onPresss={() => {}}
      >
         <View>
            <Image source={{ uri: item.image }} style={{ width: 50, height: 50, borderRadius: 25 }} />
            {(group.leader === item.id || group.deputy === item.id) && (
               <View style={styles.iconKeyContainer}>
                  <Icon source="key-variant" size={14} color={group.leader === item.id ? 'yellow' : 'lightgray'} />
               </View>
            )}
         </View>
         <Text style={{ marginLeft: 12, fontSize: 18, flex: 1 }}>{item.name}</Text>
         {/* Trưởng nhóm và phó nhóm sẽ hiện menu, trưởng nhóm sẽ ko hiện menu item của trưởng nhóm, phó nhóm sẽ ko hiện menu item của trưởng nhóm và phó nhóm */}
         {(user.id === group.leader || user.id === group.deputy) && item.id !== group.leader && user.id !== item.id && (
            <Menu
               visible={visible}
               onDismiss={() => setVisible(false)}
               anchor={
                  <IconButton
                     style={{ marginBottom: -5 }}
                     mode="contained-tonal"
                     icon="dots-vertical"
                     color="#000"
                     size={24}
                     onPress={() => setVisible(true)}
                  />
               }
            >
               {group.leader === user.id && group.deputy !== item.id && (
                  <Menu.Item
                     leadingIcon={() => <Icon source={'account-star-outline'} size={22} />}
                     title="Bổ nhiệm làm phó nhóm"
                     onPress={handleAddDeputy}
                  />
               )}
               {group.leader === user.id && (
                  <Menu.Item
                     leadingIcon={() => <Icon source={'account-key'} size={22} />}
                     title="Chuyển quyền trưởng nhóm"
                     onPress={handlePassLeader}
                  />
               )}
               <Menu.Item
                  leadingIcon={() => <Icon source={'account-cancel-outline'} size={22} />}
                  title="Xóa khỏi nhóm"
                  onPress={handleRemoveMember}
               />
            </Menu>
         )}
      </Pressable>
   );
};
