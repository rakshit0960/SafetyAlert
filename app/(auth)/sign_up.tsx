import { isClerkAPIResponseError, useOAuth, useSignUp } from '@clerk/clerk-expo'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import * as Linking from 'expo-linking'
import { Link, useRouter } from 'expo-router'
import * as WebBrowser from 'expo-web-browser'
import React, { useCallback, useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
import { ClerkAPIError } from '@clerk/types'


export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync()
    return () => {
      void WebBrowser.coolDownAsync()
    }
  }, [])
}

WebBrowser.maybeCompleteAuthSession()

export default function SignUpScreen() {
  useWarmUpBrowser()

  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [errors, setErrors] = React.useState<ClerkAPIError[]>()
  const { startOAuthFlow: startGoogleFlow } = useOAuth({ strategy: 'oauth_google' })
  const { startOAuthFlow: startGitHubFlow } = useOAuth({ strategy: 'oauth_github' })


  // Handle submission of sign-up form
  const onSignUpPress = useCallback(async () => {
    if (!isLoaded) return

    // Clear any errors that may have occurred during previous form submission
    setErrors(undefined)

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
    } catch (err) {
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors)
        console.error('Google OAuth error:', err.errors[0]?.message)
      } else {
        console.error('Unexpected error during Google sign in:', err)
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }, [isLoaded, signUp, emailAddress, password])

  // Handle submission of verification form
  const onVerifyPress = useCallback(async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/(tabs)')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.

        console.error(JSON.stringify(signUpAttempt, null, 2))

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
  }, [isLoaded, signUp, setActive, router, code])

  const onGooglePress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startGoogleFlow({
          redirectUrl: Linking.createURL("/(tabs)/", { scheme: "myapp" }),
        });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace('/(tabs)');
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
  }, [startGoogleFlow, router]);

  const onGitHubPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startGitHubFlow({
          redirectUrl: Linking.createURL("/(tabs)", { scheme: "myapp" }),
        });

      if (createdSessionId) {
        await setActive!({ session: createdSessionId });
        router.replace('/(tabs)');
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
  }, [startGitHubFlow, router]);


  if (pendingVerification) {
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
              Verify Email
            </Text>
          </View>
        </LinearGradient>

        <View className="flex-1 gap-4 px-8 pt-8 pb-10 space-y-6 bg-white rounded-t-3xl">
          <View className="space-y-2">
            <Text className="text-slate-600 font-rubikMedium ml-1">Verification Code</Text>
            <TextInput
              className="bg-slate-100 py-4 px-6 rounded-xl font-inter text-lg"
              value={code}
              placeholder="Enter verification code"
              placeholderTextColor="#94A3B8"
              onChangeText={(code) => setCode(code)}
            />
            {errors && (
              <Text className="text-red-500 font-interMedium ml-1">
                {errors[0]?.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={onVerifyPress}
            className="bg-[#0F1721] py-4 px-6 rounded-2xl flex-row justify-center items-center gap-3"
          >
            <Ionicons name="checkmark-circle-outline" size={24} color="white" />
            <Text className="text-white font-rubikBold text-lg">
              Verify Email
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

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
            Create Account
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
              onChangeText={(email) => setEmailAddress(email)}
            />
          </View>

          <View className="space-y-2">
            <Text className="text-slate-600 font-rubikMedium ml-1">Password</Text>
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
          onPress={onSignUpPress}
          className="bg-[#0F1721] py-4 px-6 rounded-2xl flex-row justify-center items-center gap-3"
        >
          <Ionicons name="person-add-outline" size={24} color="white" />
          <Text className="text-white font-rubikBold text-lg">
            Sign Up
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center">
          <View className="flex-1 h-[1px] bg-slate-200" />
          <Text className="mx-4 text-slate-400 font-inter">or continue with</Text>
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
          <Text className="text-slate-600 font-inter">Already have an account?</Text>
          <Link href="/sign_in" asChild>
            <TouchableOpacity>
              <Text className="text-blue-500 font-rubikBold">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <Text className="text-sm text-slate-400 text-center font-interMedium">
          By continuing, you agree to our Privacy Policy and Terms of Service
        </Text>
      </View>
    </View>
  )
}