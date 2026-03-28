import { apiClient } from "./apiClient";
import { fetchBookByCode } from "./booksApi";

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

export async function fetchActiveBorrowRecordsByBookCode(bookCode) {
  const code = String(bookCode || "").trim().toUpperCase();
  if (!code) return [];

  const res = await apiClient.get("/borrowRecords", { params: { bookCode: code } });
  const list = Array.isArray(res.data) ? res.data : [];

  return list.filter((r) => {
    const status = String(r?.status || "").toLowerCase();
    return status === "borrowed" && !r?.returnDate;
  });
}

export async function checkInReturnByBookCode({ bookCode, borrowRecordId }) {
  const code = String(bookCode || "").trim().toUpperCase();
  if (!code) throw new Error("Book code is required.");
  if (!borrowRecordId) throw new Error("Select a borrow record to check in.");

  const recordRes = await apiClient.get(`/borrowRecords/${borrowRecordId}`);
  const record = recordRes.data;
  if (!record) throw new Error("Borrow record not found.");

  if (String(record.bookCode || "").toUpperCase() !== code) {
    throw new Error("Selected borrow record does not match this book code.");
  }

  const status = String(record.status || "").toLowerCase();
  if (status !== "borrowed" || record.returnDate) {
    throw new Error("This borrow record is not active.");
  }

  const book = await fetchBookByCode(code);
  if (!book) throw new Error("Book not found for this code.");

  const updatedRecordRes = await apiClient.patch(`/borrowRecords/${record.id}`, {
    status: "returned",
    returnDate: isoDate(new Date()),
  });

  await apiClient.patch(`/books/${book.id}`, {
    availableCopies: Number(book.availableCopies || 0) + 1,
  });

  if (record.requestId) {
    await apiClient.patch(`/borrowRequests/${record.requestId}`, {
      status: "returned",
    });
  }

  return { record: updatedRecordRes.data, book };
}
