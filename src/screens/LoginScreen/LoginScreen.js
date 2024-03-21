import { View, Text } from 'react-native';
import React from 'react';
import styles from './styles';
import { Button, TextInput } from 'react-native-paper';
import OpenURLText from '../../components/OpenURLText';

export const LoginScreen = () => {
   return (
      <View style={styles.container}>
         <View style={{ flex: 1, width: '100%' }}>
            <Text
               style={{
                  backgroundColor: '#EEEEEE',
                  paddingLeft: 8,
                  padding: 5,
               }}
            >
               Vui lòng nhập số điện thoại và mật khẩu để đăng nhập
            </Text>
            <TextInput
               placeholder="Số điện thoại"
               mode="flat"
               activeUnderlineColor="skyblue"
               style={{ backgroundColor: '#fff' }}
            ></TextInput>
            <TextInput
               placeholder="Mật khẩu"
               mode="flat"
               activeUnderlineColor="skyblue"
               style={{ backgroundColor: '#fff' }}
            ></TextInput>
            <Button textColor="cornflowerblue">Lấy lại mật khẩu</Button>
            <Button mode="contained">Đăng nhập</Button>
         </View>
         <View style={{ marginBottom: 10 }}>
            <OpenURLText url="https://www.google.com">
               Đăng ký tài khoản
            </OpenURLText>
         </View>
      </View>
   );
};
