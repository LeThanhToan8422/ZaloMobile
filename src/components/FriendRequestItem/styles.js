import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      padding: 12,
      borderBottomWidth: 1,
      borderColor: '#ccc',
   },
   avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
   },
   actionContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 8,
      gap: 16,
   },
});

export default styles;
