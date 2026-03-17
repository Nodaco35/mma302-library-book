import { apiClient } from "./apiClient";
import { fetchBookByCode } from "./booksApi";

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export async function fetchApprovedRequestsForBook(bookId) {
  const res = await apiClient.get("/borrowRequests", {
    params: { bookId, status: "approved" },
  });
  return Array.isArray(res.data) ? res.data : [];
}

export async function handoverByBookCode({ bookCode, staffId, requestId }) {
  const code = String(bookCode || "").trim().toUpperCase();
  if (!code) throw new Error("Book code is required.");
  if (!staffId) throw new Error("Staff session not found.");

  const book = await fetchBookByCode(code);
  if (!book) throw new Error("Book not found for this code.");
  if (Number(book.availableCopies) <= 0) throw new Error("No available copies for this book.");

  const requestRes = await apiClient.get(`/borrowRequests/${requestId}`);
  const request = requestRes.data;
  if (!request) throw new Error("Request not found.");

  if (Number(request.bookId) !== Number(book.id)) {
    throw new Error("Selected request does not match this book code.");
  }

  const status = String(request.status || "").toLowerCase();
  if (status !== "approved") {
    throw new Error("Request must be approved before handover.");
  }

  const existingRec = await apiClient.get("/borrowRecords", { params: { requestId } });
  if (Array.isArray(existingRec.data) && existingRec.data.length > 0) {
    throw new Error("This request has already been handed over.");
  }

  const borrowDate = new Date();
  const dueDate = addDays(borrowDate, 7);

  const recordRes = await apiClient.post("/borrowRecords", {
    requestId: request.id,
    bookId: request.bookId,
    userId: request.userId,
    bookCode: code,
    borrowDate: isoDate(borrowDate),
    dueDate: isoDate(dueDate),
    returnDate: null,
    status: "borrowed",
  });

  await apiClient.patch(`/books/${book.id}`, {
    availableCopies: Number(book.availableCopies) - 1,
  });

  await apiClient.patch(`/borrowRequests/${request.id}`, {
    status: "handed_over",
    approvedBy: request.approvedBy ?? staffId,
    handedOverAt: new Date().toISOString(),
  });

  return { book, requestId: request.id, record: recordRes.data };
}

