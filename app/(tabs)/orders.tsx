import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Button } from "@/components/Button";
import { DeliveryTrackingCard } from "@/components/orders/DeliveryTrackingCard";
import { Text, useThemeColor } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Tokens } from "@/constants/Tokens";
import { useOrders } from "@/hooks/useOrders";
import {
  ORDER_STATUS_LABEL,
  Order,
  OrderStatus,
} from "@/services/orderService";
import { formatPrice } from "@/utils/formatPrice";

type FilterValue = "all" | OrderStatus;

interface FilterOption {
  value: FilterValue;
  label: string;
}

const FILTERS: FilterOption[] = [
  { value: "all", label: "Todos" },
  { value: "delivered", label: "Entregues" },
  { value: "cancelled", label: "Cancelados" },
];

const ORDERS_PER_PAGE = 3;

const STATUS_ICON: Record<OrderStatus, keyof typeof Ionicons.glyphMap> = {
  delivered: "checkmark-circle",
  in_transit: "bicycle",
  preparing: "time",
  cancelled: "close-circle",
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  delivered: Colors.light.success,
  in_transit: Colors.light.tint,
  preparing: Colors.light.warning,
  cancelled: Colors.light.error,
};

const formatDate = (iso: string): string => {
  const date = new Date(iso);
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const isActiveStatus = (status: OrderStatus): boolean =>
  status === "preparing" || status === "in_transit";

export default function OrdersScreen() {
  const { orders } = useOrders();
  const [filter, setFilter] = useState<FilterValue>("all");
  const [visibleCount, setVisibleCount] = useState(ORDERS_PER_PAGE);

  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const hintColor = useThemeColor("hint");
  const tintColor = useThemeColor("tint");
  const onTintColor = useThemeColor("onTint");
  const separatorColor = useThemeColor("separator");
  const borderColor = useThemeColor("cardBorderSubtle");

  const activeOrder =
    orders.find((order) => isActiveStatus(order.status)) ?? null;

  const previousOrdersFull = orders.filter((order) =>
    activeOrder ? order.id !== activeOrder.id : true,
  );
  const previousOrders =
    filter === "all"
      ? previousOrdersFull
      : previousOrdersFull.filter((order) => order.status === filter);

  const visiblePreviousOrders = previousOrders.slice(0, visibleCount);
  const hasMore = previousOrders.length > visiblePreviousOrders.length;

  const handleFilterChange = (value: FilterValue) => {
    setFilter(value);
    setVisibleCount(ORDERS_PER_PAGE);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.headerWrapper}>
        <Text style={styles.title}>Meus pedidos</Text>
        <Text style={[styles.subtitle, { color: hintColor }]}>
          Acompanhe seus pedidos em tempo real
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeOrder && (
          <View style={styles.activeSection}>
            <View style={styles.sectionHeader}>
              <Ionicons name="time" size={18} color={tintColor} />
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Pedido em andamento
              </Text>
            </View>
            <DeliveryTrackingCard order={activeOrder} />
          </View>
        )}

        <View style={styles.previousSection}>
          <View style={styles.sectionHeader}>
            <Ionicons name="receipt" size={18} color={tintColor} />
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              Pedidos anteriores
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersRow}
          >
            {FILTERS.map((option) => {
              const isSelected = filter === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[
                    styles.filterChip,
                    {
                      backgroundColor: isSelected ? tintColor : backgroundColor,
                      borderColor: isSelected ? tintColor : borderColor,
                    },
                  ]}
                  onPress={() => handleFilterChange(option.value)}
                  accessibilityRole="button"
                  accessibilityLabel={`Filtrar pedidos: ${option.label}`}
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      { color: isSelected ? onTintColor : textColor },
                    ]}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {visiblePreviousOrders.length === 0 ? (
            <View style={styles.empty}>
              <Ionicons name="clipboard-outline" size={48} color={hintColor} />
              <Text style={[styles.emptyText, { color: hintColor }]}>
                {filter === "all"
                  ? "Você ainda não tem pedidos anteriores."
                  : `Nenhum pedido ${ORDER_STATUS_LABEL[filter as OrderStatus].toLowerCase()}.`}
              </Text>
            </View>
          ) : (
            <>
              {visiblePreviousOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  textColor={textColor}
                  hintColor={hintColor}
                  borderColor={borderColor}
                  separatorColor={separatorColor}
                />
              ))}

              {hasMore && (
                <View style={styles.viewMoreWrapper}>
                  <Button
                    title={`Ver mais pedidos (${previousOrders.length - visiblePreviousOrders.length})`}
                    onPress={() =>
                      setVisibleCount((current) => current + ORDERS_PER_PAGE)
                    }
                    variant="viewMore"
                    accessibilityLabel="Carregar mais pedidos"
                  />
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

interface OrderCardProps {
  order: Order;
  textColor: string;
  hintColor: string;
  borderColor: string;
  separatorColor: string;
}

function OrderCard({
  order,
  textColor,
  hintColor,
  borderColor,
  separatorColor,
}: OrderCardProps) {
  const statusColor = STATUS_COLOR[order.status];
  const statusIcon = STATUS_ICON[order.status];
  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <View style={[styles.card, { borderColor }]}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.orderId, { color: textColor }]}>
            Pedido #{order.id}
          </Text>
          <Text style={[styles.orderDate, { color: hintColor }]}>
            {formatDate(order.createdAt)}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + "1A" }]}>
          <Ionicons name={statusIcon} size={14} color={statusColor} />
          <Text style={[styles.statusText, { color: statusColor }]}>
            {ORDER_STATUS_LABEL[order.status]}
          </Text>
        </View>
      </View>

      <View style={[styles.itemsList, { borderTopColor: separatorColor }]}>
        {order.items.map((item) => (
          <View key={item.product.id} style={styles.itemRow}>
            <Image
              source={item.product.source}
              style={styles.itemImage}
              resizeMode="cover"
            />
            <View style={styles.itemInfo}>
              <Text
                style={[styles.itemName, { color: textColor }]}
                numberOfLines={1}
              >
                {item.product.name}
              </Text>
              <Text style={[styles.itemQty, { color: hintColor }]}>
                {item.quantity}x · {formatPrice(item.product.price)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={[styles.cardFooter, { borderTopColor: separatorColor }]}>
        <Text style={[styles.footerLabel, { color: hintColor }]}>
          {itemCount} {itemCount === 1 ? "item" : "itens"}
        </Text>
        <Text style={[styles.footerTotal, { color: textColor }]}>
          Total:{" "}
          <Text
            style={{
              color: statusColor,
              fontWeight: Tokens.typography.fontWeight.bold,
            }}
          >
            {formatPrice(order.total)}
          </Text>
        </Text>
      </View>
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
    paddingBottom: 140,
  },
  activeSection: {
    marginBottom: Tokens.spacing.md,
  },
  previousSection: {
    marginTop: Tokens.spacing.sm,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.xs,
    marginBottom: Tokens.spacing.md,
  },
  sectionTitle: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  filtersRow: {
    gap: Tokens.spacing.sm,
    paddingRight: Tokens.spacing.md,
    marginBottom: Tokens.spacing.md,
  },
  filterChip: {
    borderWidth: 1,
    borderRadius: Tokens.radius.lg,
    paddingHorizontal: Tokens.spacing.md,
    paddingVertical: Tokens.spacing.sm,
    minHeight: 36,
    justifyContent: "center",
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  card: {
    borderWidth: 1,
    borderRadius: Tokens.radius.md,
    padding: Tokens.spacing.md,
    marginBottom: Tokens.spacing.md,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Tokens.spacing.md,
  },
  orderId: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  orderDate: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.xs,
    paddingHorizontal: Tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: Tokens.radius.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  itemsList: {
    borderTopWidth: 1,
    paddingTop: Tokens.spacing.sm,
    gap: Tokens.spacing.sm,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.sm,
  },
  itemImage: {
    width: 44,
    height: 44,
    borderRadius: Tokens.radius.sm,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  itemQty: {
    fontSize: 13,
    marginTop: 2,
  },
  cardFooter: {
    borderTopWidth: 1,
    marginTop: Tokens.spacing.sm,
    paddingTop: Tokens.spacing.sm,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLabel: {
    fontSize: 13,
  },
  footerTotal: {
    fontSize: Tokens.typography.body,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Tokens.spacing.xl * 2,
    gap: Tokens.spacing.md,
  },
  emptyText: {
    fontSize: Tokens.typography.body,
    textAlign: "center",
  },
  viewMoreWrapper: {
    marginTop: Tokens.spacing.sm,
    alignItems: "center",
  },
});
