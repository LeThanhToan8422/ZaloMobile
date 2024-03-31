import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from 'react-native';
import { IconButton, RadioButton, TextInput } from 'react-native-paper';
import { OpenURLText } from '../../components/OpenURLText/OpenURLText';
import styles from './styles';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

export const RegisterScreen = ({ navigation }) => {
   const [name, setName] = useState('');
   const [value, setValue] = useState(0);
   const [date, setDate] = useState(dayjs());

   return (
      <KeyboardAvoidingView
         enabled
         {...(Platform.OS === 'ios' && { behavior: 'padding', keyboardVerticalOffset: 80 })}
         style={{ flexGrow: 1 }}
      >
         <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
               <Text style={{ fontWeight: '600' }}>Tên Zalo</Text>
               <TextInput
                  mode="outlined"
                  placeholder="Gồm 2-40 ký tự"
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  contentStyle={styles.inputContent}
                  onChangeText={(text) => setName(text)}
                  value={name}
               />
               <Text style={{ fontWeight: 600 }}>Giới tính</Text>
               <RadioButton.Group onValueChange={(newValue) => setValue(newValue)} value={value}>
                  <View style={styles.radioButtonView}>
                     <Text>Nam</Text>
                     <RadioButton.IOS value={0} />
                  </View>
                  <View style={styles.radioButtonView}>
                     <Text>Nữ</Text>
                     <RadioButton.IOS value={1} />
                  </View>
               </RadioButton.Group>
               <Text style={{ fontWeight: '600', marginTop: 16 }}>Ngày sinh</Text>
               <DateTimePicker
                  mode="single"
                  date={date}
                  initialView="year"
                  onChange={(params) => setDate(params.date)}
               />

               <View style={{ rowGap: 6, marginTop: 16 }}>
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
                  disabled={name.length < 2 || name.length > 40}
                  onPress={() => navigation.navigate('PhoneNumber', { name, gender: value, dob: date }, {})}
               />
            </View>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
};
