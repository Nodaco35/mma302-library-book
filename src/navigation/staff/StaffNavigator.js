import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { StaffRequestsScreen } from "../../screens/staff/StaffRequestsScreen";
import { StaffAssignScreen } from "../../screens/staff/StaffAssignScreen";
import { StaffManageBooksScreen } from "../../screens/staff/StaffManageBooksScreen";
import { StaffStatsScreen } from "../../screens/staff/StaffStatsScreen";
import { StaffProfileScreen } from "../../screens/staff/StaffProfileScreen";
import { StaffRequestDetailScreen } from "../../screens/staff/StaffRequestDetailScreen";
import { StaffBookFormScreen } from "../../screens/staff/StaffBookFormScreen";
import { ChatNavigator } from "../chat/ChatNavigator";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function StaffTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#6B7280",
        tabBarIcon: ({ color, size }) => {
          const map = {
            StaffRequests: "clipboard-outline",
            StaffAssign: "qr-code-outline",
            StaffManageBooks: "library-outline",
            StaffStats: "stats-chart-outline",
            StaffProfile: "person-circle-outline",
            StaffChats: "chatbubbles-outline",
          };
          const iconName = map[route.name] || "ellipse-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="StaffRequests"
        component={StaffRequestsScreen}
        options={{ title: "Requests" }}
      />
      <Tab.Screen
        name="StaffAssign"
        component={StaffAssignScreen}
        options={{ title: "Assign" }}
      />
      <Tab.Screen
        name="StaffManageBooks"
        component={StaffManageBooksScreen}
        options={{ title: "Books" }}
      />
      <Tab.Screen name="StaffStats" component={StaffStatsScreen} options={{ title: "Stats" }} />
      <Tab.Screen
        name="StaffChats"
        component={ChatNavigator}
        options={{ title: "Chats", headerShown: false }}
      />
      <Tab.Screen
        name="StaffProfile"
        component={StaffProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

export function StaffNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="StaffTabs" component={StaffTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="StaffRequestDetail"
        component={StaffRequestDetailScreen}
        options={{ title: "Request" }}
      />
      <Stack.Screen
        name="StaffCreateBook"
        component={StaffBookFormScreen}
        options={{ title: "Add Book" }}
      />
      <Stack.Screen
        name="StaffEditBook"
        component={StaffBookFormScreen}
        options={{ title: "Edit Book" }}
      />
    </Stack.Navigator>
  );
}
