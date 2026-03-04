import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { Text, useThemeColor } from "@/components/Themed";
import { Tokens } from "@/constants/Tokens";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const backgroundColor = useThemeColor("background");
  const textColor = useThemeColor("text");
  const hintColor = useThemeColor("hint");
  const borderColor = useThemeColor("inputBorder");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.searchBar, { borderColor }]}>
        <Ionicons
          name="search"
          size={22}
          color={hintColor}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder="Buscar produtos..."
          placeholderTextColor={hintColor}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          accessibilityLabel="Campo de busca"
        />
      </View>
      <View style={styles.content}>
        <Text style={[styles.placeholder, { color: hintColor }]}>
          {query
            ? `Resultados para "${query}"`
            : "Digite para buscar ração, acessórios, medicamentos..."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Tokens.spacing.lg,
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Tokens.spacing.xl,
  },
  placeholder: {
    fontSize: Tokens.typography.body,
    textAlign: "center",
  },
});
