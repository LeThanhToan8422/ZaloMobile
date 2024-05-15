import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState } from 'react';
import { Image, ScrollView } from 'react-native';
import AnimatedLoader from 'react-native-animated-loader';
import { Button, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import PressableItem from '../../components/PressableItem';
import { onUserLogout } from '../../utils/zego';
import styles from './styles';

export const PersonalScreen = ({ navigation }) => {
   // const [profile, setProfile] = useState({});
   const dispatch = useDispatch();
   const profile = useSelector((state) => state.user.user);
   const [visible, setVisible] = useState(false);

   return (
      <ScrollView>
         <AnimatedLoader
            visible={visible}
            overlayColor="rgba(255,255,255,1)"
            source={require('../../../assets/lotties/loader.json')}
            animationStyle={{
               width: 200,
               height: 200,
            }}
            speed={2}
         />
         <PressableItem
            navigation={navigation}
            navParams={{ screen: 'ProfileScreen' }}
            icon={() => <Image style={styles.imageAvt} source={{ uri: profile?.image }} />}
            title={profile?.name}
            subtitle="Xem trang cá nhân"
            actionRight={
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
            navParams={{ screen: 'ChangePassScreen', params: { phone: profile?.phone } }}
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
               setVisible(true);
               setTimeout(async () => {
                  onUserLogout();
                  await AsyncStorage.clear();
                  setVisible(false);
                  navigation.reset({
                     index: 0,
                     routes: [{ name: 'AuthStack' }],
                  });
               }, 500);
            }}
         >
            Đăng xuất
         </Button>
      </ScrollView>
   );
};
