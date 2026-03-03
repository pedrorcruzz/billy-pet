import {
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { Tokens } from '@/constants/Tokens';
import { Text, useThemeColor } from '@/components/Themed';

export interface AuthInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  rightAdornment?: React.ReactNode;
}

export function AuthInput({
  label,
  error,
  rightAdornment,
  ...props
}: AuthInputProps) {
  const textColor = useThemeColor('text');
  const borderColor = useThemeColor(error ? 'error' : 'inputBorder');
  const errorColor = useThemeColor('error');

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            { color: textColor, borderColor },
            rightAdornment ? { paddingRight: Tokens.touchTarget + Tokens.spacing.md } : undefined,
          ]}
          placeholderTextColor={useThemeColor('hint')}
          accessibilityLabel={label}
          accessibilityHint={error}
          {...props}
        />
        {rightAdornment ? (
          <View style={styles.adornment} pointerEvents="box-none">
            {rightAdornment}
          </View>
        ) : null}
      </View>
      {error ? (
        <Text style={[styles.error, { color: errorColor }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Tokens.spacing.md,
  },
  label: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.semibold,
    marginBottom: Tokens.spacing.xs,
  },
  inputRow: {
    position: 'relative',
  },
  adornment: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: Tokens.touchTarget,
  },
  input: {
    borderWidth: 1,
    borderRadius: Tokens.radius.sm,
    padding: Tokens.spacing.md,
    fontSize: Tokens.typography.body,
    minHeight: Tokens.touchTarget,
  },
  error: {
    fontSize: Tokens.typography.body,
    marginTop: Tokens.spacing.xs,
  },
});
