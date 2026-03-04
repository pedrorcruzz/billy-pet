import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";

import { Button } from "@/components/Button";
import { OfferCard } from "@/components/OfferCard";
import { Text, useThemeColor } from "@/components/Themed";
import { Tokens } from "@/constants/Tokens";
import { formatPrice } from "@/utils/formatPrice";

export interface Offer {
  id: string;
  name: string;
  price: number;
  /** Preço antigo (riscado). Opcional. */
  oldPrice?: number;
  source: ImageSourcePropType;
}

export interface OffersGridProps {
  offers: Offer[];
  /** Mostra botão "Ver mais ofertas" quando há mais de 4 itens */
  onViewMore?: () => void;
  /** Label do botão quando há mais ofertas */
  viewMoreLabel?: string;
  /** Callback ao clicar em um card */
  onOfferPress?: (offer: Offer) => void;
}

export function OffersGrid({
  offers,
  onViewMore,
  viewMoreLabel = "Ver mais ofertas",
  onOfferPress,
}: OffersGridProps) {
  const textColor = useThemeColor("text");
  const displayedOffers = offers.slice(0, 4);
  const hasMore = offers.length > 4;

  const renderRow = (rowOffers: Offer[], isLastRow: boolean) => (
    <View
      key={rowOffers.map((o) => o.id).join("-")}
      style={[styles.row, isLastRow && styles.rowLast]}
    >
      {rowOffers.map((offer) => (
        <View key={offer.id} style={styles.cell}>
          <OfferCard
            name={offer.name}
            price={offer.price}
            oldPrice={offer.oldPrice}
            source={offer.source}
            onPress={onOfferPress ? () => onOfferPress(offer) : undefined}
            accessibilityLabel={`${offer.name}, ${formatPrice(offer.price)}`}
          />
        </View>
      ))}
    </View>
  );

  const rows: Offer[][] = [];
  for (let i = 0; i < displayedOffers.length; i += 2) {
    rows.push(displayedOffers.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Image
            source={require("@/assets/icons/pata.png")}
            style={styles.pawIcon}
            resizeMode="contain"
            accessibilityIgnoresInvertColors
          />
          <Text style={[styles.title, { color: textColor }]}>Ofertas</Text>
        </View>
        {hasMore && onViewMore && (
          <Button
            title={viewMoreLabel}
            onPress={onViewMore}
            variant="viewMore"
            accessibilityLabel={viewMoreLabel}
          />
        )}
      </View>
      {rows.map((row, i) => renderRow(row, i === rows.length - 1))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Tokens.spacing.md,
    paddingBottom: Tokens.spacing.lg,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Tokens.spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Tokens.spacing.sm,
  },
  pawIcon: {
    width: 34,
    height: 34,
  },
  title: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  row: {
    flexDirection: "row",
    gap: Tokens.spacing.md,
    marginBottom: Tokens.spacing.md,
  },
  rowLast: {
    marginBottom: 0,
  },
  cell: {
    flex: 1,
    minWidth: 0,
  },
});
