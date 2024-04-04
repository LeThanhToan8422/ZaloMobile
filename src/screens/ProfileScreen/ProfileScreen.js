import { PORT, SERVER_HOST } from '@env';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
import { ImageBackground, Pressable, Text, View } from 'react-native';
import { Avatar, Button, Icon, IconButton, RadioButton, TextInput } from 'react-native-paper';
import { getUserID } from '../../utils/storage';
import styles from './styles';

export const ProfileScreen = () => {
   const [name, setName] = useState('');
   const [image, setImage] = useState(null);
   const [profile, setProfile] = useState({});
   const [show, setShow] = useState(false);

   const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setShow(false);
      setDob(currentDate);
   };

   const showMode = (currentMode) => {
      setShow(true);
      setMode(currentMode);
   };

   const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.All,
         allowsEditing: true,
         aspect: [4, 3],
         quality: 1,
      });

      console.log(result);

      if (!result.canceled) {
         setImage(result.assets[0].uri);
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
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <View style={styles.container}>
         <Pressable onPress={pickImage}>
            <ImageBackground source={{ uri: profile.background }} style={styles.background}>
               <IconButton
                  mode="contained-tonal"
                  icon={'dots-horizontal'}
                  labelStyle={{ fontSize: 30, color: '#fff' }}
               />
            </ImageBackground>
         </Pressable>
         <View style={styles.avatarContainer}>
            <Pressable onPress={pickImage}>
               <Avatar.Image size={150} source={{ uri: profile.image }} />
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
            <Button
               mode="text"
               style={styles.dobStyle}
               labelStyle={{ fontSize: 16, color: '#000' }}
               onPress={() => showMode('date')}
            >
               {new Date(profile.dob).toLocaleDateString()}
            </Button>
            {show && (
               <DateTimePicker testID="dateTimePicker" value={new Date(profile.dob)} mode="date" onChange={onChange} />
            )}
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
            onPress={() => {}}
         >
            Chỉnh sửa
         </Button>
      </View>
   );
};
