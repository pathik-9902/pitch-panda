import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { UserContext } from '../UserContext';
import Icon from 'react-native-vector-icons/Feather'; // Assuming you want to use Feather icons
import { B_URL } from '@env';

const Edit = () => {
  const router = useRouter();
  const { userState, setUserState } = useContext(UserContext);
  const [alert, setAlert] = useState(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({ ...userState });
  const [loading, setLoading] = useState(false);
  const [selectedGender, setSelectedGender] = useState(editedProfile.gender || '');

  useEffect(() => {
    setEditedProfile({ ...userState });
    setSelectedGender(editedProfile.gender || '');
  }, [userState]);

  const handleProfileSave = async () => {
    try {
      setAlert(null);
      setLoading(true);
      const response = await axios.post(`${B_URL}/auth/updateProfile`, editedProfile);
      if (response.data.success) {
        setUserState((prevUserState) => ({ ...prevUserState, ...editedProfile }));
        setEditingProfile(false);
        setAlert({ type: 'success', message: 'Profile updated successfully.' });

        // Reset editedProfile to refresh form fields
        setEditedProfile({ ...userState });
        setSelectedGender(editedProfile.gender || ''); // Reset selected gender if needed

        // Optionally, clear the success message after a few seconds
        setTimeout(() => {
          setAlert(null);
        }, 3000); // 3000 milliseconds (3 seconds)

      } else {
        setAlert({ type: 'error', message: 'Failed to update profile.' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setAlert({ type: 'error', message: 'Error updating profile. Please try again later.' });
    } finally {
      setLoading(false);
    }
  };

  const selectGender = (gender) => {
    setSelectedGender(gender);
    setEditedProfile((prevProfile) => ({ ...prevProfile, gender }));
  };

  const renderGenderButtons = () => (
    <View style={styles.genderButtons}>
      <TouchableOpacity
        style={[styles.genderButton, selectedGender === 'Male' && styles.selectedGenderButton]}
        onPress={() => selectGender('Male')}
      >
        <Text style={styles.genderButtonText}>Male</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.genderButton, selectedGender === 'Female' && styles.selectedGenderButton]}
        onPress={() => selectGender('Female')}
      >
        <Text style={styles.genderButtonText}>Female</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Edit Profile</Text>

        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="First Name"
            value={editedProfile.fname}
            onChangeText={(text) => setEditedProfile((prevProfile) => ({ ...prevProfile, fname: text }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="user" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Last Name"
            value={editedProfile.lname}
            onChangeText={(text) => setEditedProfile((prevProfile) => ({ ...prevProfile, lname: text }))}
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="mail" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={editedProfile.email}
            onChangeText={(text) => setEditedProfile((prevProfile) => ({ ...prevProfile, email: text }))}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputContainer}>
          <Icon name="calendar" size={20} color="#999" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Date of Birth (YYYY-MM-DD)"
            value={editedProfile.dob}
            onChangeText={(text) => setEditedProfile((prevProfile) => ({ ...prevProfile, dob: text }))}
          />
        </View>

        {/* Non-editable fields */}
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>User ID:</Text>
          <Text style={styles.fieldValue}>{userState.userId}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Phone:</Text>
          <Text style={styles.fieldValue}>{userState.phone}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Account Status:</Text>
          <Text style={styles.fieldValue}>{userState.acStat}</Text>
        </View>

        {renderGenderButtons()}

        <TouchableOpacity onPress={handleProfileSave} style={styles.saveButton}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Profile</Text>
          )}
        </TouchableOpacity>
      </View>

      {alert ? (
        <View style={[styles.alert, alert.type === 'error' ? styles.errorAlert : styles.successAlert]}>
          <Text style={styles.alertText}>{alert.message}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  fieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  fieldLabel: {
    flex: 1,
    fontSize: 16,
    color: '#555',
  },
  fieldValue: {
    flex: 2,
    fontSize: 16,
    color: '#333',
  },
  genderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  genderButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '48%',
  },
  selectedGenderButton: {
    backgroundColor: '#0056b3',
  },
  genderButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  saveButton: {
    backgroundColor: '#28a745',
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  alert: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  alertText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  errorAlert: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
  },
  successAlert: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    borderWidth: 1,
  },
});

export default Edit;
