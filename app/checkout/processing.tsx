import { useEffect, useRef, useState } from "react";
import { Animated, BackHandler, Easing, StyleSheet, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text, useThemeColor } from "@/components/Themed";
import { Tokens } from "@/constants/Tokens";
import { useCart } from "@/hooks/useCart";
import { useOrders } from "@/hooks/useOrders";

const STEPS = [
  { label: "Confirmando pagamento...", icon: "card" as const, durationMs: 1200 },
  { label: "Reservando produtos...", icon: "cube" as const, durationMs: 1200 },
  { label: "Pedido confirmado!", icon: "checkmark-circle" as const, durationMs: 900 },
];

export default function ProcessingScreen() {
  const params = useLocalSearchParams<{ method?: string }>();
  const { items, totalPrice, clear } = useCart();
  const { addOrder } = useOrders();

  const [stepIndex, setStepIndex] = useState(0);
  const orderPlacedRef = useRef(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const spinAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const hintColor = useThemeColor("hint");
  const tintColor = useThemeColor("tint");
  const onTintColor = useThemeColor("onTint");
  const separatorColor = useThemeColor("separator");

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => true,
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (stepIndex + 1) / STEPS.length,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [stepIndex]);

  useEffect(() => {
    const totalDelay = STEPS.slice(0, stepIndex + 1).reduce(
      (sum, step) => sum + step.durationMs,
      0,
    );

    if (stepIndex < STEPS.length - 1) {
      const timer = setTimeout(() => {
        setStepIndex(stepIndex + 1);
      }, STEPS[stepIndex].durationMs);
      return () => clearTimeout(timer);
    }

    // Última etapa: cria o pedido e navega
    const finalTimer = setTimeout(() => {
      if (orderPlacedRef.current) return;
      orderPlacedRef.current = true;
      addOrder(items, totalPrice);
      clear();
      router.dismissAll();
      router.replace("/(tabs)/orders");
    }, STEPS[stepIndex].durationMs);

    return () => clearTimeout(finalTimer);
  }, [stepIndex]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const currentStep = STEPS[stepIndex];
  const isFinal = stepIndex === STEPS.length - 1;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <Animated.View
        style={[
          styles.content,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <View style={[styles.iconWrapper, { backgroundColor: tintColor + "1A" }]}>
          {isFinal ? (
            <Ionicons name="checkmark-circle" size={96} color={tintColor} />
          ) : (
            <Animated.View style={{ transform: [{ rotate: spin }] }}>
              <Ionicons name="sync" size={80} color={tintColor} />
            </Animated.View>
          )}
        </View>

        <Text style={[styles.title, { color: textColor }]}>
          {isFinal ? "Tudo certo!" : "Processando seu pedido"}
        </Text>

        <View style={styles.stepRow}>
          <Ionicons name={currentStep.icon} size={20} color={tintColor} />
          <Text style={[styles.stepLabel, { color: hintColor }]}>
            {currentStep.label}
          </Text>
        </View>

        <View style={[styles.progressTrack, { backgroundColor: separatorColor }]}>
          <Animated.View
            style={[
              styles.progressFill,
              { backgroundColor: tintColor, width: progressWidth },
            ]}
          />
        </View>

        <Text style={[styles.helperText, { color: hintColor }]}>
          {params.method === "pix"
            ? "Confirmando seu pagamento PIX..."
            : params.method === "cash"
              ? "Reservando seu pedido para pagamento na entrega..."
              : "Estamos processando seu pagamento de forma segura..."}
        </Text>

        <View style={styles.skeletonGroup}>
          <SkeletonLine
            width="80%"
            color={separatorColor}
            highlightColor={tintColor}
          />
          <SkeletonLine
            width="65%"
            color={separatorColor}
            highlightColor={tintColor}
          />
          <SkeletonLine
            width="90%"
            color={separatorColor}
            highlightColor={tintColor}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

interface SkeletonLineProps {
  width: string;
  color: string;
  highlightColor: string;
}

function SkeletonLine({ width, color }: SkeletonLineProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.85],
  });

  return (
    <Animated.View
      style={[
        styles.skeletonLine,
        { backgroundColor: color, width: width as any, opacity },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Tokens.spacing.xl,
    gap: Tokens.spacing.md,
  },
  iconWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Tokens.spacing.md,
  },
  title: {
    fontSize: Tokens.typography.h1,
    fontWeight: Tokens.typography.fontWeight.bold,
    textAlign: "center",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.sm,
    marginTop: Tokens.spacing.sm,
  },
  stepLabel: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  progressTrack: {
    width: "80%",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: Tokens.spacing.md,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  helperText: {
    fontSize: 13,
    textAlign: "center",
    marginTop: Tokens.spacing.sm,
    marginHorizontal: Tokens.spacing.md,
  },
  skeletonGroup: {
    width: "80%",
    gap: Tokens.spacing.sm,
    marginTop: Tokens.spacing.lg,
    alignItems: "center",
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
  },
});
