import { useAuth, useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Redirect, router, Tabs } from "expo-router";
import React, { useEffect } from "react";
import { Image, View } from 'react-native';
import Spinner from "react-native-loading-spinner-overlay";

export default function TabsLayout() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
    return (
      <View className="flex-1 bg-[#0F172A] items-center justify-center">
        <Spinner visible={true} color="#fff" />
      </View>
    );
  }

  useEffect(() => {
    if (!isSignedIn) {
      router.replace("/");
    }
  }, [isSignedIn]);

  return (
    <Tabs
      screenOptions={{
        // Hide the header
        headerShown: false,

        // Tab bar container styling
        tabBarStyle: {
          backgroundColor: '#0F172A',
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 80,
          borderTopWidth: 0,
          borderRadius: 20,

          // Margins and padding
          marginLeft: 10,
          marginRight: 10,
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 10,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },

        // Individual tab item styling
        tabBarItemStyle: {
          padding: 0,
          borderRadius: 12,
          overflow: 'hidden',
        },

        // Colors
        tabBarActiveTintColor: '#0F172A',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarActiveBackgroundColor: '#FFFFFF',

        // Text and icon styling
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          fontFamily: 'RubikSemiBold',
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarLabelPosition: 'below-icon',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alert-circle" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: "Report",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="evacuation"
        options={{
          title: "Evacuation",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => {
            return <Image src={user?.imageUrl} className="w-6 h-6 rounded-full" />;
          },
        }}
      />
    </Tabs>
  );
}
