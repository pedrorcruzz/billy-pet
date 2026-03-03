import { Image, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { SignUpForm } from "@/components/auth";
import { useAuth } from "@/contexts/AuthContext";
import { Tokens } from "@/constants/Tokens";

export default function RegisterScreen() {
  const { login } = useAuth();

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
    marginBottom: Tokens.spacing.xl,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  formContainer: {
    flex: 1,
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
});
