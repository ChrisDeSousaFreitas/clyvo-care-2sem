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
  const pulseBackground = isStressed ? 'rgba(230, 57, 70, 0.3)' : 'rgba(28, 141, 163, 0.2)';

  return (
    <View style={styles.container}>  
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
      </TouchableOpacity>

      <Text style={[styles.status, { color: currentColor }]}>
        Status: {isStressed ? 'ALERTA CRÍTICO' : 'Conectado'}
      </Text>
      
      <View style={styles.radarContainer}>
        <Animated.View 
          style={[
            styles.pulseCircle, 
            { 
              transform: [{ scale: scaleAnim }], 
              backgroundColor: pulseBackground 
            }
          ]} 
        />
        
        <View style={[styles.innerCircle, { shadowColor: currentColor }]}>
          <Ionicons name={isStressed ? "warning" : "heart"} size={50} color={currentColor} />
          <Text style={styles.bpmText}>{currentBpm}</Text>
          <Text style={styles.bpmLabel}>BPM</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.simulateBtn, { backgroundColor: isStressed ? colors.secondary : colors.danger }]} 
        onPress={() => setIsStressed(!isStressed)}
      >
        <Ionicons name={isStressed ? "checkmark-circle" : "flash"} size={20} color={colors.surface} />
        <Text style={styles.simulateBtnText}>
          {isStressed ? 'Normalizar Sinais' : 'Simular Pico de Estresse'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 10, backgroundColor: colors.surface, borderRadius: 50, shadowColor: '#000', shadowOpacity: 0.1, elevation: 2 },
  status: { position: 'absolute', top: 120, fontSize: 20, fontWeight: '900', letterSpacing: 1 },
  radarContainer: { justifyContent: 'center', alignItems: 'center', width: 250, height: 250 },
  pulseCircle: { position: 'absolute', width: 200, height: 200, borderRadius: 100 },
  innerCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: colors.surface, justifyContent: 'center', alignItems: 'center', elevation: 15 },
  bpmText: { fontSize: 42, fontWeight: '900', color: colors.primary, marginTop: -5 },
  bpmLabel: { fontSize: 14, color: colors.textLight, fontWeight: 'bold' },
  simulateBtn: { position: 'absolute', bottom: 60, flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 15, paddingHorizontal: 25, borderRadius: 30, elevation: 5 },
  simulateBtnText: { color: colors.surface, fontWeight: 'bold', fontSize: 16 }
});