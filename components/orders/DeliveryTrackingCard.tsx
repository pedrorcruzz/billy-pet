import { useEffect, useRef, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MapView, { Marker } from "react-native-maps";

import { AppModal } from "@/components/AppModal";
import { Button } from "@/components/Button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Text, useThemeColor } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Tokens } from "@/constants/Tokens";
import { useLocation } from "@/hooks/useLocation";
import { useOrders } from "@/hooks/useOrders";
import {
  ORDER_STATUS_LABEL,
  Order,
  OrderStatus,
} from "@/services/orderService";
import { formatPrice } from "@/utils/formatPrice";

const STATUS_FLOW: OrderStatus[] = ["preparing", "in_transit", "delivered"];
const STATUS_ICON: Record<OrderStatus, keyof typeof Ionicons.glyphMap> = {
  preparing: "restaurant",
  in_transit: "checkmark-circle",
  delivered: "checkmark-circle",
  cancelled: "close-circle",
};

const MOTOBOY_START_OFFSET = 0.018;
const ANIMATION_INTERVAL_MS = 250;
const TOTAL_TRANSIT_MS = 35000;

const STATUS_ETA: Record<OrderStatus, string | null> = {
  preparing: "Tempo estimado: 30 - 45 min",
  in_transit: "Chega em ~15 min",
  delivered: null,
  cancelled: null,
};

export interface DeliveryTrackingCardProps {
  order: Order;
}

export function DeliveryTrackingCard({ order }: DeliveryTrackingCardProps) {
  const { location, loading, error, requestLocation } = useLocation();
  const { confirmDelivery } = useOrders();
  const [confirmVisible, setConfirmVisible] = useState(false);

  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const hintColor = useThemeColor("hint");
  const tintColor = useThemeColor("tint");
  const onTintColor = useThemeColor("onTint");
  const separatorColor = useThemeColor("separator");
  const cardBorderColor = useThemeColor("cardBorderSubtle");

  const [progress, setProgress] = useState(0);
  const transitStartedAt = useRef<number | null>(null);

  useEffect(() => {
    if (!location) {
      requestLocation();
    }
  }, []);

  useEffect(() => {
    if (order.status !== "in_transit") {
      transitStartedAt.current = null;
      setProgress(order.status === "delivered" ? 1 : 0);
      return;
    }

    if (transitStartedAt.current == null) {
      transitStartedAt.current = Date.now();
    }

    const interval = setInterval(() => {
      const start = transitStartedAt.current ?? Date.now();
      const elapsed = Date.now() - start;
      const next = Math.min(elapsed / TOTAL_TRANSIT_MS, 1);
      setProgress(next);
      if (next >= 1) clearInterval(interval);
    }, ANIMATION_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [order.status]);

  const motoboyCoordinate = location
    ? {
        latitude:
          location.latitude +
          MOTOBOY_START_OFFSET * (1 - progress),
        longitude:
          location.longitude +
          MOTOBOY_START_OFFSET * (1 - progress),
      }
    : null;

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const headerTitle =
    order.status === "preparing"
      ? "Preparando seu pedido..."
      : order.status === "in_transit"
        ? "Seu pedido está a caminho!"
        : "Pedido entregue!";

  const eta = STATUS_ETA[order.status];

  return (
    <View style={[styles.card, { borderColor: cardBorderColor, backgroundColor }]}>
      <View style={styles.headerRow}>
        <View style={[styles.headerIcon, { backgroundColor: tintColor }]}>
          {order.status === "in_transit" ? (
            <MaterialCommunityIcons
              name="racing-helmet"
              size={24}
              color={onTintColor}
            />
          ) : (
            <Ionicons
              name={STATUS_ICON[order.status]}
              size={22}
              color={onTintColor}
            />
          )}
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            {headerTitle}
          </Text>
          <Text style={[styles.headerSubtitle, { color: hintColor }]}>
            Pedido #{order.id} · {itemCount}{" "}
            {itemCount === 1 ? "item" : "itens"}
          </Text>
        </View>
      </View>

      {eta && (
        <View style={[styles.etaBadge, { backgroundColor: tintColor + "1A" }]}>
          <Ionicons name="time-outline" size={16} color={tintColor} />
          <Text style={[styles.etaText, { color: tintColor }]}>{eta}</Text>
        </View>
      )}

      <StatusTimeline
        status={order.status}
        textColor={textColor}
        tintColor={tintColor}
        hintColor={hintColor}
        separatorColor={separatorColor}
      />

      <View style={[styles.mapWrapper, { borderColor: separatorColor }]}>
        {loading && !location && (
          <View style={styles.mapPlaceholder}>
            <LoadingSpinner size="small" color={tintColor} />
            <Text style={[styles.mapPlaceholderText, { color: hintColor }]}>
              Localizando entrega...
            </Text>
          </View>
        )}

        {error && !location && (
          <View style={styles.mapPlaceholder}>
            <Ionicons name="location-outline" size={32} color={hintColor} />
            <Text style={[styles.mapPlaceholderText, { color: hintColor }]}>
              Permita o acesso à localização para acompanhar a entrega.
            </Text>
            <Pressable
              onPress={() => requestLocation()}
              accessibilityRole="button"
              accessibilityLabel="Tentar localizar novamente"
            >
              <Text style={[styles.mapPlaceholderLink, { color: tintColor }]}>
                Tentar novamente
              </Text>
            </Pressable>
          </View>
        )}

        {location && motoboyCoordinate && (
          <MapView
            style={styles.map}
            region={{
              latitude:
                (location.latitude + motoboyCoordinate.latitude) / 2,
              longitude:
                (location.longitude + motoboyCoordinate.longitude) / 2,
              latitudeDelta:
                Math.abs(motoboyCoordinate.latitude - location.latitude) * 2.4 +
                0.005,
              longitudeDelta:
                Math.abs(motoboyCoordinate.longitude - location.longitude) * 2.4 +
                0.005,
            }}
            pointerEvents="none"
          >
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Seu endereço"
              pinColor={Colors.light.tint}
            />
            <Marker
              coordinate={motoboyCoordinate}
              title="Entregador"
              description={ORDER_STATUS_LABEL[order.status]}
            >
              <View style={[styles.motoboyMarker, { backgroundColor: Colors.light.card }]}>
                <Ionicons name="paw" size={20} color={onTintColor} />
              </View>
            </Marker>
          </MapView>
        )}
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={[styles.footerLabel, { color: hintColor }]}>Total</Text>
          <Text style={[styles.footerTotal, { color: textColor }]}>
            {formatPrice(order.total)}
          </Text>
        </View>
        <Pressable
          style={[styles.detailsButton, { borderColor: tintColor }]}
          onPress={() => router.push("/addresses")}
          accessibilityRole="button"
          accessibilityLabel="Ver endereço de entrega"
        >
          <Ionicons name="location" size={16} color={tintColor} />
          <Text style={[styles.detailsButtonText, { color: tintColor }]}>
            Endereço
          </Text>
        </Pressable>
      </View>

      {order.status === "in_transit" && (
        <View style={styles.confirmWrapper}>
          <Button
            title="Confirmar entrega"
            onPress={() => setConfirmVisible(true)}
            accessibilityLabel="Confirmar que o pedido foi entregue"
          />
        </View>
      )}

      <AppModal
        visible={confirmVisible}
        title="Confirmar entrega"
        message="Você confirma que recebeu o pedido?"
        icon="checkmark-circle"
        variant="success"
        onClose={() => setConfirmVisible(false)}
        buttons={[
          { label: "Cancelar", variant: "cancel" },
          {
            label: "Confirmar",
            variant: "primary",
            onPress: () => {
              setConfirmVisible(false);
              confirmDelivery(order.id);
            },
          },
        ]}
      />
    </View>
  );
}

interface StatusTimelineProps {
  status: OrderStatus;
  textColor: string;
  tintColor: string;
  hintColor: string;
  separatorColor: string;
}

function StatusTimeline({
  status,
  textColor,
  tintColor,
  hintColor,
  separatorColor,
}: StatusTimelineProps) {
  const currentIndex = STATUS_FLOW.indexOf(status);

  return (
    <View style={styles.timeline}>
      {STATUS_FLOW.map((flowStatus, index) => {
        const isCompleted = index <= currentIndex;
        const isLast = index === STATUS_FLOW.length - 1;
        const dotColor = isCompleted ? tintColor : separatorColor;
        const labelColor = isCompleted ? textColor : hintColor;

        return (
          <View key={flowStatus} style={styles.timelineStep}>
            <View style={styles.timelineRow}>
              <View style={[styles.timelineDot, { backgroundColor: dotColor }]}>
                {isCompleted && (
                  <Ionicons name="checkmark" size={12} color={Colors.light.onDark} />
                )}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.timelineLine,
                    {
                      backgroundColor:
                        index < currentIndex ? tintColor : separatorColor,
                    },
                  ]}
                />
              )}
            </View>
            <Text
              style={[styles.timelineLabel, { color: labelColor }]}
              numberOfLines={1}
            >
              {ORDER_STATUS_LABEL[flowStatus]}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: Tokens.radius.lg,
    padding: Tokens.spacing.md,
    marginBottom: Tokens.spacing.lg,
    gap: Tokens.spacing.md,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.md,
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  headerSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  etaBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: Tokens.spacing.xs,
    paddingHorizontal: Tokens.spacing.sm,
    paddingVertical: 6,
    borderRadius: Tokens.radius.sm,
  },
  etaText: {
    fontSize: 13,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  timeline: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: Tokens.spacing.xs,
  },
  timelineStep: {
    flex: 1,
    alignItems: "flex-start",
  },
  timelineRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  timelineLine: {
    flex: 1,
    height: 2,
    marginHorizontal: 2,
  },
  timelineLabel: {
    fontSize: 11,
    fontWeight: Tokens.typography.fontWeight.semibold,
    marginTop: 6,
  },
  mapWrapper: {
    height: 220,
    borderRadius: Tokens.radius.md,
    overflow: "hidden",
    borderWidth: 1,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Tokens.spacing.xs,
    paddingHorizontal: Tokens.spacing.md,
  },
  mapPlaceholderText: {
    fontSize: 13,
    textAlign: "center",
  },
  mapPlaceholderLink: {
    fontSize: 13,
    fontWeight: Tokens.typography.fontWeight.bold,
    marginTop: 4,
  },
  motoboyMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.light.onDark,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLabel: {
    fontSize: 12,
  },
  footerTotal: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.xs,
    borderWidth: 1.5,
    borderRadius: Tokens.radius.lg,
    paddingHorizontal: Tokens.spacing.md,
    paddingVertical: Tokens.spacing.sm,
    minHeight: Tokens.touchTarget,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  confirmWrapper: {
    marginTop: Tokens.spacing.xs,
  },
});
