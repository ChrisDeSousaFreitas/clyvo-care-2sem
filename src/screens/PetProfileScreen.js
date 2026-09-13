import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function PetProfileScreen({ route, navigation }) {
  const { pet } = route.params;
  
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const animatedHologramStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value}deg` }]
  }));

  const getIcon = (especie) => {
    const map = { 'Cachorro': 'dog', 'Gato': 'cat', 'Exótico': 'spider', 'Pássaro': 'bird' };
    return map[especie] || 'paw';
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.surface} />
      </TouchableOpacity>

      <Text style={styles.title}>Ficha de Análise</Text>

      <View style={styles.hologramStage}>
        <View style={styles.hologramBase} />
        <Animated.View style={[styles.hologramProjection, animatedHologramStyle]}>
          <MaterialCommunityIcons 
            name={getIcon(pet.especie)} 
            size={120} 
            color={colors.secondary} 
            style={styles.hologramGlow}
          />
        </Animated.View>
        <Text style={styles.hologramText}>Projeção Biométrica Ativa</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.petName}>{pet.nome}</Text>
        <Text style={styles.petSpecies}>{pet.especie}</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Ionicons name="heart-half" size={24} color={colors.danger} />
            <Text style={styles.statValue}>Saudável</Text>
            <Text style={styles.statLabel}>Status</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="pulse" size={24} color={colors.accent} />
            <Text style={styles.statValue}>110 BPM</Text>
            <Text style={styles.statLabel}>Ritmo Cardíaco</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B132B', padding: 25 }, // Fundo escuro para destacar o holograma
  backButton: { marginTop: 30, marginBottom: 15, padding: 10, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 50 },
  title: { fontSize: 26, fontWeight: '900', color: colors.surface, marginBottom: 40, textAlign: 'center', letterSpacing: 2 },
  
  hologramStage: { alignItems: 'center', justifyContent: 'center', height: 250, marginBottom: 30 },
  hologramBase: { position: 'absolute', bottom: 20, width: 150, height: 20, backgroundColor: 'rgba(28, 141, 163, 0.2)', borderRadius: 100, transform: [{ scaleY: 0.5 }], shadowColor: colors.secondary, shadowOpacity: 1, shadowRadius: 15 },
  hologramProjection: { alignItems: 'center', justifyContent: 'center' },
  hologramGlow: { textShadowColor: colors.secondary, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 30 }, // Brilho Neon
  hologramText: { position: 'absolute', bottom: -10, color: colors.secondary, fontSize: 10, letterSpacing: 3, opacity: 0.7, textTransform: 'uppercase' },
  
  statsCard: { backgroundColor: colors.surface, padding: 25, borderRadius: 20, elevation: 10 },
  petName: { fontSize: 32, fontWeight: 'bold', color: colors.primary, textAlign: 'center' },
  petSpecies: { fontSize: 16, color: colors.textLight, textAlign: 'center', marginBottom: 25, textTransform: 'uppercase', letterSpacing: 1 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginTop: 8 },
  statLabel: { fontSize: 12, color: colors.textLight, marginTop: 2 }
});