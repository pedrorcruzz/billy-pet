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
  variant?: "primary" | "secondary" | "viewMore";
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
  const buttonPrimaryColor = useThemeColor("buttonPrimary");
  const onButtonPrimaryColor = useThemeColor("onButtonPrimary");
  const textColor = useThemeColor("text");
  const loadingBgColor = useThemeColor("inputBorder");
  const viewMoreColor = useThemeColor("viewMoreLink");

  const isDisabled = disabled || loading;
  const backgroundColor =
    loading && variant === "primary"
      ? loadingBgColor
      : variant === "primary"
        ? buttonPrimaryColor
        : "transparent";
  const color =
    variant === "primary"
      ? onButtonPrimaryColor
      : variant === "viewMore"
        ? viewMoreColor
        : textColor;

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
          <LoadingSpinner size="small" color={onButtonPrimaryColor} inline />
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
