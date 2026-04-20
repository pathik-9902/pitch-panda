// Pitch Panda - Turf Details - V2
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Linking, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import { B_URL } from '@env';
import RatingPopup from '../../../components/RatingPopup';
import CustomCarousel from '../../../components/CustomCarousel';
import icons from '../../../assets/icons/icons';

const sportIconMap = {
  'Football': icons.football,
  'Cricket': icons.cricket,
  'Tennis': icons.tennis,
  'Basketball': icons.basketball,
  'Badminton': icons.badminton,
};

const TurfDetails = () => {
  const { turfId } = useLocalSearchParams();
  const router = useRouter();

  const [turfDetails, setTurfDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRatingModalVisible, setRatingModalVisible] = useState(false);

  useEffect(() => {
    const fetchTurfDetails = async () => {
      try {
        const response = await axios.get(`${B_URL}/turfs/${turfId}`);
        setTurfDetails(response.data);
      } catch (error) {
        console.error('Error fetching turf details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (turfId) {
      fetchTurfDetails();
    } else {
      setLoading(false);
    }
  }, [turfId]);

  const formatTimeTo12Hour = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hh = h % 12 || 12;
    return `${hh}:${minutes} ${ampm}`;
  };

  const openMaps = () => {
    if (turfDetails?.loc_url) Linking.openURL(turfDetails.loc_url);
  };

  const navigateToSlots = () => {
    router.push({
      pathname: '/(tabs)/(book)/Slot',
      params: { turfId, turfname: turfDetails.name }
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5AB25E" />
      </View>
    );
  }

  if (!turfDetails) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Venue not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.header}>
          <CustomCarousel turfId={turfId} />
          <View style={styles.headerControls}>
             <TouchableOpacity style={styles.controlBtn} onPress={() => router.back()}>
                <Ionicons name="chevron-back" size={20} color="#0F172A" />
             </TouchableOpacity>
             <View style={styles.controlRow}>
                <TouchableOpacity style={styles.controlBtn}>
                   <Ionicons name="share-outline" size={20} color="#0F172A" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlBtn}>
                   <Ionicons name="heart-outline" size={20} color="#0F172A" />
                </TouchableOpacity>
             </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.mainHeader}>
             <View style={styles.titleGroup}>
                <Text style={styles.title}>{turfDetails.name}</Text>
                <View style={styles.ratingRow}>
                   <Ionicons name="star" size={14} color="#F59E0B" />
                   <Text style={styles.ratingText}>4.8 (120+ reviews)</Text>
                </View>
             </View>
             <TouchableOpacity onPress={openMaps} style={styles.locationBtn}>
                <Ionicons name="map-outline" size={20} color="#5AB25E" />
             </TouchableOpacity>
          </View>

          <View style={styles.addressRow}>
             <Ionicons name="location-outline" size={16} color="#64748B" />
             <Text style={styles.addressText}>{turfDetails.full_loc}</Text>
          </View>

          <View style={styles.quickGrid}>
             <View style={styles.quickItem}>
                <View style={[styles.quickIcon, { backgroundColor: '#F0FDF4' }]}>
                   <Ionicons name="time" size={16} color="#5AB25E" />
                </View>
                <View>
                   <Text style={styles.quickLabel}>Hours</Text>
                   <Text style={styles.quickValue}>{formatTimeTo12Hour(turfDetails.openTime)} - {formatTimeTo12Hour(turfDetails.closeTime)}</Text>
                </View>
             </View>
             <View style={styles.quickItem}>
                <View style={[styles.quickIcon, { backgroundColor: '#EFF6FF' }]}>
                   <Ionicons name="shield-checkmark" size={16} color="#3B82F6" />
                </View>
                <View>
                   <Text style={styles.quickLabel}>Status</Text>
                   <Text style={styles.quickValue}>Verified Venue</Text>
                </View>
             </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.description}>{turfDetails.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesWrap}>
              {Object.entries(turfDetails.amenities).map(([key, val]) => (
                val && (
                  <View key={key} style={styles.amenityChip}>
                    <Ionicons name={getAmenityIcon(key)} size={16} color="#475569" />
                    <Text style={styles.amenityText}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  </View>
                )
              ))}
            </View>
          </View>

          <View style={styles.section}>
             <Text style={styles.sectionTitle}>Sports</Text>
             <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.playgroundScroll}>
               {turfDetails.playgrounds.map((p, i) => (
                  <View key={i} style={styles.sportCard}>
                     <View style={styles.sportSquare}>
                        <Image source={sportIconMap[p.sport]} style={styles.sportIcon} tintColor="#5AB25E" />
                     </View>
                     <Text style={styles.sportCardName}>{p.sport}</Text>
                     <Text style={styles.sportPrice}>From ₹{p.price}/hr</Text>
                  </View>
               ))}
             </ScrollView>
          </View>

          <View style={styles.spacer} />
        </View>
      </ScrollView>

      <View style={styles.bookingFooter}>
         <View style={styles.priceGroup}>
            <Text style={styles.footerPrice}>{`₹${turfDetails.playgrounds[0]?.price || '---'}`}</Text>
            <Text style={styles.footerLabel}>starting per hour</Text>
         </View>
         <TouchableOpacity style={styles.primaryBookBtn} onPress={navigateToSlots}>
            <Text style={styles.primaryBookText}>Book Now</Text>
            <Ionicons name="arrow-forward" size={18} color="#FFF" />
         </TouchableOpacity>
      </View>

      <RatingPopup
        visible={isRatingModalVisible}
        onClose={() => setRatingModalVisible(false)}
        onSubmit={() => {}}
        turfId={turfId}
      />
    </View>
  );
};

const getAmenityIcon = (key) => {
  const map = {
    wifi: 'wifi',
    cafe: 'cafe',
    cctv: 'videocam',
    lights: 'flashlight',
    parking: 'car',
    washroom: 'water'
  };
  return map[key] || 'checkmark-circle';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 340,
    position: 'relative',
  },
  headerControls: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  controlBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  controlRow: {
    flexDirection: 'row',
    gap: 12,
  },
  content: {
    backgroundColor: '#F8FAFC',
    marginTop: -30,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 32,
    paddingHorizontal: 24,
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleGroup: {
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  locationBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  addressText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
    flex: 1,
  },
  quickGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  quickItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  quickIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  quickValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 24,
    fontWeight: '500',
  },
  amenitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  amenityText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  playgroundScroll: {
    gap: 12,
  },
  sportCard: {
    width: 140,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  sportSquare: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  sportIcon: {
    width: 24,
    height: 24,
  },
  sportCardName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sportPrice: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '700',
    marginTop: 4,
  },
  bookingFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 34,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    zIndex: 10,
  },
  priceGroup: {
    flex: 1,
  },
  footerPrice: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  footerLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  primaryBookBtn: {
    backgroundColor: '#5AB25E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 18,
    gap: 8,
    elevation: 8,
  },
  primaryBookText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '800',
  },
  spacer: {
    height: 120,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
  }
});

export default TurfDetails;
