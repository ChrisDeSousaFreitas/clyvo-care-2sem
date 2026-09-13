import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons'; 

export default function HomeScreen({ navigation }) {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Olá, Tutor!</Text>
      <Text style={styles.subtitle}>O que vamos monitorar hoje?</Text>

      <View style={styles.grid}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Pets')}>
          <Ionicons name="paw" size={40} color={colors.secondary} />
          <Text style={styles.cardText}>Meus Pets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Agendamentos')}>
          <Ionicons name="calendar" size={40} color={colors.secondary} />
          <Text style={styles.cardText}>Agenda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, styles.cardFull]} onPress={() => navigation.navigate('Collar')}>
          <Ionicons name="pulse" size={40} color={colors.accent} />
          <Text style={styles.cardText}>Smart Collar IoT</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: colors.background, paddingTop: 60 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: colors.primary },
  subtitle: { fontSize: 16, color: colors.textLight, marginBottom: 30, marginTop: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { backgroundColor: colors.surface, width: '47%', padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  cardFull: { width: '100%', flexDirection: 'row', justifyContent: 'center', gap: 15 },
  cardText: { marginTop: 10, fontSize: 16, fontWeight: '600', color: colors.primary },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 'auto', padding: 15, gap: 8 },
  logoutText: { color: colors.danger, fontSize: 16, fontWeight: 'bold' }
});