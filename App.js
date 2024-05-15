import notifee from '@notifee/react-native';
import { StyleSheet } from 'react-native';
import { Provider } from 'react-redux';
import store from './src/app/store';
import Router from './src/routes';

export default function App() {
   notifee.onBackgroundEvent(async ({}) => {});

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
