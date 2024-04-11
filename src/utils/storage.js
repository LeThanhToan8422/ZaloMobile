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

/**
 * Store data in local, when user login
 *
 * @param {Object} value - The value to store.
 * @param {string} value.phone - The phone number of the user.
 * @param {string} value.password - The password of the user.
 * @param {string} value.id - The id of the user.
 */
const storeData = async (value) => {
   try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@user', jsonValue);
   } catch (e) {
      // saving error
   }
};

const getData = async () => {
   try {
      const jsonValue = await AsyncStorage.getItem('@user');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
   } catch (e) {
      // error reading value
   }
};

export { getUserID, getData, storeData };
