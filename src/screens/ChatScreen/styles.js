import { Dimensions, StyleSheet } from 'react-native';
const win = Dimensions.get('window');

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
   imageMessage: {
      width: win.width * 0.7,
      height: win.height * 0.3,
      objectFit: 'fill',
      borderRadius: 10,
   },
});

export default styles;
