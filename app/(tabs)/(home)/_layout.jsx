import { Stack } from 'expo-router';

const HomeLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" />
      <Stack.Screen name="Tournament" />
    </Stack>
  );
};

export default HomeLayout;
