import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserID = async () => {
   try {
      const jsonValue = await AsyncStorage.getItem('@user');
      const userID = jsonValue != null ? JSON.parse(jsonValue).id : null;
      return userID;
   } catch (e) {
      console.error(e);
   }
};

export { getUserID };
