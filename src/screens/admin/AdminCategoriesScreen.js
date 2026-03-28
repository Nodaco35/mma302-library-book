import React, { useCallback, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { createCategory, deleteCategory, fetchCategories, updateCategory } from "../../services/categoriesApi";

const emptyForm = {
  id: null,
  name: "",
  description: "",
};

export function AdminCategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const list = await fetchCategories();
      const sorted = [...list].sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
      setCategories(sorted);
    } catch (e) {
      setError(e?.message || "Failed to load categories.");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function startEdit(item) {
    setForm({
      id: item.id,
      name: String(item.name || ""),
      description: String(item.description || ""),
    });
  }

  async function onDelete(item) {
    try {
      await deleteCategory(item.id);
      load();
    } catch (e) {
      setError(e?.message || "Failed to delete category.");
    }
  }

  async function onSubmit() {
    setError("");
    if (!String(form.name || "").trim()) {
      setError("Category name is required.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        name: String(form.name || "").trim(),
        description: String(form.description || "").trim(),
      };
      if (form.id) {
        await updateCategory(form.id, payload);
      } else {
        await createCategory(payload);
      }
      setForm(emptyForm);
      load();
    } catch (e) {
      setError(e?.message || "Save failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        Categories
      </Text>

      <Card style={{ gap: 12, marginBottom: 12 }}>
        {error ? <Text style={{ color: "#991B1B" }}>{error}</Text> : null}
        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "600", color: "#111827" }}>Name</Text>
          <TextInput
            value={form.name}
            onChangeText={(v) => setForm((prev) => ({ ...prev, name: v }))}
            placeholder="Category name"
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
        <View style={{ gap: 6 }}>
          <Text style={{ fontWeight: "600", color: "#111827" }}>Description</Text>
          <TextInput
            value={form.description}
            onChangeText={(v) => setForm((prev) => ({ ...prev, description: v }))}
            placeholder="Optional description"
            multiline
            style={{
              minHeight: 60,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#E5E7EB",
              paddingHorizontal: 12,
              paddingVertical: 8,
              backgroundColor: "#FFFFFF",
              textAlignVertical: "top",
            }}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <PrimaryButton title={form.id ? "Update" : "Create"} onPress={onSubmit} disabled={isSubmitting} />
          {form.id ? (
            <PrimaryButton title="Cancel" variant="secondary" onPress={() => setForm(emptyForm)} />
          ) : null}
        </View>
      </Card>

      <FlatList
        data={categories}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ gap: 10, paddingBottom: 16 }}
        ListEmptyComponent={
          <Card>
            <Text style={{ color: "#6B7280" }}>No categories yet.</Text>
          </Card>
        }
        renderItem={({ item }) => (
          <Card style={{ gap: 8 }}>
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827" }}>{item.name}</Text>
            {item.description ? <Text style={{ color: "#6B7280" }}>{item.description}</Text> : null}
            <View style={{ flexDirection: "row", gap: 10 }}>
              <PrimaryButton title="Edit" variant="secondary" onPress={() => startEdit(item)} />
              <PrimaryButton title="Delete" variant="danger" onPress={() => onDelete(item)} />
            </View>
          </Card>
        )}
      />
    </ScreenLayout>
  );
}
