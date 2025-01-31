import React, { useEffect, useState } from "react";
import MapView from "react-native-maps";
import { StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      setLoading(true);
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          return;
        }
        const currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);
      } catch (error) {
        console.log(error);
        setErrorMsg("Error getting location");
      } finally {
        setLoading(false);
      }
    };
    requestLocationPermission();
  }, []);

  return (
    <View className="flex-1">
      {loading ? (
        <View className="flex-1 items-center justify-center bg-[#0F172A]">
          <Text className="text-white text-lg font-rubikSemiBold mb-2">Getting your location...</Text>
          <Text className="text-gray-400 text-sm">Please wait while we access your GPS</Text>
        </View>
      ) : (
        <MapView
          style={styles.map}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true}
          showsBuildings={true}
          showsIndoors={true}
          showsPointsOfInterest={true}
          initialRegion={{
            latitude: location?.coords.latitude || 0,
            longitude: location?.coords.longitude || 0,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});
