import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const EventCard = ({ tournament }) => {
  const { name, date, location, prize, type } = tournament;

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.9}>
      <View style={[styles.badge, { backgroundColor: type === 'Football' ? '#5AB25E' : '#3B82F6' }]}>
        <Text style={styles.badgeText}>{type}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{name}</Text>
        
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={14} color="#64748B" />
          <Text style={styles.infoText}>{date}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Ionicons name="location-outline" size={14} color="#64748B" />
          <Text style={styles.infoText}>{location}</Text>
        </View>

        <View style={styles.prizeContainer}>
          <Text style={styles.prizeLabel}>Prize Pool</Text>
          <Text style={styles.prizeValue}>{prize}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.joinBtn}>
        <Text style={styles.joinText}>Join Now</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 180,
    backgroundColor: '#FFF',
    borderRadius: 24,
    marginRight: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  badgeText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 12,
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  prizeContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  prizeLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  prizeValue: {
    fontSize: 15,
    fontWeight: '900',
    color: '#5AB25E',
  },
  joinBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  joinText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  }
});

export default EventCard;
