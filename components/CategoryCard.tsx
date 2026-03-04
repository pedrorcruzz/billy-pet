import {
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
} from "react-native";

import { Text, useThemeColor } from "@/components/Themed";
import { Tokens } from "@/constants/Tokens";

export interface CategoryCardProps {
  title: string;
  source: ImageSourcePropType;
  onPress?: () => void;
  accessibilityLabel?: string;
}

const IMAGE_SIZE = 72;

export function CategoryCard({
  title,
  source,
  onPress,
  accessibilityLabel,
}: CategoryCardProps) {
  const textColor = useThemeColor("text");
  const backgroundColor = useThemeColor("background");

  return (
    <Pressable
      style={[styles.card, { backgroundColor }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
    >
      <Image
        source={source}
        style={styles.image}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    alignSelf: "stretch",
    paddingVertical: Tokens.spacing.sm,
    paddingHorizontal: Tokens.spacing.xs,
    borderRadius: Tokens.radius.md,
  },
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
    marginBottom: Tokens.spacing.xs,
  },
  title: {
    fontSize: 12,
    fontWeight: Tokens.typography.fontWeight.semibold,
    textAlign: "center",
  },
});
