import { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Text, useThemeColor } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Tokens } from "@/constants/Tokens";
import { useCart } from "@/hooks/useCart";

const TOAST_VISIBLE_MS = 1800;

export function CartToast() {
  const { lastAdded } = useCart();
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tintColor = useThemeColor("tint");
  const onTintColor = useThemeColor("onTint");
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const hintColor = useThemeColor("hint");

  useEffect(() => {
    if (!lastAdded) return;

    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
    }

    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        friction: 7,
        tension: 80,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    hideTimerRef.current = setTimeout(() => {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -120,
          duration: 260,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 260,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, TOAST_VISIBLE_MS);

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [lastAdded?.token]);

  if (!lastAdded) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          backgroundColor,
          top: insets.top + Tokens.spacing.md,
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: tintColor }]}>
        <Ionicons name="checkmark" size={20} color={onTintColor} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          Adicionado ao carrinho
        </Text>
        <Text style={[styles.subtitle, { color: hintColor }]} numberOfLines={1}>
          {lastAdded.productName}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: Tokens.spacing.md,
    right: Tokens.spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.md,
    paddingVertical: Tokens.spacing.sm,
    paddingHorizontal: Tokens.spacing.md,
    borderRadius: Tokens.radius.lg,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 9999,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
