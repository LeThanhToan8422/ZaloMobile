import { View, Text, Dimensions, Image, ScrollView } from 'react-native';
import React, { useState } from 'react';
import styles from './styles';
import { SafeAreaView } from 'react-native';
import { FlatList } from 'react-native';
import SliderItem from '../SliderItem';

export const IntroSlider = () => {
   const slide = [
      {
         id: 1,
         title: 'Chào mừng bạn đến với Zalo',
         description: 'Đăng nhập để bắt đầu',
         image: require('../../assets/images/slider1.png'),
      },
      {
         id: 2,
         title: 'Tìm bạn bè',
         description: 'Tìm bạn bè trên Zalo',
         image: require('../../assets/images/slider2.png'),
      },
      {
         id: 3,
         title: 'Chat',
         description: 'Chat với bạn bè',
         image: require('../../assets/images/slider3.png'),
      },
   ];
   // setInterval(() => {
   //    setSliderState({
   //       ...sliderState,
   //       currentPage: (sliderState.currentPage + 1) % slide.length,
   //    });
   // }, 5000);
   const { width, height } = Dimensions.get('window');
   const [sliderState, setSliderState] = useState({ currentPage: 0 });
   const setSliderPage = (event) => {
      const { currentPage } = sliderState;
      const { x } = event.nativeEvent.contentOffset;
      const indexOfNextScreen = Math.floor(x / width);
      if (indexOfNextScreen !== currentPage) {
         setSliderState({
            ...sliderState,
            currentPage: indexOfNextScreen,
         });
      }
   };
   const { currentPage: pageIndex } = sliderState;
   return (
      <SafeAreaView style={styles.container}>
         <FlatList
            scrollEventThrottle={16}
            pagingEnabled={true}
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
               setSliderPage(event);
            }}
            data={slide}
            horizontal={true}
            renderItem={({ item }) => <SliderItem item={item} />}
         />
         <View style={styles.paginationWrapper}>
            {slide.map((key, index) => (
               <View style={[styles.paginationDots, { opacity: pageIndex === index ? 1 : 0.2 }]} key={index} />
            ))}
         </View>
      </SafeAreaView>
   );
};
