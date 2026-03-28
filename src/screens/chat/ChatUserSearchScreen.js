import React, { useContext, useMemo, useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { AuthContext } from "../../providers/AuthContext";
import { createConversation, searchUsers } from "../../services/chatApi";

export function ChatUserSearchScreen({ navigation }) {
  const auth = useContext(AuthContext);
  const currentUser = auth?.session?.user;
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const canSearch = useMemo(() => term.trim().length > 1 && !isSearching, [term, isSearching]);

  async function onSearch() {
    setError("");
    if (!canSearch) return;
    setIsSearching(true);
    try {
      const list = await searchUsers({ term });
      const filtered = list.filter((u) => u.id !== currentUser?.id);
      setResults(filtered);
    } catch (e) {
      setError(e?.message || "Failed to search users.");
    } finally {
      setIsSearching(false);
    }
  }

  async function onStartChat(user) {
    if (!currentUser?.id) return;
    const conversation = await createConversation({
      participantIds: [currentUser.id, user.id],
      participantNames: [currentUser.name || `User #${currentUser.id}`, user.name || `User #${user.id}`],
    });
    navigation.replace("ChatDetail", { conversationId: conversation.id, otherUserId: user.id });
  }

  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        New Chat
      </Text>

      <Card style={{ gap: 12, marginBottom: 12 }}>
        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "600", color: "#111827" }}>Find a user</Text>
          <TextInput
            value={term}
            onChangeText={setTerm}
            placeholder="Type name or email"
            style={{
              height: 44,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              paddingHorizontal: 12,
              backgroundColor: "#FFFFFF",
            }}
          />
        </View>
        <PrimaryButton title={isSearching ? "Searching..." : "Search"} onPress={onSearch} disabled={!canSearch} />
        {error ? <Text style={{ color: "#991B1B" }}>{error}</Text> : null}
      </Card>

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
        ListEmptyComponent={
          <Card>
            <Text style={{ color: "#6B7280" }}>No users found.</Text>
          </Card>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => onStartChat(item)} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
            <Card style={{ gap: 6 }}>
              <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827" }}>{item.name}</Text>
              <Text style={{ color: "#6B7280" }}>{item.email}</Text>
              <Text style={{ color: "#9CA3AF", fontSize: 12 }}>{item.role}</Text>
            </Card>
          </Pressable>
        )}
      />
    </ScreenLayout>
  );
}
