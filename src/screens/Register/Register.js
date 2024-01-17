import { View, Text, Linking } from 'react-native';
import React from 'react';
import styles from './styles';
import { IconButton, TextInput } from 'react-native-paper';
import { OpenURLText } from '../../components/OpenURLText/OpenURLText';

export const Register = () => {
   return (
      <View style={styles.container}>
         <Text style={{ fontWeight: '600' }}>Tên Zalo</Text>
         <TextInput
            mode="outlined"
            placeholder="Gồm 2-40 ký tự"
            style={styles.input}
            outlineStyle={styles.inputOutline}
            contentStyle={styles.inputContent}
         />
         <View style={{ rowGap: 6 }}>
            <Text>Lưu ý khi đặt tên:</Text>
            <Text>
               Không vi phạm
               <OpenURLText url="https://zalo.me/pc"> Điều khoản dịch vụ </OpenURLText>
            </Text>
            <Text>Nên sử dụng tên thật giúp bạn bè dễ nhận ra bạn</Text>
         </View>
         <IconButton
            style={styles.btnNext}
            mode="contained"
            containerColor="#4B8FFE"
            iconColor="#fff"
            icon="arrow-right"
         />
      </View>
   );
};
