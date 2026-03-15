import React from "react";
import { View } from "react-native";

export function Card({ children, style }) {
  return (
    <View
      style={[
        {
          backgroundColor: "#FFFFFF",
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: "#E5E7EB",
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

