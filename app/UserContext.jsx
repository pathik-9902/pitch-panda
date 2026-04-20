import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { B_URL } from '@env';

// Create the context
export const UserContext = createContext();

// Create the provider
export const UserProvider = ({ children }) => {
  const [userState, setUserState] = useState({
    userId: '',
    username: '',
    email: '',
    location: '', 
    pgCoins: 0,
  });

  const updateUserLocation = async (newLocation) => {
    try {
      // 1. Update state immediately for UI responsiveness
      setUserState(prev => ({ ...prev, location: newLocation }));
      
      // 2. Persist to AsyncStorage
      const storedUser = await AsyncStorage.getItem('userState');
      const currentUser = storedUser ? JSON.parse(storedUser) : userState;
      const updatedUser = { ...currentUser, location: newLocation };
      await AsyncStorage.setItem('userState', JSON.stringify(updatedUser));
      
      // 3. Sync with backend if logged in
      if (currentUser.userId) {
        await axios.post(`${B_URL}/auth/updateCity/${currentUser.userId}`, {
          location: newLocation
        });
      }
    } catch (error) {
      console.error('Failed to update location:', error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      try {
        const authToken = await AsyncStorage.getItem('authToken');
        const storedUser = await AsyncStorage.getItem('userState');
        
        let currentState = { ...userState };
        
        if (storedUser) {
          currentState = { ...currentState, ...JSON.parse(storedUser) };
        }
        
        if (authToken) {
          currentState = { ...currentState, token: authToken };
        }
        
        setUserState(currentState);
      } catch (error) {
        console.error('Failed to load user:', error);
      }
    };

    loadUser();
  }, []);

  // Sync state changes with AsyncStorage
  useEffect(() => {
    const saveState = async () => {
      if (userState.userId) {
        try {
          await AsyncStorage.setItem('userState', JSON.stringify(userState));
        } catch (error) {
          console.error('Failed to auto-save user state:', error);
        }
      }
    };
    saveState();
  }, [userState]);

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userState');
    setUserState({
      userId: '',
      username: '',
      email: '',
      location: '',
    });
  };

  return (
    <UserContext.Provider value={{ userState, updateUserLocation, setUserState, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Add a default export
export default UserProvider;
