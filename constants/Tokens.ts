/**
 * Design Tokens — Billy Pet
 * Modelo baseado em tokens. WCAG 2.0 AA.
 * @see .cursor/rules/design-system.mdc
 */

export const Tokens = {
  typography: {
    body: 16,
    h3: 20,
    h2: 24,
    h1: 28,
    fontWeight: {
      normal: '400' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  touchTarget: 48, // min 48×48 (Apple 44, Android 48)
} as const;
