import { View, Text } from 'react-native';
import React, { useState } from 'react';
import styles from './styles';
import { Button, TextInput } from 'react-native-paper';
import OpenURLText from '../../components/OpenURLText';
import { storeData } from '../../utils/storage';
import axios from 'axios';
import { SERVER_HOST, PORT } from '@env';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const LoginScreen = ({ navigation }) => {
   const [phone, setPhone] = useState('');
   const [password, setPassword] = useState('');
   const insets = useSafeAreaInsets();

   const handleLogin = async () => {
      try {
         const params = { phone, password };
         let res = await axios.post(`${SERVER_HOST}:${PORT}/login`, params);
         if (res.data) {
            storeData({ phone, password, id: res.data.id });
            navigation.navigate('AppStack');
         } else {
            alert('Vui lòng kiểm tra lại thông tin đăng nhập!');
         }
      } catch (e) {
         console.error(e);
      }
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
               value={password}
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
