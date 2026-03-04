import { Dimensions, StyleSheet, View } from "react-native";

import { Tokens } from "@/constants/Tokens";

import { Skeleton } from "./Skeleton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const HORIZONTAL_PADDING = Tokens.spacing.md * 2;
const GAP = Tokens.spacing.md;
const OFFER_IMAGE_SIZE = Math.floor((SCREEN_WIDTH - HORIZONTAL_PADDING - GAP) / 2);
const CARD_MARGIN = Tokens.spacing.md;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;
const CARD_HEIGHT = 270;
const CATEGORY_IMAGE_SIZE = 72;

/** Skeleton de um card de oferta (imagem + nome + preço) */
export function SkeletonOfferCard() {
  return (
    <View style={styles.offerCard}>
      <Skeleton
        width={OFFER_IMAGE_SIZE}
        height={OFFER_IMAGE_SIZE}
        borderRadius={Tokens.radius.md}
      />
      <Skeleton width="100%" height={16} style={styles.offerName} />
      <Skeleton width="60%" height={16} style={styles.offerPrice} />
    </View>
  );
}

/** Grid 2x2 de skeletons de ofertas */
export function SkeletonOffersGrid() {
  return (
    <View style={styles.offersContainer}>
      <View style={styles.offersHeader}>
        <Skeleton width={120} height={24} borderRadius={Tokens.radius.sm} />
      </View>
      <View style={styles.offersRow}>
        <View style={styles.offerCell}>
          <SkeletonOfferCard />
        </View>
        <View style={styles.offerCell}>
          <SkeletonOfferCard />
        </View>
      </View>
      <View style={styles.offersRow}>
        <View style={styles.offerCell}>
          <SkeletonOfferCard />
        </View>
        <View style={styles.offerCell}>
          <SkeletonOfferCard />
        </View>
      </View>
    </View>
  );
}

/** Skeleton de um card de categoria (círculo + texto) */
export function SkeletonCategoryCard() {
  return (
    <View style={styles.categoryCard}>
      <Skeleton
        width={CATEGORY_IMAGE_SIZE}
        height={CATEGORY_IMAGE_SIZE}
        borderRadius={CATEGORY_IMAGE_SIZE / 2}
      />
      <Skeleton width={60} height={12} style={styles.categoryTitle} />
    </View>
  );
}

/** Linha horizontal de skeletons de categorias */
export function SkeletonCategoryGrid() {
  return (
    <View style={styles.categoryContainer}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.categoryItem}>
          <SkeletonCategoryCard />
        </View>
      ))}
    </View>
  );
}

/** Skeleton do carrossel de promoções */
export function SkeletonPromoCarousel() {
  return (
    <View style={styles.promoContainer}>
      <Skeleton
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        borderRadius={Tokens.radius.md}
        style={styles.promoCard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  offerCard: {
    flex: 1,
    borderRadius: Tokens.radius.md,
    overflow: "hidden",
    minWidth: 0,
    padding: Tokens.spacing.sm,
  },
  offerName: {
    marginTop: Tokens.spacing.xs,
  },
  offerPrice: {
    marginTop: Tokens.spacing.xs,
  },
  offersContainer: {
    paddingHorizontal: Tokens.spacing.md,
    paddingBottom: Tokens.spacing.lg,
  },
  offersHeader: {
    marginBottom: Tokens.spacing.md,
  },
  offersRow: {
    flexDirection: "row",
    gap: Tokens.spacing.md,
    marginBottom: Tokens.spacing.md,
  },
  offerCell: {
    flex: 1,
    minWidth: 0,
  },
  categoryCard: {
    alignItems: "center",
    paddingVertical: Tokens.spacing.sm,
    paddingHorizontal: Tokens.spacing.xs,
  },
  categoryTitle: {
    marginTop: Tokens.spacing.xs,
  },
  categoryContainer: {
    flexDirection: "row",
    gap: Tokens.spacing.lg,
    paddingHorizontal: Tokens.spacing.lg,
  },
  categoryItem: {
    alignItems: "center",
  },
  promoContainer: {
    marginVertical: Tokens.spacing.lg,
    paddingHorizontal: Tokens.spacing.md,
    alignItems: "center",
  },
  promoCard: {
    alignSelf: "center",
  },
});
