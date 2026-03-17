import React from "react";
import { Text } from "react-native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";

export function BooksScreen() {
  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        Books
      </Text>
      <Card>
        <Text style={{ color: "#6B7280" }}>
          Placeholder for browse/search/filter + book details.
        </Text>
      </Card>
    </ScreenLayout>
  );
}

