import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: '#fff',
   },
   title: {
      backgroundColor: '#EEEEEE',
      paddingLeft: 8,
      padding: 5,
   },
   phoneInputContainer: {
      backgroundColor: '#fff',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      marginLeft: 8,
   },
   phoneInputFlagButton: {
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
   },
   phoneContainer: {
      width: '95%',
      alignSelf: 'center',
   },
   btnNext: {
      position: 'absolute',
      bottom: 20,
      right: 16,
   },
   textError: {
      color: 'red',
      marginLeft: 8,
      marginTop: 5,
   },
});

export default styles;
