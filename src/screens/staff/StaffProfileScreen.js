import React, { useContext } from "react";
import { Text } from "react-native";

import { AuthContext } from "../../providers/AuthContext";
import { ScreenLayout } from "../../components/ScreenLayout";
import { Card } from "../../components/Card";
import { PrimaryButton } from "../../components/PrimaryButton";

export function StaffProfileScreen() {
  const auth = useContext(AuthContext);

  return (
    <ScreenLayout>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
        Staff Profile
      </Text>
      <Card style={{ gap: 12 }}>
        <Text style={{ color: "#6B7280" }}>Placeholder staff profile/settings screen.</Text>
        <PrimaryButton title="Sign out" onPress={auth.signOut} variant="secondary" />
      </Card>
    </ScreenLayout>
  );
}

