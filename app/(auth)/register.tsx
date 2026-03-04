import { Alert, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";

import { AuthLogo, SignUpForm } from "@/components/auth";
import { useAuth } from "@/hooks/useAuth";
import { Tokens } from "@/constants/Tokens";
import { REGISTER_HINTS } from "@/utils/authUtils";
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
      <AuthLogo marginBottom="md">
        <Pressable
          onPress={showRulesPopup}
          style={styles.rulesIcon}
          accessibilityRole="button"
          accessibilityLabel="Regras para criar cadastro. Toque para ver."
        >
          <Ionicons name="bulb-outline" size={28} color={tintColor} />
        </Pressable>
      </AuthLogo>
      <View style={styles.formContainer}>
        <SignUpForm
          onGoToLogin={() => router.back()}
          onSignUp={async (username, email, password) => {
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

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: Tokens.spacing.lg,
    paddingTop: Tokens.spacing.xl * 2,
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
