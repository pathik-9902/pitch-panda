import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Alert from '../../components/Alert'; // Assuming you have a custom Alert component
import { B_URL } from '@env';
import { UserContext } from '../UserContext';
import DateTimePicker from '@react-native-community/datetimepicker';

const Register = () => {
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const { setUserState } = useContext(UserContext);
  const [formResp, setFormResp] = useState({});
  const [user, setUserDetails] = useState({
    username: '',
    fname: '',
    lname: '',
    email: '',
    acStat: 'active',
    phone: phone || '',
    dob: '',
    gender: '',
  });

  const [alert, setAlert] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validateForm = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    const usernameRegex = /^[a-z][a-z0-9_.]*$/;

    if (!values.username) errors.username = 'Username is required';
    else if (!usernameRegex.test(values.username)) errors.username = 'Invalid format';
    
    if (!values.fname) errors.fname = 'First Name required';
    if (!values.email) errors.email = 'Email required';
    else if (!regex.test(values.email)) errors.email = 'Invalid email';
    
    if (!values.dob) errors.dob = 'DOB required';
    if (!values.gender) errors.gender = 'Gender required';
    
    return errors;
  };

  const signupHandler = async () => {
    try {
      setIsSubmitting(true);
      const errors = validateForm(user);
      setFormResp(errors);

      if (Object.keys(errors).length === 0) {
        await axios.post(`${B_URL}/auth/signup`, user);
        const loginResponse = await axios.post(`${B_URL}/auth/login`, { phone: user.phone });
        setUserState(loginResponse.data.user);
        router.replace('/(auth)/CitySelect');
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Registration failed. Try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Join Pitch Panda</Text>
      <Text style={styles.subtitle}>Complete your profile to get started</Text>
      
      {alert.message ? <Alert type={alert.type} message={alert.message} /> : null}

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={[styles.input, formResp.username && styles.inputError]}
            placeholder="johndoe_123"
            onChangeText={(text) => setUserDetails({ ...user, username: text.toLowerCase() })}
            value={user.username}
            autoCapitalize="none"
          />
          {formResp.username && <Text style={styles.errorText}>{formResp.username}</Text>}
        </View>

        <View style={styles.row}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={[styles.input, formResp.fname && styles.inputError]}
              placeholder="John"
              onChangeText={(text) => setUserDetails({ ...user, fname: text })}
              value={user.fname}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Doe"
              onChangeText={(text) => setUserDetails({ ...user, lname: text })}
              value={user.lname}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={[styles.input, formResp.email && styles.inputError]}
            placeholder="john@example.com"
            onChangeText={(text) => setUserDetails({ ...user, email: text })}
            value={user.email}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
             <Text style={user.dob ? styles.dateText : styles.placeholderText}>
               {user.dob || 'Select Date'}
             </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={new Date()}
              mode="date"
              display="default"
              onChange={(event, date) => {
                setShowDatePicker(false);
                if (date) setUserDetails({ ...user, dob: date.toISOString().split('T')[0] });
              }}
            />
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderRow}>
            {['male', 'female', 'other'].map((g) => (
              <TouchableOpacity
                key={g}
                style={[styles.genderBtn, user.gender === g && styles.genderBtnActive]}
                onPress={() => setUserDetails({ ...user, gender: g })}
              >
                <Text style={[styles.genderBtnText, user.gender === g && styles.genderBtnTextActive]}>
                  {g.charAt(0).toUpperCase() + g.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.submitBtn, isSubmitting && { opacity: 0.7 }]} 
          onPress={signupHandler}
          disabled={isSubmitting}
        >
          <Text style={styles.submitBtnText}>{isSubmitting ? 'Creating account...' : 'Create Account'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 8,
    marginBottom: 32,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1E293B',
  },
  inputError: {
    borderColor: '#EF4444',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginLeft: 4,
  },
  dateButton: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#1E293B',
  },
  placeholderText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 12,
  },
  genderBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  genderBtnActive: {
    backgroundColor: '#5AB25E',
    borderColor: '#5AB25E',
  },
  genderBtnText: {
    fontWeight: '600',
    color: '#64748B',
  },
  genderBtnTextActive: {
    color: '#FFF',
  },
  submitBtn: {
    backgroundColor: '#5AB25E',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#5AB25E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 4,
    elevation: 4,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default Register;
