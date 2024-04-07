import Toast from 'react-native-toast-message';

const formatTime = (time) => {
   try {
      return time.split('T')[1].split(':', 2).join(':');
   } catch (error) {
      return time.toString().split(' ')[1].split(':', 2).join(':');
   }
};

const checkPassword = (password, rePassword) => {
   if (password.length < 8) {
      Toast.show({
         type: 'error',
         text1: 'Mật khẩu phải chứa ít nhất 8 ký tự',
         position: 'bottom',
      });
      return false;
   }
   const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
   if (!passwordRegex.test(password)) {
      Toast.show({
         type: 'error',
         text1: 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt',
         position: 'bottom',
      });
      return false;
   }
   if (password !== rePassword) {
      Toast.show({
         type: 'error',
         text1: 'Mật khẩu không khớp',
         position: 'bottom',
      });
      return false;
   }
   return true;
};

export { checkPassword, formatTime };
