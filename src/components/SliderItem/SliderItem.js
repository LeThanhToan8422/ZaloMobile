import { View, Text, ScrollView, Dimensions, Image } from 'react-native';
import React from 'react';
import styles from './styles';
import { SafeAreaView } from 'react-native';
import { FlatList } from 'react-native';

export const SliderItem = ({ item }) => {
   const { title, description, image } = item;
   return (
      <View style={styles.container}>
         <View>
            <Image style={styles.image} source={image} />
         </View>
         <View style={{ justifyContent: 'center', alignItems: 'center', rowGap: 12 }}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
         </View>
      </View>
   );
};
