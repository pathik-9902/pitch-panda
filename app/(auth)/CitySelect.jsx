import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { UserContext } from '../UserContext';
import axios from 'axios';
import { B_URL } from '@env';
import CustomAlert from '../../components/CustomAlert';
import Ionicons from 'react-native-vector-icons/Ionicons';

const cities = [
  { label: 'Ahmedabad, Gujarat', value: 'Ahmedabad, Gujarat' },
  { label: 'Surat, Gujarat', value: 'Surat, Gujarat' },
  { label: 'Vadodara, Gujarat', value: 'Vadodara, Gujarat' },
  { label: 'Rajkot, Gujarat', value: 'Rajkot, Gujarat' },
  { label: 'Bhavnagar, Gujarat', value: 'Bhavnagar, Gujarat' },
  { label: 'Jamnagar, Gujarat', value: 'Jamnagar, Gujarat' },
  { label: 'Gandhinagar, Gujarat', value: 'Gandhinagar, Gujarat' },
  { label: 'Junagadh, Gujarat', value: 'Junagadh, Gujarat' },
  { label: 'Gandhidham, Gujarat', value: 'Gandhidham, Gujarat' },
  { label: 'Anand, Gujarat', value: 'Anand, Gujarat' }
];
const CitySelect = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const { userState, updateUserLocation } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('');

  const handleUpdateLocation = async (city) => {
    setLoading(true);
    try {
      await updateUserLocation(city);
      
      setAlertTitle('Success');
      setAlertMessage(`City updated to ${city}`);
      setAlertVisible(true);
    } catch (error) {
      console.error('Failed to update city:', error);
      setAlertTitle('Error');
      setAlertMessage('Could not update your location preference.');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select City</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Where are you looking for a pitch?</Text>
        
        <View style={styles.grid}>
          {cities.map((city) => (
            <TouchableOpacity
              key={city.value}
              onPress={() => handleUpdateLocation(city.value)}
              style={[styles.cityCard, userState.location === city.value && styles.cityCardActive]}
            >
              <View style={[styles.cityIcon, userState.location === city.value && styles.cityIconActive]}>
                <Ionicons 
                  name="location" 
                  size={20} 
                  color={userState.location === city.value ? '#FFF' : '#64748B'} 
                />
              </View>
              <Text style={[styles.cityName, userState.location === city.value && styles.cityNameActive]}>
                {city.label.split(',')[0]}
              </Text>
              <Text style={styles.cityState}>{city.label.split(',')[1]}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5AB25E" />
        </View>
      )}

      <CustomAlert
        visible={alertVisible}
        type={alertTitle.toLowerCase()}
        heading={alertTitle}
        message={alertMessage}
        onClose={() => {
          setAlertVisible(false);
          if (alertTitle === 'Success') {
            router.replace('/(tabs)');
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF',
  },
  backBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
    marginLeft: 16,
  },
  content: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 32,
    lineHeight: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  cityCard: {
    width: '47%',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#F1F5F9',
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  cityCardActive: {
    borderColor: '#5AB25E',
    backgroundColor: '#F0FDF4',
  },
  cityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cityIconActive: {
    backgroundColor: '#5AB25E',
  },
  cityName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  cityNameActive: {
    color: '#166534',
  },
  cityState: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  }
});

export default CitySelect;
