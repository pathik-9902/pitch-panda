import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons from react-native-vector-icons
import { useNavigation } from '@react-navigation/native';

const BookingCard = ({ slotId, slotTime, slotDate, numOfHours, bookedBy, playgroundId, status, payment }) => {
  const navigation = useNavigation();

  const convertTo12HourFormat = (time24) => {
    const [hours24, minutes] = time24.split(':').map(Number);
    const period = hours24 >= 12 ? 'PM' : 'AM';
    const hours12 = hours24 % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const calculateEndTime = (startTime, hours) => {
    const [h, m] = startTime.split(':').map(Number);
    const endH = (h + Math.floor(hours)) % 24;
    const endM = (m + (hours % 1) * 60) % 60;
    return `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;
  };

  const handleCancel = () => {
    navigation.navigate('CancelPage', { slotId, slotTime, slotDate, numOfHours });
  };

  const isPast = (dateStr) => {
    const [d, m, y] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d) < new Date().setHours(0,0,0,0);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCancel} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
         <View style={styles.idGroup}>
            <Text style={styles.idLabel}>BOOKING ID</Text>
            <Text style={styles.idValue}>#{slotId}</Text>
         </View>
         <View style={[styles.statusBadge, 
            status === 'Booked' ? styles.statusBooked : 
            status === 'Cancelled' ? styles.statusCancelled : styles.statusAttempted]}>
            <View style={[styles.statusDot, 
               { backgroundColor: status === 'Booked' ? '#5AB25E' : status === 'Cancelled' ? '#EF4444' : '#F59E0B' }]} />
            <Text style={[styles.statusText, 
               { color: status === 'Booked' ? '#5AB25E' : status === 'Cancelled' ? '#EF4444' : '#F59E0B' }]}>
               {status.toUpperCase()}
            </Text>
         </View>
      </View>

      <View style={styles.mainInfo}>
         <View style={styles.timeGroup}>
            <Text style={styles.timeValue}>{convertTo12HourFormat(slotTime)}</Text>
            <Ionicons name="arrow-forward" size={14} color="#CBD5E1" />
            <Text style={styles.timeValue}>{convertTo12HourFormat(calculateEndTime(slotTime, numOfHours))}</Text>
         </View>
         <Text style={styles.durationText}>{numOfHours} HR MATCH</Text>
      </View>

      <View style={styles.footer}>
         <View style={styles.footerItem}>
            <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
            <Text style={styles.footerText}>{slotDate}</Text>
         </View>
         <View style={styles.footerItem}>
            <Ionicons name="football-outline" size={14} color="#94A3B8" />
            <Text style={styles.footerText}>Field #{playgroundId}</Text>
         </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  idGroup: {
    gap: 2,
  },
  idLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.5,
  },
  idValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  statusBooked: { backgroundColor: '#F0FDF4' },
  statusCancelled: { backgroundColor: '#FEF2F2' },
  statusAttempted: { backgroundColor: '#FFF7ED' },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  mainInfo: {
    marginBottom: 20,
  },
  timeGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  durationText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5AB25E',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  }
});

export default BookingCard;
