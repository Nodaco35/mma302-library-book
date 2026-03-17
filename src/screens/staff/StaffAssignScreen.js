import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { AuthContext } from "../../providers/AuthContext";
import { fetchBookByTitle } from "../../services/booksApi";
import {
  fetchApprovedRequestsForBook,
  handoverByBookCode,
} from "../../services/handoverApi";
import {
  checkInReturnByBookCode,
  fetchActiveBorrowRecordsByBookCode,
} from "../../services/returnsApi";

function Feedback({ type, message }) {
  if (!message) return null;
  const isSuccess = type === "success";
  return (
    <Card
      style={{
        backgroundColor: isSuccess ? "#ECFDF5" : "#FEF2F2",
        borderColor: isSuccess ? "#6EE7B7" : "#FCA5A5",
      }}
    >
      <Text
        style={{ color: isSuccess ? "#065F46" : "#991B1B", fontWeight: "800" }}
      >
        {message}
      </Text>
    </Card>
  );
}

function RequestPickRow({ item, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <Card
        style={{
          gap: 6,
          borderColor: selected ? "#2563EB" : "#E5E7EB",
          backgroundColor: selected ? "#EFF6FF" : "#FFFFFF",
        }}
      >
        <Text style={{ fontWeight: "900", color: "#111827" }}>
          Request #{item.id}
        </Text>
        <Text style={{ color: "#6B7280" }}>User ID: {item.userId}</Text>
        <Text style={{ color: "#6B7280" }}>
          Approved by: {item.approvedBy ?? "-"}
        </Text>
        <Text style={{ color: "#6B7280" }}>
          Requested: {item.requestDate || "-"}
        </Text>
      </Card>
    </Pressable>
  );
}

function BorrowPickRow({ item, selected, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <Card
        style={{
          gap: 6,
          borderColor: selected ? "#111827" : "#E5E7EB",
          backgroundColor: selected ? "#F3F4F6" : "#FFFFFF",
        }}
      >
        <Text style={{ fontWeight: "900", color: "#111827" }}>
          Borrow #{item.id}
        </Text>
        <Text style={{ color: "#6B7280" }}>User ID: {item.userId}</Text>
        <Text style={{ color: "#6B7280" }}>
          Borrowed: {item.borrowDate || "-"}
        </Text>
        <Text style={{ color: "#6B7280" }}>Due: {item.dueDate || "-"}</Text>
      </Card>
    </Pressable>
  );
}

export function StaffAssignScreen() {
  const auth = useContext(AuthContext);
  const staffId = auth?.session?.user?.id;

  const [title, setTitle] = useState("");
  const [book, setBook] = useState(null);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHandingOver, setIsHandingOver] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const [activeBorrows, setActiveBorrows] = useState([]);
  const [selectedBorrowId, setSelectedBorrowId] = useState(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [returnFeedback, setReturnFeedback] = useState({
    type: "",
    message: "",
  });

  const normalizedTitle = useMemo(() => String(title || "").trim(), [title]);

  const lookup = useCallback(async () => {
    setFeedback({ type: "", message: "" });
    setBook(null);
    setApprovedRequests([]);
    setSelectedRequestId(null);
    setActiveBorrows([]);
    setSelectedBorrowId(null);
    setReturnFeedback({ type: "", message: "" });

    if (!normalizedTitle) {
      setFeedback({ type: "error", message: "Please enter a book title." });
      return;
    }

    setIsLoading(true);
    try {
      const b = await fetchBookByTitle(normalizedTitle);
      if (!b) {
        setFeedback({
          type: "error",
          message: "Book not found for this title.",
        });
        return;
      }
      setBook(b);

      const reqs = await fetchApprovedRequestsForBook(b.id);
      setApprovedRequests(reqs);
      if (reqs.length === 1) setSelectedRequestId(reqs[0].id);

      const borrows = await fetchActiveBorrowRecordsByBookCode(b.code);
      setActiveBorrows(borrows);
      if (borrows.length === 1) setSelectedBorrowId(borrows[0].id);

      if (Number(b.availableCopies) <= 0) {
        setFeedback({
          type: "error",
          message: "No available copies left for this book.",
        });
        return;
      }

      if (reqs.length === 0) {
        setFeedback({
          type: "error",
          message: "No approved requests found for this book.",
        });
      }
    } catch (e) {
      setFeedback({ type: "error", message: e?.message || "Lookup failed." });
    } finally {
      setIsLoading(false);
    }
  }, [normalizedTitle]);

  useEffect(() => {
    setBook(null);
    setApprovedRequests([]);
    setSelectedRequestId(null);
    setFeedback({ type: "", message: "" });
    setActiveBorrows([]);
    setSelectedBorrowId(null);
    setReturnFeedback({ type: "", message: "" });
  }, [normalizedTitle]);

  async function onHandover() {
    setFeedback({ type: "", message: "" });
    if (!staffId) {
      setFeedback({ type: "error", message: "Please log in as staff." });
      return;
    }
    if (!book) {
      setFeedback({ type: "error", message: "Lookup a book first." });
      return;
    }
    if (!selectedRequestId) {
      setFeedback({ type: "error", message: "Select an approved request." });
      return;
    }

    setIsHandingOver(true);
    try {
      const result = await handoverByBookCode({
        bookCode: book.code,
        staffId,
        requestId: selectedRequestId,
      });
      setFeedback({
        type: "success",
        message: `Handover completed. Borrow record #${result.record?.id || "created"}.`,
      });
      // Refresh book/request list after handover
      await lookup();
    } catch (e) {
      setFeedback({ type: "error", message: e?.message || "Handover failed." });
    } finally {
      setIsHandingOver(false);
    }
  }

  async function onCheckIn() {
    setReturnFeedback({ type: "", message: "" });
    if (!staffId) {
      setReturnFeedback({ type: "error", message: "Please log in as staff." });
      return;
    }
    if (!book) {
      setReturnFeedback({ type: "error", message: "Lookup a book first." });
      return;
    }
    if (!selectedBorrowId) {
      setReturnFeedback({
        type: "error",
        message: "Select an active borrow record.",
      });
      return;
    }

    setIsCheckingIn(true);
    try {
      const result = await checkInReturnByBookCode({
        bookCode: book.code,
        borrowRecordId: selectedBorrowId,
      });
      setReturnFeedback({
        type: "success",
        message: `Check-in completed. Borrow record #${result.record?.id} marked returned.`,
      });
      await lookup();
    } catch (e) {
      setReturnFeedback({
        type: "error",
        message: e?.message || "Check-in failed.",
      });
    } finally {
      setIsCheckingIn(false);
    }
  }

  return (
    <ScreenLayout>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          marginBottom: 12,
          color: "#111827",
        }}
      >
        Assign / Scan
      </Text>

      <ScrollView contentContainerStyle={{ gap: 12 }}>
        <Card style={{ gap: 10 }}>
          <Text style={{ color: "#6B7280" }}>
            Simulate scanning by typing a book title. Then select an approved
            request and confirm handover, or check in a return.
          </Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter book title (e.g. Clean Code)"
            autoCapitalize="words"
            autoCorrect={false}
            style={{
              height: 44,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              paddingHorizontal: 12,
              backgroundColor: "#FFFFFF",
            }}
          />

          <Pressable
            onPress={isLoading ? undefined : lookup}
            style={({ pressed }) => ({
              height: 46,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#2563EB",
              opacity: isLoading ? 0.6 : pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>
              {isLoading ? "Looking up..." : "Lookup"}
            </Text>
          </Pressable>
        </Card>

        {isLoading ? (
          <View style={{ alignItems: "center" }}>
            <ActivityIndicator />
          </View>
        ) : null}

        <Feedback type={feedback.type} message={feedback.message} />

        {book ? (
          <Card style={{ gap: 8 }}>
            <Text style={{ fontWeight: "900", color: "#111827" }}>
              {book.title}
            </Text>
            <Text style={{ color: "#6B7280" }}>
              {book.author} • {book.category}
            </Text>
            <Text style={{ color: "#6B7280" }}>
              Available copies:{" "}
              {typeof book.availableCopies === "number"
                ? book.availableCopies
                : "-"}
            </Text>
          </Card>
        ) : null}

        {approvedRequests.length > 0 ? (
          <View style={{ gap: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "900", color: "#111827" }}>
              Approved requests ({approvedRequests.length})
            </Text>
            <FlatList
              data={approvedRequests}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={{ gap: 10, paddingBottom: 8 }}
              renderItem={({ item }) => (
                <RequestPickRow
                  item={item}
                  selected={Number(selectedRequestId) === Number(item.id)}
                  onPress={() => setSelectedRequestId(item.id)}
                />
              )}
            />
            <Pressable
              onPress={isHandingOver ? undefined : onHandover}
              style={({ pressed }) => ({
                height: 46,
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#111827",
                opacity: isHandingOver ? 0.6 : pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>
                {isHandingOver ? "Handing over..." : "Confirm handover"}
              </Text>
            </Pressable>
          </View>
        ) : null}

        <View style={{ height: 6 }} />

        <Text style={{ fontSize: 16, fontWeight: "900", color: "#111827" }}>
          Return / Check-in
        </Text>
        <Feedback type={returnFeedback.type} message={returnFeedback.message} />

        {activeBorrows.length === 0 ? (
          <Card>
            <Text style={{ color: "#6B7280" }}>
              No active borrow records found for this book code.
            </Text>
          </Card>
        ) : (
          <View style={{ gap: 10 }}>
            <FlatList
              data={activeBorrows}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={{ gap: 10, paddingBottom: 8 }}
              renderItem={({ item }) => (
                <BorrowPickRow
                  item={item}
                  selected={Number(selectedBorrowId) === Number(item.id)}
                  onPress={() => setSelectedBorrowId(item.id)}
                />
              )}
            />
            <Pressable
              onPress={isCheckingIn ? undefined : onCheckIn}
              style={({ pressed }) => ({
                height: 46,
                borderRadius: 14,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#111827",
                opacity: isCheckingIn ? 0.6 : pressed ? 0.85 : 1,
              })}
            >
              <Text style={{ color: "#FFFFFF", fontWeight: "900" }}>
                {isCheckingIn ? "Checking in..." : "Confirm return"}
              </Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}
