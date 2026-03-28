import { apiClient } from "./apiClient";

export async function fetchCategories() {
  const res = await apiClient.get("/categories");
  return Array.isArray(res.data) ? res.data : [];
}

export async function createCategory(payload) {
  const res = await apiClient.post("/categories", payload);
  return res.data;
}

export async function updateCategory(id, payload) {
  const res = await apiClient.patch(`/categories/${id}`, payload);
  return res.data;
}

export async function deleteCategory(id) {
  const res = await apiClient.delete(`/categories/${id}`);
  return res.data;
}
