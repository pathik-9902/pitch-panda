import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

const AuthLayout = () => {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" />
        <Stack.Screen name="Register" />
        <Stack.Screen name="CitySelect" />
      </Stack>
      <StatusBar backgroundColor='#161622' barStyle='light-content' />
    </>
  );
};

export default AuthLayout;
