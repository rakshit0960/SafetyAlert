import React from 'react';
import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function EmergencyAccessScreen() {
  const router = useRouter();

  const onPressGuest = () => {
    // Handle emergency guest logic, then go to tabs
    router.replace('/(tabs)');
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#FF4444', fontSize: 20, marginBottom: 20 }}>Emergency Access</Text>
      <Button title="Access as Guest" onPress={onPressGuest} color="#FF4444" />
    </View>
  );
}