import { Image, ImageSourcePropType, Pressable, StyleSheet } from "react-native";

import { Tokens } from "@/constants/Tokens";

export interface PromoCardProps {
  source: ImageSourcePropType;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export function PromoCard({ source, onPress, accessibilityLabel }: PromoCardProps) {
  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? "Card promocional"}
    >
      <Image
        source={source}
        style={styles.image}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: Tokens.radius.md,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
