import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";

import { AuthContext } from "../providers/AuthContext";
import { navigationTheme } from "./navigationTheme";
import { AuthNavigator } from "./auth/AuthNavigator";
import { BorrowerNavigator } from "./borrower/BorrowerNavigator";
import { StaffNavigator } from "./staff/StaffNavigator";
import { AdminNavigator } from "./admin/AdminNavigator";

export function RootNavigator() {
  const auth = useContext(AuthContext);

  if (!auth || auth.isHydrating) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  let content = <AuthNavigator />;
  if (auth.role === "borrower") content = <BorrowerNavigator />;
  if (auth.role === "staff") content = <StaffNavigator />;
  if (auth.role === "admin") content = <AdminNavigator />;

  return <NavigationContainer theme={navigationTheme}>{content}</NavigationContainer>;
}
