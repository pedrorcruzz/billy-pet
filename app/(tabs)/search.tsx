import { useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { OfferCard } from "@/components/OfferCard";
import { Text, useThemeColor } from "@/components/Themed";
import { Tokens } from "@/constants/Tokens";
import { useCart } from "@/hooks/useCart";
import { Category, Product, productService } from "@/services/productService";
import { formatPrice } from "@/utils/formatPrice";

const CATEGORIES = productService.listCategories();
const ALL_PRODUCTS = productService.listProducts();

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { addItem } = useCart();

  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const hintColor = useThemeColor("hint");
  const borderColor = useThemeColor("inputBorder");
  const tintColor = useThemeColor("tint");
  const separatorColor = useThemeColor("separator");

  const trimmedQuery = query.trim().toLowerCase();
  const isSearching = trimmedQuery.length > 0;

  const suggestions = isSearching
    ? ALL_PRODUCTS.filter((product) =>
        product.name.toLowerCase().includes(trimmedQuery),
      )
    : [];

  const gridProducts = selectedCategory
    ? ALL_PRODUCTS.filter((p) => p.categoryId === selectedCategory)
    : ALL_PRODUCTS;

  const sectionTitle = selectedCategory
    ? (CATEGORIES.find((c) => c.id === selectedCategory)?.title ?? "Produtos")
    : "Mais buscados";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <View style={[styles.searchBar, { borderColor }]}>
          <Ionicons
            name="search"
            size={22}
            color={hintColor}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.input, { color: textColor }]}
            placeholder="Buscar ração, brinquedos, petiscos..."
            placeholderTextColor={hintColor}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            accessibilityLabel="Campo de busca"
          />
          {query.length > 0 && (
            <Pressable
              onPress={() => setQuery("")}
              accessibilityRole="button"
              accessibilityLabel="Limpar busca"
              hitSlop={10}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color={hintColor} />
            </Pressable>
          )}
        </View>
      </View>

      {isSearching ? (
        <SuggestionsList
          suggestions={suggestions}
          onAdd={addItem}
          textColor={textColor}
          hintColor={hintColor}
          tintColor={tintColor}
          separatorColor={separatorColor}
        />
      ) : (
        <FlatList
          data={gridProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <Text style={[styles.sectionTitle, { color: textColor }]}>
                Categorias
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesRow}
              >
                {CATEGORIES.map((category) => {
                  const isSelected = selectedCategory === category.id;
                  return (
                    <CategoryChip
                      key={category.id}
                      category={category}
                      isSelected={isSelected}
                      onPress={() =>
                        setSelectedCategory(isSelected ? null : category.id)
                      }
                    />
                  );
                })}
              </ScrollView>

              <View
                style={[styles.divider, { backgroundColor: separatorColor }]}
              />

              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: textColor }]}>
                  {sectionTitle}
                </Text>
                {selectedCategory && (
                  <Pressable
                    onPress={() => setSelectedCategory(null)}
                    accessibilityRole="button"
                    accessibilityLabel="Limpar filtro de categoria"
                  >
                    <Text style={[styles.clearLink, { color: tintColor }]}>
                      Limpar
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <OfferCard
              name={item.name}
              price={item.price}
              oldPrice={item.oldPrice}
              source={item.source}
              onPress={() => addItem(item)}
              onAdd={() => addItem(item)}
              accessibilityLabel={`${item.name}, ${formatPrice(item.price)}`}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search" size={48} color={hintColor} />
              <Text style={[styles.emptyText, { color: hintColor }]}>
                Nenhum produto encontrado.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

interface SuggestionsListProps {
  suggestions: Product[];
  onAdd: (product: Product) => void;
  textColor: string;
  hintColor: string;
  tintColor: string;
  separatorColor: string;
}

function SuggestionsList({
  suggestions,
  onAdd,
  textColor,
  hintColor,
  tintColor,
  separatorColor,
}: SuggestionsListProps) {
  if (suggestions.length === 0) {
    return (
      <View style={styles.suggestionsEmpty}>
        <Ionicons name="search" size={48} color={hintColor} />
        <Text style={[styles.suggestionsEmptyTitle, { color: textColor }]}>
          Nada encontrado
        </Text>
        <Text style={[styles.suggestionsEmptyText, { color: hintColor }]}>
          Tente buscar por outro nome de produto.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.suggestionsContainer}>
      <Text style={[styles.suggestionsHeader, { color: hintColor }]}>
        {suggestions.length}{" "}
        {suggestions.length === 1 ? "resultado" : "resultados"}
      </Text>
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.suggestionsListContent}
        keyboardShouldPersistTaps="handled"
        ItemSeparatorComponent={() => (
          <View
            style={[
              styles.suggestionSeparator,
              { backgroundColor: separatorColor },
            ]}
          />
        )}
        renderItem={({ item }) => (
          <SuggestionRow
            product={item}
            onAdd={() => onAdd(item)}
            textColor={textColor}
            hintColor={hintColor}
            tintColor={tintColor}
          />
        )}
      />
    </View>
  );
}

interface SuggestionRowProps {
  product: Product;
  onAdd: () => void;
  textColor: string;
  hintColor: string;
  tintColor: string;
}

function SuggestionRow({
  product,
  onAdd,
  textColor,
  hintColor,
  tintColor,
}: SuggestionRowProps) {
  const onTintColor = useThemeColor("onTint");

  return (
    <Pressable
      style={styles.suggestionRow}
      onPress={onAdd}
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ${formatPrice(product.price)}. Toque para adicionar ao carrinho.`}
    >
      <Image
        source={product.source}
        style={styles.suggestionImage}
        resizeMode="cover"
      />
      <View style={styles.suggestionContent}>
        <Text
          style={[styles.suggestionName, { color: textColor }]}
          numberOfLines={2}
        >
          {product.name}
        </Text>
        <View style={styles.suggestionPriceRow}>
          {product.oldPrice != null && (
            <Text style={[styles.suggestionOldPrice, { color: hintColor }]}>
              {formatPrice(product.oldPrice)}
            </Text>
          )}
          <Text style={[styles.suggestionPrice, { color: tintColor }]}>
            {formatPrice(product.price)}
          </Text>
        </View>
      </View>
      <View
        style={[styles.suggestionAddButton, { backgroundColor: tintColor }]}
      >
        <Ionicons name="add" size={20} color={onTintColor} />
      </View>
    </Pressable>
  );
}

interface CategoryChipProps {
  category: Category;
  isSelected: boolean;
  onPress: () => void;
}

function CategoryChip({ category, isSelected, onPress }: CategoryChipProps) {
  const tintColor = useThemeColor("tint");
  const onTintColor = useThemeColor("onTint");
  const textColor = useThemeColor("text");
  const borderColor = useThemeColor("cardBorderSubtle");
  const backgroundColor = useThemeColor("background");

  return (
    <Pressable
      style={[
        styles.categoryChip,
        {
          backgroundColor: isSelected ? tintColor : backgroundColor,
          borderColor: isSelected ? tintColor : borderColor,
        },
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Filtrar por ${category.title}`}
      accessibilityState={{ selected: isSelected }}
    >
      <Image
        source={category.source}
        style={styles.categoryChipImage}
        resizeMode="cover"
      />
      <Text
        style={[
          styles.categoryChipText,
          { color: isSelected ? onTintColor : textColor },
        ]}
        numberOfLines={1}
      >
        {category.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Tokens.spacing.md,
    paddingTop: Tokens.spacing.md,
    paddingBottom: Tokens.spacing.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Tokens.radius.lg,
    paddingHorizontal: Tokens.spacing.md,
    minHeight: Tokens.touchTarget,
  },
  searchIcon: {
    marginRight: Tokens.spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Tokens.typography.body,
    paddingVertical: Tokens.spacing.sm,
  },
  clearButton: {
    paddingLeft: Tokens.spacing.sm,
  },
  listContent: {
    paddingHorizontal: Tokens.spacing.md,
    paddingBottom: 140,
  },
  sectionTitle: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
    marginBottom: Tokens.spacing.md,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clearLink: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.semibold,
    marginBottom: Tokens.spacing.md,
  },
  categoriesRow: {
    paddingRight: Tokens.spacing.md,
    gap: Tokens.spacing.sm,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: Tokens.radius.lg,
    paddingVertical: Tokens.spacing.xs,
    paddingHorizontal: Tokens.spacing.sm,
    paddingRight: Tokens.spacing.md,
    minHeight: Tokens.touchTarget,
  },
  categoryChipImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: Tokens.spacing.sm,
  },
  categoryChipText: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  divider: {
    height: 1,
    marginVertical: Tokens.spacing.lg,
  },
  productRow: {
    gap: Tokens.spacing.md,
    marginBottom: Tokens.spacing.md,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Tokens.spacing.xl * 2,
    gap: Tokens.spacing.md,
  },
  emptyText: {
    fontSize: Tokens.typography.body,
  },
  suggestionsContainer: {
    flex: 1,
    paddingHorizontal: Tokens.spacing.md,
  },
  suggestionsHeader: {
    fontSize: 13,
    fontWeight: Tokens.typography.fontWeight.semibold,
    marginBottom: Tokens.spacing.sm,
    marginTop: Tokens.spacing.xs,
  },
  suggestionsListContent: {
    paddingBottom: 140,
  },
  suggestionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Tokens.spacing.sm,
    gap: Tokens.spacing.md,
  },
  suggestionImage: {
    width: 56,
    height: 56,
    borderRadius: Tokens.radius.sm,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionName: {
    fontSize: Tokens.typography.body,
    fontWeight: Tokens.typography.fontWeight.semibold,
  },
  suggestionPriceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: Tokens.spacing.sm,
    marginTop: 2,
  },
  suggestionOldPrice: {
    fontSize: 12,
    textDecorationLine: "line-through",
  },
  suggestionPrice: {
    fontSize: 14,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  suggestionAddButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionSeparator: {
    height: 1,
    marginLeft: 56 + Tokens.spacing.md,
  },
  suggestionsEmpty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Tokens.spacing.xl,
    gap: Tokens.spacing.sm,
    paddingBottom: 120,
  },
  suggestionsEmptyTitle: {
    fontSize: Tokens.typography.h3,
    fontWeight: Tokens.typography.fontWeight.bold,
  },
  suggestionsEmptyText: {
    fontSize: Tokens.typography.body,
    textAlign: "center",
  },
});
