import { apiClient } from "./apiClient";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

export async function loginWithEmailPassword({ email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = String(password || "");

  if (!normalizedEmail || !normalizedPassword) {
    throw new Error("Email and password are required.");
  }

  const res = await apiClient.get("/users", {
    params: { email: normalizedEmail, password: normalizedPassword },
  });

  const user = Array.isArray(res.data) ? res.data[0] : null;
  if (!user) {
    throw new Error("Invalid email or password.");
  }

  return user;
}

export async function registerBorrower({ name, email, password }) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedName = String(name || "").trim();
  const normalizedPassword = String(password || "");

  if (!normalizedName) throw new Error("Name is required.");
  if (!normalizedEmail) throw new Error("Email is required.");
  if (!normalizedPassword) throw new Error("Password is required.");

  const existing = await apiClient.get("/users", { params: { email: normalizedEmail } });
  if (Array.isArray(existing.data) && existing.data.length > 0) {
    throw new Error("Email is already registered.");
  }

  const res = await apiClient.post("/users", {
    name: normalizedName,
    email: normalizedEmail,
    password: normalizedPassword,
    role: "borrower",
    createdAt: new Date().toISOString(),
  });

  return res.data;
}

