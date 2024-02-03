import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      backgroundColor: '#4D9DF7',
   },
   containerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 5,
   },
   containerIconRight: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   text: {
      color: 'white',
      marginLeft: 8,
      fontSize: 16,
      paddingHorizontal: 15,
   },
});

export default styles;
