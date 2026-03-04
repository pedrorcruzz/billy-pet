import { ScrollView, StyleSheet } from "react-native";

import { PromoCarousel } from "@/components/PromoCarousel";
import { Text, View, useThemeColor } from "@/components/Themed";
import { Tokens } from "@/constants/Tokens";

const PROMO_CARDS = [
  require("@/assets/cards/card-1.png"),
  require("@/assets/cards/card-2.png"),
  require("@/assets/cards/card-3.png"),
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
      <View style={[styles.separator, { backgroundColor: separatorColor }]} />
      <Text style={styles.title}>Tela Início</Text>
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
  title: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
    paddingHorizontal: Tokens.spacing.lg,
    marginTop: Tokens.spacing.lg,
  },
  separator: {
    marginHorizontal: Tokens.spacing.lg,
    marginVertical: Tokens.spacing.md,
    height: 1,
  },
});
