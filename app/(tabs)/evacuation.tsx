import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EVACUATION_SECTIONS = [
  {
    id: '1',
    title: 'Emergency Checklist',
    icon: 'checkbox-outline',
    description: 'Essential items to pack during evacuation'
  },
  {
    id: '2',
    title: 'Emergency Contacts',
    icon: 'call-outline',
    description: 'Quick access to emergency numbers'
  },
  {
    id: '3',
    title: 'Evacuation Routes',
    icon: 'map-outline',
    description: 'Safe routes and shelter locations'
  },
  {
    id: '4',
    title: 'Safety Guidelines',
    icon: 'shield-checkmark-outline',
    description: 'Important procedures to follow'
  }
];

export default function EvacuationScreen() {
  return (
    <View className="flex-1 bg-[#0F172A]">
      <ScrollView className="flex-1 px-4 pt-4">
        <Text className="text-2xl text-white font-rubikBold mb-4">Evacuation Guide</Text>

        {EVACUATION_SECTIONS.map((section) => (
          <TouchableOpacity
            key={section.id}
            className="mb-4 p-4 rounded-xl border border-gray-700 bg-gray-800/50"
            activeOpacity={0.7}
          >
            <View className="flex-row items-center gap-3 mb-2">
              <Ionicons name={section.icon as any} size={24} color="#60A5FA" />
              <Text className="text-lg text-white font-rubikSemiBold">{section.title}</Text>
            </View>
            <Text className="text-gray-300">{section.description}</Text>
          </TouchableOpacity>
        ))}

        <View className="mb-4 p-4 rounded-xl border border-red-800 bg-red-900/30">
          <View className="flex-row items-center gap-3 mb-2">
            <Ionicons name="warning" size={24} color="#FF4444" />
            <Text className="text-lg text-white font-rubikSemiBold">Emergency Alert</Text>
          </View>
          <Text className="text-gray-300">
            In case of immediate danger, call emergency services at 911
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
