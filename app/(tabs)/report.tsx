import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

interface DisasterType {
  id: number;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

interface SeverityLevel {
  id: number;
  name: string;
  color: string;
}

interface LocationData {
  latitude: number;
  longitude: number;
}

interface Report {
  disasterType: DisasterType | null;
  severity: SeverityLevel | null;
  location: LocationData | null;
  media: string | null;
  timestamp: string;
}

const DISASTER_TYPES: DisasterType[] = [
  { id: 1, name: 'Flood', icon: 'water', color: '#60A5FA' },
  { id: 2, name: 'Fire', icon: 'flame', color: '#EF4444' },
  { id: 3, name: 'Earthquake', icon: 'earth', color: '#F59E0B' },
  { id: 4, name: 'Storm', icon: 'thunderstorm', color: '#8B5CF6' },
];

const SEVERITY_LEVELS: SeverityLevel[] = [
  { id: 1, name: 'Low', color: '#22C55E' },
  { id: 2, name: 'Medium', color: '#FFD700' },
  { id: 3, name: 'High', color: '#FFB300' },
  { id: 4, name: 'Critical', color: '#FF4444' },
];

export default function ReportScreen() {
  const [step, setStep] = useState(1);
  const [disasterType, setDisasterType] = useState<DisasterType | null>(null);
  const [severity, setSeverity] = useState<SeverityLevel | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [media, setMedia] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true);
  const [pendingReports, setPendingReports] = useState<Report[]>([]);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
    }
  };

  const pickMedia = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setMedia(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const report: Report = {
      disasterType,
      severity,
      location,
      media,
      timestamp: new Date().toISOString(),
    };

    if (!isOnline) {
      setPendingReports(prev => [...prev, report]);
      return;
    }

    if (severity?.id === 4) {
      // Auto-contact authorities for critical emergencies
      // Implementation would go here
    }

    // Implementation of encrypted upload would go here
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      if (step === 2) {
        setDisasterType(null);
      } else if (step === 3) {
        setSeverity(null);
        setMedia(null);
      }
    }
  };

  return (
    <View className="flex-1 bg-[#0F172A]">
      <ScrollView className="flex-1 px-4 pt-4">
        <View className="flex-row items-center mb-4">
          {step > 1 && (
            <TouchableOpacity onPress={goBack} className="mr-3">
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}
          <Text className="text-2xl text-white font-rubikBold">Report Emergency</Text>
        </View>

        {!isOnline && (
          <View className="mb-4 p-4 rounded-xl bg-yellow-500/20 border border-yellow-500">
            <Text className="text-yellow-500">Offline Mode - Report will sync when online</Text>
          </View>
        )}

        {/* Step 1: Select Disaster Type */}
        {step === 1 && (
          <View className="mb-4">
            <Text className="text-lg text-white font-rubikSemiBold mb-3">Select Disaster Type</Text>
            <View className="flex-row flex-wrap gap-4">
              {DISASTER_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => {
                    setDisasterType(type);
                    setStep(2);
                  }}
                  className="flex-1 min-w-[45%] p-6 rounded-xl"
                  style={{ backgroundColor: `${type.color}20` }}
                >
                  <Ionicons name={type.icon} size={32} color={type.color} />
                  <Text className="text-white text-lg mt-2">{type.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 2: Select Severity */}
        {step === 2 && (
          <View className="mb-4">
            <Text className="text-lg text-white font-rubikSemiBold mb-3">Select Severity</Text>
            {SEVERITY_LEVELS.map((level) => (
              <TouchableOpacity
                key={level.id}
                onPress={() => {
                  setSeverity(level);
                  setStep(3);
                }}
                className="mb-3 p-6 rounded-xl"
                style={{ backgroundColor: `${level.color}20` }}
              >
                <Text style={{ color: level.color }} className="text-xl font-rubikSemiBold">
                  {level.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 3: Add Evidence */}
        {step === 3 && (
          <View className="mb-4">
            <Text className="text-lg text-white font-rubikSemiBold mb-3">Add Evidence</Text>
            <TouchableOpacity
              onPress={pickMedia}
              className="p-8 rounded-xl border-2 border-dashed border-gray-600 items-center"
            >
              {media ? (
                <Image source={{ uri: media }} className="w-full h-48 rounded-lg" />
              ) : (
                <>
                  <Ionicons name="camera" size={40} color="#60A5FA" />
                  <Text className="text-white text-lg mt-2">Take Photo/Video</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Step 4: Review Information */}
        {step === 4 && (
          <View className="mb-4">
            <Text className="text-lg text-white font-rubikSemiBold mb-3">Review Information</Text>

            <View className="p-4 rounded-xl bg-gray-800/50 border border-gray-700 mb-4">
              <View className="flex-row items-center mb-3">
                <Ionicons name={disasterType?.icon || 'alert'} size={24} color={disasterType?.color} />
                <Text className="text-white text-lg ml-2">{disasterType?.name}</Text>
              </View>

              <View className="flex-row items-center mb-3">
                <Ionicons name="warning" size={24} color={severity?.color} />
                <Text className="text-white text-lg ml-2">Severity: {severity?.name}</Text>
              </View>

              {location && (
                <View className="flex-row items-center mb-3">
                  <Ionicons name="location" size={24} color="#60A5FA" />
                  <Text className="text-white text-lg ml-2">
                    Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                  </Text>
                </View>
              )}

              {media && (
                <View className="mt-3">
                  <Text className="text-white text-lg mb-2">Evidence:</Text>
                  <Image source={{ uri: media }} className="w-full h-48 rounded-lg" />
                </View>
              )}
            </View>
          </View>
        )}

        <TouchableOpacity
          className="mt-4 mb-8 bg-red-500 py-6 rounded-xl flex-row justify-center items-center"
          onPress={() => {
            if (step === 3) {
              setStep(4);
            } else if (step === 4) {
              handleSubmit();
            } else {
              setStep(step + 1);
            }
          }}
        >
          <Text className="text-white text-xl font-rubikSemiBold">
            {step === 4 ? 'Submit Report' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}