import React from "react";
import { Platform, View } from "react-native";

export function ScreenLayout({ children }) {
  return (
    <View
      style={{
        flex: 1,
        padding: 16,
        paddingTop: Platform.OS === "android" ? 16 : 16,
      }}
    >
      {children}
    </View>
  );
}

