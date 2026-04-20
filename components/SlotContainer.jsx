import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SlotCard, FixedSlotCard } from './SlotCard';

const SlotContainer = ({ slots, fixed_slots = [], selectedPlaygroundId = [], openTime, closeTime, selectedDate }) => {

  const calculateTopPosition = (slotTime) => {
    const [slotHour, slotMinute] = slotTime.split(':').map(Number);

    const slotMinutes = slotHour * 60 + slotMinute;
    return slotMinutes + 30; // Adjusted with some spacing (e.g., 30 minutes)
  };


  const calculateHeight = () => {
    return 60; // 60 pixels per hour
  }

  const calculateSlotsContainerHeight = () => {
    if (!slots.length && !fixed_slots.length) {
      return 0; // No slots, height should be minimal or zero
    }
    const lastSlot = slots.length > 0 ? slots[slots.length - 1] : fixed_slots[fixed_slots.length - 1];
    const lastSlotTopPosition = calculateTopPosition(lastSlot.slotTime || lastSlot.start_time) + ((1 || lastSlot.hours) - 1) * 60;

    return lastSlotTopPosition + 60 + 60; // 60 pixels of padding
  };

  const renderTimeline = () => {
    const startHour = 0;
    const endHour = 24;

    const hours = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      hours.push({ hour, minute: 0 });
      if (hour < endHour) hours.push({ hour, minute: 30 });
    }

    return hours.map(({ hour, minute }) => {
      const isWholeHour = minute === 0;
      const period = hour < 12 || (hour === 24 && minute === 0) ? 'AM' : 'PM';
      const displayHour = hour === 0 || hour === 24 ? 12 : hour > 12 ? hour - 12 : hour;
      const timeStr = `${displayHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      
      return (
        <View key={`${hour}_${minute}`} style={isWholeHour ? styles.timelineHour : styles.timelineHalfHour}>
          <Text style={isWholeHour ? styles.timelineHourText : styles.timelineHalfHourText}>
            {`${timeStr} ${isWholeHour ? period : ''}`}
          </Text>
          <View style={[styles.timelineHourLine, { width: '100%', left: 60, opacity: isWholeHour ? 1 : 0.3 }]} />
        </View>
      );
    });
  };

  const convertToDate = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Month in JavaScript Date starts from 0 (January is 0)
  };

  const renderFixedSlots = () => {
    const selectedDateFormatted = formatDate(selectedDate);

    const currentDate = new Date();
    return fixed_slots
      .filter(fixedSlot => {
        const startDate = convertToDate(fixedSlot.start_date);
        const endDate = convertToDate(fixedSlot.end_date);
        return startDate <= currentDate && endDate >= currentDate &&
          startDate <= selectedDateFormatted && endDate >= selectedDateFormatted;
      })
      .flatMap((fixedSlot) => {
        const initialTopPosition = calculateTopPosition(fixedSlot.start_time);
        return Array.from({ length: fixedSlot.hours }, (_, i) => {
          const topPosition = initialTopPosition + i * 60;
          return (
            <View key={`${fixedSlot.id}_${i}`} style={[styles.slotWrapper, { top: topPosition, height: calculateHeight(fixedSlot.hours) }]}>
              <FixedSlotCard
                slotId={fixedSlot.id}
                startTime={fixedSlot.start_time}
                endTime={fixedSlot.end_time}
                hours={fixedSlot.hours}
              />
            </View>
          );
        });
      });
  };

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Month in JavaScript Date starts from 0 (January is 0)
  };

  const renderClosedPeriod = () => {
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);
  
    const openPosition = openHour * 60 + openMinute + 30;
    const closePosition = closeHour * 60 + closeMinute + 30;
  
    if (openPosition === closePosition) {
      return null;
    }
    let closedPeriods = [];
  
    if (openPosition <= closePosition) {
      // Turf closes and opens on the same day
      if (openPosition > 0) {
        closedPeriods.push({ top: 0, height: openPosition });
      }
      if (closePosition < 1440) {
        closedPeriods.push({ top: closePosition, height: 1440 - closePosition });
      }
    } else {
      // Turf closes and opens on different days
      closedPeriods.push({ top: closePosition, height: openPosition - closePosition });
    }
  
    return closedPeriods.map((period, index) => (
      <View key={index} style={[styles.closedPeriod, { top: period.top, height: period.height }]} />
    ));
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.timelineContainer}>
        {renderTimeline()}
      </View>
      <ScrollView style={styles.slotsContainer} contentContainerStyle={{ paddingBottom: calculateSlotsContainerHeight() }}>
        {renderClosedPeriod()}
        {slots.length > 0 && (
          slots
            .filter(slot => selectedPlaygroundId === null || slot.playgroundId === selectedPlaygroundId)
            .flatMap((slot) => {
              const initialTopPosition = calculateTopPosition(slot.slotTime);
              return Array.from({ length: 1 }, (_, i) => {
                const topPosition = initialTopPosition + i * 60;
                return (
                  <View key={`${slot._id}_${i}`} style={[styles.slotWrapper, { top: topPosition }]}>
                    <SlotCard
                      slotId={slot.slotId}
                      slotTime={slot.slotTime}
                      bookedBy={slot.bookedBy}
                    />
                  </View>
                );
              });
            })
        )}

        {renderFixedSlots()}

        {slots.length === 0 && fixed_slots.length === 0 && (
          <Text style={styles.emptyStateText}>No Bookings, Book Now</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 16,
    flex: 2,
  },
  timelineContainer: {
    width: 80,
    alignItems: 'center',
    minHeight: 1500,
  },
  timelineHourLine: {
    position: 'absolute',
    backgroundColor: '#ddd',
    height: 1,
    width: '100%',
    top: 30,
  },
  timelineHour: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineHalfHour: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineHourText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '700',
  },
  timelineHalfHourText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  slotsContainer: {
    flex: 1,
  },
  slotWrapper: {
    position: 'absolute',
    width: '100%',
  },
  closedPeriod: {
    position: 'absolute',
    width: '95%',
    marginHorizontal: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.1)',
  },
  emptyStateText: {
    marginTop: 40,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SlotContainer;
