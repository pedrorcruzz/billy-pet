import { ActivityIndicator, StyleSheet, View } from "react-native";

import { Tokens } from "@/constants/Tokens";
import { useThemeColor } from "@/components/Themed";

export interface LoadingSpinnerProps {
  /** Tamanho do spinner: "small" (20) ou "large" (padrão, 40) */
  size?: "small" | "large";
  /** Cor do spinner (padrão: tint) */
  color?: string;
  /** Exibe em tela cheia centralizado */
  fullScreen?: boolean;
  /** Sem wrapper/padding, para uso inline (ex: dentro de botão) */
  inline?: boolean;
}

export function LoadingSpinner({
  size = "large",
  color,
  fullScreen = false,
  inline = false,
}: LoadingSpinnerProps) {
  const tintColor = useThemeColor("tint");
  const spinnerColor = color ?? tintColor;

  const content = (
    <ActivityIndicator
      size={size}
      color={spinnerColor}
      accessibilityLabel="Carregando"
    />
  );

  if (fullScreen) {
    return (
      <View style={styles.fullScreen} accessibilityLabel="Carregando">
        {content}
      </View>
    );
  }

  if (inline) {
    return content;
  }

  return <View style={styles.wrapper}>{content}</View>;
}

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    padding: Tokens.spacing.md,
  },
  fullScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: Tokens.spacing.xl,
  },
});
