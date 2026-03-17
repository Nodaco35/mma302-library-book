import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { fetchBooks } from "../../services/booksApi";

function AvailabilityPill({ availableCopies }) {
  const available = Number(availableCopies) > 0;
  const bg = available ? "#ECFDF5" : "#FEF2F2";
  const border = available ? "#6EE7B7" : "#FCA5A5";
  const text = available ? "#065F46" : "#991B1B";
  const label = available ? "Available" : "Unavailable";

  return (
    <View
      style={{
        alignSelf: "flex-start",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        backgroundColor: bg,
        borderColor: border,
        borderWidth: 1,
      }}
    >
      <Text style={{ color: text, fontSize: 12, fontWeight: "700" }}>{label}</Text>
    </View>
  );
}

function CategoryChip({ label, isActive, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: isActive ? "#2563EB" : "#E5E7EB",
        backgroundColor: isActive ? "#EFF6FF" : "#FFFFFF",
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text style={{ color: isActive ? "#1D4ED8" : "#374151", fontWeight: "600", fontSize: 13 }}>
        {label}
      </Text>
    </Pressable>
  );
}

function BookRow({ book, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.85 : 1,
        flex: 1,
      })}
    >
      <Card style={{ gap: 8, minHeight: 150 }}>
        <View style={{ flex: 1, gap: 6 }}>
          <Text style={{ fontSize: 14, fontWeight: "800", color: "#111827" }} numberOfLines={2}>
            {book.title}
          </Text>
          <Text style={{ color: "#374151" }} numberOfLines={1}>
            {book.author}
          </Text>
          <Text style={{ color: "#6B7280" }} numberOfLines={1}>
            {book.category}
          </Text>
        </View>
        <View style={{ marginTop: "auto" }}>
          <AvailabilityPill availableCopies={book.availableCopies} />
        </View>
      </Card>
    </Pressable>
  );
}

export function BorrowerHomeScreen({ navigation }) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  async function load() {
    setError("");
    setIsLoading(true);
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (e) {
      setError(e?.message || "Failed to load books.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const categories = useMemo(() => {
    const set = new Set();
    for (const b of books) {
      if (b?.category) set.add(String(b.category));
    }
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [books]);

  const filtered = useMemo(() => {
    const s = String(search).trim().toLowerCase();
    return books.filter((b) => {
      const matchesTitle = !s || String(b?.title || "").toLowerCase().includes(s);
      const matchesCategory = selectedCategory === "All" || b?.category === selectedCategory;
      return matchesTitle && matchesCategory;
    });
  }, [books, search, selectedCategory]);

  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        Browse books
      </Text>

      <View style={{ gap: 10, marginBottom: 12 }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search by title…"
          autoCapitalize="none"
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

        <FlatList
          data={categories}
          keyExtractor={(c) => c}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <CategoryChip
              label={item}
              isActive={item === selectedCategory}
              onPress={() => setSelectedCategory(item)}
            />
          )}
        />
      </View>

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
            <Text style={{ fontWeight: "700", color: "#111827" }}>Retry</Text>
          </Pressable>
        </Card>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={{ gap: 10 }}
          contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
          onRefresh={load}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <BookRow
              book={item}
              onPress={() => navigation.navigate("BookDetail", { bookId: item.id })}
            />
          )}
          ListEmptyComponent={
            <Card>
              <Text style={{ color: "#6B7280" }}>No books match your search/filter.</Text>
            </Card>
          }
        />
      )}
    </ScreenLayout>
  );
}
