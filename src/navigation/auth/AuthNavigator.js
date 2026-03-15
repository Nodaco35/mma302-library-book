import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { LoginScreen } from "../../screens/auth/LoginScreen";
import { RegisterScreen } from "../../screens/auth/RegisterScreen";

const Stack = createNativeStackNavigator();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: "Login" }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ title: "Register" }} />
    </Stack.Navigator>
  );
}

