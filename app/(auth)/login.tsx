import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { LoginForm, SocialLoginButtons } from "@/components/auth";
import { Text, useThemeColor } from "@/components/Themed";
import { useAuth } from "@/hooks/useAuth";
import { Tokens } from "@/constants/Tokens";

export default function LoginScreen() {
  const { login } = useAuth();
  const lineColor = useThemeColor("inputBorder");
  const textColor = useThemeColor("hint");
  const tintColor = useThemeColor("tint");

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
        <LoginForm
          onForgotPassword={() => router.push("/(auth)/forgot-password")}
          onLogin={async (emailOrUser, password) => {
            const success = login(emailOrUser, password);
            if (success) {
              router.replace("/(tabs)");
            } else {
              throw new Error("Credenciais inválidas");
            }
          }}
        />

        <View style={styles.dividerRow}>
          <View style={[styles.dividerLine, { backgroundColor: lineColor }]} />
          <Text style={[styles.dividerText, { color: textColor }]}>OU</Text>
          <View style={[styles.dividerLine, { backgroundColor: lineColor }]} />
        </View>

        <SocialLoginButtons />
      </View>

      <View style={styles.footer}>
        <Pressable
          style={styles.signUpLink}
          onPress={() => router.push("/(auth)/register")}
          accessibilityRole="button"
          accessibilityLabel="Fazer cadastro"
        >
          <Text style={[styles.signUpLinkText, { color: tintColor }]}>
            Não tem conta? Fazer cadastro
          </Text>
        </Pressable>
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
    justifyContent: "space-between",
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
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: Tokens.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.semibold,
    paddingHorizontal: Tokens.spacing.md,
  },
  footer: {
    alignItems: "center",
    paddingTop: Tokens.spacing.md,
  },
  signUpLink: {
    paddingVertical: Tokens.spacing.sm,
  },
  signUpLinkText: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
});
