import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AuthInput, AuthLogo } from "@/components/auth";
import { Button } from "@/components/Button";
import { Text, useThemeColor } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Tokens } from "@/constants/Tokens";
import { useDebouncedValidation } from "@/hooks/useDebouncedValidation";
import { validateEmail } from "@/utils/authUtils";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);

  const debouncedValidate = useDebouncedValidation(500);

  const tintColor = useThemeColor("tint");
  const onTintColor = useThemeColor("onTint");
  const hintColor = useThemeColor("hint");
  const backgroundColor = useThemeColor("background");

  const handleSubmit = async () => {
    const error = validateEmail(email);
    if (error) {
      setEmailError(error);
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setSuccessVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSuccessVisible(false);
    router.replace("/(auth)/login");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.flex, { backgroundColor }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar para tela anterior"
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={28} color={tintColor} />
        </Pressable>

        <AuthLogo marginBottom="lg" />

        <View style={styles.content}>
          <Text style={styles.title}>Esqueceu sua senha?</Text>
          <Text style={[styles.subtitle, { color: hintColor }]}>
            Não se preocupe! Informe o e-mail cadastrado na sua conta e
            enviaremos as instruções para redefinir sua senha.
          </Text>

          <View style={styles.formWrapper}>
            <AuthInput
              label="E-mail"
              labelIcon="mail"
              type="text"
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                setEmailError(undefined);
                debouncedValidate("email", t, validateEmail, (err) =>
                  setEmailError(err ?? undefined),
                );
              }}
              error={emailError}
              placeholder="Digite seu e-mail"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />

            <Button
              title="Enviar instruções"
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              accessibilityLabel="Enviar instruções de recuperação de senha"
            />
          </View>

          <Pressable
            style={styles.backLink}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Voltar para o login"
          >
            <Ionicons name="chevron-back" size={18} color={tintColor} />
            <Text style={[styles.backLinkText, { color: tintColor }]}>
              Voltar para o login
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <Modal
        visible={successVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor }]}>
            <View style={[styles.modalIconCircle, { backgroundColor: tintColor }]}>
              <Ionicons name="mail-open" size={40} color={onTintColor} />
            </View>
            <Text style={styles.modalTitle}>E-mail enviado!</Text>
            <Text style={[styles.modalMessage, { color: hintColor }]}>
              Verifique sua caixa de entrada em{"\n"}
              <Text style={styles.modalEmail}>{email}</Text>
              {"\n"}para concluir a recuperação da senha.
            </Text>
            <View style={styles.modalButton}>
              <Button
                title="Entendi"
                onPress={handleCloseModal}
                accessibilityLabel="Fechar e voltar para o login"
              />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Tokens.spacing.lg,
    paddingTop: Tokens.spacing.xl * 2,
    paddingBottom: Tokens.spacing.xl,
  },
  backButton: {
    width: Tokens.touchTarget,
    height: Tokens.touchTarget,
    justifyContent: "center",
    alignItems: "flex-start",
    marginBottom: Tokens.spacing.sm,
  },
  content: {
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  title: {
    fontSize: Tokens.typography.h1,
    fontWeight: Tokens.typography.fontWeight.bold,
    marginBottom: Tokens.spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: Tokens.typography.body,
    textAlign: "center",
    marginBottom: Tokens.spacing.xl,
    lineHeight: 22,
  },
  formWrapper: {
    width: "100%",
    marginBottom: Tokens.spacing.lg,
  },
  backLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Tokens.spacing.md,
  },
  backLinkText: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.light.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Tokens.spacing.lg,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: Tokens.radius.lg,
    padding: Tokens.spacing.lg,
    alignItems: "center",
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  modalIconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Tokens.spacing.md,
    marginTop: Tokens.spacing.sm,
  },
  modalTitle: {
    fontSize: Tokens.typography.h2,
    fontWeight: Tokens.typography.fontWeight.bold,
    marginBottom: Tokens.spacing.sm,
    textAlign: "center",
  },
  modalMessage: {
    fontSize: Tokens.typography.body,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Tokens.spacing.lg,
  },
  modalEmail: {
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  modalButton: {
    width: "100%",
  },
});
