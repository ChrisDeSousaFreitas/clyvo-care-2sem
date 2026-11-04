import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

export default function AboutScreen({ navigation }) {
  const version = Constants.expoConfig?.version || '1.2.0';
  const commitHash =
    Constants.expoConfig?.extra?.commitHash ||
    'Disponível após gerar a versão pelo EAS Build';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={colors.primary} />
      </TouchableOpacity>

      <View style={styles.brandMark}>
        <Ionicons name="paw" size={38} color={colors.surface} />
      </View>

      <Text style={styles.title}>Clyvo SmartCare</Text>
      <Text style={styles.subtitle}>
        Tecnologia e cuidado para acompanhar a saúde de quem faz parte da família.
      </Text>

      <View style={styles.infoCard}>
        <Text style={styles.label}>VERSÃO DO APLICATIVO</Text>
        <Text style={styles.value}>v{version}</Text>
        <View style={styles.separator} />
        <Text style={styles.label}>COMMIT DE REFERÊNCIA</Text>
        <Text selectable style={styles.hash}>{commitHash}</Text>
        <Text style={styles.helper}>
          O hash é preenchido automaticamente no processo de publicação pelo EAS Build.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Clyvo SmartCare · Mobile Development</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: 24,
    paddingTop: 58,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 11,
    borderRadius: 14,
    backgroundColor: colors.surface,
    marginBottom: 34,
  },
  brandMark: {
    width: 82,
    height: 82,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    marginBottom: 18,
  },
  title: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 23,
    fontSize: 15,
    marginTop: 9,
    marginBottom: 30,
    maxWidth: 310,
  },
  infoCard: {
    width: '100%',
    backgroundColor: colors.surface,
    padding: 22,
    borderRadius: 22,
    elevation: 3,
    shadowColor: '#102A43',
    shadowOpacity: 0.08,
    shadowRadius: 14,
  },
  label: {
    color: colors.textLight,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  value: {
    color: colors.primary,
    fontSize: 25,
    fontWeight: '800',
    marginTop: 7,
  },
  separator: {
    height: 1,
    backgroundColor: colors.background,
    marginVertical: 20,
  },
  hash: {
    color: colors.secondary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  helper: {
    color: colors.textLight,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 9,
  },
  footer: { marginTop: 'auto', paddingTop: 32 },
  footerText: { color: colors.textLight, fontSize: 12 },
});
