import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { AuthContext } from "../../providers/AuthContext";
import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { fetchMyRequestsWithBooks } from "../../services/borrowerTrackingApi";

function StatusPill({ status }) {
  const s = String(status || "").toLowerCase();
  const config =
    s === "approved"
      ? { bg: "#ECFDF5", border: "#6EE7B7", text: "#065F46", label: "Approved" }
      : s === "rejected"
        ? { bg: "#FEF2F2", border: "#FCA5A5", text: "#991B1B", label: "Rejected" }
        : { bg: "#FFFBEB", border: "#FCD34D", text: "#92400E", label: "Pending" };

  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: config.bg,
        borderColor: config.border,
        borderWidth: 1,
      }}
    >
      <Text style={{ color: config.text, fontSize: 12, fontWeight: "800" }}>{config.label}</Text>
    </View>
  );
}

function RequestRow({ item }) {
  const title = item.book?.title || `Book #${item.bookId}`;
  const author = item.book?.author || "-";
  const category = item.book?.category || "-";

  return (
    <Card style={{ gap: 8 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827" }} numberOfLines={1}>
            {title}
          </Text>
          <Text style={{ color: "#374151" }} numberOfLines={1}>
            {author}
          </Text>
          <Text style={{ color: "#6B7280" }} numberOfLines={1}>
            {category}
          </Text>
          <Text style={{ color: "#6B7280" }}>Requested: {item.requestDate || "-"}</Text>
        </View>
        <StatusPill status={item.status} />
      </View>
    </Card>
  );
}

export function MyRequestsScreen() {
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
      const items = await fetchMyRequestsWithBooks(userId);
      setData(items);
    } catch (e) {
      setError(e?.message || "Failed to load requests.");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = useMemo(() => {
    const pending = [];
    const approved = [];
    const rejected = [];
    for (const r of data) {
      const s = String(r?.status || "").toLowerCase();
      if (s === "approved") approved.push(r);
      else if (s === "rejected") rejected.push(r);
      else pending.push(r);
    }
    return [
      { key: "Pending", items: pending },
      { key: "Approved", items: approved },
      { key: "Rejected", items: rejected },
    ];
  }, [data]);

  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        My Requests
      </Text>

      {!userId ? (
        <Card>
          <Text style={{ color: "#6B7280" }}>Please log in as a borrower to view requests.</Text>
        </Card>
      ) : isLoading ? (
        <View style={{ paddingTop: 8, alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <Card>
          <Text style={{ color: "#991B1B" }}>{error}</Text>
        </Card>
      ) : (
        <FlatList
          data={grouped}
          keyExtractor={(g) => g.key}
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
                  <Text style={{ color: "#6B7280" }}>No {group.key.toLowerCase()} requests.</Text>
                </Card>
              ) : (
                <View style={{ gap: 10 }}>
                  {group.items.map((r) => (
                    <RequestRow key={String(r.id)} item={r} />
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

