import { Stack } from 'expo-router';

const BookLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Turfs" />
      <Stack.Screen name="Slot" />
      <Stack.Screen name="BookForm" />
      <Stack.Screen name="SlotByDate" />
      <Stack.Screen name="Payments" />
      <Stack.Screen name="TurfDetails" />
    </Stack>
  );
};

export default BookLayout;
