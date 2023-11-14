import React, { useRef, useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Animated } from 'react-native';

const ITEM_WIDTH = 95; // 50% of assumed screen width (170)
const ITEM_HEIGHT = 160;
const ITEM_MARGIN = 35.5; // 15% of assumed screen width (170)
const SPACING_FOR_CENTERING_ITEMS = ITEM_MARGIN;

const CarouselItem = ({ title, color, image, scale }) => (
  <Animated.View style={[styles.item, { backgroundColor: color, transform: [{ scale }] }]}>
    <Image source={image} style={styles.image} />
    <Text style={styles.title}>{title}</Text>
  </Animated.View>
);

const Carousel = ({ items }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef();
  const contentWidth = ITEM_WIDTH * items.length;
  const extendedItems = [...items];

  useEffect(() => {
    scrollViewRef.current?.scrollTo({ x: contentWidth, animated: false });
  }, []);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  return (
    <View style={styles.carousel}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: SPACING_FOR_CENTERING_ITEMS }}
      >
        {extendedItems.map((item, index) => {
          const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
          ];
          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [1, 1.5, 1],
            extrapolate: 'clamp',
          });

          return (
            <CarouselItem key={index} {...item} scale={scale} />
          );
        })}
      </Animated.ScrollView>
    </View>
  );
};

const WelcomePage = ({ navigation }) => {
  const data = [
    { title: 'Khalil', color: '#FFCDD2', image: require('./pictures/icon1.png') },
    { title: 'Salah', color: '#F8BBD0', image: require('./pictures/icon2.png') },
    { title: 'Amine', color: '#E1BEE7', image: require('./pictures/icon3.png') },
    { title: 'mehrez', color: '#E1BEE7', image: require('./pictures/icon1.png') },
    { title: 'Karim', color: '#F8BBD0', image: require('./pictures/icon2.png') },
  ];

  return (
    <View style={styles.container}>
      <Image source={require('./pictures/welcomGrid.png')} style={styles.mainImage} />
      <Image source={require('./pictures/Bonjour.png')} style={styles.textImage} />
      <Carousel items={data} />
      <TouchableOpacity style={styles.buttonContinuer}>
        <Text style={styles.buttonText}
          onPress={() => navigation.navigate('Games')}
          >Continuer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  mainImage: {
    height: 250,
    width: 400,
    marginBottom: 6,
  },
  textImage: {
    height: 105,
    width: 260,
  },
  buttonContinuer: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignSelf: 'center',
    width: 260,
    height: 60,
    marginBottom: 5,
    justifyContent: 'center'
  },
  carousel: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    borderRadius: 10,
  },
    image: {
      width: 50, // Adjust according to your image size
      height: 50, // Adjust according to your image size
      marginBottom: 5, // Space between image and title
    },
    title: {
      fontSize: 20,}
 
  });

export default WelcomePage
