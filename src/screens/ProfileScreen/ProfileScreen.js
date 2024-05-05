import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import axios from 'axios';
import { Buffer } from 'buffer';
import dayjs from 'dayjs';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
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

export const ProfileScreen = ({ navigation, route }) => {
   const SERVER_HOST = Constants.expoConfig.extra.SERVER_HOST;
   const [profileAU, setProfileAU] = useState({});
   const [name, setName] = useState('');
   const [dob, setDob] = useState(null);
   const [gender, setGender] = useState(0);
   const friendID = route.params?.friend;
   const [statusFriend, setStatusFriend] = useState();
   const [visible, setVisible] = React.useState(false);

   const dispatch = useDispatch();
   const { user } = useSelector((state) => state.user);

   useEffect(() => {
      if (friendID) {
         getInfoFriend(friendID);
      } else {
         setName(user.name);
         setDob(user.dob);
         setGender(user.gender);
      }
   }, []);

   // useEffect(() => {
   //    socket.on(
   //       `Server-Make-Friends-${user.id > friendID ? `${friendID}${user.id}` : `${user.id}${user.id}`}`,
   //       (dataGot) => {
   //          if (dataGot.data) {
   //             setSendMakeFriend(true);
   //             // setIsFriend({
   //             //    id: dataGot.data.id,
   //             //    isFriends: 'Đã gửi lời mời kết bạn',
   //             // });
   //          }
   //       }
   //    );
   //    return () => {
   //       socket.off(`Server-Make-Friends-${userID > friendID ? `${friendID}${user.id}` : `${user.id}${user.id}`}`);
   //    };
   // }, [user, friendID]);

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
   };

   const handleAgreeMakeFriend = async (friendRequest) => {
      const dataDelete = await axios.delete(`${SERVER_HOST}/make-friends/${friendRequest.makeFriendId}`);
      if (dataDelete.data) {
         const params = {
            relationship: 'friends',
            id: user.id, // id user của mình
            objectId: friendRequest.id, // id của user muốn kết bạn
         };
         let dataAddFriend = await axios.post(`${SERVER_HOST}/users/relationships`, params);
         if (dataAddFriend.data) {
            socket.emit(`Client-Chat-Room`, {
               message: `Bạn và ${friendRequest.name} đã trở thành bạn`,
               dateTimeSend: dayjs().format('YYYY-MM-DD HH:mm:ss'),
               sender: user.id,
               receiver: friendRequest.id,
               chatRoom: user.id > friendRequest.id ? `${friendRequest.id}${user.id}` : `${user.id}${friendRequest.id}`,
            });
            setContentChat(`Bạn và ${friendRequest.name} đã trở thành bạn`);
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
                           source={{ uri: profileAU?.background || user.background }}
                           style={styles.background}
                        ></ImageBackground>
                     </Pressable>
                     <View style={styles.avatarContainer}>
                        <Pressable onPress={() => !friendID && pickImage('avatar')}>
                           <Avatar.Image size={150} source={{ uri: profileAU?.image || user.image }} />
                        </Pressable>
                        <Text style={{ fontSize: 25, fontWeight: '700' }}>{profileAU?.name || user.name}</Text>
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
                           <Button
                              icon={() => <Icon source={'chat-plus-outline'} size={22} />}
                              mode="contained"
                              style={[styles.btnEdit, { marginRight: 10, flex: 1, backgroundColor: '#A5C4F2' }]}
                              labelStyle={{ fontSize: 16, color: '#000' }}
                              onPress={() => navigation.navigate('ChatScreen', { id: friendID })}
                           >
                              Nhắn tin
                           </Button>
                           <Button
                              icon={() => <Icon source={'account-plus-outline'} size={22} />}
                              mode="contained"
                              style={[styles.btnEdit]}
                              labelStyle={{ fontSize: 16, color: '#000' }}
                              onPress={statusFriend ? handleAgreeMakeFriend : handleAddFriend}
                           >
                              {statusFriend ? statusFriend.isFriends : 'Kết bạn'}
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
                                 onPress={() => {}}
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
                           <Button mode="text" onPress={showMode} labelStyle={{ color: '#000', fontSize: 16 }}>
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
