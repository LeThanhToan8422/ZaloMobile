import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      marginHorizontal: 10,
      maxWidth: '80%',
   },
   messageContainer: {
      alignSelf: 'flex-start',
      backgroundColor: '#fff',
      borderRadius: 10,
      marginVertical: 2,
      padding: 10,
      borderWidth: 1,
      borderColor: '#c8c8c8',
   },
   avatar: {
      width: 25,
      height: 25,
      borderRadius: 10,
      marginRight: 10,
   },
   content: {},
   time: {
      fontSize: 12,
      color: '#888',
      marginTop: 5,
   },
});

export default styles;
