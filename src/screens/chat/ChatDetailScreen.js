import React, { useCallback, useContext, useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { AuthContext } from "../../providers/AuthContext";
import { fetchMessages, sendMessage } from "../../services/chatApi";

function MessageBubble({ message, isMine }) {
  return (
    <View style={{ alignItems: isMine ? "flex-end" : "flex-start" }}>
      <Card
        style={{
          maxWidth: "80%",
          backgroundColor: isMine ? "#DBEAFE" : "#FFFFFF",
          borderColor: isMine ? "#93C5FD" : "#E5E7EB",
        }}
      >
        <Text style={{ color: "#111827" }}>{message.content}</Text>
        <Text style={{ color: "#9CA3AF", fontSize: 11, marginTop: 4 }}>
          {message.createdAt || "-"}
        </Text>
      </Card>
    </View>
  );
}

export function ChatDetailScreen({ route }) {
  const { conversationId, otherUserId } = route.params || {};
  const auth = useContext(AuthContext);
  const currentUser = auth?.session?.user;

  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);

  const load = useCallback(async () => {
    setError("");
    if (!conversationId) return;
    try {
      const list = await fetchMessages(conversationId);
      setMessages(list);
    } catch (e) {
      setError(e?.message || "Failed to load messages.");
    }
  }, [conversationId]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const receiverId = useMemo(() => {
    if (!messages.length) return null;
    const last = messages[messages.length - 1];
    if (last.senderId === currentUser?.id) return last.receiverId;
    return last.senderId;
  }, [messages, currentUser]);

  const resolvedReceiverId = receiverId || otherUserId || null;

  async function onSend() {
    if (!currentUser?.id || !text.trim() || !conversationId || !resolvedReceiverId) return;
    setIsSending(true);
    try {
      const sent = await sendMessage({
        conversationId,
        senderId: currentUser.id,
        receiverId: resolvedReceiverId,
        content: text.trim(),
      });
      setMessages((prev) => [...prev, sent]);
      setText("");
    } catch (e) {
      setError(e?.message || "Failed to send message.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        Chat
      </Text>

      {error ? (
        <Card>
          <Text style={{ color: "#991B1B" }}>{error}</Text>
        </Card>
      ) : null}

      <FlatList
        data={messages}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <MessageBubble message={item} isMine={item.senderId === currentUser?.id} />
        )}
        ListEmptyComponent={
          <Card>
            <Text style={{ color: "#6B7280" }}>No messages yet.</Text>
          </Card>
        }
      />

      <Card style={{ gap: 8 }}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
          multiline
          style={{
            minHeight: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: "#FFFFFF",
            textAlignVertical: "top",
          }}
        />
        <PrimaryButton title={isSending ? "Sending..." : "Send"} onPress={onSend} disabled={isSending} />
      </Card>
    </ScreenLayout>
  );
}
