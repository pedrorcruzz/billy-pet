import { Pressable, StyleSheet } from "react-native";

import { Text, useThemeColor } from "@/components/Themed";
import { Tokens } from "@/constants/Tokens";

export interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  accessibilityLabel?: string;
}

export function Button({
  title,
  onPress,
  disabled = false,
  variant = "primary",
  accessibilityLabel,
}: ButtonProps) {
  const tintColor = useThemeColor("tint");
  const onTintColor = useThemeColor("onTint");
  const textColor = useThemeColor("text");

  const backgroundColor = variant === "primary" ? tintColor : "transparent";
  const color = variant === "primary" ? onTintColor : textColor;

  return (
    <Pressable
      style={[
        styles.button,
        { backgroundColor },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
    >
      <Text style={[styles.buttonText, { color }]}>{title}</Text>
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
  disabled: {
    opacity: 0.5,
  },
});
