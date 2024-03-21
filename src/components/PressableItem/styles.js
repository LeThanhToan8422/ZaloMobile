import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderBottomColor: '#f0f0f0',
      borderBottomWidth: 1,
   },
   textContainer: {
      marginLeft: 12,
   },
   title: {
      fontSize: 16,
      fontWeight: '300',
   },
   subtitle: {
      fontSize: 14,
      color: '#333',
      fontWeight: '300',
      marginTop: 4,
   },
});

export default styles;
