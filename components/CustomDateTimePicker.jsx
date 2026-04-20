// CustomDateTimePicker.js

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const CustomDateTimePicker = ({ mode, isVisible, onConfirm, onCancel }) => {
  const [date, setDate] = useState(new Date());

  const handleChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    if (selectedTime) {
      const selectedDateTime = new Date(date);
      selectedDateTime.setHours(selectedTime.getHours());
      // Smart rounding to nearest 30 mins
      const mins = selectedTime.getMinutes();
      const roundedMins = Math.round(mins / 30) * 30;
      if (roundedMins === 60) {
        selectedDateTime.setHours(selectedTime.getHours() + 1);
        selectedDateTime.setMinutes(0);
      } else {
        selectedDateTime.setMinutes(roundedMins);
      }
      setDate(selectedDateTime);
    }
  };

  const handleConfirm = () => {
    onConfirm(date);
    onCancel();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onCancel}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Select {mode === 'date' ? 'Date' : 'Time'}</Text>
          <Text style={styles.modalSubtitle}>
            {mode === 'time' ? 'Slots are available in 30-min increments' : 'Pick your matching day'}
          </Text>
          
          <View style={styles.pickerContainer}>
            <DateTimePicker
              value={date}
              mode={mode}
              is24Hour={true}
              minuteInterval={30}
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={mode === 'time' ? handleTimeChange : handleChange}
              textColor="#1E293B"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm} style={styles.confirmBtn}>
              <Text style={styles.confirmBtnText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 24,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 20,
    fontWeight: '500',
  },
  pickerContainer: {
    width: '100%',
    paddingVertical: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginTop: 24,
  },
  cancelBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '700',
  },
  confirmBtn: {
    flex: 2,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5AB25E',
  },
  confirmBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CustomDateTimePicker;
