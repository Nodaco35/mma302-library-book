import React, { useContext, useMemo, useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";

import { AuthContext } from "../../providers/AuthContext";
import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";

export function LoginScreen({ navigation }) {
  const auth = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return String(email).trim().length > 0 && String(password).length > 0 && !isSubmitting;
  }, [email, password, isSubmitting]);

  async function onLogin() {
    setError("");
    setIsSubmitting(true);
    try {
      await auth.signIn({ email, password });
    } catch (e) {
      setError(e?.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        Welcome back
      </Text>

      <Card style={{ gap: 12 }}>
        <Text style={{ color: "#6B7280" }}>Sign in using your json-server user account.</Text>

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
            textContentType="password"
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

        <PrimaryButton title="Login" onPress={onLogin} disabled={!canSubmit} />

        {isSubmitting ? (
          <View style={{ alignItems: "center", paddingTop: 4 }}>
            <ActivityIndicator />
          </View>
        ) : null}

        <View style={{ height: 8 }} />

        <PrimaryButton
          title="Go to Register"
          onPress={() => navigation.navigate("Register")}
          variant="secondary"
        />
      </Card>
    </ScreenLayout>
  );
}

