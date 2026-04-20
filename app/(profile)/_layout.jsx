import { Stack } from 'expo-router';

const ProfileLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" />
      <Stack.Screen name="Edit" />
      <Stack.Screen name="Rewards" />
      <Stack.Screen name="BookedSlots" />
    </Stack>
  );
};

export default ProfileLayout;
