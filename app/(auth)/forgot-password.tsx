import { ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";

import { Button } from "@/components/Button";
import { Text } from "@/components/Themed";
import { Tokens } from "@/constants/Tokens";

export default function ForgotPasswordScreen() {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.content}>
        <Text style={styles.title}>Esqueci minha senha</Text>
        <Text style={styles.subtitle}>
          Em breve você poderá recuperar sua senha por e-mail.
        </Text>
        <Button
          title="Voltar ao login"
          onPress={() => router.back()}
          accessibilityLabel="Voltar ao login"
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
  content: {
    maxWidth: 400,
    alignSelf: "center",
    width: "100%",
  },
  title: {
    fontSize: Tokens.typography.h2,
    fontWeight: Tokens.typography.fontWeight.bold,
    marginBottom: Tokens.spacing.md,
  },
  subtitle: {
    fontSize: Tokens.typography.body,
    marginBottom: Tokens.spacing.xl,
  },
});
