import { SERVER_HOST } from '@env';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import axios from 'axios';
import dayjs from 'dayjs';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import {
   ImageBackground,
   Keyboard,
   KeyboardAvoidingView,
   Platform,
   Pressable,
   Text,
   TouchableWithoutFeedback,
   View,
} from 'react-native';
import { Avatar, Button, Icon, IconButton, Menu, PaperProvider, RadioButton, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { socket } from '../../utils/socket';
import { getUserID } from '../../utils/storage';
import styles from './styles';

export const ProfileScreen = ({ navigation, route }) => {
   const [userID, setUserID] = useState(null);
   const [profile, setProfile] = useState({});
   const [name, setName] = useState('');
   const [dob, setDob] = useState(null);
   const [avatar, setAvatar] = useState(null);
   const [background, setBackground] = useState(null);
   const [friendID, setFriendID] = useState(route.params?.friend);
   const [statusFriend, setStatusFriend] = useState();
   const [visible, setVisible] = React.useState(false);

   useEffect(() => {
      getUserID()
         .then((id) => {
            setUserID(id);
            if (id === friendID) setFriendID(null);
            friendID ? getProfile(friendID) : getProfile(id);
            friendID && checkIsFriend(id, friendID);
         })
         .catch((err) => {
            console.error(err);
         });
   }, []);

   useEffect(() => {
      socket.on(`Server-update-avatar-${profile.id}`, (data) => {
         setAvatar(data.data.image);
      });
      socket.on(`Server-update-background-${profile.id}`, (data) => {
         setBackground(data.data.background);
      });
      return () => {
         socket.off('Server-update-avatar');
         socket.off('Server-update-background');
      };
   }, [socket, avatar, background]);

   useEffect(() => {
      socket?.on(
         `Server-Make-Friends-${userID > friendID ? `${friendID}${userID}` : `${userID}${userID}`}`,
         (dataGot) => {
            if (dataGot.data) {
               setSendMakeFriend(true);
               // setIsFriend({
               //    id: dataGot.data.id,
               //    isFriends: 'Đã gửi lời mời kết bạn',
               // });
            }
         }
      );
      return () => {
         socket?.disconnect();
      };
   }, [userID, friendID]);

   const getProfile = async (userID) => {
      try {
         const response = await axios.get(`${SERVER_HOST}/users/${userID}`);
         setProfile(response.data);
         setName(response.data.name);
         setDob(new Date(response.data.dob));
         setAvatar(response.data.image);
         setBackground(response.data.background);
      } catch (error) {
         console.error(error);
      }
   };

   const checkIsFriend = async (id, friendID) => {
      try {
         const response = await axios.get(`${SERVER_HOST}/users/check-is-friend/${id}/${friendID}`);
         if (response.data) {
            setStatusFriend(response.data);
         }
      } catch (error) {
         console.error(error);
      }
   };

   const onChange = (event, selectedDate) => {
      setDob(selectedDate);
      setProfile({ ...profile, dob: selectedDate });
   };

   const showMode = () => {
      DateTimePickerAndroid.open({
         value: new Date(profile.dob) || new Date(),
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
         let typeImage = match ? `image/${match[1]}` : `image`;
         const buffer = await axios.get(localUri, { responseType: 'arraybuffer' }).then((res) => res.data);
         const data = {
            originalname: filename,
            encoding: '7bit',
            mimetype: typeImage,
            buffer: buffer,
            size: result.assets[0].fileSize,
         };

         try {
            if (type === 'avatar') {
               if (!result.canceled) {
                  socket.emit('Client-update-avatar', {
                     id: profile.id,
                     file: data,
                  });
               }
            } else {
               socket.emit('Client-update-background', {
                  id: profile.id,
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
            id: profile.id,
            name,
            gender: profile.gender ? 1 : 0,
            dob: dayjs(dob).format('YYYY-MM-DD'),
         });
         if (response.data) {
            Toast.show({
               type: 'success',
               text1: 'Cập nhật thông tin cá nhân thành công',
               position: 'bottom',
            });
            setProfile({ ...profile, name });
         }
      } catch (error) {
         console.error(error);
      }
   };

   const handleAddFriend = async () => {
      socket.emit(`Client-Make-Friends`, {
         content: 'Mình kết bạn với nhau nhé!!!',
         giver: userID, // id user của mình
         recipient: friendID, // id của user muốn kết bạn hoặc block
         chatRoom: userID > friendID ? `${friendID}${userID}` : `${userID}${friendID}`,
      });
   };

   const handleAgreeMakeFriend = async (friendRequest) => {
      const dataDelete = await axios.delete(`${SERVER_HOST}/make-friends/${friendRequest.makeFriendId}`);
      if (dataDelete.data) {
         const params = {
            relationship: 'friends',
            id: userID, // id user của mình
            objectId: friendRequest.id, // id của user muốn kết bạn
         };
         let dataAddFriend = await axios.post(`${SERVER_HOST}/users/relationships`, params);
         if (dataAddFriend.data) {
            socket.emit(`Client-Chat-Room`, {
               message: `Bạn và ${friendRequest.name} đã trở thành bạn`,
               dateTimeSend: dayjs().format('YYYY-MM-DD HH:mm:ss'),
               sender: userID,
               receiver: friendRequest.id,
               chatRoom: userID > friendRequest.id ? `${friendRequest.id}${userID}` : `${userID}${friendRequest.id}`,
            });
            setContentChat(`Bạn và ${friendRequest.name} đã trở thành bạn`);
         }
      }
   };

   return (
      <PaperProvider>
         <KeyboardAvoidingView
            enabled
            {...(Platform.OS === 'ios' && { behavior: 'padding', keyboardVerticalOffset: 60 })}
            style={{ flexGrow: 1 }}
         >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
               <View style={styles.container}>
                  <Pressable onPress={() => !friendID && pickImage('background')}>
                     <ImageBackground source={{ uri: background }} style={styles.background}></ImageBackground>
                  </Pressable>
                  <View style={styles.avatarContainer}>
                     <Pressable onPress={() => !friendID && pickImage('avatar')}>
                        <Avatar.Image size={150} source={{ uri: avatar && avatar }} />
                     </Pressable>
                     <Text style={{ fontSize: 25, fontWeight: '700' }}>{profile.name}</Text>
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
                        value={name}
                        editable={friendID ? false : true}
                        onChangeText={(text) => setName(text)}
                        onBlur={() => setProfile({ ...profile, name })}
                     />
                  </View>
                  <View style={styles.inputContainer}>
                     <Text style={styles.labelInput}>Ngày sinh:</Text>
                     {Platform.OS === 'android' ? (
                        <Button mode="text" onPress={showMode} labelStyle={{ color: '#000', fontSize: 16 }}>
                           {dayjs(profile.dob).format('DD/MM/YYYY') || null}
                        </Button>
                     ) : (
                        <DateTimePicker
                           disabled={friendID ? true : false}
                           visible={false}
                           testID="dateTimePicker"
                           value={new Date(profile.dob || null)}
                           mode="date"
                           onChange={onChange}
                        />
                     )}
                  </View>
                  <View style={styles.inputContainer}>
                     <Text style={styles.labelInput}>Giới tính:</Text>
                     {friendID ? (
                        <Text style={{ fontSize: 18, marginLeft: 16 }}>{profile.gender ? 'Nam' : 'Nữ'}</Text>
                     ) : (
                        <RadioButton.Group
                           onValueChange={(value) => setProfile({ ...profile, gender: value })}
                           value={profile.gender ? true : false}
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
      </PaperProvider>
   );
};
