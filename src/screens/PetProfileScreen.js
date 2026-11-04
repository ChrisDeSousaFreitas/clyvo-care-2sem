import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { colors } from '../theme/colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function PetProfileScreen({ route, navigation }) {
  const { pet } = route.params;
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 4000, easing: Easing.linear }), -1, false);
  }, [rotation]);

  const animatedHologramStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value}deg` }],
  }));

  const getIcon = (species) => {
    const map = { Cachorro: 'dog', Gato: 'cat', Exótico: 'spider', Pássaro: 'bird' };
    return map[species] || 'paw';
  };

  const details = [
    { label: 'Idade', value: `${pet.idade ?? '—'} ano(s)`, icon: 'calendar-outline' },
    { label: 'Raça', value: pet.raca || 'Não informada', icon: 'paw-outline' },
    { label: 'Cor', value: pet.cor || 'Não informada', icon: 'color-palette-outline' },
    { label: 'Peso', value: pet.peso == null ? 'Não informado' : `${pet.peso} kg`, icon: 'fitness-outline' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.eyebrow}>FICHA DO PACIENTE</Text>
      <Text style={styles.title}>{pet.nome}</Text>
      <Text style={styles.subtitle}>{pet.especie}</Text>

      <View style={styles.hologramStage}>
        <View style={styles.hologramBase} />
        <Animated.View style={[styles.hologramProjection, animatedHologramStyle]}>
          <MaterialCommunityIcons name={getIcon(pet.especie)} size={116} color={colors.secondary} style={styles.hologramGlow} />
        </Animated.View>
        <Text style={styles.hologramText}>PERFIL DO PACIENTE</Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>Dados cadastrais</Text>
        {details.map((detail) => (
          <View key={detail.label} style={styles.infoRow}>
            <View style={styles.infoIcon}><Ionicons name={detail.icon} size={20} color={colors.secondary} /></View>
            <View style={styles.infoCopy}>
              <Text style={styles.infoTitle}>{detail.label}</Text>
              <Text style={styles.infoDescription}>{detail.value}</Text>
            </View>
          </View>
        ))}

        <View style={styles.notice}>
          <Ionicons name="information-circle-outline" size={18} color={colors.secondary} />
          <Text style={styles.disclaimer}>Os dados são provenientes do cadastro da API clínica. Diagnósticos e medições dependem de registros veterinários e fontes reais de telemetria.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0B132B', padding: 24, paddingTop: 52, paddingBottom: 35 },
  backButton: { marginBottom: 24, padding: 10, alignSelf: 'flex-start', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 13 },
  eyebrow: { color: colors.secondary, fontSize: 10, fontWeight: '900', letterSpacing: 1.7, textAlign: 'center' },
  title: { fontSize: 29, fontWeight: '900', color: '#FFFFFF', marginTop: 6, textAlign: 'center' },
  subtitle: { color: '#B7C9D4', fontSize: 12, marginTop: 5, textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 },
  hologramStage: { alignItems: 'center', justifyContent: 'center', height: 215, marginVertical: 14 },
  hologramBase: { position: 'absolute', bottom: 20, width: 150, height: 20, backgroundColor: 'rgba(28,141,163,0.2)', borderRadius: 100, transform: [{ scaleY: 0.5 }] },
  hologramProjection: { alignItems: 'center', justifyContent: 'center' },
  hologramGlow: { textShadowColor: colors.secondary, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 28 },
  hologramText: { position: 'absolute', bottom: -4, color: colors.secondary, fontSize: 9, letterSpacing: 2, fontWeight: '800' },
  statsCard: { backgroundColor: colors.surface, padding: 20, borderRadius: 22, elevation: 8 },
  sectionTitle: { fontSize: 16, color: colors.primary, fontWeight: '900', marginBottom: 7 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11, borderTopWidth: 1, borderTopColor: '#E8EEF2' },
  infoIcon: { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  infoCopy: { flex: 1 },
  infoTitle: { color: colors.textLight, fontSize: 10, fontWeight: '700' },
  infoDescription: { color: colors.primary, fontSize: 14, fontWeight: '800', marginTop: 3 },
  notice: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, backgroundColor: colors.background, padding: 12, borderRadius: 12, marginTop: 12 },
  disclaimer: { flex: 1, color: colors.textLight, fontSize: 10, lineHeight: 15 },
});
