import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function SmartCollarScreen({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [isStressed, setIsStressed] = useState(false);

  useEffect(() => {
    const speed = isStressed ? 150 : 400;
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.3, duration: speed, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: speed, useNativeDriver: true }),
      ])
    );

    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [scaleAnim, isStressed]);

  const currentColor = isStressed ? colors.danger : colors.secondary;
  const currentBpm = isStressed ? '185' : '110';
  const pulseBackground = isStressed
    ? 'rgba(230, 57, 70, 0.3)'
    : 'rgba(28, 141, 163, 0.2)';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.eyebrow}>SMART COLLAR</Text>
      <Text style={styles.title}>Monitoramento</Text>
      <View style={styles.demoBadge}>
        <View style={styles.demoDot} />
        <Text style={styles.demoText}>MODO DE SIMULAÇÃO</Text>
      </View>

      <Text style={[styles.status, { color: currentColor }]}>
        {isStressed ? 'PICO DE ESTRESSE SIMULADO' : 'SINAIS SIMULADOS NORMAIS'}
      </Text>

      <View style={styles.radarContainer}>
        <Animated.View
          style={[
            styles.pulseCircle,
            { transform: [{ scale: scaleAnim }], backgroundColor: pulseBackground },
          ]}
        />
        <View style={[styles.innerCircle, { shadowColor: currentColor }]}>
          <Ionicons name={isStressed ? 'warning' : 'heart'} size={42} color={currentColor} />
          <Text style={styles.bpmText}>{currentBpm}</Text>
          <Text style={styles.bpmLabel}>BPM · DEMO</Text>
        </View>
      </View>

      <Text style={styles.disclaimer}>
        Valores ilustrativos para demonstrar a interface. Não representam medições de um dispositivo real.
      </Text>

      <TouchableOpacity
        style={[styles.simulateBtn, { backgroundColor: isStressed ? colors.secondary : colors.danger }]}
        onPress={() => setIsStressed(!isStressed)}
        activeOpacity={0.85}
      >
        <Ionicons name={isStressed ? 'checkmark-circle' : 'flash'} size={20} color="#FFFFFF" />
        <Text style={styles.simulateBtnText}>
          {isStressed ? 'Voltar à simulação normal' : 'Simular pico de estresse'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background, padding: 24 },
  backButton: { position: 'absolute', top: 52, left: 22, zIndex: 10, padding: 10, backgroundColor: colors.surface, borderRadius: 13, elevation: 2 },
  eyebrow: { color: colors.secondary, fontSize: 10, fontWeight: '900', letterSpacing: 1.7 },
  title: { color: colors.primary, fontSize: 28, fontWeight: '900', marginTop: 6 },
  demoBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 7, marginTop: 13 },
  demoDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.accent, marginRight: 7 },
  demoText: { color: colors.textLight, fontSize: 9, fontWeight: '900', letterSpacing: 1.2 },
  status: { fontSize: 12, fontWeight: '900', letterSpacing: 1, marginTop: 34 },
  radarContainer: { justifyContent: 'center', alignItems: 'center', width: 250, height: 250, marginTop: 12 },
  pulseCircle: { position: 'absolute', width: 190, height: 190, borderRadius: 100 },
  innerCircle: { width: 148, height: 148, borderRadius: 74, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', elevation: 12 },
  bpmText: { fontSize: 40, fontWeight: '900', color: colors.primary, marginTop: 3 },
  bpmLabel: { fontSize: 10, color: colors.textLight, fontWeight: '900', letterSpacing: 1 },
  disclaimer: { color: colors.textLight, fontSize: 11, lineHeight: 17, textAlign: 'center', maxWidth: 290, marginTop: 5 },
  simulateBtn: { position: 'absolute', bottom: 52, flexDirection: 'row', alignItems: 'center', gap: 9, paddingVertical: 15, paddingHorizontal: 22, borderRadius: 15, elevation: 4 },
  simulateBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 14 },
});
