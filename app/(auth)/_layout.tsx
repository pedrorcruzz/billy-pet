import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AuthLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ title: "Entrar" }} />
        <Stack.Screen name="register" options={{ title: "Cadastro" }} />
        <Stack.Screen name="forgot-password" options={{ title: "Recuperar senha" }} />
      </Stack>
    </>
  );
}
