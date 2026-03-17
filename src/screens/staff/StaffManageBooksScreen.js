import React, { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { deleteBook, fetchBooks } from "../../services/booksApi";

function BookRow({ book, onEdit, onDelete }) {
  return (
    <Pressable onPress={onEdit} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      <Card style={{ gap: 6 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827" }} numberOfLines={1}>
              {book.title}
            </Text>
            <Text style={{ color: "#374151" }} numberOfLines={1}>
              {book.author}
            </Text>
            <Text style={{ color: "#6B7280" }} numberOfLines={1}>
              {book.category} • Code: {book.code}
            </Text>
            <Text style={{ color: "#6B7280" }}>
              {typeof book.availableCopies === "number" ? book.availableCopies : "-"} /{" "}
              {typeof book.totalCopies === "number" ? book.totalCopies : "-"} available
            </Text>
          </View>
          <Pressable
            onPress={onDelete}
            style={({ pressed }) => ({
              alignSelf: "flex-start",
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 999,
              backgroundColor: "#FEF2F2",
              borderWidth: 1,
              borderColor: "#FCA5A5",
              opacity: pressed ? 0.85 : 1,
            })}
          >
            <Text style={{ color: "#B91C1C", fontSize: 12, fontWeight: "800" }}>Delete</Text>
          </Pressable>
        </View>
      </Card>
    </Pressable>
  );
}

export function StaffManageBooksScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    setIsLoading(true);
    try {
      const list = await fetchBooks();
      const sorted = [...list].sort((a, b) => String(a.title || "").localeCompare(b.title || ""));
      setBooks(sorted);
    } catch (e) {
      setError(e?.message || "Failed to load books.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function confirmDelete(book) {
    Alert.alert(
      "Delete book",
      `Are you sure you want to delete "${book.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteBook(book.id);
              load();
            } catch (e) {
              setError(e?.message || "Failed to delete book.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  }

  return (
    <ScreenLayout>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
          Manage Books
        </Text>
        <PrimaryButton
          title="Add"
          onPress={() => navigation.navigate("StaffCreateBook", { mode: "create" })}
        />
      </View>

      {error ? (
        <Card>
          <Text style={{ color: "#991B1B", marginBottom: 8 }}>{error}</Text>
          <PrimaryButton title="Retry" onPress={load} variant="secondary" />
        </Card>
      ) : null}

      <FlatList
        data={books}
        keyExtractor={(item) => String(item.id)}
        onRefresh={load}
        refreshing={isLoading}
        contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
        ListEmptyComponent={
          !isLoading && !error ? (
            <Card>
              <Text style={{ color: "#6B7280" }}>No books yet. Tap Add to create one.</Text>
            </Card>
          ) : null
        }
        renderItem={({ item }) => (
          <BookRow
            book={item}
            onEdit={() => navigation.navigate("StaffEditBook", { mode: "edit", bookId: item.id })}
            onDelete={() => confirmDelete(item)}
          />
        )}
      />
    </ScreenLayout>
  );
}


