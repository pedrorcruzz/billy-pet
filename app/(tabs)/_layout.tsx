import React from "react";
import { Tabs } from "expo-router";
import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import Colors from "@/constants/Colors";

const TAB_ICON_SIZE = 25;
const CART_ICON_SIZE = 60;
const cartIconCircleStyle = {
  width: CART_ICON_SIZE,
  height: CART_ICON_SIZE,
  borderRadius: CART_ICON_SIZE / 2,
  backgroundColor: Colors.light.tint,
  justifyContent: "center" as const,
  alignItems: "center" as const,
  marginTop: -12,
};

const TAB_BAR_HEIGHT = 70;
const tabBarStyle = {
  position: "absolute" as const,
  height: TAB_BAR_HEIGHT,
  borderRadius: TAB_BAR_HEIGHT / 2,
  backgroundColor: Colors.light.background,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  borderTopWidth: 0,
  paddingBottom: 0,
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        tabBarStyle,
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categorias",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "grid" : "grid-outline"}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Carrinho",
          tabBarIcon: ({ focused }) => (
            <View style={cartIconCircleStyle}>
              <Ionicons
                name={focused ? "cart" : "cart-outline"}
                size={TAB_ICON_SIZE}
                color={Colors.light.onTint}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "Pedidos",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "clipboard" : "clipboard-outline"}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={TAB_ICON_SIZE}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
