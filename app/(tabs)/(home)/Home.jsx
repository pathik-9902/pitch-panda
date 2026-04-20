import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, SafeAreaView, TextInput, Image } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import BestDealsCard from '../../../components/BestDealsCard';
import { UserContext } from '../../UserContext';
import { B_URL } from '@env';
import icons from '../../../assets/icons/icons';
import { Ionicons } from '@expo/vector-icons';

const Home = () => {
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { userState } = useContext(UserContext);
  const router = useRouter();

  const fetchData = () => {
    const city = userState?.location?.trim();
    if (!city) {
      setLoading(false);
      return;
    }

    setLoading(true);
    let url = `${B_URL}/turfs/byCity/${city}`;
    axios
      .get(url)
      .then((response) => {
        if (Array.isArray(response.data)) {
          const sortedTurfs = response.data.sort((a, b) => getMaxDiscount(b) - getMaxDiscount(a));
          setTurfs(sortedTurfs);
        } else {
          setTurfs([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching turfs:', error);
        setTurfs([]);
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [userState?.location]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const getMaxDiscount = (turf) => {
    if (turf.playgrounds && turf.playgrounds.length > 0) {
      return Math.max(...turf.playgrounds.map(playground => playground.discount), 0);
    }
    return 0;
  };

  const sports = [
    { name: 'Football', icon: icons.football },
    { name: 'Cricket', icon: icons.cricket },
    { name: 'Tennis', icon: icons.tennis },
    { name: 'Basketball', icon: icons.basketball },
    { name: 'Badminton', icon: icons.badminton },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5AB25E']} tintColor="#5AB25E" />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.locationText}>{(userState?.location || 'Select City').split(',')[0]} ✨</Text>
            </View>
            <TouchableOpacity style={styles.profileBadge} onPress={() => router.push('/(profile)/Profile')}>
              <Image source={icons.profile} style={styles.profileIcon} tintColor="#5AB25E" />
            </TouchableOpacity>
          </View>

          <Text style={styles.heroTitle}>Find your next{'\n'}<Text style={styles.heroTitleGreen}>Perfect Pitch</Text></Text>

          <TouchableOpacity style={styles.searchContainer} onPress={() => router.push('/(tabs)/(book)/Turfs')}>
            <Ionicons name="search-outline" size={20} color="#94A3B8" style={{ marginRight: 12 }} />
            <Text style={styles.searchPlaceholder}>Search by name or area...</Text>
          </TouchableOpacity>
        </View>

        {/* Categories / Sports */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Explore Sports</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {sports.map((sport, index) => (
            <TouchableOpacity key={index} style={styles.categoryBtn} onPress={() => router.push({ pathname: '/(tabs)/(book)/Turfs', params: { sport: sport.name } })}>
              <View style={styles.categoryIconCircle}>
                <Image source={sport.icon} style={styles.categoryIcon} tintColor="#5AB25E" />
              </View>
              <Text style={styles.categoryText}>{sport.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Best Deals Section */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Best Deals Near You</Text>
            <Text style={styles.sectionSubtitle}>Handpicked pitches with exclusive discounts</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/(tabs)/(book)/Turfs')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.horizontalScrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bestDealsScroll}
          >
            {turfs.length > 0 ? (
              turfs.map(turf => (
                <BestDealsCard
                  key={turf._id || turf.turfId}
                  turfId={turf.turfId}
                  name={turf.name}
                  playgrounds={turf.playgrounds}
                  discount={getMaxDiscount(turf)}
                />
              ))
            ) : (
              loading ? (
                [1, 2].map(i => (
                  <View key={i} style={styles.skeletonCard}>
                    <View style={styles.skeletonImage} />
                    <View style={styles.skeletonText} />
                  </View>
                ))
              ) : (
                <View style={styles.noTurfsContainer}>
                  <Text style={styles.noTurfsText}>🏪 No turfs found in {(userState?.location || 'your area').split(',')[0]} yet.</Text>
                  <TouchableOpacity onPress={() => router.push('/(auth)/CitySelect')}>
                    <Text style={styles.changeCityText}>Change City</Text>
                  </TouchableOpacity>
                </View>
              )
            )}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(profile)/BookedSlots')}>
            <View style={[styles.actionIconBg, { backgroundColor: '#F0FDF4' }]}>
               <Ionicons name="calendar-outline" size={24} color="#5AB25E" />
            </View>
            <Text style={styles.actionTitle}>Bookings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(profile)/Rewards')}>
            <View style={[styles.actionIconBg, { backgroundColor: '#FFF7ED' }]}>
               <Ionicons name="gift-outline" size={24} color="#F97316" />
            </View>
            <Text style={styles.actionTitle}>Rewards</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  heroSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    backgroundColor: '#FFF',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  locationText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  profileBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: 24,
    height: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  heroTitleGreen: {
    color: '#5AB25E',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 56,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: '#94A3B8',
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    marginTop: 2,
  },
  seeAll: {
    fontSize: 14,
    fontWeight: '700',
    color: '#5AB25E',
  },
  categoryScroll: {
    paddingLeft: 24,
    paddingRight: 10,
    gap: 20,
  },
  categoryBtn: {
    alignItems: 'center',
    gap: 8,
  },
  categoryIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  categoryIcon: {
    width: 28,
    height: 28,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  horizontalScrollWrapper: {
    marginTop: 8,
  },
  bestDealsScroll: {
    paddingLeft: 24,
    paddingRight: 8,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  actionIconBg: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionIcon: {
    width: 24,
    height: 24,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  skeletonCard: {
    width: 260,
    height: 200,
    borderRadius: 24,
    marginRight: 16,
    backgroundColor: '#FFF',
    padding: 12,
  },
  skeletonImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    marginBottom: 12,
  },
  skeletonText: {
    width: '60%',
    height: 20,
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
  },
  noTurfsContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: 300,
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginRight: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  noTurfsText: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 22,
  },
  changeCityText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: '800',
    color: '#5AB25E',
    textDecorationLine: 'underline',
  }
});

export default Home;
