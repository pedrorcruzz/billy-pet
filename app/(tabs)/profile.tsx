import { Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";

import { Text, View, useThemeColor } from "@/components/Themed";
import { useAuth } from "@/contexts/AuthContext";
import { Tokens } from "@/constants/Tokens";

export default function ProfileScreen() {
  const { logout } = useAuth();
  const tintColor = useThemeColor("tint");
  const onTintColor = useThemeColor("onTint");

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Pressable
        style={[styles.button, { backgroundColor: tintColor }]}
        onPress={handleLogout}
        accessibilityRole="button"
        accessibilityLabel="Sair da conta"
      >
        <Text style={[styles.buttonText, { color: onTintColor }]}>Sair</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Tokens.spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    minHeight: Tokens.touchTarget,
    minWidth: 120,
    borderRadius: Tokens.radius.sm,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Tokens.spacing.lg,
  },
  buttonText: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
});
