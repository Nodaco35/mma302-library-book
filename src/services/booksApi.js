import { apiClient } from "./apiClient";

export async function fetchBooks() {
  const res = await apiClient.get("/books");
  return Array.isArray(res.data) ? res.data : [];
}

export async function fetchBookByCode(code) {
  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) return null;
  const res = await apiClient.get("/books", { params: { code: normalized } });
  const list = Array.isArray(res.data) ? res.data : [];
  return list[0] || null;
}

export async function fetchBookByTitle(title) {
  const normalized = String(title || "").trim();
  if (!normalized) return null;
  const res = await apiClient.get("/books", { params: { title_like: normalized } });
  const list = Array.isArray(res.data) ? res.data : [];
  return list[0] || null;
}

export async function fetchBookById(bookId) {
  const res = await apiClient.get(`/books/${bookId}`);
  return res.data;
}

export async function createBook(payload) {
  const res = await apiClient.post("/books", payload);
  return res.data;
}

export async function updateBook(bookId, payload) {
  const res = await apiClient.patch(`/books/${bookId}`, payload);
  return res.data;
}

export async function deleteBook(bookId) {
  await apiClient.delete(`/books/${bookId}`);
}

