import { apiClient } from "./apiClient";

export async function fetchPayments() {
  const res = await apiClient.get("/payments");
  return Array.isArray(res.data) ? res.data : [];
}
