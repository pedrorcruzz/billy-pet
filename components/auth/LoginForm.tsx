import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Tokens } from '@/constants/Tokens';
import { Text, useThemeColor } from '@/components/Themed';

import { AuthInput } from './AuthInput';
import { PasswordInput } from './PasswordInput';

export interface LoginFormProps {
  onLogin?: (emailOrUser: string, password: string) => void | Promise<void>;
  onGoToSignUp?: () => void;
  /** Mensagem de erro do servidor (ex: credenciais inválidas) */
  serverError?: string;
}

export function LoginForm({
  onLogin,
  onGoToSignUp,
  serverError,
}: LoginFormProps) {
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ emailOrUser?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const tintColor = useThemeColor('tint');
  const onTintColor = useThemeColor('onTint');

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};
    if (!emailOrUser.trim()) newErrors.emailOrUser = 'E-mail ou usuário é obrigatório';
    if (!password) newErrors.password = 'Senha é obrigatória';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await onLogin?.(emailOrUser.trim(), password);
    } catch {
      setErrors({ password: 'E-mail/usuário ou senha inválidos. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  const displayError = serverError || errors.password;

  return (
    <View style={styles.container}>
      <AuthInput
        label="E-mail ou usuário"
        value={emailOrUser}
        onChangeText={(t) => {
          setEmailOrUser(t);
          setErrors((e) => ({ ...e, emailOrUser: undefined }));
        }}
        error={errors.emailOrUser}
        placeholder="Digite seu e-mail ou usuário"
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
        error={displayError}
        placeholder="Digite sua senha"
      />

      <Pressable
        style={[styles.button, { backgroundColor: tintColor }]}
        onPress={handleSubmit}
        disabled={loading}
        accessibilityRole="button"
        accessibilityLabel="Entrar"
      >
        <Text style={[styles.buttonText, { color: onTintColor }]}>{loading ? 'Entrando...' : 'Entrar'}</Text>
      </Pressable>

      {onGoToSignUp ? (
        <Pressable
          style={styles.link}
          onPress={onGoToSignUp}
          accessibilityRole="button"
          accessibilityLabel="Fazer cadastro"
        >
          <Text style={[styles.linkText, { color: tintColor }]}>
            Não tem conta? Fazer cadastro
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
