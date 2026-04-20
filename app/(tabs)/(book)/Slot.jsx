import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableHighlight, StyleSheet, TouchableOpacity, RefreshControl, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import SlotContainer from '../../../components/SlotContainer';
import CustomDateTimePicker from '../../../components/CustomDateTimePicker';
import CustomAlert from '../../../components/CustomAlert';
import { B_URL } from '@env';
import iconsBack from '../../../assets/icons/back.png';


const Slot = () => {
  const { turfId, turfname } = useLocalSearchParams();
  const router = useRouter();
  const [selectedPlaygroundId, setSelectedPlaygroundId] = useState(null);
  const [turfs, setTurfs] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [showDates, setShowDates] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchTurfs(), fetchSlots()]);
      setLoading(false);
    };
    init();
  }, []);

  const fetchTurfs = async () => {
    try {
      const response = await axios.get(`${B_URL}/turfs`);
      setTurfs(response.data);
    } catch (error) {
      console.error('Fetch turfs error:', error);
    }
  };

  const fetchSlots = async () => {
    try {
      const response = await axios.get(`${B_URL}/split/fetch/${turfId}`);
      const sortedBookings = response.data.sort((a, b) => {
        const dateComparison = new Date(a.slotDate).getTime() - new Date(b.slotDate).getTime();
        if (dateComparison !== 0) return dateComparison;
        return a.slotTime.localeCompare(b.slotTime);
      });
      setAllBookings(sortedBookings);
    } catch (error) {
      console.error('Fetch slots error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchTurfs(), fetchSlots()]);
    setRefreshing(false);
  };

  useEffect(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(formatDate(date));
    }
    setShowDates(dates);
  }, []);

  useEffect(() => {
    if (allBookings.length && showDates[selectedDateIndex]) {
      const playgroundId = selectedPlaygroundId;
      const date = showDates[selectedDateIndex];
      const filteredByPlayground = playgroundId ? allBookings.filter(b => b.playgroundId === playgroundId) : allBookings;
      const filtered = filteredByPlayground.filter(b => b.slotDate === date);
      setFilteredBookings(filtered);
    }
  }, [selectedPlaygroundId, selectedDateIndex, allBookings, showDates]);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const dayOfWeek = (dateStr) => {
    const [d, m, y] = dateStr.split('-');
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const handleBook = () => {
    if (selectedPlaygroundId) {
      const selectedTurf = turfs.find(t => t.turfId === Number(turfId));
      const playground = selectedTurf.playgrounds.find(p => p.id === selectedPlaygroundId);
      router.push({
        pathname: '/(tabs)/(book)/BookForm',
        params: {
          turfId,
          playgroundId: selectedPlaygroundId,
          ...playground,
          weekend_inc: selectedTurf.weekend_inc, 
          open: selectedTurf.open,
          date: showDates[selectedDateIndex],
        }
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#5AB25E" />
        <Text style={styles.loadingText}>Fetching slots...</Text>
      </View>
    );
  }

  const selectedTurf = turfs.find(t => t.turfId === Number(turfId));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Image source={iconsBack} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{turfname || 'Select Slot'}</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5AB25E']} tintColor="#5AB25E" />}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Pick a Playground</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.playgroundList} contentContainerStyle={{ paddingRight: 40 }}>
          {selectedTurf?.playgrounds?.length > 0 ? (
            selectedTurf.playgrounds.map((p) => (
              <TouchableOpacity
                key={p.id}
                onPress={() => setSelectedPlaygroundId(p.id)}
                style={[styles.pCard, selectedPlaygroundId === p.id && styles.pCardActive]}
              >
                <View style={[styles.pIcon, selectedPlaygroundId === p.id && styles.pIconActive]}>
                  <Icon name="soccer-ball-o" size={20} color={selectedPlaygroundId === p.id ? '#FFF' : '#5AB25E'} />
                </View>
                <Text style={[styles.pName, selectedPlaygroundId === p.id && styles.pNameActive]}>{p.sport}</Text>
                <Text style={[styles.pPrice, selectedPlaygroundId === p.id && styles.pPriceActive]}>₹{p.price}/hr</Text>
                {p.discount > 0 && <View style={styles.discountTag}><Text style={styles.discountText}>{p.discount}% OFF</Text></View>}
              </TouchableOpacity>
            ))
          ) : (
             <View style={styles.errorState}>
                <Text style={styles.errorStateText}>No playgrounds available at this turf.</Text>
             </View>
          )}
        </ScrollView>

        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateList}>
            {showDates.map((date, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedDateIndex(idx)}
                style={[styles.dateCard, selectedDateIndex === idx && styles.dateCardActive]}
              >
                <Text style={[styles.dayText, selectedDateIndex === idx && styles.dayTextActive]}>{dayOfWeek(date)}</Text>
                <Text style={[styles.dateTextLabel, selectedDateIndex === idx && styles.dateTextLabelActive]}>{date.split('-')[0]}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {selectedPlaygroundId ? (
          <View style={styles.slotsWrapper}>
            <Text style={styles.sectionTitle}>Available Slots</Text>
            <SlotContainer 
               selectedDate={showDates[selectedDateIndex]} 
               slots={filteredBookings} 
               fixed_slots={selectedTurf?.fixed_slots || []} 
               selectedPlaygroundId={selectedPlaygroundId} 
               openTime={selectedTurf?.openTime} 
               closeTime={selectedTurf?.closeTime} 
            />
            {!filteredBookings.length && (
               <View style={styles.emptySlots}>
                  <Text style={styles.emptyText}>All slots are available!</Text>
               </View>
            )}
          </View>
        ) : (
          <View style={styles.selectPrompt}>
             <Icon name="hand-pointer-o" size={48} color="#E2E8F0" />
             <Text style={styles.promptText}>Please select a playground first</Text>
             <Text style={styles.promptSub}>Choose a sport to see available slots</Text>
          </View>
        )}
      </ScrollView>

      {selectedPlaygroundId && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.bookActionBtn} onPress={handleBook}>
            <Text style={styles.bookActionText}>Proceed to Book</Text>
          </TouchableOpacity>
        </View>
      )}

      <CustomAlert
        visible={alertVisible}
        title="Alert"
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
      />
    </View>
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
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFF',
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 16,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  playgroundList: {
    paddingLeft: 20,
    marginBottom: 24,
  },
  pCard: {
    width: 140,
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  pCardActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#5AB25E',
  },
  pIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  pIconActive: {
    backgroundColor: '#5AB25E',
  },
  pName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },
  pNameActive: {
    color: '#166534',
  },
  pPrice: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  pPriceActive: {
    color: '#5AB25E',
  },
  discountTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  discountText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  dateSection: {
    marginBottom: 24,
  },
  dateList: {
    paddingLeft: 20,
    gap: 12,
  },
  dateCard: {
    width: 60,
    height: 80,
    backgroundColor: '#FFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateCardActive: {
    backgroundColor: '#5AB25E',
    borderColor: '#5AB25E',
  },
  dayText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
    marginBottom: 4,
  },
  dayTextActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dateTextLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E293B',
  },
  dateTextLabelActive: {
    color: '#FFF',
  },
  slotsWrapper: {
    paddingBottom: 100,
  },
  emptySlots: {
    marginHorizontal: 20,
    padding: 20,
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    alignItems: 'center',
  },
  emptyText: {
    color: '#166534',
    fontWeight: '600',
  },
  selectPrompt: {
    marginTop: 40,
    alignItems: 'center',
    gap: 12,
  },
  promptText: {
    color: '#94A3B8',
    fontSize: 15,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 40,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  bookActionBtn: {
    backgroundColor: '#5AB25E',
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  bookActionText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
  errorState: {
    padding: 20,
    alignItems: 'center',
  },
  errorStateText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  promptSub: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 4,
  }
});

export default Slot;
