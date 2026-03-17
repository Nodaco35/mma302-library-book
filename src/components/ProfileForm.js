import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";

import { Card } from "./Card";
import { PrimaryButton } from "./PrimaryButton";
import { updateUser } from "../services/usersApi";

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export function ProfileForm({ user, onUpdated, onSignOut }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setName(user?.name || "");
  }, [user?.name]);

  const canSubmit = useMemo(() => {
    if (!user?.id) return false;
    if (isSubmitting) return false;
    if (!String(name).trim()) return false;
    if (String(name).trim() === String(user?.name || "").trim()) return false;
    return true;
  }, [user?.id, user?.name, name, isSubmitting]);

  async function onSave() {
    if (!user?.id) return;
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      const updated = await updateUser(user.id, { name: String(name).trim() });
      if (onUpdated) await onUpdated(updated);
      setSuccess("Profile updated successfully.");
    } catch (e) {
      setError(e?.message || "Update failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card style={{ gap: 12 }}>
      <Text style={{ color: "#6B7280" }}>
        You can update your display name. Important fields (email, role, id) are locked.
      </Text>

      {error ? (
        <View
          style={{
            backgroundColor: "#FEF2F2",
            borderColor: "#FCA5A5",
            borderWidth: 1,
            padding: 10,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#991B1B" }}>{error}</Text>
        </View>
      ) : null}

      {success ? (
        <View
          style={{
            backgroundColor: "#ECFDF3",
            borderColor: "#86EFAC",
            borderWidth: 1,
            padding: 10,
            borderRadius: 12,
          }}
        >
          <Text style={{ color: "#166534" }}>{success}</Text>
        </View>
      ) : null}

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}>Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          autoCapitalize="words"
          style={{
            height: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            paddingHorizontal: 12,
            backgroundColor: "#FFFFFF",
          }}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}>Email</Text>
        <View
          style={{
            height: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            paddingHorizontal: 12,
            backgroundColor: "#F9FAFB",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#6B7280" }}>{user?.email || "-"}</Text>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}>Role</Text>
        <View
          style={{
            height: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            paddingHorizontal: 12,
            backgroundColor: "#F9FAFB",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#6B7280" }}>{user?.role || "-"}</Text>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}>User ID</Text>
        <View
          style={{
            height: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            paddingHorizontal: 12,
            backgroundColor: "#F9FAFB",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#6B7280" }}>{user?.id ?? "-"}</Text>
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}>
          Created At
        </Text>
        <View
          style={{
            height: 44,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            paddingHorizontal: 12,
            backgroundColor: "#F9FAFB",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#6B7280" }}>{formatDate(user?.createdAt)}</Text>
        </View>
      </View>

      <PrimaryButton title="Save changes" onPress={onSave} disabled={!canSubmit} />

      {isSubmitting ? (
        <View style={{ alignItems: "center", paddingTop: 4 }}>
          <ActivityIndicator />
        </View>
      ) : null}

      <View style={{ height: 6 }} />

      <PrimaryButton title="Sign out" onPress={onSignOut} variant="secondary" />
    </Card>
  );
}
