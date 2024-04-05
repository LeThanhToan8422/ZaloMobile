import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      flex: 1,
      justifyContent: 'space-between',
   },
   chatContainer: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   input: {
      fontSize: 16,
      flex: 1,
   },
   modalContainer: {
      padding: 20,
      backgroundColor: '#E2E8F1',
      width: '80%',
      alignSelf: 'center',
      borderRadius: 10,
   },
   modalActionContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      backgroundColor: '#E2E8F1',
      borderRadius: 10,
   },
   messageContainer: {
      alignSelf: 'flex-start',
      borderRadius: 10,
      overflow: 'hidden',
      marginVertical: 2,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderColor: '#c8c8c8',
      backgroundColor: '#fff',
   },
});

export default styles;
