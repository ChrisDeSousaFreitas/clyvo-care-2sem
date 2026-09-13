import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function SmartCollarScreen() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.2, duration: 400, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  }, [scaleAnim]);

  return (
    <View style={styles.container}>
      <Text style={styles.status}>Status: Conectado</Text>
      
      <View style={styles.radarContainer}>
        <Animated.View style={[styles.pulseCircle, { transform: [{ scale: scaleAnim }] }]} />
        <View style={styles.innerCircle}>
          <Ionicons name="heart" size={50} color={colors.accent} />
          <Text style={styles.bpmText}>120</Text>
          <Text style={styles.bpmLabel}>BPM</Text>
        </View>
      </View>

      <Text style={styles.info}>Telemetria em tempo real ativada.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  status: { position: 'absolute', top: 50, fontSize: 16, fontWeight: 'bold', color: colors.secondary },
  radarContainer: { justifyContent: 'center', alignItems: 'center', width: 250, height: 250 },
  pulseCircle: { position: 'absolute', width: 200, height: 200, borderRadius: 100, backgroundColor: 'rgba(28, 141, 163, 0.2)' },
  innerCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', shadowColor: colors.secondary, shadowOpacity: 0.5, shadowRadius: 15, elevation: 10 },
  bpmText: { fontSize: 32, fontWeight: '900', color: colors.primary, marginTop: -5 },
  bpmLabel: { fontSize: 12, color: colors.textLight, fontWeight: 'bold' },
  info: { position: 'absolute', bottom: 50, color: colors.textLight, fontSize: 14 }
});