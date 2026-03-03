import { Alert, Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

import { SignUpForm } from "@/components/auth";
import { useAuth } from "@/hooks/useAuth";
import { Tokens } from "@/constants/Tokens";
import { REGISTER_HINTS } from "@/services/auth/validationService";
import { useThemeColor } from "@/components/Themed";

const REGISTER_RULES_MESSAGE = [
  `• ${REGISTER_HINTS.username}`,
  `• ${REGISTER_HINTS.email}`,
  `• ${REGISTER_HINTS.password}`,
].join("\n");

export default function RegisterScreen() {
  const { login } = useAuth();
  const tintColor = useThemeColor("tint");

  const showRulesPopup = () => {
    Alert.alert("Regras para criar cadastro", REGISTER_RULES_MESSAGE, [
      { text: "Entendi" },
    ]);
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.logoContainer}>
        <Image
          source={require("@/assets/images/splash-icon.png")}
          style={styles.logo}
          resizeMode="contain"
          accessibilityLabel="Logo Billy Pet"
        />
        <Pressable
          onPress={showRulesPopup}
          style={styles.rulesIcon}
          accessibilityRole="button"
          accessibilityLabel="Regras para criar cadastro. Toque para ver."
        >
          <Ionicons name="bulb-outline" size={28} color={tintColor} />
        </Pressable>
      </View>
      <View style={styles.formContainer}>
        <SignUpForm
          onGoToLogin={() => router.back()}
          onSignUp={async (username, email, password) => {
            // Mock: cadastro bem-sucedido → faz login automaticamente
            const success = login(email, password);
            if (success) {
              router.replace("/(tabs)");
            } else {
              throw new Error("Erro ao cadastrar. Tente novamente.");
            }
          }}
        />
      </View>
    </ScrollView>
  );
}

const LOGO_SIZE = 160;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: Tokens.spacing.lg,
    paddingTop: Tokens.spacing.xl * 2,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: Tokens.spacing.md,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  rulesIcon: {
    marginTop: Tokens.spacing.sm,
    minWidth: Tokens.touchTarget,
    minHeight: Tokens.touchTarget,
    justifyContent: "center",
    alignItems: "center",
  },
  formContainer: {
    flex: 1,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
});
