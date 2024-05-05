import { Dimensions, StyleSheet } from 'react-native';
const win = Dimensions.get('window');

const styles = StyleSheet.create({
   container: {
      flexDirection: 'row',
      marginHorizontal: 10,
      maxWidth: '80%',
      marginVertical: 2,
   },
   messageContainer: {
      alignSelf: 'flex-start',
      backgroundColor: '#fff',
      borderRadius: 10,
      paddingHorizontal: 10,
      paddingTop: 6,
      paddingBottom: 10,
      borderWidth: 1,
      borderColor: '#c8c8c8',
   },
   name: {
      color: '#FF5F00',
      paddingBottom: 2,
      fontWeight: '500',
   },
   avatar: {
      width: 25,
      height: 25,
      borderRadius: 25 / 2,
      marginRight: 10,
   },
   content: {},
   imageMessage: {
      width: win.width * 0.7,
      height: win.height * 0.3,
      objectFit: 'fill',
      borderRadius: 10,
      marginVertical: 2,
   },
   time: {
      fontSize: 12,
      color: '#888',
      marginTop: 5,
   },
   emojiContainer: {
      backgroundColor: '#f8f8f8',
      alignItems: 'center',
      borderRadius: 20,
      position: 'absolute',
      paddingHorizontal: 4,
      bottom: 0,
      right: 10,
      flexDirection: 'row',
      gap: 4,
   },
   emoji: {
      fontSize: 12,
   },
});

export default styles;
