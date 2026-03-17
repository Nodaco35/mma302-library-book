import { apiClient } from "./apiClient";

export async function updateUser(userId, payload) {
  const res = await apiClient.patch(`/users/${userId}`, payload);
  return res.data;
}
