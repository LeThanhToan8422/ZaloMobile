import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Store data in local, when user login
 *
 * @param {Object} value - The value to store.
 * @param {string} value.phone - The phone number of the user.
 * @param {string} value.password - The password of the user.
 * @param {string} value.id - The id of the user.
 */
const storeData = async (key, value) => {
   try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
   } catch (e) {
      console.error(e);
   }
};

const multiStoreData = async (data) => {
   try {
      const multiData = data.map((item) => {
         return [item[0], JSON.stringify(item[1])];
      });
      await AsyncStorage.multiSet(multiData);
   } catch (e) {
      console.error(e);
   }
};

const mergeData = async (key, value) => {
   try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.mergeItem(key, jsonValue);
   } catch (e) {
      console.error(e);
   }
};

const getData = async (key) => {
   try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
   } catch (e) {
      console.error(e);
   }
};

export { getData, storeData, mergeData, multiStoreData };
