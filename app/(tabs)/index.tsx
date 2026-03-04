import { ScrollView, StyleSheet, View } from "react-native";

import { CategoryGrid } from "@/components/CategoryGrid";
import { PromoCarousel } from "@/components/PromoCarousel";
import { Text, useThemeColor } from "@/components/Themed";
import Colors from "@/constants/Colors";
import { Tokens } from "@/constants/Tokens";

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

export default function HomeScreen() {
  const separatorColor = useThemeColor("separator");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: Tokens.spacing.lg,
    paddingBottom: Tokens.spacing.xl,
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
