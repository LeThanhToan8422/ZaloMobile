import Constants from 'expo-constants';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
   FlatList,
   Image,
   Keyboard,
   KeyboardAvoidingView,
   Platform,
   Pressable,
   Text,
   TouchableWithoutFeedback,
   View,
} from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';
import styles from './styles';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Toast from 'react-native-toast-message';
import { socket } from '../../utils/socket';
import * as ImagePicker from 'expo-image-picker';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

export const ManageGroupAndChat = ({ navigation, route }) => {
   const SERVER_HOST = Constants.expoConfig.extra.SERVER_HOST;
   const [groupName, setGroupName] = useState('');
   const [search, setSearch] = useState('');
   const [avatarGroup, setAvatarGroup] = useState('');
   const [friends, setFriends] = useState([]);
   const [selectMembers, setSelectMembers] = useState([]);
   const type = route.params?.type;
   const data = route.params?.data;
   const { user } = useSelector((state) => state.user);
   let searchTimeout = null;

   navigation.setOptions({
      headerTitle: type === 'addGroup' ? 'Tạo nhóm mới' : type === 'addMember' ? 'Thêm thành viên' : 'Chuyển tiếp',
      headerLeft: () => (
         <IconButton
            icon="close"
            color="#fff"
            size={24}
            onPress={() => {
               navigation.goBack();
            }}
         />
      ),
      headerRight: () => (
         <IconButton
            icon="check"
            color="#fff"
            size={24}
            onPress={async () => {
               const dataGroup = type === 'addMember' && (await axios.get(`${SERVER_HOST}/group-chats/${data.id}`));
               if (type === 'addGroup' && !checkValidate()) return;
               type === 'addGroup'
                  ? socket.emit(`Client-Group-Chats`, {
                       name: groupName,
                       members: JSON.stringify([user.id, ...selectMembers]),
                       leader: user.id,
                    })
                  : type === 'addMember'
                  ? socket.emit(`Client-Update-Group-Chats`, {
                       group: dataGroup.data,
                       // group : thông tin của group đang chat
                       mbs: selectMembers,
                       implementer: user.id,
                    })
                  : selectMembers.forEach((friendID) => sendMessage(friendID));
               navigation.goBack();
            }}
         />
      ),
   });

   useEffect(() => {
      getFriends();
   }, []);

   const checkValidate = () => {
      if (!groupName) {
         Toast.show({
            type: 'error',
            text1: 'Vui lòng nhập tên nhóm',
            position: 'bottom',
         });
         return false;
      }
      if (selectMembers.length <= 1) {
         Toast.show({
            type: 'error',
            text1: 'Nhóm phải có ít nhất 3 thành viên',
            position: 'bottom',
         });
         return false;
      }
      return true;
   };

   const sendMessage = async (friendID) => {
      const res = await axios.get(`${SERVER_HOST}/users/get-chats-by-id/${user.id}`);
      const result = res.data.filter((item) => item.id === friendID)[0];
      const params = {
         message: data.message.trim(), // thông tin message
         dateTimeSend: dayjs().format('YYYY-MM-DD HH:mm:ss'),
         sender: user.id, // id người gửi
         chatRoom: result?.leader ? result.id : user.id > friendID ? `${friendID}${user.id}` : `${user.id}${friendID}`,
      };
      result?.leader ? (params.groupChat = result.id) : (params.receiver = friendID);
      socket.emit('Client-Chat-Room', params);
   };

   const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      console.log(result.assets[0].uri);
      setAvatarGroup(result.assets[0].uri);

      // if (!result.canceled) {
      //    result.assets.forEach((image) => handleSendFile(image));
      // }
   };

   const handleSearch = (text) => {
      const search = async () => {
         let res = null;
         if (type === 'addMember') {
            res = text.trim()
               ? await axios.get(`${SERVER_HOST}/users/get-friends-not-join-group/${user.id}/${data.id}/${text}`)
               : await axios.get(`${SERVER_HOST}/users/get-friends-not-join-group/${user.id}/${data.id}`);
         } else {
            res = /^[0-9]+$/g.test(text)
               ? await axios.get(`${SERVER_HOST}/users/phone/${text}`)
               : await axios.get(`${SERVER_HOST}/users/friends/${user.id}/${text}`);
         }
         if (res.data) {
            if (type === 'addGroup') setFriends(res.data.filter((item) => !item.leader));
            else setFriends(res.data);
         }
      };
      setSearch(text);
      if (searchTimeout) clearTimeout(searchTimeout);
      searchTimeout = setTimeout(search, 300);
   };

   const getFriends = async () => {
      const res =
         type === 'forward'
            ? await axios.get(`${SERVER_HOST}/users/friends/${user.id}`)
            : type === 'addMember'
            ? await axios.get(`${SERVER_HOST}/users/get-friends-not-join-group/${user.id}/${data.id}`)
            : await axios.get(`${SERVER_HOST}/users/friends/${user.id}`);
      if (res.data) {
         if (type === 'addGroup') setFriends(res.data.filter((item) => !item.leader));
         else setFriends(res.data);
      }
   };

   return (
      <KeyboardAvoidingView
         enabled
         {...(Platform.OS === 'ios' && { behavior: 'padding', keyboardVerticalOffset: 60 })}
         style={{ flexGrow: 1 }}
      >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
               {type === 'addGroup' && (
                  <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
                     <Pressable style={styles.imageGroupContainer} onPress={pickImage}>
                        <Image
                           source={avatarGroup ? { uri: avatarGroup } : require('../../../assets/images/camera.jpeg')}
                           style={[
                              styles.imageGroup,
                              avatarGroup && {
                                 width: 50,
                                 height: 50,
                              },
                           ]}
                        />
                     </Pressable>
                     <TextInput
                        style={{ marginLeft: 8, flex: 1 }}
                        placeholder=" Đặt tên nhóm"
                        value={groupName}
                        onChangeText={(text) => setGroupName(text)}
                     />
                  </View>
               )}
               <TextInput
                  left={<TextInput.Icon icon="account-search" />}
                  style={{ marginTop: 20 }}
                  placeholder="Tìm kiếm bạn bè "
                  value={search}
                  onChangeText={(text) => handleSearch(text)}
               />

               <FlatList
                  data={friends}
                  keyExtractor={(_, index) => index.toString()}
                  renderItem={({ item }) => {
                     return (
                        <View style={{ paddingHorizontal: 8 }}>
                           <BouncyCheckbox
                              id={item.id}
                              size={22}
                              fillColor="#447DF4"
                              unfillColor="#fff"
                              textComponent={
                                 <View
                                    style={{
                                       marginLeft: 16,
                                       paddingVertical: 8,
                                       flexDirection: 'row',
                                       alignItems: 'center',
                                    }}
                                 >
                                    <Image
                                       source={{ uri: item.image }}
                                       style={{ width: 50, height: 50, borderRadius: 25 }}
                                    />
                                    <Text style={{ marginLeft: 10, fontSize: 18, color: '#000' }}>{item.name}</Text>
                                 </View>
                              }
                              iconStyle={{ borderColor: '#ccc' }}
                              onPress={(isChecked) => {
                                 isChecked
                                    ? setSelectMembers((prev) => [...prev, item.id])
                                    : setSelectMembers((prev) => prev.filter((i) => i !== item.id));
                              }}
                           />
                        </View>
                     );
                  }}
               />
            </View>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
};
