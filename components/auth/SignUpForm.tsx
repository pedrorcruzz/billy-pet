import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Tokens } from '@/constants/Tokens';
import { Text, useThemeColor } from '@/components/Themed';
import {
  validateUsername,
  validatePassword,
  validateEmail,
} from '@/utils/auth/authUtils';

import { AuthInput } from './AuthInput';
import { AuthHintBox } from './AuthHintBox';
import { PasswordInput } from './PasswordInput';

export interface SignUpFormProps {
  onSignUp?: (username: string, email: string, password: string) => void | Promise<void>;
  onGoToLogin?: () => void;
  /** Mensagem de erro do servidor */
  serverError?: string;
}

export function SignUpForm({
  onSignUp,
  onGoToLogin,
  serverError,
}: SignUpFormProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  const tintColor = useThemeColor('tint');
  const onTintColor = useThemeColor('onTint');
  const errorColor = useThemeColor('error');

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};
    newErrors.username = validateUsername(username);
    newErrors.email = validateEmail(email);
    newErrors.password = validatePassword(password);

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não conferem';
    } else if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirme sua senha';
    }

    const cleanErrors = Object.fromEntries(
      Object.entries(newErrors).filter(([, v]) => v != null)
    ) as typeof errors;

    setErrors(cleanErrors);
    if (Object.keys(cleanErrors).length > 0) return;

    setLoading(true);
    try {
      await onSignUp?.(username.trim(), email.trim(), password);
    } catch {
      setErrors((e) => ({
        ...e,
        password: serverError || 'Erro ao cadastrar. Tente novamente.',
      }));
    } finally {
      setLoading(false);
    }
  };

  const displayError = serverError && !errors.password ? serverError : undefined;

  return (
    <View style={styles.container}>
      <AuthHintBox type="both" />

      <AuthInput
        label="Usuário"
        value={username}
        onChangeText={(t) => {
          setUsername(t);
          setErrors((e) => ({ ...e, username: undefined }));
        }}
        error={errors.username}
        placeholder="Ex: nick_nick ou nickNick"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <AuthInput
        label="E-mail"
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          setErrors((e) => ({ ...e, email: undefined }));
        }}
        error={errors.email}
        placeholder="seu@email.com"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />

      <PasswordInput
        label="Senha"
        value={password}
        onChangeText={(t) => {
          setPassword(t);
          setErrors((e) => ({ ...e, password: undefined }));
        }}
        error={errors.password}
        placeholder="Crie uma senha"
      />

      <PasswordInput
        label="Confirmar senha"
        value={confirmPassword}
        onChangeText={(t) => {
          setConfirmPassword(t);
          setErrors((e) => ({ ...e, confirmPassword: undefined }));
        }}
        error={errors.confirmPassword}
        placeholder="Repita a senha"
      />

      {displayError ? (
        <Text style={[styles.serverError, { color: errorColor }]}>{displayError}</Text>
      ) : null}

      <Pressable
        style={[styles.button, { backgroundColor: tintColor }]}
        onPress={handleSubmit}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Cadastrar"
      >
        <Text style={[styles.buttonText, { color: onTintColor }]}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </Text>
      </Pressable>

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
    width: '100%',
  },
  serverError: {
    fontSize: Tokens.typography.body,
    marginBottom: Tokens.spacing.md,
  },
  button: {
    minHeight: Tokens.touchTarget,
    borderRadius: Tokens.radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Tokens.spacing.sm,
    marginBottom: Tokens.spacing.md,
  },
  buttonText: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  link: {
    minHeight: Tokens.touchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
});
