import React, { useCallback, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { fetchBorrowRecords } from "../../services/borrowRecordsApi";

export function AdminBorrowRecordsScreen() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const list = await fetchBorrowRecords();
      const sorted = [...list].sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
      setRecords(sorted);
    } catch (e) {
      setError(e?.message || "Failed to load borrow records.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        Borrow Records
      </Text>

      {error ? (
        <Card>
          <Text style={{ color: "#991B1B" }}>{error}</Text>
        </Card>
      ) : null}

      <FlatList
        data={records}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
        ListEmptyComponent={
          <Card>
            <Text style={{ color: "#6B7280" }}>No borrow records yet.</Text>
          </Card>
        }
        renderItem={({ item }) => (
          <Card style={{ gap: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827" }}>
              Record #{item.id}
            </Text>
            <Text style={{ color: "#374151" }}>User: {item.userId || "============="}</Text>
            <Text style={{ color: "#374151" }}>Book: {item.bookId || "============="}</Text>
            <Text style={{ color: "#6B7280" }}>Status: {item.status || "-"}</Text>
            <Text style={{ color: "#6B7280" }}>Borrowed: {item.borrowDate || "-"}</Text>
            <Text style={{ color: "#6B7280" }}>Returned: {item.returnDate || "-"}</Text>
          </Card>
        )}
      />
    </ScreenLayout>
  );
}
