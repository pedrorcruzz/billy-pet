import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { Text, useThemeColor } from "@/components/Themed";
import { Tokens } from "@/constants/Tokens";
import { formatPrice } from "@/utils/formatPrice";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = Tokens.spacing.md * 2;
const GAP = Tokens.spacing.md;
const OFFER_IMAGE_SIZE = Math.floor((SCREEN_WIDTH - HORIZONTAL_PADDING - GAP) / 2);

export interface OfferCardProps {
  name: string;
  price: number;
  /** Preço antigo (riscado). Opcional. */
  oldPrice?: number;
  source: ImageSourcePropType;
  onPress?: () => void;
  accessibilityLabel?: string;
}

export function OfferCard({
  name,
  price,
  oldPrice,
  source,
  onPress,
  accessibilityLabel,
}: OfferCardProps) {
  const textColor = useThemeColor("text");
  const tintColor = useThemeColor("tint");
  const hintColor = useThemeColor("hint");
  const backgroundColor = useThemeColor("background");
  const borderColor = useThemeColor("cardBorderSubtle");

  const formattedPrice = formatPrice(price);
  const formattedOldPrice = oldPrice != null ? formatPrice(oldPrice) : null;

  return (
    <Pressable
      style={[styles.card, { backgroundColor, borderColor }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? name}
    >
      <Image
        source={source}
        style={styles.image}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
      <View style={styles.content}>
        <Text style={[styles.name, { color: textColor }]} numberOfLines={2}>
          {name}
        </Text>
        <View style={styles.priceRow}>
          {formattedOldPrice != null && (
            <Text style={[styles.oldPrice, { color: hintColor }]}>
              {formattedOldPrice}
            </Text>
          )}
          <Text style={[styles.price, { color: tintColor }]}>{formattedPrice}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "column",
    borderRadius: Tokens.radius.md,
    overflow: "hidden",
    minWidth: 0,
    borderWidth: 0.5,
  },
  image: {
    width: OFFER_IMAGE_SIZE,
    height: OFFER_IMAGE_SIZE,
  },
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: 0,
    paddingHorizontal: Tokens.spacing.md,
  },
  name: {
    fontSize: 14,
    fontWeight: Tokens.typography.fontWeight.semibold,
    textAlign: "center",
    paddingTop: Tokens.spacing.xs,
    paddingBottom: Tokens.spacing.xs,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Tokens.spacing.sm,
    paddingTop: Tokens.spacing.xs,
    paddingBottom: Tokens.spacing.sm,
  },
  oldPrice: {
    fontSize: 14,
    textDecorationLine: "line-through",
  },
  price: {
    fontSize: 14,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
});
