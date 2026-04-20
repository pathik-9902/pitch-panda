import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Image, Dimensions, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { B_URL } from '@env';

const { width: windowWidth } = Dimensions.get('window');
const imageHeight = 340; // Fixed height for immersive feel

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000';

const CustomCarousel = ({ turfId }) => {
  const scrollViewRef = useRef();
  const [activeIndex, setActiveIndex] = useState(0);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${B_URL}/images/${turfId}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setImages(data);
          } else {
            setImages([PLACEHOLDER_IMAGE]);
          }
        } else {
          setImages([PLACEHOLDER_IMAGE]);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        setImages([PLACEHOLDER_IMAGE]);
      } finally {
        setLoading(false);
      }
    };
    if (turfId) fetchImages();
    else {
      setImages([PLACEHOLDER_IMAGE]);
      setLoading(false);
    }
  }, [turfId]);

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.max(0, Math.round(contentOffsetX / windowWidth));
    setActiveIndex(index);
  };

  const scrollToIndex = (index) => {
    scrollViewRef.current?.scrollTo({
      animated: true,
      x: index * windowWidth,
      y: 0,
    });
  };

  if (loading) {
    return (
      <View style={[styles.placeholder, { height: imageHeight }]}>
         <ActivityIndicator color="#5AB25E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        bounces={false}
      >
        {images.map((image, index) => (
          <View key={index} style={{ width: windowWidth, height: imageHeight }}>
            <Image
              source={{ uri: image }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
      
      {images.length > 1 && (
        <View style={styles.pagination}>
          {images.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                index === activeIndex ? styles.activeDot : null,
              ]}
              onPress={() => scrollToIndex(index)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: imageHeight,
    backgroundColor: '#E2E8F0',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  image: {
    width: windowWidth,
    height: imageHeight,
  },
  pagination: {
    position: 'absolute',
    bottom: 40, // Above the content overlap
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FFF',
    width: 16,
  },
});

export default CustomCarousel;
