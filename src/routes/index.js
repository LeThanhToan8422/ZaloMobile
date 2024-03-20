import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppStack from './AppStack';
import AuthStack from './AuthStack';

const Stack = createNativeStackNavigator();

const Router = () => {
   const [userID, setUserID] = useState(1);
   useEffect(() => {
      checkLogin();
      // storeData({ phone: '123', password: '123', id: userID });
   }, []);
   const checkLogin = async () => {
      try {
         const jsonValue = await AsyncStorage.getItem('@user');
         const params = jsonValue != null ? JSON.parse(jsonValue) : null;
         if (!params) setUserID(null);
         let res = await axios.post('http://localhost:8080/account', params);
         setUserID(res.data ? res.data.id : null);
      } catch (e) {
         setUserID(null);
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
   return (
      <SafeAreaProvider>
         <NavigationContainer>
            <Stack.Navigator>
               {userID ? (
                  <Stack.Screen name="AppStack" component={AppStack} options={{ headerShown: false }} />
               ) : (
                  <Stack.Screen name="AuthStack" component={AuthStack} options={{ headerShown: false }} />
               )}
            </Stack.Navigator>
         </NavigationContainer>
      </SafeAreaProvider>
   );
};

export default Router;
