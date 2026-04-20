import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity, Alert, TouchableHighlight, Image } from 'react-native';
import axios from 'axios';
import SlotContainer from '../../../components/SlotContainer';
import { B_URL } from '@env';
import { useRouter, useLocalSearchParams } from 'expo-router';
import iconsBack from '../../../assets/icons/back.png';

const SlotByDate = () => {
  const { turfId, date, openTime, closeTime, fixed_slots } = useLocalSearchParams();
  const router = useRouter();
  const [slots, setSlots] = useState([]);
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlaygroundId, setSelectedPlaygroundId] = useState(1);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // const navigation = useNavigation(); // Remove unused and missing import

  useEffect(() => {
    fetchTurfs();
    fetchSlots();
  }, [turfId, date, selectedPlaygroundId]);

  const showAlert = (title, message) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const fetchTurfs = async () => {
    try {
      const response = await axios.get(`${B_URL}/turfs`);
      setTurfs(response.data);
    } catch (error) {
      console.error('Error fetching turfs:', error);
      showAlert('Error', 'Failed to fetch turfs details. Please try again later.');
    }
  };

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const formattedDate = formatDate(new Date(date));
      const response = await axios.get(`${B_URL}/split/fetch/${turfId}/${formattedDate}`);
      const bookedSlots = response.data.filter(slot => slot.status.toLowerCase() === 'booked');

      const sortedBookings = bookedSlots.sort((a, b) => {
        const dateComparison = new Date(a.slotDate).getTime() - new Date(b.slotDate).getTime();
        if (dateComparison !== 0) {
          return dateComparison;
        }
        return a.slotTime.localeCompare(b.slotTime);
      });

      setSlots(sortedBookings);
      setLoading(false);
    } catch (error) {
      console.error('Fetch slots error:', error);
      setError('Failed to fetch slots. Please try again later.');
      showAlert('Error', 'Failed to fetch slots details. Please try again later.');
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSlots().finally(() => setRefreshing(false));
  };

  const handlePlaygroundPress = (playgroundId) => {
    setSelectedPlaygroundId(playgroundId === selectedPlaygroundId ? null : playgroundId);
  };

  const handleBook = () => {
    const selectedTurf = turfs.find((turf) => turf.turfId === turfId);
    const selectedPlayground = selectedTurf ? selectedTurf.playgrounds.find((playground) => playground.id === selectedPlaygroundId) : null;
    const formattedDate = formatDate(new Date(date));

    router.push({
      pathname: '/(tabs)/(book)/BookForm',
      params: {
        turfId,
        playgroundId: selectedPlaygroundId,
        date: formattedDate,
        openTime,
        closeTime,
        fixed_slots: typeof selectedTurf.fixed_slots === 'string' ? selectedTurf.fixed_slots : JSON.stringify(selectedTurf.fixed_slots),
        price: selectedPlayground ? selectedPlayground.price : null,
        discount: selectedPlayground ? selectedPlayground.discount : null,
        weekend_inc: selectedPlayground ? selectedPlayground.weekend_inc : null,
        sport: selectedPlayground ? selectedPlayground.sport : null,
      }
    });
  };
  let s_date = formatDate(new Date(date))
  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <TouchableHighlight
        style={styles.backButton}
        onPress={() => router.back()}
        underlayColor="transparent" // to remove the default TouchableHighlight background
      >
        <Image source={iconsBack} style={styles.backIcon} />
      </TouchableHighlight>
      <Text style={styles.header}>Slots on {formatDate(new Date(date))}</Text>
      <TouchableOpacity style={styles.bookButton} onPress={handleBook}>
        <Text style={styles.bookButtonText}>Book</Text>
      </TouchableOpacity>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          {
            turfs
              .filter(turf => turf.turfId === turfId)
              .map((turf) => (
                <View key={turf.turfId}>
                  <View style={styles.playgroundsContainer}>
                    {turf.playgrounds.map((playground) => (
                      <TouchableOpacity
                        key={playground.id}
                        style={[
                          styles.playgroundButton,
                          selectedPlaygroundId === playground.id && styles.selectedPlaygroundButton,
                        ]}
                        onPress={() => handlePlaygroundPress(playground.id)}
                      >
                        <Text style={styles.playgroundButtonText}>{playground.id}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))
          }

          <SlotContainer selectedDate={s_date} slots={slots} selectedPlaygroundId={selectedPlaygroundId} fixed_slots={fixed_slots} openTime={openTime} closeTime={closeTime} />

        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
    paddingBottom: 80,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  playgroundsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  playgroundButton: {
    backgroundColor: '#007bff',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  selectedPlaygroundButton: {
    backgroundColor: '#4CAF50',
  },
  playgroundButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
  bookButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 1,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
});

export default SlotByDate;
