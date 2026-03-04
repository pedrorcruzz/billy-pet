import { Image, StyleSheet, View } from "react-native";

import { Tokens } from "@/constants/Tokens";

const LOGO_SIZE = 160;

export interface AuthLogoProps {
  children?: React.ReactNode;
  marginBottom?: keyof typeof Tokens.spacing;
}

export function AuthLogo({
  children,
  marginBottom = "xl",
}: AuthLogoProps) {
  return (
    <View style={[styles.container, { marginBottom: Tokens.spacing[marginBottom] }]}>
      <Image
        source={require("@/assets/images/splash-icon.png")}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="Logo Billy Pet"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
