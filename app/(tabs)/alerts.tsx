import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SAMPLE_ALERTS = [
  {
    id: '1',
    type: 'Flood',
    severity: 3,
    time: '2h ago',
    description: 'Flash flooding reported in low-lying areas'
  },
  {
    id: '2',
    type: 'Earthquake',
    severity: 4,
    time: '1h ago',
    description: 'Magnitude 4.5 earthquake detected'
  },
  {
    id: '3',
    type: 'Fire',
    severity: 5,
    time: '10m ago',
    description: 'Wildfire spreading in northern region'
  },
];

const getSeverityColor = (severity: number
  
) => {
  switch(severity) {
    case 5: return '#FF4444';
    case 4: return '#FFB300';
    case 3: return '#FFD700';
    default: return '#22C55E';
  }
};

export default function AlertsScreen() {
  return (
    <View className="flex-1 bg-[#0F172A] px-4 pt-4">
      <Text className="text-2xl text-white font-rubikBold mb-4">Active Alerts</Text>
      <FlatList
        data={SAMPLE_ALERTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="mb-4 p-4 rounded-xl border border-gray-700 bg-gray-800/50"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <Ionicons name="warning" size={24} color={getSeverityColor(item.severity)} />
                <Text className="text-lg text-white font-rubikSemiBold">{item.type}</Text>
              </View>
              <Text className="text-gray-400 text-sm">{item.time}</Text>
            </View>
            <Text className="text-gray-300">{item.description}</Text>
            <View className="flex-row items-center mt-3">
              <Text className="text-gray-400 text-sm">
                Severity Level: <Text style={{color: getSeverityColor(item.severity)}}>{item.severity}</Text>
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}