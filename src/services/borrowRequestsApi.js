import { apiClient } from "./apiClient";

export async function hasPendingBorrowRequest({ bookId, userId }) {
  const res = await apiClient.get("/borrowRequests", {
    params: { bookId, userId, status: "pending" },
  });
  return Array.isArray(res.data) && res.data.length > 0;
}

export async function createBorrowRequest({ bookId, userId }) {
  const requestDate = new Date().toISOString().slice(0, 10);
  const res = await apiClient.post("/borrowRequests", {
    bookId,
    userId,
    status: "pending",
    requestDate,
    approvedBy: null,
    note: "",
  });
  return res.data;
}

