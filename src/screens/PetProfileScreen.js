import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
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
  }, [rotation]);

  const animatedHologramStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value}deg` }],
  }));

  const getIcon = (species) => {
    const map = { Cachorro: 'dog', Gato: 'cat', Exótico: 'spider', Pássaro: 'bird' };
    return map[species] || 'paw';
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.eyebrow}>PERFIL DO PET</Text>
      <Text style={styles.title}>Ficha de {pet.nome}</Text>

      <View style={styles.hologramStage}>
        <View style={styles.hologramBase} />
        <Animated.View style={[styles.hologramProjection, animatedHologramStyle]}>
          <MaterialCommunityIcons
            name={getIcon(pet.especie)}
            size={116}
            color={colors.secondary}
            style={styles.hologramGlow}
          />
        </Animated.View>
        <Text style={styles.hologramText}>VISUALIZAÇÃO DO PERFIL</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.petName}>{pet.nome}</Text>
        <Text style={styles.petSpecies}>{pet.especie}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="heart-outline" size={21} color={colors.secondary} />
          </View>
          <View style={styles.infoCopy}>
            <Text style={styles.infoTitle}>Dados clínicos</Text>
            <Text style={styles.infoDescription}>
              Nenhuma medição clínica foi sincronizada para este perfil.
            </Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoIcon}>
            <Ionicons name="pulse-outline" size={21} color={colors.accent} />
          </View>
          <View style={styles.infoCopy}>
            <Text style={styles.infoTitle}>Telemetria</Text>
            <Text style={styles.infoDescription}>
              Conecte uma fonte de dados Smart Collar para visualizar métricas reais.
            </Text>
          </View>
        </View>

        <Text style={styles.disclaimer}>
          As informações desta ficha refletem apenas os dados cadastrados. Nenhum diagnóstico veterinário é realizado pelo aplicativo.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0B132B', padding: 24, paddingTop: 52, paddingBottom: 35 },
  backButton: { marginBottom: 24, padding: 10, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 13 },
  eyebrow: { color: colors.secondary, fontSize: 10, fontWeight: '900', letterSpacing: 1.7 },
  title: { fontSize: 25, fontWeight: '900', color: '#FFFFFF', marginTop: 6, textAlign: 'center' },
  hologramStage: { alignItems: 'center', justifyContent: 'center', height: 230, marginVertical: 18 },
  hologramBase: { position: 'absolute', bottom: 20, width: 150, height: 20, backgroundColor: 'rgba(28,141,163,0.2)', borderRadius: 100, transform: [{ scaleY: 0.5 }] },
  hologramProjection: { alignItems: 'center', justifyContent: 'center' },
  hologramGlow: { textShadowColor: colors.secondary, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 28 },
  hologramText: { position: 'absolute', bottom: -4, color: colors.secondary, fontSize: 9, letterSpacing: 2, fontWeight: '800' },
  statsCard: { backgroundColor: colors.surface, padding: 22, borderRadius: 22, elevation: 8 },
  petName: { fontSize: 29, fontWeight: '900', color: colors.primary, textAlign: 'center' },
  petSpecies: { fontSize: 13, color: colors.textLight, textAlign: 'center', marginBottom: 23, marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderTopWidth: 1, borderTopColor: '#E8EEF2' },
  infoIcon: { width: 42, height: 42, borderRadius: 13, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  infoCopy: { flex: 1 },
  infoTitle: { color: colors.primary, fontSize: 14, fontWeight: '800' },
  infoDescription: { color: colors.textLight, fontSize: 12, lineHeight: 18, marginTop: 4 },
  disclaimer: { color: colors.textLight, fontSize: 10, lineHeight: 16, marginTop: 15 },
});
