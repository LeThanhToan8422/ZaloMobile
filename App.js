import notifee from '@notifee/react-native';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/app/store';
import Router from './src/routes';
import { checkNotificationPermission } from './src/utils/notification';
import { LogBox } from 'react-native';

export default function App() {
   LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message

   notifee.onBackgroundEvent(async ({}) => {});
   checkNotificationPermission();

   return (
      <Provider store={store}>
         <Router />
      </Provider>
   );
}

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
   },
});
