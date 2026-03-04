import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Button } from "@/components/Button";
import { Text, useThemeColor } from "@/components/Themed";
import { Tokens } from "@/constants/Tokens";
import { useDebouncedValidation } from "@/hooks/useDebouncedValidation";
import {
  validateUsername,
  validatePassword,
  validateEmail,
  validateConfirmPassword,
} from "@/utils/authUtils";

import { AuthInput } from "./AuthInput";
import { SocialLoginButtons } from "./SocialLoginButtons";

export interface SignUpFormProps {
  onSignUp?: (
    username: string,
    email: string,
    password: string,
  ) => void | Promise<void>;
  onGoToLogin?: () => void;
  serverError?: string;
  onGooglePress?: () => void;
  onApplePress?: () => void;
  onFacebookPress?: () => void;
}

export function SignUpForm({
  onSignUp,
  onGoToLogin,
  serverError,
  onGooglePress,
  onApplePress,
  onFacebookPress,
}: SignUpFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const debouncedValidate = useDebouncedValidation(500);

  const setError = (key: keyof typeof errors, err?: string) => {
    setErrors((e) => ({ ...e, [key]: err }));
  };

  const tintColor = useThemeColor("tint");
  const errorColor = useThemeColor("error");
  const hintColor = useThemeColor("hint");
  const lineColor = useThemeColor("inputBorder");

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};
    const usernameErr = validateUsername(username);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    newErrors.username = usernameErr ?? undefined;
    newErrors.email = emailErr ?? undefined;
    newErrors.password = passwordErr ?? undefined;

    const confirmErr = !confirmPassword
      ? "Confirme sua senha"
      : validateConfirmPassword(password, confirmPassword);
    newErrors.confirmPassword = confirmErr ?? undefined;

    const cleanErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([, v]) => v != null),
    ) as typeof errors;

    setErrors(cleanErrors);
    if (Object.keys(cleanErrors).length > 0) return;

    setLoading(true);
    try {
      await onSignUp?.(username.trim(), email.trim(), password);
    } catch {
      setErrors((e) => ({
        ...e,
        password: serverError || "Erro ao cadastrar. Tente novamente.",
      }));
    } finally {
      setLoading(false);
    }
  };

  const displayError =
    serverError && !errors.password ? serverError : undefined;

  return (
    <View style={styles.container}>
      <AuthInput
        label="Usuário"
        labelIcon="person"
        type="text"
        value={username}
        required
        onChangeText={(t) => {
          setUsername(t);
          setErrors((e) => ({ ...e, username: undefined }));
          debouncedValidate("username", t, validateUsername, (err) =>
            setError("username", err),
          );
        }}
        error={errors.username}
        placeholder="Seu usuário"
        autoCapitalize="none"
      />

      <AuthInput
        label="E-mail"
        labelIcon="mail"
        type="text"
        value={email}
        required
        onChangeText={(t) => {
          setEmail(t);
          setErrors((e) => ({ ...e, email: undefined }));
          debouncedValidate("email", t, validateEmail, (err) =>
            setError("email", err),
          );
        }}
        error={errors.email}
        placeholder="seu@email.com"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />

      <AuthInput
        label="Senha"
        labelIcon="lock-closed"
        type="password"
        value={password}
        required
        onChangeText={(t) => {
          setPassword(t);
          setErrors((e) => ({ ...e, password: undefined }));
          debouncedValidate("password", t, validatePassword, (err) =>
            setError("password", err),
          );
          debouncedValidate(
            "confirmPassword",
            confirmPassword,
            (v) => validateConfirmPassword(t, v),
            (err) => setError("confirmPassword", err),
          );
        }}
        error={errors.password}
        placeholder="Crie uma senha"
      />

      <AuthInput
        label="Confirmar senha"
        labelIcon="lock-closed"
        type="password"
        value={confirmPassword}
        required
        onChangeText={(t) => {
          setConfirmPassword(t);
          setErrors((e) => ({ ...e, confirmPassword: undefined }));
          debouncedValidate(
            "confirmPassword",
            t,
            (v) => validateConfirmPassword(password, v),
            (err) => setError("confirmPassword", err),
          );
        }}
        error={errors.confirmPassword}
        placeholder="Confirme sua senha"
      />

      {displayError ? (
        <Text style={[styles.serverError, { color: errorColor }]}>
          {displayError}
        </Text>
      ) : null}

      <View style={styles.buttonWrapper}>
        <Button
          title={loading ? "Cadastrando..." : "Cadastrar"}
          onPress={handleSubmit}
          disabled={loading}
          accessibilityLabel="Cadastrar"
        />
      </View>

      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, { backgroundColor: lineColor }]} />
        <Text style={[styles.dividerText, { color: hintColor }]}>OU</Text>
        <View style={[styles.dividerLine, { backgroundColor: lineColor }]} />
      </View>

      <SocialLoginButtons
        onGooglePress={onGooglePress}
        onApplePress={onApplePress}
        onFacebookPress={onFacebookPress}
      />

      {onGoToLogin ? (
        <Pressable
          style={styles.link}
          onPress={onGoToLogin}
          accessibilityRole="button"
          accessibilityLabel="Já tenho conta, fazer login"
        >
          <Text style={[styles.linkText, { color: tintColor }]}>
            Já tem conta? Fazer login
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  serverError: {
    fontSize: Tokens.typography.body,
    marginBottom: Tokens.spacing.md,
  },
  buttonWrapper: {
    marginTop: Tokens.spacing.sm,
    marginBottom: Tokens.spacing.md,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Tokens.spacing.lg,
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
  link: {
    minHeight: Tokens.touchTarget,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Tokens.spacing.md,
  },
  linkText: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
});
