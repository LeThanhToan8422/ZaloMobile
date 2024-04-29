import { PORT, SERVER_HOST } from '@env';
import axios from 'axios';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import reactNativeBcrypt from 'react-native-bcrypt';
import { Button, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import OpenURLText from '../../components/OpenURLText';
import { storeData } from '../../utils/storage';
import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../features/user/userSlice';
import { fetchChats } from '../../features/chat/chatSlice';

export const LoginScreen = ({ navigation }) => {
   const [phone, setPhone] = useState('');
   const [password, setPassword] = useState('');
   const [secPass, setSecPass] = useState(true);
   const insets = useSafeAreaInsets();
   const dispatch = useDispatch();
   const { user, status, error } = useSelector((state) => state.user);

   const handleLogin = async () => {
      dispatch(login({ phone, password }))
         .unwrap()
         .then((res) => {
            if (res) {
               storeData({ phone: res.phone, password: password, user: res.user });
               dispatch(fetchChats());
               navigation.navigate('AppStack');
            } else {
               Toast.show({
                  type: 'error',
                  text1: `Đăng nhập thất bại. Sai số điện thoại hoặc mật khẩu`,
                  position: 'bottom',
               });
            }
         })
         .catch((err) => {
            Toast.show({
               type: 'error',
               text1: `Đăng nhập thất bại. ${err.message}`,
               position: 'bottom',
            });
         });
   };

   return (
      <View style={[styles.container, { paddingBottom: insets.bottom }]}>
         <View style={{ flex: 1, width: '100%' }}>
            <Text style={styles.title}>Vui lòng nhập số điện thoại và mật khẩu để đăng nhập</Text>
            <TextInput
               placeholder="Số điện thoại"
               mode="flat"
               activeUnderlineColor="skyblue"
               style={{ backgroundColor: '#fff' }}
               onChangeText={(text) => {
                  setPhone(text);
               }}
               value={phone}
            />
            <TextInput
               placeholder="Mật khẩu"
               mode="flat"
               activeUnderlineColor="skyblue"
               style={{ backgroundColor: '#fff' }}
               onChangeText={(text) => setPassword(text)}
               secureTextEntry={secPass}
               value={password}
               right={
                  <TextInput.Icon
                     icon={secPass ? 'eye-off' : 'eye'}
                     onPress={() => {
                        setSecPass(!secPass);
                     }}
                  />
               }
            />
            <Button textColor="cornflowerblue" onPress={() => navigation.navigate('RecoveryPass')}>
               Lấy lại mật khẩu
            </Button>
            <Button mode="contained" style={styles.btnStyle} onPress={handleLogin}>
               Đăng nhập
            </Button>
         </View>
         <View style={{ marginBottom: 10 }}>
            <OpenURLText url="https://www.google.com">Các câu hỏi thường gặp</OpenURLText>
         </View>
      </View>
   );
};
