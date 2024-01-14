import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      width: '100%',
      flex: 1,
   },
   paginationWrapper: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
   },
   paginationDots: {
      height: 10,
      width: 10,
      borderRadius: 10 / 2,
      backgroundColor: '#0898A0',
      marginLeft: 10,
   },
});

export default styles;
