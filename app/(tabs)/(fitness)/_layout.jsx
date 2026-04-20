import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import Fitness from './Fitness';
import CancelPage from '../../(profile)/CancelPage';

const Stack = createStackNavigator();

const FitnessLayout = () => (
  <View style={styles.container}>
    <Stack.Navigator initialRouteName="Fitness">
      <Stack.Screen name="Fitness" component={Fitness} options={{ headerShown: false }}/>
      <Stack.Screen name="CancelPage" component={CancelPage} options={{ headerShown: false }} />
    </Stack.Navigator>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 5,
  },
});

export default FitnessLayout;
