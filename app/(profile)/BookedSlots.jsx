import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { UserContext } from '../UserContext';
import Alert from '../../components/Alert';
import BookingCard from '../../components/BookingCard';
import { B_URL } from '@env';
import { Ionicons } from '@expo/vector-icons';

const BookedSlots = () => {
  const { userState } = useContext(UserContext);
  const router = useRouter();
  const [userSlots, setUserSlots] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!userState) {
      router.replace('/(auth)/Login');
    } else {
      fetchUserSlots(); 
    }
  }, [userState]);

  const fetchUserSlots = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${B_URL}/slots/fetchByUser/${userState.userId}`);
      setUserSlots(response.data);
    } catch (error) {
      console.error('Error fetching user slots:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUserSlots();
  };

  const getISTOffset = () => {
    const now = new Date();
    const ISTOffset = 330 * 60000;
    const offset = now.getTimezoneOffset();
    return ISTOffset + offset * 60000;
  };

  const parseSlotDate = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const categorizeSlots = (slots) => {
    const ISTOffset = getISTOffset();
    const nowIST = new Date(Date.now() + ISTOffset);
    nowIST.setHours(0, 0, 0, 0);

    const upcomingSlots = [];
    const pastSlots = [];

    slots.forEach(slot => {
      const slotDate = parseSlotDate(slot.slotDate);
      if (slotDate >= nowIST) {
        upcomingSlots.push(slot);
      } else {
        pastSlots.push(slot);
      }
    });

    return { 
      upcoming: upcomingSlots.sort((a, b) => parseSlotDate(a.slotDate) - parseSlotDate(b.slotDate)), 
      past: pastSlots.sort((a, b) => parseSlotDate(b.slotDate) - parseSlotDate(a.slotDate)) 
    };
  };

  const { upcoming, past } = categorizeSlots(userSlots);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
           <Ionicons name="chevron-back" size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5AB25E']} tintColor="#5AB25E"/>}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#5AB25E" style={{ marginTop: 40 }} />
        ) : (
          <>
            {upcoming.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Upcoming</Text>
                {upcoming.map(slot => (
                  <BookingCard key={slot.slotId} {...slot} />
                ))}
              </View>
            )}

            {past.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Past</Text>
                {past.map(slot => (
                  <BookingCard key={slot.slotId} {...slot} />
                ))}
              </View>
            )}

            {userSlots.length === 0 && (
              <View style={styles.emptyContainer}>
                <View style={styles.emptyIconCircle}>
                   <Ionicons name="calendar-outline" size={48} color="#CBD5E1" />
                </View>
                <Text style={styles.emptyTitle}>No bookings yet</Text>
                <Text style={styles.emptySub}>Your scheduled matches will appear here. Ready to play?</Text>
                <TouchableOpacity style={styles.bookNowBtn} onPress={() => router.push('/(tabs)/(book)/Turfs')}>
                   <Text style={styles.bookNowText}>Discover Turfs</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
    marginLeft: 4,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.02,
    shadowRadius: 20,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1E293B',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  bookNowBtn: {
    backgroundColor: '#5AB25E',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#5AB25E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 4,
  },
  bookNowText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 15,
  }
});

export default BookedSlots;
