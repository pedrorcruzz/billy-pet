import { StyleSheet, View } from 'react-native';

import { Tokens } from '@/constants/Tokens';
import { Text, useThemeColor } from '@/components/Themed';
import { AUTH_HINTS, REGISTER_HINTS } from '@/utils/authUtils';

export type AuthHintType = 'username' | 'password' | 'both';

export interface AuthHintBoxProps {
  type?: AuthHintType;
  message?: string;
  variant?: 'auth' | 'register';
}

export function AuthHintBox({
  type = 'both',
  message,
  variant = 'auth',
}: AuthHintBoxProps) {
  const hintColor = useThemeColor('hint');
  const borderColor = useThemeColor('inputBorder');
  const errorColor = useThemeColor('error');

  if (message) {
    return (
      <View style={[styles.box, { borderColor }]}>
        <Text
          style={[styles.text, { color: errorColor }]}
          accessibilityLabel={message}
        >
          • {message}
        </Text>
      </View>
    );
  }

  const hints =
    variant === 'register'
      ? [REGISTER_HINTS.username, REGISTER_HINTS.email, REGISTER_HINTS.password]
      : type === 'both'
        ? [AUTH_HINTS.username, AUTH_HINTS.password]
        : type === 'username'
          ? [AUTH_HINTS.username]
          : [AUTH_HINTS.password];

  return (
    <View style={[styles.box, { borderColor }]}>
      {hints.map((hint, i) => (
        <Text
          key={i}
          style={[
            styles.text,
            { color: hintColor },
            i === hints.length - 1 && styles.textLast,
          ]}
          accessibilityLabel={hint}
        >
          • {hint}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1,
    borderRadius: Tokens.radius.sm,
    padding: Tokens.spacing.md,
    marginBottom: Tokens.spacing.md,
  },
  text: {
    fontSize: Tokens.typography.body,
    marginBottom: Tokens.spacing.xs,
  },
  textLast: {
    marginBottom: 0,
  },
});
