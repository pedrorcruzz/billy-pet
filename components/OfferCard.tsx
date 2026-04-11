import { useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text, useThemeColor } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Tokens } from "@/constants/Tokens";
import { formatPrice } from "@/utils/formatPrice";

export interface OfferCardProps {
  name: string;
  price: number;
  /** Preço antigo (riscado). Opcional. */
  oldPrice?: number;
  source: ImageSourcePropType;
  onPress?: () => void;
  /** Quando definido, exibe botão flutuante "+" sobre a imagem */
  onAdd?: () => void;
  accessibilityLabel?: string;
}

export function OfferCard({
  name,
  price,
  oldPrice,
  source,
  onPress,
  onAdd,
  accessibilityLabel,
}: OfferCardProps) {
  const textColor = useThemeColor("text");
  const tintColor = useThemeColor("tint");
  const hintColor = useThemeColor("hint");
  const onTintColor = useThemeColor("onTint");
  const backgroundColor = useThemeColor("background");
  const borderColor = useThemeColor("cardBorderSubtle");

  const buttonScale = useRef(new Animated.Value(1)).current;

  const formattedPrice = formatPrice(price);
  const formattedOldPrice = oldPrice != null ? formatPrice(oldPrice) : null;

  const animateAdd = () => {
    buttonScale.setValue(1);
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 1.35,
        duration: 140,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 4,
        tension: 120,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAdd = () => {
    animateAdd();
    onAdd?.();
  };

  return (
    <Pressable
      style={[styles.card, { backgroundColor, borderColor }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? name}
    >
      <View style={styles.imageWrapper}>
        <Image
          source={source}
          style={styles.image}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
        {onAdd && (
          <Animated.View
            style={[
              styles.addButton,
              { backgroundColor: tintColor, transform: [{ scale: buttonScale }] },
            ]}
          >
            <Pressable
              style={styles.addButtonInner}
              onPress={handleAdd}
              accessibilityRole="button"
              accessibilityLabel={`Adicionar ${name} ao carrinho`}
              hitSlop={6}
            >
              <Ionicons name="add" size={20} color={onTintColor} />
            </Pressable>
          </Animated.View>
        )}
      </View>
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
  imageWrapper: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  addButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonInner: {
    flex: 1,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
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
