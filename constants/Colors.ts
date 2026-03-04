const greenSecondary = "#497700";
const brownCard = "#C25A14";
const grayDark = "#2E2E2C";
const grayBorderSubtle = "#D4D4D4";
const graySkeleton = "#E5E7EB";
const whiteLight = "#FFF";
const grayHint = "#6B7280";
const grayTabIcon = "#717171";
const grayBorder = "#9CA3AF";
const graySeparator = "#EEEEEE";
const grayCarouselDot = "#B3B3B3";
const redError = "#B91C1C";
const shadowBlack = "#000";

export default {
  light: {
    text: grayDark,
    background: whiteLight,
    tint: greenSecondary,
    secondary: greenSecondary,
    card: brownCard,
    tabIconDefault: grayTabIcon,
    tabIconSelected: greenSecondary,
    hint: grayHint,
    inputBorder: grayBorder,
    error: redError,
    onTint: whiteLight,
    separator: graySeparator,
    carouselDotActive: whiteLight,
    carouselDotInactive: grayCarouselDot,
    shadow: shadowBlack,
    /** Cor para links "Ver mais ofertas", "Ver mais x", etc. */
    viewMoreLink: brownCard,
    /** Borda sutil em cards */
    cardBorderSubtle: grayBorderSubtle,
    /** Skeleton loading */
    skeletonBase: graySkeleton,
  },
};
