import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, StyleSheet, View, TextInput, RefreshControl, TouchableOpacity, Text, SafeAreaView } from 'react-native';
import { UserContext } from '../../UserContext';
import axios from 'axios';
import TurfCard from '../../../components/TurfCard';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { B_URL } from '@env';
import icons from '../../../assets/icons/icons';

const Turfs = ({ navigation }) => {
  const [turfs, setTurfs] = useState([]);
  const { userState } = useContext(UserContext);
  const [search, setSearch] = useState('');
  const [areaFilter, setAreaFilter] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!userState?.location || userState.location.trim() === '') {
      setLoading(false);
      return;
    }
    setLoading(true);
    let url = `${B_URL}/turfs/byCity/${userState.location.trim()}`;

    try {
      const response = await axios.get(url);
      setTurfs(response.data);
    } catch (error) {
      console.error('Error fetching turfs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [userState.location]);

  const filteredTurfs = turfs.filter((turf) => (
    turf.name.toLowerCase().includes(search.toLowerCase()) &&
    (!areaFilter || turf.area.toLowerCase() === areaFilter.toLowerCase()) &&
    (!sportFilter || turf.playgrounds.some(p => p.sport.toLowerCase() === sportFilter.toLowerCase()))
  ));

  const areas = [...new Set(turfs.map(t => t.area))];
  const availableSports = ['Football', 'Cricket', 'Tennis', 'Basketball', 'Badminton'];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 10 }} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search pitches..."
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      <View style={styles.filterStrip}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
           <TouchableOpacity 
             style={[styles.filterChip, !areaFilter && !sportFilter && styles.filterChipActive]}
             onPress={() => { setAreaFilter(''); setSportFilter(''); }}
           >
             <Text style={[styles.filterText, !areaFilter && !sportFilter && styles.filterTextActive]}>All</Text>
           </TouchableOpacity>
           
           {availableSports.map(sport => (
             <TouchableOpacity 
               key={sport}
               style={[styles.filterChip, sportFilter === sport && styles.filterChipActive]}
               onPress={() => setSportFilter(sport === sportFilter ? '' : sport)}
             >
               <Text style={[styles.filterText, sportFilter === sport && styles.filterTextActive]}>{sport}</Text>
             </TouchableOpacity>
           ))}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5AB25E']} tintColor="#5AB25E" />}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.resultsHeader}>
           <Text style={styles.resultsCount}>Found {filteredTurfs.length} pitches</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#5AB25E" style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.turfsGrid}>
            {filteredTurfs.map((turf) => (
              <TurfCard
                key={turf.turfId}
                {...turf}
                navigation={navigation}
              />
            ))}
          </View>
        )}
        
        {!loading && filteredTurfs.length === 0 && (
          <View style={styles.emptyState}>
             <Ionicons name="search" size={64} color="#CBD5E1" style={{ marginBottom: 20 }} />
             <Text style={styles.emptyTitle}>No pitches match your search</Text>
             <Text style={styles.emptySub}>Try adjusting your filters or searching for something else</Text>
          </View>
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
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 16,
    backgroundColor: '#FFF',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
  },
  filterStrip: {
    backgroundColor: '#FFF',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterScroll: {
    paddingHorizontal: 24,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#5AB25E',
    borderColor: '#5AB25E',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  filterTextActive: {
    color: '#FFF',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  resultsHeader: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  resultsCount: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  turfsGrid: {
    paddingBottom: 20,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 64,
    height: 64,
    marginBottom: 20,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySub: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  }
});

export default Turfs;