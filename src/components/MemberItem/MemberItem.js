import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Icon, IconButton, Menu } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { socket } from '../../utils/socket';
import styles from './styles';

export const MemberItem = ({ item }) => {
   const group = useSelector((state) => state.detailChat.info);
   const { user } = useSelector((state) => state.user);
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
      socket.emit(`Client-Change-Leader-And-Deputy-Group-Chats`, {
         group: {
            ...group,
            leader: item.id,
            deputy: group.leader === group.deputy ? null : group.deputy,
         },
      });
      setVisible(false);
   };

   const handleAddDeputy = () => {
      socket.emit(`Client-Change-Leader-And-Deputy-Group-Chats`, {
         group: { ...group, deputy: item.id },
      });
      setVisible(false);
   };

   const handleRemoveDeputy = () => {
      socket.emit(`Client-Change-Leader-And-Deputy-Group-Chats`, {
         group: { ...group, deputy: null },
      });
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
         <View style={{ flex: 1 }}>
            <Text style={{ marginLeft: 12, fontSize: 18, flex: 1 }}>{item.name}</Text>
            {(group.leader === item.id || group.deputy === item.id) && (
               <Text style={{ marginLeft: 12, fontSize: 14, flex: 1 }}>
                  {group.leader === item.id ? 'Trưởng nhóm' : 'Phó nhóm'}
               </Text>
            )}
         </View>
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
               {group.leader === user.id && group.deputy === item.id && (
                  <Menu.Item
                     leadingIcon={() => <Icon source={'account-cancel-outline'} size={22} />}
                     title="Xóa phó nhóm"
                     onPress={handleRemoveDeputy}
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
