import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const { logout, user } = useAuth();
  const displayName = user?.username || 'Administrador';

  const shortcuts = [
    { title: 'Pets', description: 'Cadastro e informações', icon: 'paw', route: 'Pets' },
    { title: 'Agenda', description: 'Consultas e procedimentos', icon: 'calendar', route: 'Agendamentos' },
    { title: 'Smart Collar', description: 'Demonstração da experiência IoT', icon: 'pulse', route: 'Collar', wide: true },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.eyebrow}>PAINEL CLYVO</Text>
          <Text style={styles.greeting}>Olá, {displayName}.</Text>
          <Text style={styles.subtitle}>Tudo pronto para organizar os cuidados veterinários?</Text>
        </View>
        <View style={styles.avatar}>
          <Ionicons name="person" size={22} color={colors.secondary} />
        </View>
      </View>

      <View style={styles.highlightCard}>
        <View style={styles.highlightIcon}>
          <Ionicons name="heart" size={23} color="#FFFFFF" />
        </View>
        <View style={styles.highlightCopy}>
          <Text style={styles.highlightTitle}>Cuidado em cada detalhe</Text>
          <Text style={styles.highlightText}>Gerencie os pacientes, acompanhe consultas e mantenha a rotina clínica organizada.</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Acesso rápido</Text>
      <View style={styles.grid}>
        {shortcuts.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={[styles.card, item.wide && styles.cardWide]}
            onPress={() => navigation.navigate(item.route)}
            activeOpacity={0.82}
          >
            <View style={styles.cardIcon}>
              <Ionicons name={item.icon} size={25} color={colors.secondary} />
            </View>
            <View style={styles.cardCopy}>
              <Text style={styles.cardText}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footerActions}>
        <TouchableOpacity style={styles.footerButton} onPress={() => navigation.navigate('About')}>
          <Ionicons name="information-circle-outline" size={19} color={colors.secondary} />
          <Text style={styles.footerButtonText}>Sobre o aplicativo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Ionicons name="log-out-outline" size={19} color={colors.danger} />
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 24, paddingTop: 62, paddingBottom: 30, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 26 },
  headerCopy: { flex: 1, paddingRight: 12 },
  eyebrow: { color: colors.secondary, fontSize: 10, fontWeight: '900', letterSpacing: 1.6, marginBottom: 8 },
  greeting: { fontSize: 29, fontWeight: '900', color: colors.primary },
  subtitle: { fontSize: 14, lineHeight: 21, color: colors.textLight, marginTop: 6, maxWidth: 280 },
  avatar: { width: 48, height: 48, borderRadius: 16, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center' },
  highlightCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, borderRadius: 20, padding: 18, marginBottom: 30 },
  highlightIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  highlightCopy: { flex: 1 },
  highlightTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  highlightText: { color: '#DCE8EF', fontSize: 12, lineHeight: 18, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: '900', color: colors.primary, marginBottom: 13 },
  grid: { gap: 11 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 16, borderRadius: 17, minHeight: 78, elevation: 2 },
  cardWide: { borderWidth: 1, borderColor: '#D7E8EC' },
  cardIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 13 },
  cardCopy: { flex: 1 },
  cardText: { fontSize: 16, fontWeight: '800', color: colors.primary },
  cardDescription: { fontSize: 12, color: colors.textLight, marginTop: 3 },
  footerActions: { marginTop: 26, borderTopWidth: 1, borderTopColor: '#E1E8ED', paddingTop: 17, gap: 8 },
  footerButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 9 },
  footerButtonText: { color: colors.secondary, fontSize: 14, fontWeight: '700' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 9 },
  logoutText: { color: colors.danger, fontSize: 14, fontWeight: '700' },
});
