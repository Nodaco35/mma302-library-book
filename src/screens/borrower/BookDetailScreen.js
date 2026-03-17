import React, { useContext, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { fetchBookById } from "../../services/booksApi";
import { AuthContext } from "../../providers/AuthContext";
import { createBorrowRequest, hasPendingBorrowRequest } from "../../services/borrowRequestsApi";

export function BookDetailScreen({ route }) {
  const { bookId } = route.params || {};
  const auth = useContext(AuthContext);
  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState({ type: "", message: "" });
  const [isRequesting, setIsRequesting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      setError("");
      setFeedback({ type: "", message: "" });
      try {
        const data = await fetchBookById(bookId);
        if (mounted) setBook(data);
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load book.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [bookId]);

  const userId = auth?.session?.user?.id;
  const isAvailable = useMemo(() => Number(book?.availableCopies) > 0, [book?.availableCopies]);

  async function onRequestBorrow() {
    setFeedback({ type: "", message: "" });

    if (!userId) {
      setFeedback({ type: "error", message: "You must be logged in to request a book." });
      return;
    }
    if (!book?.id) {
      setFeedback({ type: "error", message: "Book is missing." });
      return;
    }
    if (!isAvailable) {
      setFeedback({ type: "error", message: "This book is currently unavailable." });
      return;
    }

    setIsRequesting(true);
    try {
      const duplicate = await hasPendingBorrowRequest({ bookId: book.id, userId });
      if (duplicate) {
        setFeedback({
          type: "error",
          message: "You already have a pending request for this book.",
        });
        return;
      }

      await createBorrowRequest({ bookId: book.id, userId });
      setFeedback({ type: "success", message: "Borrow request sent. Status: pending." });
    } catch (e) {
      setFeedback({ type: "error", message: e?.message || "Failed to create request." });
    } finally {
      setIsRequesting(false);
    }
  }

  function FeedbackCard() {
    if (!feedback?.message) return null;
    const isSuccess = feedback.type === "success";
    return (
      <Card
        style={{
          backgroundColor: isSuccess ? "#ECFDF5" : "#FEF2F2",
          borderColor: isSuccess ? "#6EE7B7" : "#FCA5A5",
        }}
      >
        <Text style={{ color: isSuccess ? "#065F46" : "#991B1B", fontWeight: "700" }}>
          {feedback.message}
        </Text>
      </Card>
    );
  }

  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        Book detail
      </Text>

      {isLoading ? (
        <View style={{ paddingTop: 8, alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      ) : error ? (
        <Card>
          <Text style={{ color: "#991B1B" }}>{error}</Text>
        </Card>
      ) : !book ? (
        <Card>
          <Text style={{ color: "#6B7280" }}>Book not found.</Text>
        </Card>
      ) : (
        <View style={{ gap: 12 }}>
          <Card style={{ gap: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "800", color: "#111827" }}>{book.title}</Text>

            <View style={{ gap: 6 }}>
              <Text style={{ color: "#374151" }}>Code: {book.code || "-"}</Text>
              <Text style={{ color: "#374151" }}>Author: {book.author || "-"}</Text>
              <Text style={{ color: "#374151" }}>Category: {book.category || "-"}</Text>
              <Text style={{ color: "#374151" }}>Status: {book.status || "-"}</Text>
              <Text style={{ color: "#374151" }}>
                Total copies: {typeof book.totalCopies === "number" ? book.totalCopies : "-"}
              </Text>
              <Text style={{ color: "#374151" }}>
                Available copies:{" "}
                {typeof book.availableCopies === "number" ? book.availableCopies : "-"}
              </Text>
            </View>

            {book.description ? <Text style={{ color: "#6B7280" }}>{book.description}</Text> : null}
          </Card>

          <FeedbackCard />

          <Pressable
            onPress={isRequesting ? undefined : onRequestBorrow}
            style={({ pressed }) => ({
              height: 46,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: isAvailable ? "#2563EB" : "#9CA3AF",
              opacity: isRequesting ? 0.6 : pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "800" }}>
              {isRequesting ? "Sending request..." : "Request to borrow"}
            </Text>
          </Pressable>
        </View>
      )}
    </ScreenLayout>
  );
}

