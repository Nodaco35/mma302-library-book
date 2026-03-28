import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { AdminDashboardScreen } from "../../screens/admin/AdminDashboardScreen";
import { AdminCategoriesScreen } from "../../screens/admin/AdminCategoriesScreen";
import { AdminBorrowRecordsScreen } from "../../screens/admin/AdminBorrowRecordsScreen";
import { AdminPaymentsScreen } from "../../screens/admin/AdminPaymentsScreen";
import { AdminProfileScreen } from "../../screens/admin/AdminProfileScreen";
import { StaffRequestsScreen } from "../../screens/staff/StaffRequestsScreen";
import { StaffRequestDetailScreen } from "../../screens/staff/StaffRequestDetailScreen";
import { StaffManageBooksScreen } from "../../screens/staff/StaffManageBooksScreen";
import { StaffBookFormScreen } from "../../screens/staff/StaffBookFormScreen";
import { ChatNavigator } from "../chat/ChatNavigator";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#6B7280",
        tabBarIcon: ({ color, size }) => {
          const map = {
            AdminDashboard: "analytics-outline",
            AdminRequests: "clipboard-outline",
            AdminBooks: "library-outline",
            AdminCategories: "list-outline",
            AdminRecords: "albums-outline",
            AdminPayments: "cash-outline",
            AdminProfile: "person-circle-outline",
            AdminChats: "chatbubbles-outline",
          };
          const iconName = map[route.name] || "ellipse-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ title: "Dashboard" }}
      />
      <Tab.Screen
        name="AdminRequests"
        component={StaffRequestsScreen}
        options={{ title: "Requests" }}
      />
      <Tab.Screen name="AdminBooks" component={StaffManageBooksScreen} options={{ title: "Books" }} />
      <Tab.Screen
        name="AdminCategories"
        component={AdminCategoriesScreen}
        options={{ title: "Categories" }}
      />
      <Tab.Screen
        name="AdminRecords"
        component={AdminBorrowRecordsScreen}
        options={{ title: "Records" }}
      />
      <Tab.Screen
        name="AdminPayments"
        component={AdminPaymentsScreen}
        options={{ title: "Payments" }}
      />
      <Tab.Screen
        name="AdminChats"
        component={ChatNavigator}
        options={{ title: "Chats", headerShown: false }}
      />
      <Tab.Screen
        name="AdminProfile"
        component={AdminProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

export function AdminNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen name="AdminTabs" component={AdminTabs} options={{ headerShown: false }} />
      <Stack.Screen
        name="StaffRequestDetail"
        component={StaffRequestDetailScreen}
        options={{ title: "Request" }}
      />
      <Stack.Screen
        name="AdminRequestDetail"
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
      <Stack.Screen
        name="AdminCreateBook"
        component={StaffBookFormScreen}
        options={{ title: "Add Book" }}
      />
      <Stack.Screen
        name="AdminEditBook"
        component={StaffBookFormScreen}
        options={{ title: "Edit Book" }}
      />
    </Stack.Navigator>
  );
}
