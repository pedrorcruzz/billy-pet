import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { CategoryGrid } from "@/components/CategoryGrid";
import { Offer } from "@/components/OffersGrid";
import { OffersGrid } from "@/components/OffersGrid";
import { PromoCarousel } from "@/components/PromoCarousel";
import {
  SkeletonCategoryGrid,
  SkeletonOffersGrid,
  SkeletonPromoCarousel,
} from "@/components/SkeletonPresets";
import { Text, useThemeColor } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Tokens } from "@/constants/Tokens";
import { useCart } from "@/hooks/useCart";
import { productService } from "@/services/productService";

const PROMO_CARDS = [
  require("@/assets/cards/card-1.png"),
  require("@/assets/cards/card-2.png"),
  require("@/assets/cards/card-3.png"),
];

const CATEGORIES = [
  { title: "Brinquedos", source: require("@/assets/categories/brinquedo.png") },
  { title: "Conforto", source: require("@/assets/categories/cama.png") },
  { title: "Rações", source: require("@/assets/categories/racoes.png") },
  { title: "Petiscos", source: require("@/assets/categories/brinquedo.png") },
  { title: "Higiene", source: require("@/assets/categories/cama.png") },
];

const OFFERS: Offer[] = productService
  .listProducts()
  .filter((product) => product.oldPrice != null)
  .map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    oldPrice: product.oldPrice,
    source: product.source,
  }));

const LOADING_DELAY_MS = 800;

export default function HomeScreen() {
  const router = useRouter();
  const separatorColor = useThemeColor("separator");
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  const handleAddOffer = (offer: Offer) => {
    const product = productService.findById(offer.id);
    if (product) addItem(product);
  };

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), LOADING_DELAY_MS);
    return () => clearTimeout(id);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {isLoading ? (
        <>
          <SkeletonPromoCarousel />
          <View style={styles.separatorWithTitle}>
            <View style={[styles.separatorLine, { backgroundColor: separatorColor }]} />
            <View style={styles.categoriesTitleBadge}>
              <Text
                style={styles.categoriesTitleBadgeText}
                color={Colors.light.onTint}
              >
                Categorias
              </Text>
            </View>
            <View style={[styles.separatorLine, { backgroundColor: separatorColor }]} />
          </View>
          <View style={styles.categoriesWrapper}>
            <SkeletonCategoryGrid />
          </View>
          <View style={[styles.separator, { backgroundColor: separatorColor }]} />
          <SkeletonOffersGrid />
        </>
      ) : (
        <>
          <PromoCarousel items={PROMO_CARDS} />
          <View style={styles.separatorWithTitle}>
            <View style={[styles.separatorLine, { backgroundColor: separatorColor }]} />
            <View style={styles.categoriesTitleBadge}>
              <Text
                style={styles.categoriesTitleBadgeText}
                color={Colors.light.onTint}
              >
                Categorias
              </Text>
            </View>
            <View style={[styles.separatorLine, { backgroundColor: separatorColor }]} />
          </View>
          <View style={styles.categoriesWrapper}>
            <CategoryGrid items={CATEGORIES} />
          </View>
          <View style={[styles.separator, { backgroundColor: separatorColor }]} />
          <OffersGrid
            offers={OFFERS}
            onViewMore={() => router.push("/(tabs)/search")}
            onOfferAdd={handleAddOffer}
            onOfferPress={handleAddOffer}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: Tokens.spacing.lg,
    paddingBottom: 120,
  },
  separator: {
    marginHorizontal: Tokens.spacing.lg,
    marginVertical: Tokens.spacing.md,
    height: 1,
  },
  separatorWithTitle: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Tokens.spacing.lg,
    marginVertical: Tokens.spacing.md,
    gap: Tokens.spacing.md,
  },
  separatorLine: {
    flex: 1,
    height: 1,
  },
  categoriesTitleBadge: {
    backgroundColor: Colors.light.tint,
    paddingHorizontal: Tokens.spacing.md,
    paddingVertical: 6,
    borderRadius: Tokens.radius.md,
    flexShrink: 0,
  },
  categoriesTitleBadgeText: {
    color: Colors.light.onTint,
    fontSize: 14,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  categoriesWrapper: {
    marginTop: 0,
  },
});
