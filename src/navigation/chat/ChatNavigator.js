import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ChatHomeScreen } from "../../screens/chat/ChatHomeScreen";
import { ChatUserSearchScreen } from "../../screens/chat/ChatUserSearchScreen";
import { ChatDetailScreen } from "../../screens/chat/ChatDetailScreen";

const Stack = createNativeStackNavigator();

export function ChatNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="ChatHome" component={ChatHomeScreen} options={{ title: "Chats" }} />
      <Stack.Screen
        name="ChatUserSearch"
        component={ChatUserSearchScreen}
        options={{ title: "New Chat" }}
      />
      <Stack.Screen name="ChatDetail" component={ChatDetailScreen} options={{ title: "Chat" }} />
    </Stack.Navigator>
  );
}
