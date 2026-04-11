import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/Button";
import { Text, useThemeColor } from "@/components/Themed";
import { Tokens } from "@/constants/Tokens";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";

type PaymentMethod = "pix" | "credit" | "debit" | "cash";

interface SavedCard {
  id: string;
  brand: string;
  last4: string;
  holder: string;
  expiry: string;
}

const SAVED_CREDIT_CARDS: SavedCard[] = [
  {
    id: "card-1",
    brand: "Visa",
    last4: "4242",
    holder: "PEDRO ROSA",
    expiry: "12/28",
  },
];

interface MethodOption {
  value: PaymentMethod;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const METHODS: MethodOption[] = [
  {
    value: "pix",
    label: "PIX",
    description: "Pagamento instantâneo via QR Code",
    icon: "qr-code",
  },
  {
    value: "credit",
    label: "Cartão de crédito",
    description: "Selecione um cartão salvo",
    icon: "card",
  },
  {
    value: "debit",
    label: "Cartão de débito",
    description: "Cadastre um novo cartão",
    icon: "card-outline",
  },
  {
    value: "cash",
    label: "Dinheiro em espécie",
    description: "Pague na entrega",
    icon: "cash",
  },
];

export default function CheckoutScreen() {
  const { totalPrice } = useCart();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [selectedCardId, setSelectedCardId] = useState<string | null>(
    SAVED_CREDIT_CARDS[0]?.id ?? null,
  );

  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const hintColor = useThemeColor("hint");
  const tintColor = useThemeColor("tint");
  const onTintColor = useThemeColor("onTint");
  const separatorColor = useThemeColor("separator");
  const borderColor = useThemeColor("cardBorderSubtle");

  const goToProcessing = (method: PaymentMethod) => {
    router.push({ pathname: "/checkout/processing", params: { method } });
  };

  const handleContinue = () => {
    if (!selectedMethod) return;

    if (selectedMethod === "pix") {
      router.push("/checkout/pix");
      return;
    }
    if (selectedMethod === "debit") {
      router.push("/checkout/new-card");
      return;
    }
    if (selectedMethod === "credit") {
      if (!selectedCardId) return;
      goToProcessing("credit");
      return;
    }
    if (selectedMethod === "cash") {
      goToProcessing("cash");
      return;
    }
  };

  const continueLabel =
    selectedMethod === "pix"
      ? "Gerar PIX"
      : selectedMethod === "debit"
        ? "Cadastrar cartão"
        : `Pagar ${formatPrice(totalPrice)}`;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top", "left", "right"]}
    >
      <View style={[styles.header, { borderBottomColor: separatorColor }]}>
        <Pressable
          style={styles.headerButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          hitSlop={10}
        >
          <Ionicons name="arrow-back" size={26} color={textColor} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: textColor }]}>
          Forma de pagamento
        </Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.summaryCard, { borderColor }]}>
          <Text style={[styles.summaryLabel, { color: hintColor }]}>
            Total do pedido
          </Text>
          <Text style={[styles.summaryValue, { color: tintColor }]}>
            {formatPrice(totalPrice)}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: textColor }]}>
          Selecione o método
        </Text>

        {METHODS.map((method) => {
          const isSelected = selectedMethod === method.value;
          return (
            <View key={method.value}>
              <Pressable
                style={[
                  styles.methodCard,
                  {
                    borderColor: isSelected ? tintColor : borderColor,
                    borderWidth: isSelected ? 2 : 1,
                  },
                ]}
                onPress={() => setSelectedMethod(method.value)}
                accessibilityRole="button"
                accessibilityLabel={`Pagar com ${method.label}`}
                accessibilityState={{ selected: isSelected }}
              >
                <View
                  style={[
                    styles.methodIcon,
                    { backgroundColor: tintColor + "1A" },
                  ]}
                >
                  <Ionicons name={method.icon} size={24} color={tintColor} />
                </View>
                <View style={styles.methodInfo}>
                  <Text style={[styles.methodLabel, { color: textColor }]}>
                    {method.label}
                  </Text>
                  <Text style={[styles.methodDescription, { color: hintColor }]}>
                    {method.description}
                  </Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    {
                      borderColor: isSelected ? tintColor : borderColor,
                      backgroundColor: isSelected ? tintColor : "transparent",
                    },
                  ]}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={14} color={onTintColor} />
                  )}
                </View>
              </Pressable>

              {isSelected && method.value === "credit" && (
                <View style={styles.savedCardsList}>
                  {SAVED_CREDIT_CARDS.map((card) => {
                    const isCardSelected = selectedCardId === card.id;
                    return (
                      <Pressable
                        key={card.id}
                        style={[
                          styles.savedCard,
                          {
                            borderColor: isCardSelected ? tintColor : borderColor,
                            backgroundColor: isCardSelected
                              ? tintColor + "0F"
                              : backgroundColor,
                          },
                        ]}
                        onPress={() => setSelectedCardId(card.id)}
                        accessibilityRole="button"
                        accessibilityLabel={`Cartão ${card.brand} final ${card.last4}`}
                        accessibilityState={{ selected: isCardSelected }}
                      >
                        <View style={[styles.cardBrand, { backgroundColor: tintColor }]}>
                          <Text
                            style={[styles.cardBrandText, { color: onTintColor }]}
                          >
                            {card.brand.toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.savedCardInfo}>
                          <Text style={[styles.savedCardNumber, { color: textColor }]}>
                            •••• •••• •••• {card.last4}
                          </Text>
                          <Text style={[styles.savedCardMeta, { color: hintColor }]}>
                            {card.holder} · {card.expiry}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.radio,
                            {
                              borderColor: isCardSelected ? tintColor : borderColor,
                              backgroundColor: isCardSelected
                                ? tintColor
                                : "transparent",
                            },
                          ]}
                        >
                          {isCardSelected && (
                            <Ionicons name="checkmark" size={14} color={onTintColor} />
                          )}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>

      <View
        style={[
          styles.footer,
          { backgroundColor, borderTopColor: separatorColor },
        ]}
      >
        <Button
          title={continueLabel}
          onPress={handleContinue}
          disabled={!selectedMethod}
          accessibilityLabel="Continuar para o pagamento"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Tokens.spacing.md,
    paddingVertical: Tokens.spacing.md,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: Tokens.touchTarget,
    height: Tokens.touchTarget,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  scrollContent: {
    padding: Tokens.spacing.lg,
    paddingBottom: Tokens.spacing.xl * 2,
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: Tokens.radius.md,
    padding: Tokens.spacing.md,
    alignItems: "center",
    marginBottom: Tokens.spacing.lg,
  },
  summaryLabel: {
    fontSize: 13,
    marginBottom: Tokens.spacing.xs,
  },
  summaryValue: {
    fontSize: Tokens.typography.h1,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  sectionTitle: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
    marginBottom: Tokens.spacing.md,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.md,
    borderRadius: Tokens.radius.md,
    padding: Tokens.spacing.md,
    marginBottom: Tokens.spacing.md,
  },
  methodIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  methodDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  savedCardsList: {
    marginTop: -Tokens.spacing.sm,
    marginBottom: Tokens.spacing.md,
    marginLeft: Tokens.spacing.lg,
    gap: Tokens.spacing.sm,
  },
  savedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.sm,
    borderWidth: 1,
    borderRadius: Tokens.radius.md,
    padding: Tokens.spacing.sm,
  },
  cardBrand: {
    paddingHorizontal: Tokens.spacing.sm,
    paddingVertical: 6,
    borderRadius: Tokens.radius.sm,
  },
  cardBrandText: {
    fontSize: 11,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  savedCardInfo: {
    flex: 1,
  },
  savedCardNumber: {
    fontSize: 14,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  savedCardMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    padding: Tokens.spacing.lg,
    borderTopWidth: 1,
  },
});
