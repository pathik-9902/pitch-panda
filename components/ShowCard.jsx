import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ShowCard = ({ slot }) => {
  const navigation = useNavigation();

  if (!slot || !slot.slotTime) {
    return <Text style={styles.errorText}>Error fetching slot details: Slot data not available.</Text>;
  }

  const formattedStartTime = formatTime(slot.slotTime);
  const endTime = calculateEndTime(slot.slotTime, slot.numOfHours);
  const formattedEndTime = formatTime(endTime);

  const handlePress = () => {
    navigation.navigate('CancelPage', {
      slotId: slot.slotId,
      slotTime: slot.slotTime,
      slotDate: slot.slotDate,
      numOfHours: slot.numOfHours,
    });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Slot Details</Text>
      </View>
      <View style={styles.content}>
        <Row label="Slot ID" value={slot.slotId} />
        <Row label="Turf ID" value={slot.turfId} />
        <Row label="Playground ID" value={slot.playgroundId} />
        <Row label="Date" value={slot.slotDate} />
        <Row label="Time Slot" value={`${formattedStartTime} - ${formattedEndTime}`} />
        <Row label="Number of Hours" value={`${slot.numOfHours} hrs`} />
        <Row label="Booked By" value={slot.bookedBy} />
        <Row
          label="Status"
          value={slot.status}
          color={slot.status === 'Confirmed' ? '#2ecc71' : '#e74c3c'}
        />
        <Row
          label="Amount Paid"
          value={`₹ ${slot.payment.amountPaid.toFixed(2)}`}
        />
        <Row
          label="Amount Pending"
          value={`₹ ${slot.payment.amountToBePaid.toFixed(2)}`}
        />
      </View>
    </TouchableOpacity>
  );
};

const Row = ({ label, value, color }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={[styles.value, color && { color: color }]}>{value}</Text>
  </View>
);

const formatTime = (time) => {
  const [hours, minutes] = time.split(':');
  let parsedHours = parseInt(hours, 10);
  const suffix = parsedHours >= 12 ? 'PM' : 'AM';
  parsedHours = parsedHours % 12 || 12;
  return `${parsedHours}:${minutes} ${suffix}`;
};

const calculateEndTime = (startTime, hours) => {
  const timeRegex = /^(\d{2}):(\d{2})$/i;
  const match = startTime.match(timeRegex);
  if (!match) {
    return 'Invalid input time format';
  }

  const [, hoursPart, minutesPart] = match.map((m) => parseInt(m));

  let totalHours = hoursPart + hours;
  const newHours = totalHours % 24;
  const displayHours = newHours.toString().padStart(2, '0');
  const endTime = `${displayHours}:${minutesPart.toString().padStart(2, '0')}`;

  return endTime;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    elevation: 5,
  },
  header: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    flex: 1.5,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    flex: 2,
    fontSize: 14,
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default ShowCard;
