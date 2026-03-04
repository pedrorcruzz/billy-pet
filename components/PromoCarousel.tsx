import { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageSourcePropType,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  View,
} from "react-native";

import Colors from "@/constants/Colors";
import { Tokens } from "@/constants/Tokens";

import { PromoCard } from "./PromoCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_MARGIN = Tokens.spacing.md;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;
const CARD_HEIGHT = 270;
const AUTO_SCROLL_INTERVAL_MS = 5500;

export interface PromoCarouselProps {
  items: ImageSourcePropType[];
  onCardPress?: (index: number) => void;
}

export function PromoCarousel({ items, onCardPress }: PromoCarouselProps) {
  const flatListRef = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const isUserScrolling = useRef(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  activeIndexRef.current = activeIndex;

  if (items.length === 0) return null;

  const infiniteData = [items[items.length - 1], ...items, items[0]];

  const itemWidth = CARD_WIDTH + CARD_MARGIN * 2;

  const scrollToOffset = useCallback(
    (index: number, animated = true) => {
      flatListRef.current?.scrollToOffset({
        offset: index * itemWidth,
        animated,
      });
    },
    [itemWidth],
  );

  useEffect(() => {
    const id = setInterval(() => {
      if (isUserScrolling.current) return;
      const current = activeIndexRef.current;
      if (current === items.length - 1) {
        scrollToOffset(infiniteData.length - 1, true);
      } else {
        scrollToOffset(current + 2, true);
      }
    }, AUTO_SCROLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [items.length, infiniteData.length, scrollToOffset]);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: itemWidth,
      offset: itemWidth * index,
      index,
    }),
    [itemWidth],
  );

  const handleScrollBeginDrag = useCallback(() => {
    isUserScrolling.current = true;
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrolling.current = false;
    }, 3000);
  }, []);

  const handleMomentumScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / itemWidth);

      if (index === 0) {
        scrollToOffset(items.length, false);
        setActiveIndex(items.length - 1);
      } else if (index === infiniteData.length - 1) {
        scrollToOffset(1, false);
        setActiveIndex(0);
      } else {
        setActiveIndex(index - 1);
      }
    },
    [items.length, infiniteData.length, itemWidth, scrollToOffset],
  );

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = e.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / itemWidth);
      if (index >= 1 && index <= items.length) {
        setActiveIndex(index - 1);
      }
    },
    [items.length, itemWidth],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: ImageSourcePropType; index: number }) => (
      <View style={styles.cardWrapper}>
        <View style={styles.cardContainer}>
          <PromoCard
            source={item}
            onPress={() => onCardPress?.(index % items.length)}
          />
        </View>
      </View>
    ),
    [items.length, onCardPress],
  );

  return (
    <View style={[styles.container, { height: CARD_HEIGHT }]}>
      <FlatList
        ref={flatListRef}
        data={infiniteData}
        renderItem={renderItem}
        keyExtractor={(_, i) => `promo-${i}`}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={itemWidth}
        snapToAlignment="start"
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        initialScrollIndex={1}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToOffset({
              offset: info.index * itemWidth,
              animated: false,
            });
          }, 100);
        }}
      />
      <View
        style={[styles.pagination, { width: CARD_WIDTH }]}
        pointerEvents="box-none"
      >
        {items.map((_, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              {
                backgroundColor:
                  i === activeIndex
                    ? Colors.light.carouselDotActive
                    : Colors.light.carouselDotInactive,
                width: i === activeIndex ? 20 : 12,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Tokens.spacing.lg,
    position: "relative",
  },
  listContent: {
    alignItems: "center",
  },
  cardWrapper: {
    width: CARD_WIDTH + CARD_MARGIN * 2,
    paddingHorizontal: CARD_MARGIN,
    justifyContent: "center",
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  pagination: {
    position: "absolute",
    bottom: Tokens.spacing.sm,
    left: CARD_MARGIN,
    right: CARD_MARGIN,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Tokens.spacing.sm,
  },
  bar: {
    height: 3,
    borderRadius: 2,
  },
});
