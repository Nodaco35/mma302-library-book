import React from "react";
import { Pressable, Text } from "react-native";

export function PrimaryButton({ title, onPress, variant = "primary", disabled = false }) {
  const isPrimary = variant === "primary";
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => ({
        height: 44,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        paddingHorizontal: 14,
        backgroundColor: isPrimary ? "#2563EB" : "#FFFFFF",
        borderWidth: isPrimary ? 0 : 1,
        borderColor: "#E5E7EB",
        opacity: disabled ? 0.55 : pressed ? 0.85 : 1,
      })}
    >
      <Text
        style={{
          color: isPrimary ? "#FFFFFF" : "#111827",
          fontSize: 15,
          fontWeight: "600",
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

