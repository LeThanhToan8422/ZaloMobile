import { PORT, SERVER_HOST } from '@env';
import DateTimePicker from '@react-native-community/datetimepicker';
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
import { Avatar, Button, Icon, IconButton, RadioButton, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { socket } from '../../utils/socket';
import { getUserID } from '../../utils/storage';
import styles from './styles';

export const ProfileScreen = () => {
   const [profile, setProfile] = useState({});
   const [name, setName] = useState('');
   const [dob, setDob] = useState(null);
   const [avatar, setAvatar] = useState(null);
   const [background, setBackground] = useState(null);

   const onChange = (event, selectedDate) => {
      setDob(selectedDate);
      setProfile({ ...profile, dob: selectedDate });
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

   useEffect(() => {
      getUserID()
         .then((id) => {
            getProfile(id);
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

   const getProfile = async (userID) => {
      try {
         const response = await axios.get(`${SERVER_HOST}:${PORT}/users/${userID}`);
         setProfile(response.data);
         setName(response.data.name);
         setDob(new Date(response.data.dob));
         setAvatar(response.data.image);
         setBackground(response.data.background);
      } catch (error) {
         console.error(error);
      }
   };

   const handleUpdateProfile = async () => {
      try {
         const response = await axios.put(`${SERVER_HOST}:${PORT}/users`, {
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

   return (
      <KeyboardAvoidingView
         enabled
         {...(Platform.OS === 'ios' && { behavior: 'padding', keyboardVerticalOffset: 60 })}
         style={{ flexGrow: 1 }}
      >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
               <Pressable onPress={() => pickImage('background')}>
                  <ImageBackground source={{ uri: background }} style={styles.background}></ImageBackground>
               </Pressable>
               <View style={styles.avatarContainer}>
                  <Pressable onPress={() => pickImage('avatar')}>
                     <Avatar.Image size={150} source={{ uri: avatar }} />
                  </Pressable>
                  <Text style={{ fontSize: 25, fontWeight: '700' }}>{profile.name}</Text>
               </View>
               <Text style={{ fontSize: 20, fontWeight: '500', marginTop: 30, marginLeft: 10, marginBottom: 10 }}>
                  Thông tin cá nhân
               </Text>
               <View style={styles.inputContainer}>
                  <Text style={styles.labelInput}>Họ tên:</Text>
                  <TextInput
                     style={styles.input}
                     placeholder="Nhập họ tên"
                     value={name}
                     onChangeText={(text) => setName(text)}
                     onBlur={() => setProfile({ ...profile, name })}
                  />
               </View>
               <View style={styles.inputContainer}>
                  <Text style={styles.labelInput}>Ngày sinh:</Text>
                  {
                     <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date(profile.dob || null)}
                        mode="date"
                        onChange={onChange}
                     />
                  }
               </View>
               <View style={styles.inputContainer}>
                  <Text style={styles.labelInput}>Giới tính:</Text>
                  <RadioButton.Group
                     onValueChange={(value) => setProfile({ ...profile, gender: value })}
                     value={profile.gender ? true : false}
                  >
                     <RadioButton.Item label="Nam" value={true} />
                     <RadioButton.Item label="Nữ" value={false} />
                  </RadioButton.Group>
               </View>
               <Button
                  icon={() => <Icon source={'account-edit-outline'} size={22} />}
                  mode="contained"
                  style={styles.btnEdit}
                  labelStyle={{ fontSize: 16, color: '#000' }}
                  onPress={handleUpdateProfile}
               >
                  Chỉnh sửa
               </Button>
            </View>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
};
