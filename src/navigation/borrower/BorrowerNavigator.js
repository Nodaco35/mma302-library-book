import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { BorrowerHomeScreen } from "../../screens/borrower/BorrowerHomeScreen";
// import { BooksScreen } from "../../screens/borrower/BooksScreen";
import { BorrowedScreen } from "../../screens/borrower/BorrowedScreen";
import { BorrowerProfileScreen } from "../../screens/borrower/BorrowerProfileScreen";
import { BookDetailScreen } from "../../screens/borrower/BookDetailScreen";
import { MyRequestsScreen } from "../../screens/borrower/MyRequestsScreen";
import { BorrowedBooksScreen } from "../../screens/borrower/BorrowedBooksScreen";
import { BorrowHistoryScreen } from "../../screens/borrower/BorrowHistoryScreen";
import { ChatNavigator } from "../chat/ChatNavigator";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BorrowerTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleAlign: "center",
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#6B7280",
        tabBarIcon: ({ color, size }) => {
          const map = {
            BorrowerHome: "home-outline",
            Books: "book-outline",
            Borrowed: "albums-outline",
            BorrowerProfile: "person-circle-outline",
            Chats: "chatbubbles-outline",
          };
          const iconName = map[route.name] || "ellipse-outline";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="BorrowerHome"
        component={BorrowerHomeScreen}
        options={{ title: "Home" }}
      />
      {/* <Tab.Screen
        name="Books"
        component={BooksScreen}
        options={{ title: "Books" }}
      /> */}
      <Tab.Screen
        name="Borrowed"
        component={BorrowedScreen}
        options={{ title: "Borrowed" }}
      />
      <Tab.Screen name="Chats" component={ChatNavigator} options={{ headerShown: false }} />
      <Tab.Screen
        name="BorrowerProfile"
        component={BorrowerProfileScreen}
        options={{ title: "Profile" }}
      />
    </Tab.Navigator>
  );
}

export function BorrowerNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTitleAlign: "center" }}>
      <Stack.Screen
        name="BorrowerTabs"
        component={BorrowerTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="BookDetail"
        component={BookDetailScreen}
        options={{ title: "Book" }}
      />
      <Stack.Screen
        name="MyRequests"
        component={MyRequestsScreen}
        options={{ title: "My Requests" }}
      />
      <Stack.Screen
        name="BorrowedBooks"
        component={BorrowedBooksScreen}
        options={{ title: "Borrowed Books" }}
      />
      <Stack.Screen
        name="BorrowHistory"
        component={BorrowHistoryScreen}
        options={{ title: "Borrow History" }}
      />
    </Stack.Navigator>
  );
}
