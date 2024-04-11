import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      borderBottomWidth: 1,
      borderColor: '#ccc',
      justifyContent: 'space-between',
   },
   avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
   },
   name: {
      fontSize: 16,
      marginLeft: 8,
      fontWeight: '500',
   },
});

export default styles;
