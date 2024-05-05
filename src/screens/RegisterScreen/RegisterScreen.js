import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Button, IconButton, RadioButton, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { OpenURLText } from '../../components/OpenURLText/OpenURLText';
import styles from './styles';

export const RegisterScreen = ({ navigation }) => {
   const [name, setName] = useState('');
   const [value, setValue] = useState(1);
   const [date, setDate] = useState(dayjs('2000-01-01'));

   const handleNext = () => {
      if (dayjs().diff(date, 'year') < 16) {
         Toast.show({
            type: 'error',
            text1: 'Bạn chưa đủ 16 tuổi để sử dụng Zalo ',
            position: 'bottom',
         });
         return;
      }
      navigation.navigate('PhoneNumber', { name, gender: value, dob: date.format('YYYY-MM-DD') });
   };

   const onChange = (event, selectedDate) => {
      setDate(dayjs(selectedDate));
   };

   const showMode = () => {
      DateTimePickerAndroid.open({
         value: date.toDate(),
         onChange,
         mode: 'date',
      });
   };

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
               <RadioButton.Group onValueChange={(newValue) => setValue(newValue)} value={value ? true : false}>
                  <View style={styles.radioButtonView}>
                     <Text>Nam</Text>
                     <RadioButton value={true} />
                  </View>
                  <View style={styles.radioButtonView}>
                     <Text>Nữ</Text>
                     <RadioButton value={false} />
                  </View>
               </RadioButton.Group>
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontWeight: '600' }}>Ngày sinh: </Text>
                  {Platform.OS === 'android' ? (
                     <Button mode="contained-tonal" onPress={showMode} labelStyle={{ color: '#000', fontSize: 16 }}>
                        {date.format('DD/MM/YYYY')}
                     </Button>
                  ) : (
                     <DateTimePicker
                        style={{ alignSelf: 'flex-start' }}
                        visible={false}
                        testID="dateTimePicker"
                        value={date.toDate()}
                        mode="date"
                        onChange={onChange}
                     />
                  )}
               </View>

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
                  onPress={handleNext}
               />
            </View>
         </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
   );
};
