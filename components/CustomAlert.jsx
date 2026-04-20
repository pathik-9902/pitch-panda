import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';

const CustomAlert = ({ type, heading, message, visible, onClose }) => {
  let alertStyle, headingStyle;

  switch (type) {
    case 'success':
      alertStyle = styles.successAlert;
      headingStyle = styles.successHeading;
      break;
    case 'error':
      alertStyle = styles.errorAlert;
      headingStyle = styles.errorHeading;
      break;
    case 'alert':
    default:
      alertStyle = styles.alertAlert;
      headingStyle = styles.alertHeading;
      break;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.alertContainer, alertStyle]}>
          <Text style={[styles.heading, headingStyle]}>{heading}</Text>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
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
    backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent background
  },
  alertContainer: {
    padding: 20,
    borderRadius: 10,
    width: '80%',
    backgroundColor: '#FFF', // white background for alert
  },
  successAlert: {
    backgroundColor: '#4CAF50', // green
  },
  errorAlert: {
    backgroundColor: '#f44336', // red
  },
  alertAlert: {
    backgroundColor: '#ffeb3b', // yellow
  },
  heading: {
    fontWeight: 'bold',
    marginBottom: 10,
    fontSize: 18,
  },
  successHeading: {
    color: '#FFF', // white text for contrast
  },
  errorHeading: {
    color: '#FFF', // white text for contrast
  },
  alertHeading: {
    color: '#333', // dark text for contrast
  },
  message: {
    color: '#333', // dark text for contrast
    marginBottom: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 10,
  },
  closeButtonText: {
    color: '#333', // dark text for close button
    fontWeight: 'bold',
  },
});

export default CustomAlert;
