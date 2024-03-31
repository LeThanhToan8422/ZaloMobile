import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
   container: {
      backgroundColor: '#fff',
      flex: 1,
      paddingVertical: 16,
      paddingHorizontal: 12,
   },
   input: {
      marginBottom: 16,
   },
   inputOutline: {
      borderRadius: 0,
      borderWidth: 0,
      borderBottomWidth: 1,
      borderBottomColor: '#727174',
   },
   inputContent: {
      paddingLeft: 0,
   },
   radioButtonView: {
      flexDirection: 'row',
      alignItems: 'center',
   },
   btnNext: {
      position: 'absolute',
      bottom: 20,
      right: 16,
   },
});

export default styles;
