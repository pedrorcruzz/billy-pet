import { Pressable, StyleSheet, View } from "react-native";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Text, useThemeColor } from "@/components/Themed";
import { Tokens } from "@/constants/Tokens";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  /** Exibe spinner em vez do texto, fundo cinza */
  loading?: boolean;
  variant?: "primary" | "secondary";
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "primary",
  accessibilityLabel,
}: ButtonProps) {
  const tintColor = useThemeColor("tint");
  const onTintColor = useThemeColor("onTint");
  const textColor = useThemeColor("text");
  const loadingBgColor = useThemeColor("inputBorder");

  const isDisabled = disabled || loading;
  const backgroundColor =
    loading && variant === "primary"
      ? loadingBgColor
      : variant === "primary"
        ? tintColor
        : "transparent";
  const color = variant === "primary" ? onTintColor : textColor;

  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor },
        isDisabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityState={{ busy: loading }}
    >
      {loading ? (
        <View style={styles.spinnerWrapper}>
          <LoadingSpinner size="small" color={onTintColor} inline />
        </View>
      ) : (
        <Text style={[styles.buttonText, { color }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: Tokens.touchTarget,
    borderRadius: Tokens.radius.lg,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Tokens.spacing.lg,
  },
  buttonText: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  spinnerWrapper: {
    padding: Tokens.spacing.xs,
  },
  disabled: {
    opacity: 0.5,
  },
});
