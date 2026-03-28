import { apiClient } from "./apiClient";

function normalizeTerm(term) {
  return String(term || "").trim();
}

export async function searchUsers({ term }) {
  const value = normalizeTerm(term);
  if (!value) return [];
  const [byName, byEmail] = await Promise.all([
    apiClient.get("/users", { params: { name_like: value } }),
    apiClient.get("/users", { params: { email_like: value } }),
  ]);
  const list = []
    .concat(Array.isArray(byName.data) ? byName.data : [])
    .concat(Array.isArray(byEmail.data) ? byEmail.data : []);
  const map = new Map();
  list.forEach((u) => {
    if (u?.id) map.set(u.id, u);
  });
  return Array.from(map.values());
}

export async function fetchConversationsByUser(userId) {
  const res = await apiClient.get("/conversations", {
    params: { participantIds: Number(userId) },
  });
  return Array.isArray(res.data) ? res.data : [];
}

export async function createConversation({ participantIds, participantNames }) {
  const res = await apiClient.post("/conversations", {
    participantIds,
    participantNames,
    lastMessage: "",
    lastMessageAt: "",
  });
  return res.data;
}

export async function fetchMessages(conversationId) {
  const res = await apiClient.get("/messages", {
    params: { conversationId, _sort: "createdAt", _order: "asc" },
  });
  return Array.isArray(res.data) ? res.data : [];
}

export async function sendMessage({ conversationId, senderId, receiverId, content }) {
  const now = new Date().toISOString();
  const res = await apiClient.post("/messages", {
    conversationId,
    senderId,
    receiverId,
    content,
    createdAt: now,
  });

  await apiClient.patch(`/conversations/${conversationId}`, {
    lastMessage: content,
    lastMessageAt: now,
  });

  return res.data;
}
