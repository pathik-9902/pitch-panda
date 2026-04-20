import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { B_URL } from '@env';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import icons from '../assets/icons/icons';

const sportIconMap = {
  Basketball: icons.basketball,
  Cricket: icons.cricket,
  Golf: icons.golf,
  Badminton: icons.badminton,
  Football: icons.football,
  Pickleball: icons.pickleball,
  Snooker: icons.snooker,
  Volleyball: icons.volleyball,
  Swimming: icons.swimming,
  Tennis: icons.tennis,
};

const TurfCard = React.memo(({ turfId, name, area, playgrounds }) => {
  const router = useRouter();
  const [averageRating, setAverageRating] = useState(0);
  const [numberOfRatings, setNumberOfRatings] = useState(0);
  const [animatedScale] = useState(new Animated.Value(1));
  const [isTurfOpenState, setIsTurfOpenState] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${B_URL}/images/${turfId}`);
        if (response.ok) {
          const data = await response.json();
          setImages(data);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, [turfId]);

  useEffect(() => {
    fetchAverageRating();
    const checkOpen = () => {
      const hours = new Date().getHours();
      setIsTurfOpenState(hours >= 5 && hours < 24);
    };
    checkOpen();
    const interval = setInterval(checkOpen, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAverageRating = async () => {
    try {
      const response = await fetch(`${B_URL}/rating/average/${turfId}`);
      if (response.ok) {
        const data = await response.json();
        setAverageRating(data.average);
        setNumberOfRatings(data.count);
      }
    } catch (error) {
      console.error('Error fetching rating:', error);
    }
  };

  const handleView = () => {
    router.push({
      pathname: '/(tabs)/(book)/TurfDetails',
      params: { turfId }
    });
  };

  const handlePressIn = () => {
    Animated.spring(animatedScale, { toValue: 0.98, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedScale, { toValue: 1, useNativeDriver: true }).start();
  };

  const sportIcons = playgrounds ? playgrounds.map(p => sportIconMap[p.sport]).filter(Boolean) : [];

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleView}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={styles.cardContainer}
    >
      <Animated.View style={[styles.card, { transform: [{ scale: animatedScale }] }]}>
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: images.length > 0 ? images[0] : null }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.badgeRow}>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>#{turfId}</Text>
            </View>
            <View style={styles.ratingBadge}>
              <Image source={icons.star} style={styles.starIcon} tintColor="#FFD700" />
              <Text style={styles.ratingText}>{averageRating.toFixed(1)}</Text>
            </View>
          </View>
          
          <View style={[styles.statusTag, { backgroundColor: isTurfOpenState ? '#4CAF50' : '#EF4444' }]}>
             <Text style={styles.statusText}>{isTurfOpenState ? 'OPEN' : 'CLOSED'}</Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>{name}</Text>
          </View>
          <View style={styles.locationRow}>
             <Ionicons name="location-outline" size={14} color="#94A3B8" />
             <Text style={styles.locationText}>{area}</Text>
          </View>
          
          <View style={styles.sportFooter}>
            <View style={styles.iconSpoke}>
              {sportIcons.slice(0, 3).map((icon, idx) => (
                <Image key={idx} source={icon} style={styles.sportIcon} tintColor="#5AB25E" />
              ))}
              {sportIcons.length > 3 && (
                <Text style={styles.moreCount}>+{sportIcons.length - 3}</Text>
              )}
            </View>
            <TouchableOpacity style={styles.bookBtn} onPress={handleView}>
               <Text style={styles.bookBtnText}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    overflow: 'hidden',
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  imageWrapper: {
    width: '100%',
    height: 180,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeRow: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  idBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  idText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '800',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  starIcon: {
    width: 14,
    height: 14,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  statusTag: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  infoSection: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  locIcon: {
    width: 14,
    height: 14,
  },
  locationText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  sportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
    paddingTop: 16,
  },
  iconSpoke: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sportIcon: {
    width: 20,
    height: 20,
  },
  moreCount: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
  },
  bookBtn: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  bookBtnText: {
    color: '#5AB25E',
    fontWeight: '800',
    fontSize: 13,
  }
});

export default TurfCard;
