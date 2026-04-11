import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

import { AppModal } from "@/components/AppModal";
import { Button } from "@/components/Button";
import { Text, useThemeColor } from "@/components/Themed";
import { Tokens } from "@/constants/Tokens";
import { CartItem, useCart } from "@/hooks/useCart";
import { formatPrice } from "@/utils/formatPrice";

const SHIPPING_FEE = 14.9;
const FREE_SHIPPING_THRESHOLD = 150;

export default function CartScreen() {
  const { items, totalPrice, totalItems, increment, decrement, removeItem } =
    useCart();
  const [pendingRemoval, setPendingRemoval] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const hintColor = useThemeColor("hint");
  const tintColor = useThemeColor("tint");
  const separatorColor = useThemeColor("separator");

  const isEmpty = items.length === 0;
  const shipping = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const finalTotal = totalPrice + shipping;
  const remainingForFreeShipping = Math.max(
    FREE_SHIPPING_THRESHOLD - totalPrice,
    0,
  );

  const handleCheckout = () => {
    router.push("/checkout");
  };

  const handleRemove = (productId: string, productName: string) => {
    setPendingRemoval({ id: productId, name: productName });
  };

  const confirmRemove = () => {
    if (pendingRemoval) {
      removeItem(pendingRemoval.id);
      setPendingRemoval(null);
    }
  };

  if (isEmpty) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <View style={styles.headerWrapper}>
          <Text style={styles.title}>Carrinho</Text>
        </View>
        <View style={styles.empty}>
          <View style={[styles.emptyIconCircle, { backgroundColor: separatorColor }]}>
            <Ionicons name="cart-outline" size={64} color={hintColor} />
          </View>
          <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
          <Text style={[styles.emptyText, { color: hintColor }]}>
            Adicione produtos para continuar sua compra.
          </Text>
          <View style={styles.emptyButton}>
            <Button
              title="Explorar produtos"
              onPress={() => router.push("/(tabs)/search")}
              accessibilityLabel="Explorar produtos"
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.headerWrapper}>
        <Text style={styles.title}>Carrinho</Text>
        <Text style={[styles.subtitle, { color: hintColor }]}>
          {totalItems} {totalItems === 1 ? "item" : "itens"}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {shipping > 0 && (
          <View style={[styles.shippingBanner, { backgroundColor: separatorColor }]}>
            <Ionicons name="bicycle" size={20} color={tintColor} />
            <Text style={[styles.shippingBannerText, { color: textColor }]}>
              Faltam{" "}
              <Text style={{ fontWeight: Tokens.typography.fontWeight.bold }}>
                {formatPrice(remainingForFreeShipping)}
              </Text>{" "}
              para frete grátis!
            </Text>
          </View>
        )}

        {items.map((item) => (
          <CartItemRow
            key={item.product.id}
            item={item}
            onIncrement={() => increment(item.product.id)}
            onDecrement={() => decrement(item.product.id)}
            onRemove={() => handleRemove(item.product.id, item.product.name)}
          />
        ))}

        <View style={[styles.summaryCard, { borderColor: separatorColor }]}>
          <Text style={[styles.summaryTitle, { color: textColor }]}>
            Resumo do pedido
          </Text>

          <SummaryRow
            label="Subtotal"
            value={formatPrice(totalPrice)}
            hintColor={hintColor}
            textColor={textColor}
          />
          <SummaryRow
            label="Entrega"
            value={shipping === 0 ? "Grátis" : formatPrice(shipping)}
            hintColor={hintColor}
            textColor={shipping === 0 ? tintColor : textColor}
          />

          <View style={[styles.summaryDivider, { backgroundColor: separatorColor }]} />

          <View style={styles.summaryTotalRow}>
            <Text style={[styles.summaryTotalLabel, { color: textColor }]}>
              Total
            </Text>
            <Text style={[styles.summaryTotalValue, { color: tintColor }]}>
              {formatPrice(finalTotal)}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.checkoutBar, { backgroundColor, borderTopColor: separatorColor }]}>
        <Button
          title={`Finalizar pedido • ${formatPrice(finalTotal)}`}
          onPress={handleCheckout}
          accessibilityLabel="Finalizar pedido"
        />
      </View>

      <AppModal
        visible={pendingRemoval !== null}
        title="Remover item"
        message={
          pendingRemoval
            ? `Deseja remover "${pendingRemoval.name}" do carrinho?`
            : ""
        }
        variant="danger"
        icon="trash"
        onClose={() => setPendingRemoval(null)}
        buttons={[
          { label: "Cancelar", variant: "cancel" },
          { label: "Remover", variant: "destructive", onPress: confirmRemove },
        ]}
      />
    </View>
  );
}

interface CartItemRowProps {
  item: CartItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

function CartItemRow({ item, onIncrement, onDecrement, onRemove }: CartItemRowProps) {
  const textColor = useThemeColor("text");
  const tintColor = useThemeColor("tint");
  const hintColor = useThemeColor("hint");
  const onTintColor = useThemeColor("onTint");
  const borderColor = useThemeColor("cardBorderSubtle");

  const lineTotal = item.product.price * item.quantity;

  return (
    <View style={[styles.cartItem, { borderColor }]}>
      <Image
        source={item.product.source}
        style={styles.cartItemImage}
        resizeMode="cover"
      />
      <View style={styles.cartItemBody}>
        <View style={styles.cartItemHeader}>
          <Text
            style={[styles.cartItemName, { color: textColor }]}
            numberOfLines={2}
          >
            {item.product.name}
          </Text>
          <Pressable
            onPress={onRemove}
            accessibilityRole="button"
            accessibilityLabel={`Remover ${item.product.name} do carrinho`}
            hitSlop={10}
          >
            <Ionicons name="trash-outline" size={20} color={hintColor} />
          </Pressable>
        </View>
        <Text style={[styles.cartItemUnit, { color: hintColor }]}>
          {formatPrice(item.product.price)} cada
        </Text>
        <View style={styles.cartItemFooter}>
          <View style={[styles.qtyControl, { borderColor }]}>
            <Pressable
              style={[styles.qtyButton, { backgroundColor: tintColor }]}
              onPress={onDecrement}
              accessibilityRole="button"
              accessibilityLabel="Diminuir quantidade"
            >
              <Ionicons name="remove" size={16} color={onTintColor} />
            </Pressable>
            <Text style={[styles.qtyValue, { color: textColor }]}>
              {item.quantity}
            </Text>
            <Pressable
              style={[styles.qtyButton, { backgroundColor: tintColor }]}
              onPress={onIncrement}
              accessibilityRole="button"
              accessibilityLabel="Aumentar quantidade"
            >
              <Ionicons name="add" size={16} color={onTintColor} />
            </Pressable>
          </View>
          <Text style={[styles.cartItemTotal, { color: tintColor }]}>
            {formatPrice(lineTotal)}
          </Text>
        </View>
      </View>
    </View>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
  hintColor: string;
  textColor: string;
}

function SummaryRow({ label, value, hintColor, textColor }: SummaryRowProps) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, { color: hintColor }]}>{label}</Text>
      <Text style={[styles.summaryValue, { color: textColor }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    paddingHorizontal: Tokens.spacing.lg,
    paddingTop: Tokens.spacing.md,
    paddingBottom: Tokens.spacing.sm,
  },
  title: {
    fontSize: Tokens.typography.h2,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  subtitle: {
    fontSize: Tokens.typography.body,
    marginTop: 2,
  },
  scrollContent: {
    paddingHorizontal: Tokens.spacing.lg,
    paddingTop: Tokens.spacing.md,
    paddingBottom: 200,
  },
  shippingBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.sm,
    padding: Tokens.spacing.md,
    borderRadius: Tokens.radius.md,
    marginBottom: Tokens.spacing.md,
  },
  shippingBannerText: {
    fontSize: 14,
    flex: 1,
  },
  cartItem: {
    flexDirection: "row",
    borderWidth: 0.5,
    borderRadius: Tokens.radius.md,
    padding: Tokens.spacing.sm,
    marginBottom: Tokens.spacing.md,
    gap: Tokens.spacing.md,
  },
  cartItemImage: {
    width: 88,
    height: 88,
    borderRadius: Tokens.radius.sm,
  },
  cartItemBody: {
    flex: 1,
    justifyContent: "space-between",
  },
  cartItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: Tokens.spacing.sm,
  },
  cartItemName: {
    flex: 1,
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  cartItemUnit: {
    fontSize: 13,
    marginTop: 2,
  },
  cartItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: Tokens.spacing.sm,
  },
  qtyControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Tokens.radius.sm,
    overflow: "hidden",
  },
  qtyButton: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: Tokens.typography.fontWeight.bold,
    minWidth: 28,
    textAlign: "center",
  },
  cartItemTotal: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  summaryCard: {
    borderWidth: 1,
    borderRadius: Tokens.radius.md,
    padding: Tokens.spacing.md,
    marginTop: Tokens.spacing.sm,
  },
  summaryTitle: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
    marginBottom: Tokens.spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Tokens.spacing.xs,
  },
  summaryLabel: {
    fontSize: Tokens.typography.body,
  },
  summaryValue: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  summaryDivider: {
    height: 1,
    marginVertical: Tokens.spacing.sm,
  },
  summaryTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Tokens.spacing.xs,
  },
  summaryTotalLabel: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  summaryTotalValue: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  checkoutBar: {
    position: "absolute",
    bottom: 100,
    left: 0,
    right: 0,
    paddingHorizontal: Tokens.spacing.lg,
    paddingTop: Tokens.spacing.md,
    paddingBottom: Tokens.spacing.md,
    borderTopWidth: 1,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Tokens.spacing.xl,
    gap: Tokens.spacing.md,
    paddingBottom: 120,
  },
  emptyIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Tokens.spacing.md,
  },
  emptyTitle: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
    textAlign: "center",
  },
  emptyText: {
    fontSize: Tokens.typography.body,
    textAlign: "center",
  },
  emptyButton: {
    width: "100%",
    maxWidth: 280,
    marginTop: Tokens.spacing.md,
  },
});
