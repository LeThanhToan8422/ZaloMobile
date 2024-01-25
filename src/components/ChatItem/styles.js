import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
   },
   contentContainer: {
      flex: 1,
      flexDirection: 'row',
      height: '100%',
      borderBottomWidth: 1,
      paddingVertical: 12,
      borderColor: '#ddd',
   },
   name: {
      fontSize: 16,
      fontWeight: '400',
   },
   message: {
      fontSize: 14,
      fontWeight: '300',
      color: '#333',
      maxHeight: 20,
      overflow: 'hidden',
   },
   image: {
      width: 50,
      height: 50,
      borderRadius: 25,
   },
   time: {
      fontSize: 14,
      fontWeight: '300',
      color: '#333',
   },
   qtyNotification: {
      backgroundColor: '#EF4D48',
      fontSize: 12,
      color: '#fff',
      width: 28,
      height: 18,
      borderRadius: 10,
      textAlign: 'center',
      lineHeight: 18,
      overflow: 'hidden',
   },
});

export default styles;
