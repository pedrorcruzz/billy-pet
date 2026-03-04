import {
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";

import { Tokens } from "@/constants/Tokens";

import { CategoryCard } from "./CategoryCard";

export interface CategoryItem {
  title: string;
  source: ImageSourcePropType;
}

export interface CategoryGridProps {
  items: CategoryItem[];
  columns?: number;
  onCategoryPress?: (index: number) => void;
}

export function CategoryGrid({
  items,
  onCategoryPress,
}: CategoryGridProps) {
  const { width } = useWindowDimensions();
  const padding = Tokens.spacing.lg;
  const gap = Tokens.spacing.lg;
  const itemWidth = (width - padding * 2 - gap * 2) / 3.5;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, { paddingHorizontal: padding }]}
    >
      {items.map((item, index) => (
        <View
          key={index}
          style={[
            styles.item,
            {
              width: itemWidth,
              marginRight: index < items.length - 1 ? gap : padding,
            },
          ]}
        >
          <CategoryCard
            title={item.title}
            source={item.source}
            onPress={() => onCategoryPress?.(index)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  item: {
    alignItems: "center",
  },
});
