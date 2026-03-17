import { apiClient } from "./apiClient";
import { fetchBooks } from "./booksApi";

function toMap(items) {
  const map = new Map();
  for (const it of items || []) map.set(Number(it.id), it);
  return map;
}

export async function fetchPendingRequestsWithDetails() {
  const [reqRes, books, usersRes] = await Promise.all([
    apiClient.get("/borrowRequests", { params: { status: "pending" } }),
    fetchBooks(),
    apiClient.get("/users"),
  ]);

  const bookMap = toMap(books);
  const users = Array.isArray(usersRes.data) ? usersRes.data : [];
  const userMap = toMap(users.map((u) => ({ ...u, password: undefined })));

  const requests = Array.isArray(reqRes.data) ? reqRes.data : [];
  return requests
    .map((r) => ({
      ...r,
      book: bookMap.get(Number(r.bookId)) || null,
      borrower: userMap.get(Number(r.userId)) || null,
    }))
    .sort((a, b) => String(b.requestDate || "").localeCompare(String(a.requestDate || "")));
}

export async function fetchRequestByIdWithDetails(requestId) {
  const [reqRes, books, usersRes] = await Promise.all([
    apiClient.get(`/borrowRequests/${requestId}`),
    fetchBooks(),
    apiClient.get("/users"),
  ]);

  const bookMap = toMap(books);
  const users = Array.isArray(usersRes.data) ? usersRes.data : [];
  const userMap = toMap(users.map((u) => ({ ...u, password: undefined })));

  const r = reqRes.data;
  return {
    ...r,
    book: bookMap.get(Number(r.bookId)) || null,
    borrower: userMap.get(Number(r.userId)) || null,
  };
}

export async function updateRequestStatus({ requestId, status, approvedBy }) {
  const res = await apiClient.patch(`/borrowRequests/${requestId}`, {
    status,
    approvedBy: approvedBy ?? null,
  });
  return res.data;
}

