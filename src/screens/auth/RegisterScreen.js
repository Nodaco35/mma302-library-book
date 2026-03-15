import React, { useContext, useMemo, useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";

import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";
import { AuthContext } from "../../providers/AuthContext";

export function RegisterScreen({ navigation }) {
  const auth = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    if (isSubmitting) return false;
    if (!String(name).trim()) return false;
    if (!String(email).trim()) return false;
    if (!String(password)) return false;
    if (password !== confirmPassword) return false;
    return true;
  }, [name, email, password, confirmPassword, isSubmitting]);

  async function onRegister() {
    setError("");
    setIsSubmitting(true);
    try {
      await auth.signUpBorrower({ name, email, password });
    } catch (e) {
      setError(e?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        Create account
      </Text>
      <Card style={{ gap: 12 }}>
        <Text style={{ color: "#6B7280" }}>
          Register a new borrower account (saved to json-server `users`).
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
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
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
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            textContentType="newPassword"
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
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#111827" }}>
            Confirm password
          </Text>
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="••••••••"
            secureTextEntry
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

        <PrimaryButton title="Register" onPress={onRegister} disabled={!canSubmit} />

        {isSubmitting ? (
          <View style={{ alignItems: "center", paddingTop: 4 }}>
            <ActivityIndicator />
          </View>
        ) : null}

        <View style={{ height: 8 }} />

        <PrimaryButton
          title="Back to Login"
          onPress={() => navigation.goBack()}
          variant="secondary"
          disabled={isSubmitting}
        />
      </Card>
    </ScreenLayout>
  );
}

