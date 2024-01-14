import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');
const styles = StyleSheet.create({
   container: {
      width,
      justifyContent: 'center',
      alignItems: 'center',
      rowGap: 30,
   },
   image: {
      width: 100,
      height: 33,
   },
   title: {
      fontSize: 20,
      fontWeight: '700',
   },
   description: {
      fontSize: 16,
      color: '#777',
      fontWeight: '600',
   },
});

export default styles;
