import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: '#EEEEEE',
      marginBottom: 16,
   },
   background: {
      width: '100%',
      height: 200,
      alignItems: 'flex-end',
   },
   avatarContainer: {
      marginTop: -75,
      alignItems: 'center',
   },
   inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
   },
   dobStyle: {
      flex: 1,
      alignItems: 'flex-start',
   },
   labelInput: {
      fontSize: 18,
      margin: 5,
      width: 90,
   },
   input: {
      flex: 1,
      margin: 5,
      backgroundColor: '#fff',
      fontSize: 18,
   },
   btnEdit: {
      marginTop: 10,
      backgroundColor: '#CCC',
   },
});

export default styles;
