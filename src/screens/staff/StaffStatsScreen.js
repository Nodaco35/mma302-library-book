import React, { useCallback, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { apiClient } from "../../services/apiClient";

export function StaffStatsScreen() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalRequests: 0,
    totalBorrowedActive: 0,
    totalReturned: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setIsLoading(true);
    try {
      const [booksRes, requestsRes, recordsRes] = await Promise.all([
        apiClient.get("/books"),
        apiClient.get("/borrowRequests"),
        apiClient.get("/borrowRecords"),
      ]);

      const books = Array.isArray(booksRes.data) ? booksRes.data : [];
      const requests = Array.isArray(requestsRes.data) ? requestsRes.data : [];
      const records = Array.isArray(recordsRes.data) ? recordsRes.data : [];

      const totalBorrowedActive = records.filter((r) => {
        const status = String(r?.status || "").toLowerCase();
        return status === "borrowed" && !r?.returnDate;
      }).length;

      const totalReturned = records.filter((r) => {
        const status = String(r?.status || "").toLowerCase();
        return status === "returned" || !!r?.returnDate;
      }).length;

      setStats({
        totalBooks: books.length,
        totalRequests: requests.length,
        totalBorrowedActive,
        totalReturned,
      });
    } catch (e) {
      setError(e?.message || "Failed to load statistics.");
    } finally {
      setIsLoading(false);
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
        Statistics
      </Text>

      {isLoading ? (
        <View style={{ paddingTop: 8, alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      ) : null}

      {error ? (
        <Card>
          <Text style={{ color: "#991B1B", marginBottom: 8 }}>{error}</Text>
          <Text style={{ color: "#6B7280" }}>Pull to refresh to try again.</Text>
        </Card>
      ) : null}

      <View style={{ gap: 10, marginTop: 12 }}>
        <Card>
          <Text style={{ fontSize: 14, color: "#6B7280" }}>Total books</Text>
          <Text style={{ fontSize: 24, fontWeight: "800", color: "#111827" }}>
            {stats.totalBooks}
          </Text>
        </Card>
        <Card>
          <Text style={{ fontSize: 14, color: "#6B7280" }}>Total borrow requests</Text>
          <Text style={{ fontSize: 24, fontWeight: "800", color: "#111827" }}>
            {stats.totalRequests}
          </Text>
        </Card>
        <Card>
          <Text style={{ fontSize: 14, color: "#6B7280" }}>Borrowed (active)</Text>
          <Text style={{ fontSize: 24, fontWeight: "800", color: "#111827" }}>
            {stats.totalBorrowedActive}
          </Text>
        </Card>
        <Card>
          <Text style={{ fontSize: 14, color: "#6B7280" }}>Returned / completed</Text>
          <Text style={{ fontSize: 24, fontWeight: "800", color: "#111827" }}>
            {stats.totalReturned}
          </Text>
        </Card>
      </View>
    </ScreenLayout>
  );
}

