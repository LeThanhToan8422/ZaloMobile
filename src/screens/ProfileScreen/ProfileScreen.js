import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Buffer } from 'buffer';
import dayjs from 'dayjs';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
   Alert,
   ImageBackground,
   Keyboard,
   KeyboardAvoidingView,
   Platform,
   Pressable,
   ScrollView,
   Text,
   TouchableWithoutFeedback,
   View,
} from 'react-native';
import RNFS from 'react-native-fs';
import { Avatar, Button, Icon, IconButton, Menu, PaperProvider, RadioButton, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../features/user/userSlice';
import { socket } from '../../utils/socket';
import styles from './styles';
import { fetchChats, fetchMessagesOfChats } from '../../features/chat/chatSlice';
import { fetchFriendRequests } from '../../features/friendRequest/friendRequestSlice';
import { fetchFriend } from '../../features/friend/friendSlice';

export const ProfileScreen = ({ navigation, route }) => {
   const SERVER_HOST = Constants.expoConfig.extra.SERVER_HOST;
   const [profileAU, setProfileAU] = useState({});
   const [name, setName] = useState('');
   const [dob, setDob] = useState(null);
   const [gender, setGender] = useState(0);
   const friendID = route.params?.friend;
   const [statusFriend, setStatusFriend] = useState({});
   const [visible, setVisible] = React.useState(false);

   const dispatch = useDispatch();
   const { user } = useSelector((state) => state.user);
   const { friendRequests } = useSelector((state) => state.friendRequest);

   useEffect(() => {
      navigation.setOptions({
         title: 'Thông tin cá nhân',
      });
      if (friendID) {
         getInfoFriend(friendID);
         checkIsFriend(user.id, friendID);
      } else {
         setProfileAU(user);
         setName(user.name);
         setDob(user.dob);
         setGender(user.gender);
      }
   }, []);

   const checkIsFriend = async (id, friendID) => {
      try {
         const response = await axios.get(`${SERVER_HOST}/users/check-is-friend/${id}/${friendID}`);
         if (response.data) {
            console.log(response.data);
            setStatusFriend(response.data);
         }
      } catch (error) {
         console.error(error);
      }
   };

   const getInfoFriend = async (id) => {
      const response = await axios.get(`${SERVER_HOST}/users/${id}`);
      if (response.data) {
         setProfileAU(response.data);
      }
   };

   const onChange = (event, selectedDate) => {
      setDob(selectedDate);
   };

   const showMode = () => {
      DateTimePickerAndroid.open({
         value: new Date(dob) || new Date(),
         onChange,
         mode: 'date',
      });
   };

   const pickImage = async (type) => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      if (!result.canceled) {
         let localUri = result.assets[0].uri;
         let filename = localUri.split('/').pop();
         let match = /\.(\w+)$/.exec(filename);
         let typeImage = match ? `image/${match[1]}` : `image/jpg`;
         const fileContent = await RNFS.readFile(localUri, 'base64');
         const buffer = Buffer.from(fileContent, 'base64');

         const data = {
            fieldname: 'image',
            originalname: filename,
            encoding: '7bit',
            mimetype: typeImage,
            buffer: buffer,
            size: result.assets[0].fileSize,
         };
         try {
            if (type === 'avatar') {
               socket.emit('Client-update-avatar', {
                  file: data,
                  id: user.id,
               });
            } else {
               socket.emit('Client-update-background', {
                  id: user.id,
                  file: data,
               });
            }
         } catch (error) {
            console.error(error);
         }
      }
   };

   const handleUpdateProfile = async () => {
      try {
         const response = await axios.put(`${SERVER_HOST}/users`, {
            id: user.id,
            name,
            gender,
            dob: dayjs(dob).format('YYYY-MM-DD'),
         });
         if (response.data) {
            Toast.show({
               type: 'success',
               text1: 'Cập nhật thông tin cá nhân thành công',
               position: 'bottom',
            });
            dispatch(updateUser({ ...user, name, gender, dob: dayjs(dob).format('YYYY-MM-DD') }));
         }
      } catch (error) {
         console.error(error);
      }
   };

   const handleAddFriend = async () => {
      socket.emit(`Client-Make-Friends`, {
         content: 'Mình kết bạn với nhau nhé!!!',
         giver: user.id, // id user của mình
         recipient: friendID, // id của user muốn kết bạn hoặc block
         chatRoom: user.id > friendID ? `${friendID}${user.id}` : `${user.id}${friendID}`,
      });
      setStatusFriend({ isFriends: 'Đã' });
   };

   const handleBlockUser = async () => {
      let handleClickBlock = async () => {
         let dataBlock = await axios.post(`${SERVER_HOST}/users/relationships`, {
            relationship: 'block',
            id: user.id, // id user của mình
            objectId: friendID, // id của user muốn block
         });
      };
      Alert.alert(
         'Chặn người dùng',
         'Bạn có chắc chắn muốn chặn người dùng này không?',
         [
            {
               text: 'Hủy',
               onPress: () => console.log('Cancel Pressed'),
               style: 'cancel',
            },
            { text: 'Chặn', onPress: () => handleClickBlock() },
         ],
         { cancelable: false }
      );
   };

   const handleRemoveFriend = async () => {
      Alert.alert(
         'Hủy kết bạn',
         `Bạn có chắc chắn muốn hủy kết bạn với ${profileAU?.name} không?`,
         [
            {
               text: 'Hủy',
               onPress: () => console.log('Cancel Pressed'),
               style: 'cancel',
            },
            {
               text: 'Hủy kết bạn',
               onPress: async () => {
                  socket.emit(`Client-Update-Friends`, {
                     userId: user.id,
                     friendId: friendID,
                     chatRoom: user.id > friendID ? `${friendID}${user.id}` : `${user.id}${friendID}`,
                  });
                  setStatusFriend({ isFriends: '0' });
               },
            },
         ],
         { cancelable: false }
      );
   };

   const handleRemoveMakeFriend = async () => {
      const makeFriendData = await axios.get(`${SERVER_HOST}/make-friends/givers/${friendID}`);
      if (makeFriendData.data) {
         const id = makeFriendData.data.find((item) => item.id === user.id).makeFriendId;
         if (id) {
            const dataDelete = await axios.delete(`${SERVER_HOST}/make-friends/${id}`);
            if (dataDelete.data) setStatusFriend({});
         }
      }
   };

   const handleAgreeMakeFriend = async () => {
      const dataDelete = await axios.delete(
         `${SERVER_HOST}/make-friends/${friendRequests.find((item) => item.id === friendID).makeFriendId}`
      );
      if (dataDelete.data) {
         const params = {
            relationship: 'friends',
            id: user.id, // id user của mình
            objectId: friendID, // id của user muốn kết bạn
         };
         let dataAddFriend = await axios.post(`${SERVER_HOST}/users/relationships`, params);
         if (dataAddFriend.data) {
            socket.emit(`Client-Chat-Room`, {
               message: `Bạn và ${name} đã trở thành bạn`,
               dateTimeSend: dayjs().format('YYYY-MM-DD HH:mm:ss'),
               sender: user.id,
               receiver: friendID,
               chatRoom: user.id > friendID ? `${friendID}${user.id}` : `${user.id}${friendID}`,
            });
            setContentChat(`Bạn và ${name} đã trở thành bạn`);
            dispatch(fetchChats(user.id));
            dispatch(fetchMessagesOfChats(user.id));
            dispatch(fetchFriendRequests());
            dispatch(fetchFriend());
            setIsFriend(true);
         }
      }
   };

   return (
      <PaperProvider>
         <ScrollView>
            <KeyboardAvoidingView
               enabled
               {...(Platform.OS === 'ios' && { behavior: 'padding', keyboardVerticalOffset: 60 })}
               style={{ flexGrow: 1 }}
            >
               <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={styles.container}>
                     <Pressable onPress={() => !friendID && pickImage('background')}>
                        <ImageBackground
                           source={{ uri: profileAU?.background || undefined }}
                           style={styles.background}
                        />
                     </Pressable>
                     <View style={styles.avatarContainer}>
                        <Pressable onPress={() => !friendID && pickImage('avatar')}>
                           <Avatar.Image size={150} source={{ uri: profileAU?.image || undefined }} />
                        </Pressable>
                        <Text style={{ fontSize: 25, fontWeight: '700' }}>{profileAU?.name}</Text>
                     </View>
                     {friendID && (
                        <View
                           style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                              marginHorizontal: 12,
                           }}
                        >
                           {statusFriend.isFriends === '1' && (
                              <Button
                                 icon={() => <Icon source={'chat-plus-outline'} size={22} />}
                                 mode="contained"
                                 style={[styles.btnEdit, { marginRight: 10, flex: 1, backgroundColor: '#A5C4F2' }]}
                                 labelStyle={{ fontSize: 16, color: '#000' }}
                                 onPress={() =>
                                    navigation.navigate('ChatScreen', { id: friendID, name: profileAU.name })
                                 }
                              >
                                 Nhắn tin
                              </Button>
                           )}
                           <Button
                              icon={() =>
                                 statusFriend.isFriends === '1' || statusFriend.isFriends?.includes('Đợi') ? (
                                    <Icon source={'account-check'} size={22} />
                                 ) : statusFriend.isFriends?.includes('Đã') ? (
                                    <Icon source={'account-arrow-right'} size={22} />
                                 ) : (
                                    <Icon source={'account-plus-outline'} size={22} />
                                 )
                              }
                              mode="contained"
                              style={[styles.btnEdit]}
                              labelStyle={{ fontSize: 16, color: '#000' }}
                              onPress={
                                 statusFriend.isFriends === '1'
                                    ? handleRemoveFriend
                                    : statusFriend.isFriends?.includes('Đã')
                                    ? handleRemoveMakeFriend
                                    : statusFriend.isFriends?.includes('Đợi')
                                    ? handleAgreeMakeFriend
                                    : handleAddFriend
                              }
                           >
                              {statusFriend.isFriends === '1'
                                 ? 'Bạn bè'
                                 : statusFriend.isFriends?.includes('Đã')
                                 ? 'Hủy lời mời'
                                 : statusFriend.isFriends?.includes('Đợi')
                                 ? 'Chấp nhận'
                                 : 'Kết bạn'}
                           </Button>
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
                              <Menu.Item
                                 leadingIcon={() => <Icon source={'account-cancel-outline'} size={22} />}
                                 title={'Chặn'}
                                 onPress={() => {
                                    handleBlockUser();
                                 }}
                              />
                           </Menu>
                        </View>
                     )}
                     <Text style={{ fontSize: 20, fontWeight: '500', marginTop: 30, marginLeft: 10, marginBottom: 10 }}>
                        Thông tin cá nhân
                     </Text>
                     <View style={styles.inputContainer}>
                        <Text style={styles.labelInput}>Họ tên:</Text>
                        <TextInput
                           style={styles.input}
                           contentStyle={{ color: '#000' }}
                           placeholder="Nhập họ tên"
                           value={profileAU?.name || name}
                           editable={friendID ? false : true}
                           onChangeText={(text) => setName(text)}
                        />
                     </View>
                     <View style={styles.inputContainer}>
                        <Text style={styles.labelInput}>Ngày sinh:</Text>
                        {Platform.OS === 'android' ? (
                           <Button
                              mode="text"
                              onPress={!friendID && showMode}
                              labelStyle={{ color: '#000', fontSize: 16 }}
                           >
                              {dayjs(profileAU?.dob || dob).format('DD/MM/YYYY') || null}
                           </Button>
                        ) : (
                           <DateTimePicker
                              disabled={friendID ? true : false}
                              visible={false}
                              testID="dateTimePicker"
                              value={new Date(profileAU?.dob || dob) || null}
                              mode="date"
                              onChange={onChange}
                           />
                        )}
                     </View>
                     <View style={styles.inputContainer}>
                        <Text style={styles.labelInput}>Giới tính:</Text>
                        {friendID ? (
                           <Text style={{ fontSize: 18, marginLeft: 16 }}>{gender ? 'Nam' : 'Nữ'}</Text>
                        ) : (
                           <RadioButton.Group
                              onValueChange={(value) => setGender(value ? 1 : 0)}
                              value={profileAU?.gender || gender ? true : false}
                           >
                              <RadioButton.Item label="Nam" value={true} />
                              <RadioButton.Item label="Nữ" value={false} />
                           </RadioButton.Group>
                        )}
                     </View>
                     {!friendID && (
                        <Button
                           icon={() => <Icon source={'account-edit-outline'} size={22} />}
                           mode="contained"
                           style={styles.btnEdit}
                           labelStyle={{ fontSize: 16, color: '#000' }}
                           onPress={handleUpdateProfile}
                        >
                           Chỉnh sửa
                        </Button>
                     )}
                  </View>
               </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
         </ScrollView>
      </PaperProvider>
   );
};
