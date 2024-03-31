import { View, Text, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from './styles';
import PressableItem from '../../components/PressableItem';
import { IconButton } from 'react-native-paper';
import axios from 'axios';
import { SERVER_HOST, PORT } from '@env';
import { getUserID } from '../../utils/storage';

export const PersonalScreen = ({ navigation }) => {
   const [profile, setProfile] = useState({});
   useEffect(() => {
      getUserID()
         .then((id) => {
            getProfile(id);
         })
         .catch((err) => {
            console.log(err);
         });
   }, []);

   const getProfile = async (userID) => {
      try {
         const response = await axios.get(`${SERVER_HOST}:${PORT}/users/${userID}`);
         setProfile(response.data);
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <View style={styles.container}>
         <PressableItem
            navigation={navigation}
            icon={() => <Image style={styles.imageAvt} source={{ uri: profile.image }} />}
            title={profile.name}
            subtitle="Xem trang cá nhân"
            action={
               <IconButton
                  icon="account-sync-outline"
                  size={24}
                  iconColor="#375FD1"
                  style={{ margin: 0 }}
                  onPress={() => {}}
               />
            }
            style={{ marginBottom: 8 }}
         />
         <PressableItem navigation={navigation} icon="security" title="Tài khoản và bảo mật" />
         <PressableItem navigation={navigation} icon="lock" title="Quyền riêng tư" />
      </View>
   );
};
