import { SERVER_HOST } from '@env';
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
import { getUserID } from '../../utils/storage';
import styles from './styles';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import Toast from 'react-native-toast-message';
import { socket } from '../../utils/socket';
import * as ImagePicker from 'expo-image-picker';
import dayjs from 'dayjs';

export const ManageGroupAndChat = ({ navigation, route }) => {
   const [userID, setUserID] = useState('');
   const [groupName, setGroupName] = useState('');
   const [search, setSearch] = useState('');
   const [avatarGroup, setAvatarGroup] = useState('');
   const [friends, setFriends] = useState([]);
   const [selectMembers, setSelectMembers] = useState([]);
   const type = route.params?.type;
   const data = route.params?.data;
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
                  ? checkValidate() &&
                    socket.emit(`Client-Group-Chats`, {
                       name: groupName,
                       members: JSON.stringify([userID, ...selectMembers]),
                       leader: userID,
                    })
                  : type === 'addMember'
                  ? socket.emit(`Client-Update-Group-Chats`, {
                       group: dataGroup.data,
                       // group : thông tin của group đang chat
                       mbs: selectMembers,
                    })
                  : selectMembers.forEach((friendID) => sendMessage(friendID));
               navigation.goBack();
            }}
         />
      ),
   });

   useEffect(() => {
      getUserID().then((userID) => {
         getFriends(userID);
         setUserID(userID);
      });
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
      const res = await axios.get(`${SERVER_HOST}/group-chats/${friendID}`);
      const params = {
         message: data.message.trim(), // thông tin message
         dateTimeSend: dayjs().format('YYYY-MM-DD HH:mm:ss'),
         sender: userID, // id người gửi
         chatRoom: res.data ? res.data.id : userID > friendID ? `${friendID}${userID}` : `${userID}${friendID}`,
      };
      res.data ? (params.groupChat = res.data.id) : (params.receiver = friendID);
      console.log(params);
      // socket.emit('Client-Chat-Room', params);
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
               ? await axios.get(`${SERVER_HOST}/users/get-friends-not-join-group/${userID}/${data.id}/${text}`)
               : await axios.get(`${SERVER_HOST}/users/get-friends-not-join-group/${userID}/${data.id}`);
         } else {
            res = /^[0-9]*$/g.test(text)
               ? await axios.get(`${SERVER_HOST}/users/phone/${text}`)
               : await axios.get(`${SERVER_HOST}/users/friends/${userID}/${text}`);
         }
         if (res.data) {
            setFriends(res.data);
         }
      };

      setSearch(text);
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(search, 500);
   };

   const getFriends = async (userID) => {
      const res =
         type === 'forward'
            ? await axios.get(`${SERVER_HOST}/users/get-chats-by-id/${userID}`)
            : type === 'addMember'
            ? await axios.get(`${SERVER_HOST}/users/get-friends-not-join-group/${userID}/${data.id}`)
            : await axios.get(`${SERVER_HOST}/users/friends/${userID}`);
      if (res.data) {
         setFriends(res.data);
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
