import React from 'react';
import { View, Text } from 'react-native';

export default function SmartCollarScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Status da Coleira IoT: Conectada</Text>
      <Text>BPM Atual: 120</Text>
    </View>
  );
}