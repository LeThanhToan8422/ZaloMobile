import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
   },
   containerSearch: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#4D9DF7',
      paddingHorizontal: 5,
   },
   text: {
      color: 'white',
      marginLeft: 16,
      fontSize: 16,
      paddingHorizontal: 15,
   },
   containerIconRight: {
      flexDirection: 'row',
      alignItems: 'center',
   },
});

export default styles;
