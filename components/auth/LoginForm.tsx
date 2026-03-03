import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from '@/components/Button';
import { Tokens } from '@/constants/Tokens';
import { useDebouncedValidation } from '@/hooks/useDebouncedValidation';
import {
  validateEmailOrUser,
  validatePasswordRequired,
} from '@/utils/authUtils';

import { AuthInput } from './AuthInput';

export interface LoginFormProps {
  onLogin?: (emailOrUser: string, password: string) => void | Promise<void>;
  onForgotPassword?: () => void;
  serverError?: string;
}

export function LoginForm({
  onLogin,
  onForgotPassword,
  serverError,
}: LoginFormProps) {
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ emailOrUser?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const debouncedValidate = useDebouncedValidation(500);

  const setError = (key: keyof typeof errors, err?: string) => {
    setErrors((e) => ({ ...e, [key]: err }));
  };

  const handleSubmit = async () => {
    const newErrors: typeof errors = {};
    const emailErr = validateEmailOrUser(emailOrUser);
    const pwdErr = validatePasswordRequired(password);
    if (emailErr) newErrors.emailOrUser = emailErr;
    if (pwdErr) newErrors.password = pwdErr;

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
        labelIcon="person"
        type="text"
        value={emailOrUser}
        onChangeText={(t) => {
          setEmailOrUser(t);
          setErrors((e) => ({ ...e, emailOrUser: undefined }));
          debouncedValidate('emailOrUser', t, validateEmailOrUser, (err) =>
            setError('emailOrUser', err)
          );
        }}
        error={errors.emailOrUser}
        placeholder="Digite seu e-mail ou usuário"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />

      <AuthInput
        label="Senha"
        labelIcon="lock-closed"
        type="password"
        value={password}
        onChangeText={(t) => {
          setPassword(t);
          setErrors((e) => ({ ...e, password: undefined }));
          debouncedValidate('password', t, validatePasswordRequired, (err) =>
            setError('password', err)
          );
        }}
        error={displayError}
        placeholder="Digite sua senha"
        trailingLink={
          onForgotPassword
            ? { text: 'Esqueceu?', onPress: onForgotPassword }
            : undefined
        }
      />

      <View style={styles.buttonWrapper}>
        <Button
          title={loading ? 'Entrando...' : 'Entrar'}
          onPress={handleSubmit}
          disabled={loading}
          accessibilityLabel="Entrar"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  buttonWrapper: {
    marginBottom: Tokens.spacing.md,
  },
});
