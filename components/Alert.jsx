import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Make sure you have react-native-vector-icons installed

const Alert = ({ type, message }) => {
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity: 0

  useEffect(() => {
    if (message) {
      fadeIn();
      const timer = setTimeout(() => {
        fadeOut();
      }, 2000); // Hide the alert after 2 seconds

      return () => {
        clearTimeout(timer);
      };
    }
  }, [message]);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Fade in duration
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500, // Fade out duration
      useNativeDriver: true,
    }).start();
  };

  let alertStyle = styles.alert;
  let icon = null;
  if (type === 'success') {
    alertStyle = { ...alertStyle, backgroundColor: '#28a745' };
    icon = <MaterialIcons name="check-circle" size={24} color="white" />;
  } else if (type === 'warning') {
    alertStyle = { ...alertStyle, backgroundColor: '#ffc107' };
    icon = <MaterialIcons name="warning" size={24} color="white" />;
  } else if (type === 'error') {
    alertStyle = { ...alertStyle, backgroundColor: '#dc3545' };
    icon = <MaterialIcons name="error" size={24} color="white" />;
  }

  return (
    <Animated.View style={[alertStyle, { opacity: fadeAnim }]}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  alert: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 10,
  },
  message: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Alert;
