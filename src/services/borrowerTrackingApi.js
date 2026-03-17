import { apiClient } from "./apiClient";
import { fetchBooks } from "./booksApi";

function toBookMap(books) {
  const map = new Map();
  for (const b of books || []) map.set(Number(b.id), b);
  return map;
}

export async function fetchMyRequestsWithBooks(userId) {
  const [reqRes, books] = await Promise.all([
    apiClient.get("/borrowRequests", { params: { userId } }),
    fetchBooks(),
  ]);

  const bookMap = toBookMap(books);
  const requests = Array.isArray(reqRes.data) ? reqRes.data : [];
  return requests
    .map((r) => ({ ...r, book: bookMap.get(Number(r.bookId)) || null }))
    .sort((a, b) => String(b.requestDate || "").localeCompare(String(a.requestDate || "")));
}

export async function fetchMyBorrowRecordsWithBooks(userId) {
  const [recRes, books] = await Promise.all([
    apiClient.get("/borrowRecords", { params: { userId } }),
    fetchBooks(),
  ]);

  const bookMap = toBookMap(books);
  const records = Array.isArray(recRes.data) ? recRes.data : [];
  return records
    .map((r) => ({ ...r, book: bookMap.get(Number(r.bookId)) || null }))
    .sort((a, b) => String(b.borrowDate || "").localeCompare(String(a.borrowDate || "")));
}

