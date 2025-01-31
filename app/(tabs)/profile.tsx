import { useUser, useAuth } from "@clerk/clerk-expo";
import { Image, Text, View, TouchableOpacity, ScrollView } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();

  if (!isLoaded) {
    return (
      <View className="flex-1 bg-[#0F172A] items-center justify-center">
        <Spinner visible={true} color="#fff" />
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 bg-[#0F172A] items-center justify-center">
        <Text className="text-white">No user found</Text>
      </View>
    );
  }

  const joinedDate = new Date(user.createdAt!).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
        <View className="h-full w-full bg-white rounded-3xl p-6 py-12">
          <View className="items-center pb-6 border-b border-gray-200">
            <Image
              source={{ uri: user?.imageUrl }}
              className="w-24 h-24 rounded-full mb-4"
            />
            <Text className="text-xl font-bold text-gray-800">
              {user?.fullName}
            </Text>
            <Text className="text-gray-500 mb-2">
              {user?.emailAddresses[0]?.emailAddress}
            </Text>
            <Text className="text-sm text-gray-400">Joined {joinedDate}</Text>
          </View>

          <View className="py-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Profile
            </Text>
            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={24} color="#4B5563" />
                <Text className="ml-3 text-gray-600">Manage Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>

          <View className="py-4 border-b border-gray-200">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Settings
            </Text>
            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="#4B5563"
                />
                <Text className="ml-3 text-gray-600">Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#4B5563" />
            </TouchableOpacity>
            <TouchableOpacity className="flex-row items-center justify-between py-3">
              <View className="flex-row items-center">
                <Ionicons name="moon-outline" size={24} color="#4B5563" />
                <Text className="ml-3 text-gray-600">Dark Mode</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              signOut();
              router.navigate("/(auth)/sign_in");
            }}
            className="mt-6 bg-red-500 py-4 px-6 rounded-xl flex-row justify-center items-center"
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text className="ml-2 text-white font-semibold">Sign Out</Text>
          </TouchableOpacity>
        </View>
  );
}
