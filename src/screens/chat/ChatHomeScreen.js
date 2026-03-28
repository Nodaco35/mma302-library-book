import React, { useCallback, useContext, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { AuthContext } from "../../providers/AuthContext";
import { fetchConversationsByUser } from "../../services/chatApi";

function ConversationRow({ item, onOpen }) {
  return (
    <Pressable onPress={onOpen} style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}>
      <Card style={{ gap: 6 }}>
        <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827" }}>
          {item.participantNames?.join(" & ") || "Conversation"}
        </Text>
        <Text style={{ color: "#6B7280" }} numberOfLines={1}>
          {item.lastMessage || "No messages yet."}
        </Text>
        <Text style={{ color: "#9CA3AF", fontSize: 12 }}>
          {item.lastMessageAt || "-"}
        </Text>
      </Card>
    </Pressable>
  );
}

export function ChatHomeScreen({ navigation }) {
  const auth = useContext(AuthContext);
  const userId = auth?.session?.user?.id;
  const [conversations, setConversations] = useState([]);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    if (!userId) return;
    try {
      const list = await fetchConversationsByUser(userId);
      const sorted = [...list].sort((a, b) =>
        String(b.lastMessageAt || "").localeCompare(String(a.lastMessageAt || ""))
      );
      setConversations(sorted);
    } catch (e) {
      setError(e?.message || "Failed to load conversations.");
    }
  }, [userId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <ScreenLayout>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
          Chats
        </Text>
        <PrimaryButton
          title="New"
          onPress={() => navigation.navigate("ChatUserSearch")}
        />
      </View>

      {error ? (
        <Card>
          <Text style={{ color: "#991B1B", marginBottom: 8 }}>{error}</Text>
          <PrimaryButton title="Retry" onPress={load} variant="secondary" />
        </Card>
      ) : null}

      <FlatList
        data={conversations}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
        ListEmptyComponent={
          <Card>
            <Text style={{ color: "#6B7280" }}>No conversations yet. Tap New to start.</Text>
          </Card>
        }
        renderItem={({ item }) => (
          <ConversationRow
            item={item}
            onOpen={() =>
              navigation.navigate("ChatDetail", {
                conversationId: item.id,
                otherUserId:
                  Array.isArray(item.participantIds)
                    ? item.participantIds.find((id) => id !== userId)
                    : null,
              })
            }
          />
        )}
      />
    </ScreenLayout>
  );
}
