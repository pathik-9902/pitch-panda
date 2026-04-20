import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import { B_URL } from '@env';
import { useRouter, useLocalSearchParams } from 'expo-router';


const CancelPage = () => {
  const { slotId, slotTime, slotDate, numOfHours } = useLocalSearchParams();
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);

  const handleCancel = async () => {
    try {
      setCancelling(true);
      const response = await axios.put(`${B_URL}/slots/cancel/${slotId}`);
      Alert.alert('Cancellation Successful', response.data.message, [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error cancelling slot:', error);
      Alert.alert('Cancellation Failed', 'An error occurred while cancelling the slot. Please try again.');
    } finally {
      setCancelling(false);
    }
  };

  const isFutureSlot = () => {
    const currentDateTime = new Date();
    const [day, month, year] = slotDate.split('-').map(num => parseInt(num, 10));
    const [hours, minutes] = slotTime.split(':').map(num => parseInt(num, 10));
    const slotDateTime = new Date(year, month - 1, day, hours, minutes);
    return slotDateTime > currentDateTime;
  };

  const isFuture = isFutureSlot();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Slot ID:</Text>
      <Text style={styles.text}>{slotId}</Text>

      <Text style={styles.label}>Slot Time:</Text>
      <Text style={styles.text}>{slotTime}</Text>

      <Text style={styles.label}>Slot Date:</Text>
      <Text style={styles.text}>{slotDate}</Text>

      <Text style={styles.label}>Number of Hours:</Text>
      <Text style={styles.text}>{numOfHours}</Text>

      {isFuture ? (
        <Button
          title={cancelling ? 'Cancelling...' : 'Cancel Booking'}
          onPress={handleCancel}
          disabled={cancelling}
          style={styles.button}
        />
      ) : (
        <Text style={styles.message}>Cannot cancel past bookings.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
  message: {
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
  },
});

export default CancelPage;
