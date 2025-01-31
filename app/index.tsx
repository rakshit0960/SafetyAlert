import { useAuth } from "@clerk/clerk-expo";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';


export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  if (!isLoaded || isLoading) {
    return (
      <View className="flex-1 bg-[#0F172A] items-center justify-center">
        <Spinner visible={true} color="#fff" />
      </View>
    );
  }

  if (isSignedIn) return <Redirect href="/(tabs)" />;

  return (
    <ScrollView className="flex-1">
      {/* Hero Section */}
      <LinearGradient
        colors={[
          "#0F172A",
          "#0F1721",
          "#0F1721",
          "rgba(15, 23, 42, 0.1)",
          "transparent",
        ]}
        locations={[0, 0.6, 0.92, 0.98, 1]}
        className="h-[35vh] px-6 pt-12 justify-between pb-20"
      >
        <View className="flex-row items-center gap-4">
          <View className="bg-white/10 p-3 rounded-2xl">
            <Ionicons name="shield-checkmark" size={40} color="white" />
          </View>
          <Text className="text-4xl text-white font-rubikBold">
            SafetyAlert
          </Text>
        </View>

        <View>
          <Text className="text-3xl text-white font-rubikBold mb-4 leading-tight">
            Stay Safe.{"\n"}Get Real-Time Disaster Alerts.
          </Text>
          <View className="flex-row items-center gap-2 bg-white/10 p-3 rounded-xl">
            {/* <Ionicons name="alert-circle" size={24} color="#FF4444" /> */}
            <Ionicons name="alert-circle" size={24} color="#22C55E" />
            <Text className="text-green-400 font-rubikSemiBold">
              No active threats in your area
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Feature Cards */}
      <View className="px-6 py-8 flex-1">
        <FeatureCards />
      </View>

      {/* Authentication Section */}
      <View className="flex-1 gap-4 px-8 pb-10 space-y-6 bg-white pt-8 rounded-t-3xl shadow-inner">
        <View className="gap-4">
          <TouchableOpacity
            onPress={() => router.push("/(auth)/sign_up")}
            className="bg-[#0F1721] py-4 px-6 rounded-2xl flex-row justify-center items-center gap-3"
          >
            <Ionicons name="person-add-outline" size={24} color="white" />
            <Text className="text-white font-rubikBold text-lg">
              Create Account
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/(auth)/sign_in")}
            className="bg-white/10 py-4 px-6 rounded-2xl flex-row justify-center items-center gap-3 border border-slate-400"
          >

            <Ionicons name="log-in-outline" size={24} color="#0F1721" />
            <Text className="font-rubikBold text-lg text-[#0F1721]">
              Sign In
            </Text>
          </TouchableOpacity>

        </View>

        <Text className="text-sm text-slate-400 text-center font-interMedium">
          By continuing, you agree to our Privacy Policy and Terms of Service
        </Text>
      </View>
    </ScrollView>
  );
}

function FeatureCards() {
  const features = [
    {
      icon: <Ionicons name="warning" size={28} color="#4B5563" />,
      title: "Live Alerts",
      description: "Receive instant notifications about nearby threats",
    },
    {
      icon: <MaterialCommunityIcons name="map-marker-plus" size={28} color="#4B5563"/>,
      title: "Emergency Reporting",
      description: "Report incidents in 3 taps with photos/location",
    },
    {
      icon: <MaterialIcons name="emergency" size={28} color="#4B5563" />,
      title: "Evacuation Plans",
      description: "Step-by-step routes to nearest safe zones",
    },
  ];

  return (
    <View className="flex-1 gap-6">
      {features.map((feature, index) => (
        <View
          key={index}

          className="flex-1 flex-row items-center px-6 py-6 rounded-lg shadow-md gap-3 bg-white border border-slate-100"
        >
          <View className="p-2">{feature.icon}</View>
          <View className="flex-1">
            <Text className="text-lg font-rubikBold font-semibold text-gray-800">
              {feature.title}
            </Text>
            <Text className="text-base font-inter text-gray-600">
              {feature.description}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
