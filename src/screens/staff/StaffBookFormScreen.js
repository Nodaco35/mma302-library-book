import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TextInput, View } from "react-native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { createBook, fetchBookById, updateBook } from "../../services/booksApi";

function validate(values) {
  const errors = {};
  if (!values.code.trim()) errors.code = "Code is required.";
  if (!values.title.trim()) errors.title = "Title is required.";
  if (!values.author.trim()) errors.author = "Author is required.";
  if (!values.category.trim()) errors.category = "Category is required.";

  const total = Number.parseInt(values.totalCopies, 10);
  if (Number.isNaN(total) || total <= 0) {
    errors.totalCopies = "Total copies must be a positive number.";
  }

  return errors;
}

export function StaffBookFormScreen({ route, navigation }) {
  const mode = route.params?.mode === "edit" ? "edit" : "create";
  const bookId = route.params?.bookId;

  const [values, setValues] = useState({
    code: "",
    title: "",
    author: "",
    category: "",
    totalCopies: "",
    description: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState("");

  const isEdit = mode === "edit";

  const canSubmit = useMemo(() => {
    return !isSubmitting;
  }, [isSubmitting]);

  const load = useCallback(async () => {
    if (!isEdit || !bookId) return;
    setIsLoading(true);
    try {
      const book = await fetchBookById(bookId);
      setValues({
        code: String(book.code || ""),
        title: String(book.title || ""),
        author: String(book.author || ""),
        category: String(book.category || ""),
        totalCopies:
          typeof book.totalCopies === "number" ? String(book.totalCopies) : String(book.totalCopies || ""),
        description: String(book.description || ""),
      });
    } catch (e) {
      setFeedback(e?.message || "Failed to load book.");
    } finally {
      setIsLoading(false);
    }
  }, [isEdit, bookId]);

  useEffect(() => {
    load();
  }, [load]);

  function handleChange(field, value) {
    setValues((prev) => ({ ...prev, [field]: value }));
  }

  async function onSubmit() {
    setFeedback("");
    const nextErrors = validate({
      code: values.code,
      title: values.title,
      author: values.author,
      category: values.category,
      totalCopies: values.totalCopies,
      description: values.description,
    });
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const normalizedCode = values.code.trim().toUpperCase();
      const total = Number.parseInt(values.totalCopies, 10);
      const basePayload = {
        code: normalizedCode,
        title: values.title.trim(),
        author: values.author.trim(),
        category: values.category.trim(),
        description: values.description.trim(),
      };

      if (isEdit) {
        await updateBook(bookId, { ...basePayload, totalCopies: total });
        navigation.goBack();
      } else {
        await createBook({
          ...basePayload,
          totalCopies: total,
          availableCopies: total,
          status: "available",
        });
        navigation.goBack();
      }
    } catch (e) {
      setFeedback(e?.message || "Save failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const titleText = isEdit ? "Edit Book" : "Add Book";

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
          {titleText}
        </Text>

        {isLoading ? (
          <View style={{ paddingTop: 8, alignItems: "center" }}>
            <ActivityIndicator />
          </View>
        ) : (
          <Card style={{ gap: 12 }}>
            {feedback ? <Text style={{ color: "#991B1B" }}>{feedback}</Text> : null}

            <View style={{ gap: 6 }}>
              <Text style={{ fontWeight: "600", color: "#111827" }}>Code</Text>
              <TextInput
                value={values.code}
                onChangeText={(v) => handleChange("code", v)}
                placeholder="BK001"
                autoCapitalize="characters"
                autoCorrect={false}
                style={{
                  height: 44,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: errors.code ? "#DC2626" : "#E5E7EB",
                  paddingHorizontal: 12,
                  backgroundColor: "#FFFFFF",
                }}
              />
              {errors.code ? <Text style={{ color: "#DC2626" }}>{errors.code}</Text> : null}
            </View>

            <View style={{ gap: 6 }}>
              <Text style={{ fontWeight: "600", color: "#111827" }}>Title</Text>
              <TextInput
                value={values.title}
                onChangeText={(v) => handleChange("title", v)}
                placeholder="Book title"
                style={{
                  height: 44,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: errors.title ? "#DC2626" : "#E5E7EB",
                  paddingHorizontal: 12,
                  backgroundColor: "#FFFFFF",
                }}
              />
              {errors.title ? <Text style={{ color: "#DC2626" }}>{errors.title}</Text> : null}
            </View>

            <View style={{ gap: 6 }}>
              <Text style={{ fontWeight: "600", color: "#111827" }}>Author</Text>
              <TextInput
                value={values.author}
                onChangeText={(v) => handleChange("author", v)}
                placeholder="Author name"
                style={{
                  height: 44,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: errors.author ? "#DC2626" : "#E5E7EB",
                  paddingHorizontal: 12,
                  backgroundColor: "#FFFFFF",
                }}
              />
              {errors.author ? <Text style={{ color: "#DC2626" }}>{errors.author}</Text> : null}
            </View>

            <View style={{ gap: 6 }}>
              <Text style={{ fontWeight: "600", color: "#111827" }}>Category</Text>
              <TextInput
                value={values.category}
                onChangeText={(v) => handleChange("category", v)}
                placeholder="Category (e.g. Programming)"
                style={{
                  height: 44,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: errors.category ? "#DC2626" : "#E5E7EB",
                  paddingHorizontal: 12,
                  backgroundColor: "#FFFFFF",
                }}
              />
              {errors.category ? <Text style={{ color: "#DC2626" }}>{errors.category}</Text> : null}
            </View>

            <View style={{ gap: 6 }}>
              <Text style={{ fontWeight: "600", color: "#111827" }}>Total copies</Text>
              <TextInput
                value={values.totalCopies}
                onChangeText={(v) => handleChange("totalCopies", v)}
                placeholder="5"
                keyboardType="number-pad"
                style={{
                  height: 44,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: errors.totalCopies ? "#DC2626" : "#E5E7EB",
                  paddingHorizontal: 12,
                  backgroundColor: "#FFFFFF",
                }}
              />
              {errors.totalCopies ? (
                <Text style={{ color: "#DC2626" }}>{errors.totalCopies}</Text>
              ) : null}
            </View>

            <View style={{ gap: 6 }}>
              <Text style={{ fontWeight: "600", color: "#111827" }}>Description (optional)</Text>
              <TextInput
                value={values.description}
                onChangeText={(v) => handleChange("description", v)}
                placeholder="Short description"
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

            <PrimaryButton
              title={isEdit ? "Save changes" : "Create book"}
              onPress={onSubmit}
              disabled={!canSubmit}
            />
          </Card>
        )}
      </ScrollView>
    </ScreenLayout>
  );
}

