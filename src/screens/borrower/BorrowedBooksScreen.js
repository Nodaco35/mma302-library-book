import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { AuthContext } from "../../providers/AuthContext";
import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { fetchMyBorrowRecordsWithBooks } from "../../services/borrowerTrackingApi";

function RecordRow({ item }) {
  const title = item.book?.title || `Book #${item.bookId}`;
  const author = item.book?.author || "-";
  const category = item.book?.category || "-";
  const status = String(item?.status || "").toLowerCase();
  const statusLabel = status ? status.replace(/_/g, " ") : "-";

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
      <Text style={{ color: "#6B7280" }}>Status: {statusLabel}</Text>
      <Text style={{ color: "#6B7280" }}>Borrowed: {item.borrowDate || "-"}</Text>
      <Text style={{ color: "#6B7280" }}>Due: {item.dueDate || "-"}</Text>
      <Text style={{ color: "#6B7280" }}>Returned: {item.returnDate || "-"}</Text>
    </Card>
  );
}

export function BorrowedBooksScreen() {
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
      setError(e?.message || "Failed to load borrowed books.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = useMemo(() => {
    const borrowed = [];
    const returned = [];
    for (const r of data) {
      const status = String(r?.status || "").toLowerCase();
      if (status === "borrowed" && !r?.returnDate) borrowed.push(r);
      else returned.push(r);
    }
    return [
      { key: "Borrowed", items: borrowed },
      { key: "Returned", items: returned },
    ];
  }, [data]);

  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        Borrowed Books
      </Text>

      {!userId ? (
        <Card>
          <Text style={{ color: "#6B7280" }}>Please log in as a borrower to view borrowed books.</Text>
        </Card>
      ) : isLoading ? (
        <View style={{ paddingTop: 8, alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <Card>
          <Text style={{ color: "#991B1B" }}>{error}</Text>
        </Card>
      ) : data.length === 0 ? (
        <Card>
          <Text style={{ color: "#6B7280" }}>You have no borrow records yet.</Text>
        </Card>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(group) => group.key}
          contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
          onRefresh={load}
          refreshing={isLoading}
          renderItem={({ item: group }) => (
            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 16, fontWeight: "900", color: "#111827" }}>
                {group.key} ({group.items.length})
              </Text>
              {group.items.length === 0 ? (
                <Card>
                  <Text style={{ color: "#6B7280" }}>
                    No {group.key.toLowerCase()} records.
                  </Text>
                </Card>
              ) : (
                <View style={{ gap: 10 }}>
                  {group.items.map((r) => (
                    <RecordRow key={String(r.id)} item={r} />
                  ))}
                </View>
              )}
            </View>
          )}
        />
      )}
    </ScreenLayout>
  );
}
