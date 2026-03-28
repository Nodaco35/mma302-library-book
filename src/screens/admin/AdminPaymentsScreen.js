import React, { useCallback, useState } from "react";
import { FlatList, Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { fetchPayments } from "../../services/paymentsApi";

export function AdminPaymentsScreen() {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const list = await fetchPayments();
      const sorted = [...list].sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
      setPayments(sorted);
    } catch (e) {
      if (e?.response?.status === 404) {
        setError("Payments API chưa được deploy (404).");
        setPayments([]);
      } else {
        setError(e?.message || "Failed to load payments.");
      }
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
        Payments (Mock)
      </Text>

      {error ? (
        <Card>
          <Text style={{ color: "#991B1B" }}>{error}</Text>
        </Card>
      ) : null}

      <FlatList
        data={payments}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
        ListEmptyComponent={
          <Card>
            <Text style={{ color: "#6B7280" }}>No payments yet.</Text>
          </Card>
        }
        renderItem={({ item }) => (
          <Card style={{ gap: 6 }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827" }}>
              Payment #{item.id}
            </Text>
            <Text style={{ color: "#374151" }}>User: {item.userId || "============="}</Text>
            <Text style={{ color: "#374151" }}>
              Borrow record: {item.borrowRecordId || "============="}
            </Text>
            <Text style={{ color: "#6B7280" }}>
              Amount: {item.amount} {item.currency || "VND"}
            </Text>
            <Text style={{ color: "#6B7280" }}>Status: {item.status || "-"}</Text>
            <Text style={{ color: "#6B7280" }}>Method: {item.method || "-"}</Text>
            <Text style={{ color: "#6B7280" }}>Created: {item.createdAt || "-"}</Text>
          </Card>
        )}
      />
    </ScreenLayout>
  );
}
