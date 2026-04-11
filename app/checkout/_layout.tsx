import { Stack } from "expo-router";

export default function CheckoutLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="pix" />
      <Stack.Screen name="new-card" />
      <Stack.Screen
        name="processing"
        options={{ animation: "fade", gestureEnabled: false }}
      />
    </Stack>
  );
}
