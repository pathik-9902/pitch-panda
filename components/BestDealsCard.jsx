import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import icons from '../assets/icons/icons';
import { B_URL } from '@env';
import { useRouter } from 'expo-router';

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

const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600';

const BestDealsCard = ({ turfId, name, playgrounds, discount }) => {
  const [images, setImages] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${B_URL}/images/${turfId}`);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setImages(data);
          }
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, [turfId]);

  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/(book)/TurfDetails',
      params: { turfId }
    });
  };

  const sportIcons = (playgrounds || []).map(p => sportIconMap[p.sport]).filter(Boolean);
  const displayImage = images.length > 0 ? images[0] : PLACEHOLDER_IMAGE;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: displayImage }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{discount}% OFF</Text>
        </View>
      </View>
      <View style={styles.infoWrapper}>
        <Text style={styles.name} numberOfLines={1}>{name || 'Premium Turf'}</Text>
        <View style={styles.footerRow}>
           <View style={styles.sportsRow}>
              {sportIcons.slice(0, 3).map((icon, idx) => (
                <Image key={idx} source={icon} style={styles.sportIcon} tintColor="#94A3B8" />
              ))}
              {sportIcons.length > 3 && <Text style={styles.moreText}>+{sportIcons.length - 3}</Text>}
              {sportIcons.length === 0 && <Text style={styles.moreText}>Multi-sport</Text>}
           </View>
           <View style={styles.ratingBox}>
              <Image source={icons.star} style={styles.starIcon} tintColor="#F59E0B" />
              <Text style={styles.ratingText}>4.8</Text>
           </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 260,
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginRight: 16,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginBottom: 8,
  },
  imageWrapper: {
    width: '100%',
    height: 140,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    elevation: 4,
  },
  discountText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '900',
  },
  infoWrapper: {
    padding: 16,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sportsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sportIcon: {
    width: 16,
    height: 16,
  },
  moreText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '700',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  starIcon: {
    width: 12,
    height: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1E293B',
  }
});

export default BestDealsCard;
