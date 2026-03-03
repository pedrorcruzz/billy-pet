import { StyleSheet, View } from 'react-native';

import { Tokens } from '@/constants/Tokens';
import { Text, useThemeColor } from '@/components/Themed';
import { AUTH_HINTS } from '@/utils/auth/authUtils';

export type AuthHintType = 'username' | 'password' | 'both';

export interface AuthHintBoxProps {
  type: AuthHintType;
}

export function AuthHintBox({ type }: AuthHintBoxProps) {
  const hintColor = useThemeColor('hint');
  const borderColor = useThemeColor('inputBorder');

  const hints =
    type === 'both'
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
