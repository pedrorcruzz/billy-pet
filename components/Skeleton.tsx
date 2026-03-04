import { useEffect } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useThemeColor } from "@/components/Themed";
import { Tokens } from "@/constants/Tokens";

export interface SkeletonProps {
  /** Largura. Use number ou "100%" */
  width?: number | string;
  /** Altura */
  height?: number;
  /** Border radius */
  borderRadius?: number;
  /** Estilo adicional */
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 24,
  borderRadius = Tokens.radius.sm,
  style,
}: SkeletonProps) {
  const baseColor = useThemeColor("skeletonBase");
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 800 }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.base,
        {
          width,
          height,
          borderRadius,
          backgroundColor: baseColor,
        },
        animatedStyle,
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: "hidden",
  },
});
