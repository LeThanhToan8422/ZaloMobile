import { PORT, SERVER_HOST } from '@env';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, View, Text } from 'react-native';
import { Button, Icon, IconButton } from 'react-native-paper';
import PressableItem from '../../components/PressableItem';
import { getUserID } from '../../utils/storage';
import styles from './styles';
import { CommonActions } from '@react-navigation/native';

export const PersonalScreen = ({ navigation }) => {
   const [profile, setProfile] = useState({});
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
      } catch (error) {
         console.error(error);
      }
   };

   return (
      <View>
         <PressableItem
            navigation={navigation}
            navParams={{ screen: 'ProfileScreen' }}
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
         <PressableItem navigation={navigation} icon="lock" title="Quyền riêng tư" style={{ marginBottom: 8 }} />
         <PressableItem icon="bell-outline" title="Thông báo" />
         <PressableItem icon="chat-processing-outline" title="Tin nhắn" />
         <PressableItem icon="contacts-outline" title="Danh bạ" style={{ marginBottom: 8 }} />
         <PressableItem
            navigation={navigation}
            navParams={{ screen: 'ChangePassScreen', params: { phone: profile.phone } }}
            icon="onepassword"
            title="Đổi mật khẩu"
         />
         <PressableItem icon="help-circle-outline" title="Trợ giúp" />
         <PressableItem icon="information-outline" title="Thông tin về Zalo" style={{ marginBottom: 8 }} />
         <Button
            mode="contained"
            icon="logout"
            contentStyle={{ flexDirection: 'row-reverse' }}
            style={{ margin: 8, backgroundColor: '#666' }}
            onPress={() => {
               storeData(null);
               navigation.reset({
                  index: 0,
                  routes: [{ name: 'AuthStack' }],
               });
            }}
         >
            Đăng xuất
         </Button>
      </View>
   );
};
