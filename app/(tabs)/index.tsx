import { StyleSheet } from "react-native";

import { Text, View, useThemeColor } from "@/components/Themed";

export default function TabOneScreen() {
  const separatorColor = useThemeColor("separator");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tela Inicio</Text>
      <View style={[styles.separator, { backgroundColor: separatorColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
