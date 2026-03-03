import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Tokens } from '@/constants/Tokens';

const ICON_SIZE = 56;

const SOCIAL_ICONS = {
  google: require('@/assets/icons/google.jpg'),
  apple: require('@/assets/icons/apple.jpg'),
  facebook: require('@/assets/icons/facebook.png'),
} as const;

export type SocialProvider = keyof typeof SOCIAL_ICONS;

export interface SocialLoginButtonsProps {
  onGooglePress?: () => void;
  onApplePress?: () => void;
  onFacebookPress?: () => void;
}

export function SocialLoginButtons({
  onGooglePress,
  onApplePress,
  onFacebookPress,
}: SocialLoginButtonsProps) {
  const providers: { key: SocialProvider; onPress?: () => void }[] = [
    { key: 'google', onPress: onGooglePress },
    { key: 'apple', onPress: onApplePress },
    { key: 'facebook', onPress: onFacebookPress },
  ];

  return (
    <View style={styles.container}>
      {providers.map(({ key, onPress }) => (
        <Pressable
          key={key}
          style={styles.iconButton}
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={`Entrar com ${key === 'google' ? 'Google' : key === 'apple' ? 'Apple' : 'Facebook'}`}
        >
          <Image
            source={SOCIAL_ICONS[key]}
            style={styles.icon}
            resizeMode="contain"
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Tokens.spacing.xl,
  },
  iconButton: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});
