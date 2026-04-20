import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, TouchableHighlight, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import CustomDateTimePicker from '../../../components/CustomDateTimePicker';
import Slider from '@react-native-community/slider';
import { B_URL } from '@env';
import CustomAlert from '../../../components/CustomAlert';
import iconsBack from '../../../assets/icons/back.png';

const BookForm = () => {
  const router = useRouter();
  const { turfId, playgroundId, open, price, sport, discount, weekend_inc, date } = useLocalSearchParams();
  
  if (!turfId || !playgroundId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Invalid Booking Parameters</Text>
        <TouchableOpacity style={styles.backButtonInline} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const [slotDate, setSlotDate] = useState(date || '');
  const [slotTime, setSlotTime] = useState('');
  const [numOfHours, setNumOfHours] = useState(1);
  const [bookings, setBookings] = useState([]);
  const [isDateVisible, setDateVisible] = useState(false);
  const [isTimeVisible, setTimeVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertType, setAlertType] = useState('');
  const [alertHeading, setAlertHeading] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${B_URL}/slots/book/${turfId}/${playgroundId}`);
      setBookings(response.data.sort((a, b) => new Date(b.slotDate.split('-').reverse().join('-')) - new Date(a.slotDate.split('-').reverse().join('-'))));
    } catch (error) {
      console.error('Error fetching bookings:', error);
      showAlert('error', 'Error', 'Failed to fetch bookings. Please try again later.');
    }
  };

  const showAlert = (type, heading, message) => {
    setAlertType(type);
    setAlertHeading(heading);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const handleSubmit = async () => {
    if (!slotDate || !slotTime || !numOfHours) {
      showAlert('alert', 'Missing Information', 'Please fill in all fields.');
      return;
    }

    const selectedDateTime = new Date(`${slotDate.split('-').reverse().join('-')} ${slotTime}`);
    const currentDateTime = new Date();

    if (selectedDateTime <= currentDateTime) {
      showAlert('alert', 'Invalid Date/Time', 'Please select a future date and time.');
      return;
    }

    let turfDetails;
    try {
      const response = await axios.get(`${B_URL}/turfs/${turfId}`);
      turfDetails = response.data;
    } catch (error) {
      console.error('Error fetching turf details:', error);
      showAlert('error', 'Error', 'Failed to fetch turf details. Please try again later.');
      return;
    }

    const { openTime, closeTime } = turfDetails;
    const [openHours, openMinutes] = openTime.split(':').map(Number);
    let [closeHours, closeMinutes] = closeTime.split(':').map(Number);

    if (closeHours === 0 && closeMinutes === 0) {
      closeHours = 24;
    }

    const [hours, minutes] = slotTime.split(':').map(Number);
    const slotStart = new Date(slotDate.split('-').reverse().join('-'));
    slotStart.setHours(hours, minutes, 0, 0);
    const slotEnd = new Date(slotStart.getTime() + numOfHours * 60 * 60 * 1000);

    const openingDateTime = new Date(slotDate.split('-').reverse().join('-'));
    openingDateTime.setHours(openHours, openMinutes, 0, 0);

    let closingDateTime;
    if (closeHours < openHours || (closeHours === openHours && closeMinutes <= openMinutes)) {
      closingDateTime = new Date(slotDate.split('-').reverse().join('-'));
      closingDateTime.setDate(closingDateTime.getDate() + 1);
    } else {
      closingDateTime = new Date(slotDate.split('-').reverse().join('-'));
    }
    closingDateTime.setHours(closeHours, closeMinutes, 0, 0);

    let isValid = true;
    if (closeHours < openHours || (closeHours === openHours && closeMinutes <= openMinutes)) {
      const closedStart = new Date(slotDate.split('-').reverse().join('-'));
      closedStart.setHours(closeHours, closeMinutes, 0, 0);
      const closedEnd = new Date(closedStart.getTime() + 1 * 60 * 60 * 1000);

      if ((slotStart >= closedStart && slotStart < closedEnd) || (slotEnd > closedStart && slotEnd <= closedEnd) || (slotStart < closedStart && slotEnd > closedEnd)) {
        isValid = false;
      }
    } else {
      if (!(slotStart >= openingDateTime && slotEnd <= closingDateTime)) {
        isValid = false;
      }
    }

    if (!isValid) {
      showAlert('alert', 'Invalid Time Slot', `Bookings are only allowed between ${openTime} and ${closeTime}.`);
      return;
    }

    const isSlotOverlap = bookings.some((booking) => {
      if (booking.status === 'Booking' || booking.status === 'Booked') {
        const [bookedHours, bookedMinutes] = booking.slotTime.split(':').map(Number);
        const bookingStart = new Date(booking.slotDate.split('-').reverse().join('-'));
        bookingStart.setHours(bookedHours, bookedMinutes, 0, 0);
        const bookingEnd = new Date(bookingStart.getTime() + booking.numOfHours * 60 * 60 * 1000);

        return (
          (slotStart >= bookingStart && slotStart < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
          (slotStart <= bookingStart && slotEnd >= bookingEnd)
        );
      }
      return false;
    });

    if (isSlotOverlap) {
      showAlert('alert', 'Slot Already Booked', 'Please select another time slot.');
      return;
    }

    const bookingDetails = {
      turfId,
      playgroundId,
      slotDate,
      slotTime,
      numOfHours: Number(numOfHours),
      price: Number(price),
      sport,
      discount: Number(discount),
      weekend_inc: Number(weekend_inc)
    };

    router.push({
      pathname: '/(tabs)/(book)/Payments',
      params: { 
        bookingDetails: JSON.stringify(bookingDetails), 
        discount: Number(discount), 
        weekend_inc: Number(weekend_inc) 
      }
    });
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (time) => {
    let hours = String(time.getHours()).padStart(2, '0');
    let minutes = time.getMinutes();
    minutes = Math.round(minutes / 30) * 30;
    if (minutes === 60) {
      minutes = 0;
      hours = String(parseInt(hours, 10) + 1).padStart(2, '0');
    }
    return `${hours}:${String(minutes).padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Image source={iconsBack} tintColor="#333" style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.heading}>Book Slot</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Turf</Text>
          <Text style={styles.infoValue}>{turfId}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Playground</Text>
          <Text style={styles.infoValue}>{playgroundId}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rate</Text>
          <Text style={styles.infoValue}>₹{price}/hr</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Sport</Text>
          <Text style={styles.infoValue}>{sport}</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.sectionTitle}>Select Date & Time</Text>
        
        <TouchableOpacity style={styles.pickerButton} onPress={() => setDateVisible(true)}>
          <Text style={styles.pickerLabel}>Date</Text>
          <Text style={styles.pickerValue}>{slotDate || 'Select Date'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.pickerButton} onPress={() => setTimeVisible(true)}>
          <Text style={styles.pickerLabel}>Start Time</Text>
          <Text style={styles.pickerValue}>{slotTime || 'Select Time'}</Text>
        </TouchableOpacity>

        <CustomDateTimePicker
          mode="date"
          isVisible={isDateVisible}
          onConfirm={(date) => {
            setSlotDate(formatDate(date));
            setDateVisible(false);
          }}
          onCancel={() => setDateVisible(false)}
        />

        <CustomDateTimePicker
          mode="time"
          isVisible={isTimeVisible}
          onConfirm={(time) => {
            setSlotTime(formatTime(time));
            setTimeVisible(false);
          }}
          onCancel={() => setTimeVisible(false)}
        />

        <View style={styles.sliderSection}>
          <Text style={styles.sliderLabel}>Duration: <Text style={styles.boldText}>{numOfHours} Hour{numOfHours > 1 ? 's' : ''}</Text></Text>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={1}
            maximumValue={12}
            value={numOfHours}
            step={1}
            onValueChange={setNumOfHours}
            minimumTrackTintColor="#5AB25E"
            maximumTrackTintColor="#D1D1D1"
            thumbTintColor="#5AB25E"
          />
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleSubmit}>
          <Text style={styles.nextButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {bookings.length > 0 && (
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          {bookings.slice(0, 3).map((booking, index) => (
            <View key={index} style={styles.bookingItem}>
              <Text style={styles.bookingDate}>{booking.slotDate}</Text>
              <Text style={styles.bookingTime}>{booking.slotTime} ({booking.numOfHours}h)</Text>
            </View>
          ))}
        </View>
      )}

      <CustomAlert
        type={alertType}
        heading={alertHeading}
        message={alertMessage}
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginLeft: 20,
  },
  card: {
    margin: 20,
    padding: 24,
    backgroundColor: '#FFF',
    borderRadius: 24,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 16,
    marginTop: 10,
  },
  pickerButton: {
    backgroundColor: '#FFF',
    padding: 18,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
  },
  pickerLabel: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  pickerValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#5AB25E',
  },
  sliderSection: {
    marginTop: 20,
    marginBottom: 32,
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sliderLabel: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 12,
    fontWeight: '600',
  },
  boldText: {
    fontWeight: '800',
    color: '#0F172A',
  },
  nextButton: {
    backgroundColor: '#5AB25E',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 8,
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  historySection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  bookingItem: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#5AB25E',
  },
  bookingDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D3748',
  },
  bookingTime: {
    fontSize: 14,
    color: '#718096',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#E53E3E',
    marginBottom: 20,
  },
  backButtonInline: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    backgroundColor: '#5AB25E',
    borderRadius: 12,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: '600',
  }
});

export default BookForm;
