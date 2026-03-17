import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { fetchPendingRequestsWithDetails } from "../../services/staffRequestsApi";

function RequestRow({ item, onPress }) {
  const title = item.book?.title || `Book #${item.bookId}`;
  const borrower = item.borrower?.name || `User #${item.userId}`;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      <Card style={{ gap: 8 }}>
        <Text style={{ fontSize: 16, fontWeight: "900", color: "#111827" }} numberOfLines={1}>
          {title}
        </Text>
        <Text style={{ color: "#374151" }} numberOfLines={1}>
          Borrower: {borrower}
        </Text>
        <Text style={{ color: "#6B7280" }}>Requested: {item.requestDate || "-"}</Text>
      </Card>
    </Pressable>
  );
}

export function StaffRequestsScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setIsLoading(true);
    try {
      const items = await fetchPendingRequestsWithDetails();
      setData(items);
    } catch (e) {
      setError(e?.message || "Failed to load requests.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        Borrow Requests
      </Text>

      {isLoading ? (
        <View style={{ paddingTop: 8, alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <Card>
          <Text style={{ color: "#991B1B", marginBottom: 10 }}>{error}</Text>
          <Pressable
            onPress={load}
            style={({ pressed }) => ({
              height: 44,
              borderRadius: 12,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: "#E5E7EB",
              backgroundColor: "#FFFFFF",
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ fontWeight: "800", color: "#111827" }}>Retry</Text>
          </Pressable>
        </Card>
      ) : data.length === 0 ? (
        <Card>
          <Text style={{ color: "#6B7280" }}>No pending requests.</Text>
        </Card>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
          onRefresh={load}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <RequestRow
              item={item}
              onPress={() => navigation.navigate("StaffRequestDetail", { requestId: item.id })}
            />
          )}
        />
      )}
    </ScreenLayout>
  );
}

