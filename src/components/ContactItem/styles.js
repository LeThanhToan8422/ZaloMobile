import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
   },
   image: {
      width: 50,
      height: 50,
      borderRadius: 25,
   },
   name: {
      fontSize: 18,
      fontWeight: '300',
   },
});

export default styles;
