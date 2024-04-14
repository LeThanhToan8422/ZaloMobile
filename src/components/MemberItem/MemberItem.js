import React, { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Icon, IconButton, Menu } from 'react-native-paper';
import styles from './styles';
import { socket } from '../../utils/socket';

export const MemberItem = ({ data, item, userID, onFreshMember }) => {
   const [group, setGroup] = useState(data);
   const [visible, setVisible] = useState(false);

   const handleRemoveMember = () => {
      socket.emit(`Client-Update-Group-Chats`, {
         group,
         mbs: item.id,
      });
      setVisible(false);
      onFreshMember();
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
      console.log('group', group);
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
         {(userID === group.leader || userID === group.deputy) && item.id !== group.leader && userID !== item.id && (
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
               {group.leader === userID && group.deputy !== item.id && (
                  <Menu.Item
                     leadingIcon={() => <Icon source={'account-star-outline'} size={22} />}
                     title="Bổ nhiệm làm phó nhóm"
                     onPress={handleAddDeputy}
                  />
               )}
               {group.leader === userID && (
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