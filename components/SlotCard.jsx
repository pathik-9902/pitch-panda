import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons from react-native-vector-icons

const convertTo12HourFormat = (time24) => {
  const [hours24, minutes] = time24.split(':').map(Number);
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
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

const SlotCard = ({ slotId, slotTime}) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Text style={styles.slotId}>#{slotId}</Text>
    </View>
    <View style={styles.infoItem}>
      <Ionicons name="time-outline" size={18} color="#4CAF50" style={styles.icon} />
      <Text style={styles.slotInfoText}>
        {convertTo12HourFormat(slotTime)} - {convertTo12HourFormat(calculateEndTime(slotTime, 1))}
      </Text>
    </View>
    <View style={styles.details}>
    </View>
  </View>
);

const FixedSlotCard = ({ startTime, endTime, hours }) => (
  <View style={styles.fixedCard}>
    <View style={styles.header}>
      <Text style={styles.slotId}>Fixed Slot</Text>
    </View>
    <View style={styles.infoItem}>
      <Ionicons name="time-outline" size={18} color="#FF9800" style={styles.icon} />
      <Text style={styles.slotInfoText}>
        {convertTo12HourFormat(startTime)} - {convertTo12HourFormat(endTime)} ({hours} hrs)
      </Text>
    </View>
    <View style={styles.details}>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    elevation: 3,
    width: '95%',
    top:0.5,
    alignSelf: 'center',
    marginBottom: 10,
  },
  fixedCard: {
    backgroundColor: '#fff3e0',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    elevation: 3,
    width: '95%',
    alignSelf: 'center',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  slotId: {
    fontSize: 12,
    color: '#555',
  },
  bookedBy: {
    fontSize: 10,
    fontStyle: 'italic',
    color: '#888',
  },
  details: {},
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    marginRight: 8,
  },
  slotInfoText: {
    fontSize: 14,
    color: '#444',
    fontWeight: 'bold',
  },
});

export { SlotCard, FixedSlotCard };
