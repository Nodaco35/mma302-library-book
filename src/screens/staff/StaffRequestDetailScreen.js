import React, { useCallback, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { AuthContext } from "../../providers/AuthContext";
import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import {
  fetchRequestByIdWithDetails,
  updateRequestStatus,
} from "../../services/staffRequestsApi";

function ActionButton({ title, variant, disabled, onPress }) {
  const bg =
    variant === "danger" ? "#DC2626" : variant === "secondary" ? "#FFFFFF" : "#2563EB";
  const border = variant === "secondary" ? "#E5E7EB" : bg;
  const text = variant === "secondary" ? "#111827" : "#FFFFFF";

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={({ pressed }) => ({
        flex: 1,
        height: 46,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: bg,
        borderWidth: 1,
        borderColor: border,
        opacity: disabled ? 0.55 : pressed ? 0.85 : 1,
      })}
    >
      <Text style={{ color: text, fontWeight: "900" }}>{title}</Text>
    </Pressable>
  );
}

export function StaffRequestDetailScreen({ route, navigation }) {
  const { requestId } = route.params || {};
  const auth = useContext(AuthContext);
  const staffId = auth?.session?.user?.id;

  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const load = useCallback(async () => {
    setFeedback({ type: "", message: "" });
    setIsLoading(true);
    try {
      const data = await fetchRequestByIdWithDetails(requestId);
      setItem(data);
    } catch (e) {
      setFeedback({ type: "error", message: e?.message || "Failed to load request." });
    } finally {
      setIsLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    load();
  }, [load]);

  async function onUpdate(nextStatus) {
    if (!staffId) {
      setFeedback({ type: "error", message: "You must be logged in as staff." });
      return;
    }
    if (!item?.id) return;

    setIsSaving(true);
    setFeedback({ type: "", message: "" });
    try {
      const updated = await updateRequestStatus({
        requestId: item.id,
        status: nextStatus,
        approvedBy: staffId,
      });
      setItem((prev) => ({ ...(prev || {}), ...updated }));
      setFeedback({
        type: "success",
        message: nextStatus === "approved" ? "Request approved." : "Request rejected.",
      });
      navigation.setOptions({ title: `Request #${item.id}` });
    } catch (e) {
      setFeedback({ type: "error", message: e?.message || "Failed to update request." });
    } finally {
      setIsSaving(false);
    }
  }

  const isPending = String(item?.status || "").toLowerCase() === "pending";

  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        Request detail
      </Text>

      {isLoading ? (
        <View style={{ paddingTop: 8, alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      ) : !item ? (
        <Card>
          <Text style={{ color: "#6B7280" }}>Request not found.</Text>
        </Card>
      ) : (
        <View style={{ gap: 12 }}>
          <Card style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "900", color: "#111827" }}>
              Request #{item.id}
            </Text>
            <Text style={{ color: "#374151" }}>Status: {item.status}</Text>
            <Text style={{ color: "#6B7280" }}>Requested: {item.requestDate || "-"}</Text>
            <View style={{ height: 6 }} />
            <Text style={{ fontWeight: "800", color: "#111827" }}>Borrower</Text>
            <Text style={{ color: "#374151" }}>{item.borrower?.name || `User #${item.userId}`}</Text>
            <Text style={{ color: "#6B7280" }}>{item.borrower?.email || "-"}</Text>
            <View style={{ height: 6 }} />
            <Text style={{ fontWeight: "800", color: "#111827" }}>Book</Text>
            <Text style={{ color: "#374151" }}>{item.book?.title || `Book #${item.bookId}`}</Text>
            <Text style={{ color: "#6B7280" }}>
              {item.book?.author || "-"} • {item.book?.category || "-"}
            </Text>
          </Card>

          {feedback?.message ? (
            <Card
              style={{
                backgroundColor: feedback.type === "success" ? "#ECFDF5" : "#FEF2F2",
                borderColor: feedback.type === "success" ? "#6EE7B7" : "#FCA5A5",
              }}
            >
              <Text
                style={{
                  color: feedback.type === "success" ? "#065F46" : "#991B1B",
                  fontWeight: "800",
                }}
              >
                {feedback.message}
              </Text>
            </Card>
          ) : null}

          <View style={{ flexDirection: "row", gap: 10 }}>
            <ActionButton
              title="Approve"
              onPress={() => onUpdate("approved")}
              disabled={!isPending || isSaving}
            />
            <ActionButton
              title="Reject"
              variant="danger"
              onPress={() => onUpdate("rejected")}
              disabled={!isPending || isSaving}
            />
          </View>
        </View>
      )}
    </ScreenLayout>
  );
}

