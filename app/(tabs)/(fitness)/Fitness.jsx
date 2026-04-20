import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import ShowCard from '../../../components/ShowCard'; // Adjust the path if necessary
import { B_URL } from '@env';

const Fitness = () => {
  const [slotDetails, setSlotDetails] = useState(null);
  const { userState } = useContext(UserContext);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSlotDetails = async () => {
    try {
      const response = await axios.get(`${B_URL}/slots/fetchByUser/${userState.userId}`);
      let slots = response.data;

      if (!Array.isArray(slots) || slots.length === 0) {
        console.log('No slots found for user:', userState.userId);
        setSlotDetails([]);
        return;
      }

      slots.forEach(slot => {
        const [day, month, year] = slot.slotDate.split('-');
        const [hours, minutes] = slot.slotTime.split(':');
        slot.slotDateTime = new Date(year, month - 1, day, hours, minutes);
      });

      slots.sort((a, b) => a.slotDateTime - b.slotDateTime);

      const now = new Date();
      let nearestSlot = slots.find(slot => slot.slotDateTime >= now);

      if (!nearestSlot) {
        nearestSlot = slots[0]; // If no future slots, show the first slot (current first)
      }

      setSlotDetails([nearestSlot]);
    } catch (error) {
      console.error('Error fetching slot details:', error);
      setSlotDetails([]);
    }
  };

  // useEffect to fetch slot details on component mount and when userState.userId changes
  useEffect(() => {
    fetchSlotDetails();
  }, [userState?.userId]);

  // Function to handle refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchSlotDetails(); // Call fetchSlotDetails to update slot details
    setRefreshing(false);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.heading}>Upcoming Slot Details</Text>
      {slotDetails && slotDetails.length > 0 ? (
        slotDetails.filter(slot => slot.status === "Booked").length > 0 ? (
          slotDetails
            .filter(slot => slot.status === "Booked")
            .map((slot) => (
              <ShowCard key={slot.slotId} slot={slot} />
            ))
        ) : (
          <Text>No upcoming slots available</Text>
        )
      ) : (
        <Text>No upcoming slots available</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Fitness;
