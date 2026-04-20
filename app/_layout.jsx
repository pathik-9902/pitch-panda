import { Stack } from 'expo-router';
import { UserProvider } from './UserContext';

const RootLayout = () => {
  return (
    <UserProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(profile)" />
      </Stack>
    </UserProvider>
  );
};

export default RootLayout;
