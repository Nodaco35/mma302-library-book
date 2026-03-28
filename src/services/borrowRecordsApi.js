import { apiClient } from "./apiClient";

export async function fetchBorrowRecords() {
  const res = await apiClient.get("/borrowRecords");
  return Array.isArray(res.data) ? res.data : [];
}
