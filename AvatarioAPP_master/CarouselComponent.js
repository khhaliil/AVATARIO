import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import Carousel from 'react-native-snap-carousel';

const { width: viewportWidth } = Dimensions.get('window');

const entries = [
  {
    title: 'Item 1',
    imageUrl: 'https://placekitten.com/200/200', // Replace with your own image URLs
  },
  {
    title: 'Item 2',
    imageUrl: 'https://placekitten.com/200/200',
  },
  // ... more items
];

const renderItem = ({ item, index }) => {
  return (
    <View style={styles.slide}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.slideImage}
      />
      <Text style={styles.title}>{item.title}</Text>
    </View>
  );
};

const CarouselComponent = () => {
  return (
    <Carousel
      data={entries}
      renderItem={renderItem}
      sliderWidth={viewportWidth}
      itemWidth={viewportWidth * 0.75} // Adjust the width of each carousel item
      layout={'default'}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    width: viewportWidth * 0.75, // Adjust the width of each carousel item
    height: 200, // Adjust the height as necessary
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'floralwhite',
    borderRadius: 8,
    // Add additional styling as needed
  },
  slideImage: {
    width: viewportWidth * 0.7, // Adjust the width of the image
    height: 150, // Adjust the height of the image
    // Add additional styling as needed
  },
  title: {
    // Style for the title
  }
});

export default CarouselComponent;
