import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      backgroundColor: '#fff',
      flex: 1,
      alignContent: 'center',
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
   btnStyle: {
      backgroundColor: 'cornflowerblue',
      width: '60%',
      alignSelf: 'center',
   },
   textError: {
      color: 'red',
      marginLeft: 8,
      marginTop: 5,
   },
});

export default styles;
