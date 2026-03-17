import React from "react";
import { Pressable, Text, View } from "react-native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";

function NavRow({ title, subtitle, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      <Card style={{ gap: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: "900", color: "#111827" }}>{title}</Text>
        <Text style={{ color: "#6B7280" }}>{subtitle}</Text>
      </Card>
    </Pressable>
  );
}

export function BorrowedScreen({ navigation }) {
  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        Tracking
      </Text>

      <View style={{ gap: 10 }}>
        <NavRow
          title="My Requests"
          subtitle="Pending, approved, rejected"
          onPress={() => navigation.navigate("MyRequests")}
        />
        <NavRow
          title="Borrowed Books"
          subtitle="Currently borrowed books"
          onPress={() => navigation.navigate("BorrowedBooks")}
        />
        <NavRow
          title="Borrow History"
          subtitle="Returned and past borrow records"
          onPress={() => navigation.navigate("BorrowHistory")}
        />
      </View>
    </ScreenLayout>
  );
}

