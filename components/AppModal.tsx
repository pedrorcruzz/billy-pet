import { Modal, Pressable, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Button } from "@/components/Button";
import { Text, useThemeColor } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Tokens } from "@/constants/Tokens";

export type AppModalVariant = "default" | "success" | "danger" | "info";

export type AppModalButtonVariant = "primary" | "secondary" | "destructive" | "cancel";

export interface AppModalButton {
  label: string;
  onPress?: () => void;
  variant?: AppModalButtonVariant;
}

export interface AppModalProps {
  visible: boolean;
  title: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: AppModalVariant;
  buttons: AppModalButton[];
  /** Chamado ao tocar fora do modal ou no botão de cancelar */
  onClose: () => void;
}

const VARIANT_COLORS: Record<AppModalVariant, string> = {
  default: Colors.light.tint,
  success: Colors.light.success,
  danger: Colors.light.error,
  info: Colors.light.tint,
};

const DEFAULT_ICON: Record<AppModalVariant, keyof typeof Ionicons.glyphMap> = {
  default: "help-circle",
  success: "checkmark-circle",
  danger: "alert-circle",
  info: "information-circle",
};

export function AppModal({
  visible,
  title,
  message,
  icon,
  variant = "default",
  buttons,
  onClose,
}: AppModalProps) {
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const hintColor = useThemeColor("hint");
  const onTintColor = useThemeColor("onTint");
  const errorColor = useThemeColor("error");
  const separatorColor = useThemeColor("separator");
  const borderColor = useThemeColor("cardBorderSubtle");

  const accentColor = VARIANT_COLORS[variant];
  const finalIcon = icon ?? DEFAULT_ICON[variant];

  const renderButton = (button: AppModalButton, index: number, isStacked: boolean) => {
    const handlePress = () => {
      button.onPress?.();
      if (button.variant !== "primary") onClose();
    };

    const key = `${button.label}-${index}`;

    if (button.variant === "primary") {
      return (
        <View key={key} style={isStacked ? styles.stackedButton : styles.flexButton}>
          <Button
            title={button.label}
            onPress={() => {
              button.onPress?.();
            }}
            accessibilityLabel={button.label}
          />
        </View>
      );
    }

    if (button.variant === "destructive") {
      return (
        <Pressable
          key={key}
          style={[
            isStacked ? styles.stackedButton : styles.flexButton,
            styles.destructiveButton,
            { borderColor: errorColor },
          ]}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={button.label}
        >
          <Text style={[styles.destructiveText, { color: errorColor }]}>
            {button.label}
          </Text>
        </Pressable>
      );
    }

    if (button.variant === "cancel") {
      return (
        <Pressable
          key={key}
          style={[
            isStacked ? styles.stackedButton : styles.flexButton,
            styles.cancelButton,
            { borderColor: separatorColor },
          ]}
          onPress={handlePress}
          accessibilityRole="button"
          accessibilityLabel={button.label}
        >
          <Text style={[styles.cancelText, { color: hintColor }]}>
            {button.label}
          </Text>
        </Pressable>
      );
    }

    return (
      <Pressable
        key={key}
        style={[
          isStacked ? styles.stackedButton : styles.flexButton,
          styles.secondaryButton,
          { borderColor },
        ]}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={button.label}
      >
        <Text style={[styles.secondaryText, { color: textColor }]}>
          {button.label}
        </Text>
      </Pressable>
    );
  };

  const isStacked = buttons.length > 2;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.card, { backgroundColor }]}
          onPress={() => undefined}
        >
          <View style={[styles.iconCircle, { backgroundColor: accentColor }]}>
            <Ionicons name={finalIcon} size={36} color={onTintColor} />
          </View>

          <Text style={[styles.title, { color: textColor }]}>{title}</Text>

          {message && (
            <Text style={[styles.message, { color: hintColor }]}>{message}</Text>
          )}

          <View
            style={[styles.divider, { backgroundColor: separatorColor }]}
          />

          <View
            style={isStacked ? styles.actionsStacked : styles.actionsRow}
          >
            {buttons.map((button, index) =>
              renderButton(button, index, isStacked),
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.light.overlay,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Tokens.spacing.lg,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: Tokens.radius.lg,
    padding: Tokens.spacing.lg,
    alignItems: "center",
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Tokens.spacing.md,
  },
  title: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
    textAlign: "center",
    marginBottom: Tokens.spacing.sm,
  },
  message: {
    fontSize: Tokens.typography.body,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: Tokens.spacing.lg,
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: Tokens.spacing.md,
  },
  actionsRow: {
    flexDirection: "row",
    gap: Tokens.spacing.sm,
    width: "100%",
  },
  actionsStacked: {
    width: "100%",
    gap: Tokens.spacing.sm,
  },
  flexButton: {
    flex: 1,
  },
  stackedButton: {
    width: "100%",
  },
  cancelButton: {
    borderWidth: 1.5,
    borderRadius: Tokens.radius.lg,
    minHeight: Tokens.touchTarget,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Tokens.spacing.md,
  },
  cancelText: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderRadius: Tokens.radius.lg,
    minHeight: Tokens.touchTarget,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Tokens.spacing.md,
  },
  secondaryText: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  destructiveButton: {
    borderWidth: 1.5,
    borderRadius: Tokens.radius.lg,
    minHeight: Tokens.touchTarget,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Tokens.spacing.md,
  },
  destructiveText: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
});
