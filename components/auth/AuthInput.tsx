import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Tokens } from '@/constants/Tokens';
import { Text, useThemeColor } from '@/components/Themed';

export type AuthInputLabelIcon = 'person' | 'lock-closed';

export interface AuthInputTrailingLink {
  text: string;
  onPress: () => void;
}

export interface AuthInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  /** Ícone à esquerda — person (perfil) ou lock-closed (senha). Outline verde. */
  labelIcon?: AuthInputLabelIcon;
  error?: string;
  /** Campo de senha: exibe toggle mostrar/ocultar */
  type?: 'text' | 'password';
  /** Link à direita (ex: "Esqueceu?") — só para type="password" */
  trailingLink?: AuthInputTrailingLink;
}

export function AuthInput({
  label,
  labelIcon = 'person',
  error,
  type = 'text',
  secureTextEntry: _secureTextEntry,
  trailingLink,
  ...props
}: AuthInputProps) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const textColor = useThemeColor('text');
  const borderColor = useThemeColor(error ? 'error' : 'inputBorder');
  const errorColor = useThemeColor('error');
  const tintColor = useThemeColor('tint');
  const separatorColor = useThemeColor('inputBorder');

  const isPassword = type === 'password';
  const showPassword = isPassword && passwordVisible;
  const secure = isPassword ? !showPassword : (_secureTextEntry ?? false);

  const IconComponent = labelIcon === 'lock-closed' ? (
    <Ionicons name="lock-closed-outline" size={24} color={tintColor} />
  ) : (
    <Ionicons name="person-outline" size={24} color={tintColor} />
  );

  const toggle = isPassword ? (
    <Pressable
      onPress={() => setPasswordVisible((v) => !v)}
      accessibilityRole="button"
      accessibilityLabel={passwordVisible ? 'Ocultar senha' : 'Mostrar senha'}
      style={styles.toggle}
    >
      <Ionicons
        name={passwordVisible ? 'eye-off' : 'eye'}
        size={24}
        color={tintColor}
      />
    </Pressable>
  ) : null;

  const hasRightAdornment = toggle || trailingLink;
  const rightAdornment = (toggle || trailingLink) && (
    <View style={styles.rightAdornment} pointerEvents="box-none">
      {trailingLink ? (
        <>
          {toggle}
          <View style={[styles.separator, { backgroundColor: separatorColor }]} />
          <Pressable
            onPress={trailingLink.onPress}
            accessibilityRole="button"
            accessibilityLabel={trailingLink.text}
            style={styles.trailingLink}
          >
            <Text style={[styles.trailingLinkText, { color: tintColor }]}>
              {trailingLink.text}
            </Text>
          </Pressable>
        </>
      ) : (
        toggle
      )}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View style={[styles.inputRow, { borderBottomColor: borderColor }]}>
        <View style={styles.iconWrapper}>{IconComponent}</View>
        <TextInput
          style={[
            styles.input,
            { color: textColor },
            hasRightAdornment ? { paddingRight: Tokens.touchTarget * 2 + Tokens.spacing.lg } : undefined,
          ]}
          placeholderTextColor={useThemeColor('hint')}
          accessibilityLabel={label}
          accessibilityHint={error}
          secureTextEntry={secure}
          autoCapitalize={isPassword ? 'none' : props.autoCapitalize}
          autoCorrect={isPassword ? false : props.autoCorrect}
          {...props}
        />
        {rightAdornment}
      </View>
      {error ? (
        <Text style={[styles.error, { color: errorColor }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Tokens.spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingVertical: Tokens.spacing.sm,
    position: 'relative',
  },
  iconWrapper: {
    marginRight: Tokens.spacing.md,
    minWidth: 24,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingVertical: Tokens.spacing.sm,
    paddingHorizontal: 0,
    fontSize: Tokens.typography.body,
    minHeight: Tokens.touchTarget - Tokens.spacing.sm * 2,
  },
  toggle: {
    minWidth: Tokens.touchTarget,
    minHeight: Tokens.touchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightAdornment: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
  },
  trailingLink: {
    paddingHorizontal: Tokens.spacing.sm,
    paddingVertical: Tokens.spacing.sm,
    justifyContent: 'center',
  },
  trailingLinkText: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  separator: {
    width: 1,
    alignSelf: 'stretch',
    marginHorizontal: Tokens.spacing.xs,
  },
  error: {
    fontSize: Tokens.typography.body,
    marginTop: Tokens.spacing.xs,
  },
});
