import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { AuthContext } from "../../providers/AuthContext";
import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { fetchMyBorrowRecordsWithBooks } from "../../services/borrowerTrackingApi";

function HistoryRow({ item }) {
  const title = item.book?.title || `Book #${item.bookId}`;
  const author = item.book?.author || "-";
  const category = item.book?.category || "-";

  return (
    <Card style={{ gap: 8 }}>
      <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827" }} numberOfLines={1}>
        {title}
      </Text>
      <Text style={{ color: "#374151" }} numberOfLines={1}>
        {author}
      </Text>
      <Text style={{ color: "#6B7280" }} numberOfLines={1}>
        {category}
      </Text>
      <Text style={{ color: "#6B7280" }}>Borrowed: {item.borrowDate || "-"}</Text>
      <Text style={{ color: "#6B7280" }}>Returned: {item.returnDate || "-"}</Text>
    </Card>
  );
}

export function BorrowHistoryScreen() {
  const auth = useContext(AuthContext);
  const userId = auth?.session?.user?.id;

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!userId) return;
    setError("");
    setIsLoading(true);
    try {
      const items = await fetchMyBorrowRecordsWithBooks(userId);
      setData(items);
    } catch (e) {
      setError(e?.message || "Failed to load history.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const history = useMemo(() => {
    return data.filter((r) => !!r?.returnDate || String(r?.status || "").toLowerCase() !== "borrowed");
  }, [data]);

  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        Borrow History
      </Text>

      {!userId ? (
        <Card>
          <Text style={{ color: "#6B7280" }}>Please log in as a borrower to view history.</Text>
        </Card>
      ) : isLoading ? (
        <View style={{ paddingTop: 8, alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <Card>
          <Text style={{ color: "#991B1B" }}>{error}</Text>
        </Card>
      ) : history.length === 0 ? (
        <Card>
          <Text style={{ color: "#6B7280" }}>No past borrow records yet.</Text>
        </Card>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
          onRefresh={load}
          refreshing={isLoading}
          renderItem={({ item }) => <HistoryRow item={item} />}
        />
      )}
    </ScreenLayout>
  );
}

