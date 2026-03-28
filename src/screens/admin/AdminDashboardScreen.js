import React, { useCallback, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { apiClient } from "../../services/apiClient";

export function AdminDashboardScreen() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalRequests: 0,
    totalBorrowedActive: 0,
    totalReturned: 0,
    totalPayments: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setIsLoading(true);
    try {
      const results = await Promise.allSettled([
        apiClient.get("/books"),
        apiClient.get("/borrowRequests"),
        apiClient.get("/borrowRecords"),
        apiClient.get("/payments"),
      ]);

      const [booksRes, requestsRes, recordsRes, paymentsRes] = results.map((r) =>
        r.status === "fulfilled" ? r.value : null
      );

      const books = Array.isArray(booksRes.data) ? booksRes.data : [];
      const requests = Array.isArray(requestsRes.data) ? requestsRes.data : [];
      const records = Array.isArray(recordsRes.data) ? recordsRes.data : [];
      const payments = paymentsRes && Array.isArray(paymentsRes.data) ? paymentsRes.data : [];

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
        totalPayments: payments.length,
      });
      const paymentsFailed =
        results[3].status === "rejected" && results[3].reason?.response?.status === 404;
      if (paymentsFailed) {
        setError("Payments API chưa được deploy (404). Dashboard vẫn hiển thị số liệu còn lại.");
      }
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
        Admin Dashboard
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
        <Card>
          <Text style={{ fontSize: 14, color: "#6B7280" }}>Payments (mock)</Text>
          <Text style={{ fontSize: 24, fontWeight: "800", color: "#111827" }}>
            {stats.totalPayments}
          </Text>
        </Card>
      </View>
    </ScreenLayout>
  );
}
