import React, { useContext } from "react";
import { ScrollView, Text } from "react-native";

import { AuthContext } from "../../providers/AuthContext";
import { ScreenLayout } from "../../components/ScreenLayout";
import { ProfileForm } from "../../components/ProfileForm";

export function BorrowerProfileScreen() {
  const auth = useContext(AuthContext);
  const user = auth?.session?.user;

  return (
    <ScreenLayout>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#111827" }}>
          Profile
        </Text>
        <ProfileForm
          user={user}
          onUpdated={auth?.updateSessionUser}
          onSignOut={auth?.signOut}
        />
      </ScrollView>
    </ScreenLayout>
  );
}
