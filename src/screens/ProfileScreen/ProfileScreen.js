import { PORT, SERVER_HOST } from '@env';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { Avatar, Button, Icon, IconButton, RadioButton, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { getUserID } from '../../utils/storage';
import styles from './styles';
import dayjs from 'dayjs';

export const ProfileScreen = () => {
   const [name, setName] = useState('');
   const [image, setImage] = useState(null);
   const [profile, setProfile] = useState({});
   const [dob, setDob] = useState(null);

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

      // console.log(result);

      if (!result.canceled) {
         let localUri = result.assets[0].uri;
         let filename = localUri.split('/').pop();
         let match = /\.(\w+)$/.exec(filename);
         let typeImage = match ? `image/${match[1]}` : `image`;

         let data = new FormData();
         data.append('photo', {
            uri: localUri,
            name: filename,
            type: typeImage,
         });

         try {
            if (type === 'avatar') {
               const response = await axios.put(`${SERVER_HOST}:${PORT}/users/avatar`, data);
               setProfile({ ...profile, image: response.data });
               setProfile({ ...profile, image: result.assets[0].uri });
            } else {
               setProfile({ ...profile, background: result.assets[0].uri });
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

   const getProfile = async (userID) => {
      try {
         const response = await axios.get(`${SERVER_HOST}:${PORT}/users/${userID}`);
         setProfile(response.data);
         setName(response.data.name);
         setDob(new Date(response.data.dob));
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
      <View style={styles.container}>
         <Pressable onPress={() => pickImage('background')}>
            <ImageBackground source={{ uri: profile?.background }} style={styles.background}>
               <IconButton
                  mode="contained-tonal"
                  icon={'dots-horizontal'}
                  labelStyle={{ fontSize: 30, color: '#fff' }}
               />
            </ImageBackground>
         </Pressable>
         <View style={styles.avatarContainer}>
            <Pressable onPress={() => pickImage('avatar')}>
               <Avatar.Image size={150} source={{ uri: profile?.image }} />
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
   );
};
