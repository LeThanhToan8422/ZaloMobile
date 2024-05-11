import { StyleSheet } from 'react-native';
// import * as encoding from 'text-encoding';
import Router from './src/routes';
import bcrypt from 'react-native-bcrypt';
import isaac from 'isaac';
import store from './src/app/store';
import { Provider } from 'react-redux';

export default function App() {
   bcrypt.setRandomFallback((len) => {
      const buf = new Uint8Array(len);
      return buf.map(() => Math.floor(isaac.random() * 256));
   });

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
