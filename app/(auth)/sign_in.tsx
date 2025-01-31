import { isClerkAPIResponseError, useOAuth, useSignIn } from "@clerk/clerk-expo";
import { ClerkAPIError } from "@clerk/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";


export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Page() {
  useWarmUpBrowser();

  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<ClerkAPIError[]>()
  const { startOAuthFlow: startGoogleFlow } = useOAuth({
    strategy: "oauth_google",
  });
  const { startOAuthFlow: startGitHubFlow } = useOAuth({
    strategy: "oauth_github",
  });

  // Handle the submission of the sign-in form
  const onSignInPress = useCallback(async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors)
        console.error('Google OAuth error:', err.errors[0]?.message)
      } else {
        console.error('Unexpected error during Google sign in:', err)
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }, [isLoaded, emailAddress, password]);

  const onGooglePress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startGoogleFlow({
          redirectUrl: Linking.createURL("/(tabs)/", { scheme: "myapp" }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors)
        console.error('Google OAuth error:', err.errors[0]?.message)
      } else {
        console.error('Unexpected error during Google sign in:', err)
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }, [startGoogleFlow]);

  const onGitHubPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startGitHubFlow({
          redirectUrl: Linking.createURL("/(tabs)", { scheme: "myapp" }),
        });

      // If sign in was successful, set the active session
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
      } else {
        // Use signIn or signUp returned from startOAuthFlow
        // for next steps, such as MFA
      }
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors)
        console.error('Google OAuth error:', err.errors[0]?.message)
      } else {
        console.error('Unexpected error during Google sign in:', err)
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }, [startGoogleFlow]);

  return (
    <View className="flex-1 bg-[#0F172A]">
      <LinearGradient
        colors={[
          "#0F172A",
          "#0F1721",
          "#0F1721",
          "rgba(15, 23, 42, 0.1)",
          "transparent",
        ]}
        locations={[0, 0.6, 0.92, 0.98, 1]}
        className="h-[22vh] px-6 pt-12 justify-between pb-20"
      >
        <View className="flex-row items-center gap-4">
          <View className="bg-white/10 p-3 rounded-2xl">
            <Ionicons name="shield-checkmark" size={40} color="white" />
          </View>
          <Text className="text-4xl text-white font-rubikBold">
            Welcome Back
          </Text>
        </View>
      </LinearGradient>

      <View className="flex-1 gap-4 px-8 pt-8 pb-10 space-y-6 bg-white rounded-t-3xl">
        <View className="gap-2">
          <View className="space-y-2">
            <Text className="text-slate-600 font-rubikMedium ml-1">Email</Text>
            <TextInput
              className="bg-slate-100 py-4 px-6 rounded-xl font-inter text-lg"
              autoCapitalize="none"
              value={emailAddress}
              placeholder="Enter your email"
              placeholderTextColor="#94A3B8"
              onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
            />
          </View>

          <View className="space-y-2">
            <Text className="text-slate-600 font-rubikMedium ml-1">
              Password
            </Text>
            <TextInput
              className="bg-slate-100 py-4 px-6 rounded-xl font-inter text-lg"
              value={password}
              placeholder="Enter your password"
              placeholderTextColor="#94A3B8"
              secureTextEntry={true}
              onChangeText={(password) => setPassword(password)}
            />
          </View>
            {errors && (
            <Text className="text-red-500 font-interMedium ml-1">
              {errors.map((error, index) => (
                <Text key={index} className="text-red-500 font-interMedium ml-1">
                  {error.message}
                </Text>
              ))}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={onSignInPress}
          className="bg-[#0F1721] py-4 px-6 rounded-2xl flex-row justify-center items-center gap-3"
        >
          <Ionicons name="log-in-outline" size={24} color="white" />
          <Text className="text-white font-rubikBold text-lg">Sign In</Text>
        </TouchableOpacity>

        <View className="flex-row items-center">
          <View className="flex-1 h-[1px] bg-slate-200" />
          <Text className="mx-4 text-slate-400 font-inter">
            or continue with
          </Text>
          <View className="flex-1 h-[1px] bg-slate-200" />
        </View>

        <View className="flex-row gap-4">
          <TouchableOpacity
            onPress={onGooglePress}
            className="flex-1 py-4 px-6 rounded-2xl flex-row justify-center items-center gap-3 border border-slate-200"
          >
            <Ionicons name="logo-google" size={24} color="#0F1721" />
            <Text className="font-rubikBold text-[#0F1721]">Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onGitHubPress}
            className="flex-1 py-4 px-6 rounded-2xl flex-row justify-center items-center gap-3 border border-slate-200"
          >
            <Ionicons name="logo-github" size={24} color="#0F1721" />
            <Text className="font-rubikBold text-[#0F1721]">GitHub</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center items-center gap-2">
          <Text className="text-slate-600 font-inter">
            Don't have an account?
          </Text>
          <Link href="/sign_up" asChild>
            <TouchableOpacity>
              <Text className="text-blue-500 font-rubikBold">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text className="text-sm text-slate-400 text-center font-interMedium">
          By continuing, you agree to our Privacy Policy and Terms of Service
        </Text>
      </View>
    </View>
  );
}
