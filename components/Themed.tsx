/**
 * Componentes com cores do design system — Billy Pet
 */
import { Text as DefaultText, View as DefaultView } from 'react-native';

import Colors from '@/constants/Colors';

export type TextProps = DefaultText['props'] & { color?: string };
export type ViewProps = DefaultView['props'] & { backgroundColor?: string };

export function useThemeColor(
  colorName: keyof typeof Colors.light,
  override?: string
): string {
  return override ?? Colors.light[colorName];
}

export function Text(props: TextProps) {
  const { style, color, ...otherProps } = props;
  const textColor = useThemeColor('text', color);

  return <DefaultText style={[{ color: textColor }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, backgroundColor: bgOverride, ...otherProps } = props;
  const bg = useThemeColor('background', bgOverride);

  return <DefaultView style={[{ backgroundColor: bg }, style]} {...otherProps} />;
}
