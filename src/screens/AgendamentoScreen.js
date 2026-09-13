import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

const mockTimeline = [
  { id: '1', data: 'Hoje, 14:00', tipo: 'Consulta Preventiva', status: 'pendente' },
  { id: '2', data: '05 Set, 09:30', tipo: 'Vacina Raiva', status: 'concluido' },
  { id: '3', data: '20 Ago, 16:00', tipo: 'Exame de Sangue', status: 'concluido' },
  { id: '4', data: '15 Jul, 10:00', tipo: 'Check-up Exóticos', status: 'concluido' },
];

export default function AgendamentoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>Histórico Clínico</Text>
      
      <FlatList
        data={mockTimeline}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30, marginTop: 10 }}
        renderItem={({ item, index }) => {
          const isDone = item.status === 'concluido';
          const isLast = index === mockTimeline.length - 1;
          
          return (
            <View style={styles.timelineRow}>
              <View style={styles.nodeColumn}>
                <View style={[styles.node, { backgroundColor: isDone ? colors.secondary : colors.accent }]} />
                {!isLast && <View style={styles.line} />}
              </View>
              
              <View style={[styles.card, !isDone && styles.cardHighlight]}>
                <Text style={styles.date}>{item.data}</Text>
                <Text style={styles.type}>{item.tipo}</Text>
                <Ionicons 
                  name={isDone ? "checkmark-circle" : "time"} 
                  size={24} 
                  color={isDone ? colors.secondary : colors.accent} 
                  style={styles.icon} 
                />
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: colors.background },
  backButton: { marginTop: 30, marginBottom: 15, padding: 10, alignSelf: 'flex-start', backgroundColor: colors.surface, borderRadius: 50, elevation: 2 },
  title: { fontSize: 28, fontWeight: '900', color: colors.primary, marginBottom: 25 },
  timelineRow: { flexDirection: 'row' },
  nodeColumn: { alignItems: 'center', width: 30 },
  node: { width: 16, height: 16, borderRadius: 8, zIndex: 10, elevation: 3 },
  line: { width: 2, flex: 1, backgroundColor: '#D1D5DB', marginVertical: -4 },
  card: { flex: 1, backgroundColor: colors.surface, padding: 18, borderRadius: 16, marginBottom: 25, marginLeft: 15, shadowColor: '#000', shadowOpacity: 0.05, elevation: 3 },
  cardHighlight: { borderColor: colors.accent, borderWidth: 1, shadowColor: colors.accent, shadowOpacity: 0.1, elevation: 5 },
  date: { fontSize: 13, color: colors.textLight, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 0.5 },
  type: { fontSize: 18, color: colors.primary, fontWeight: '700', marginTop: 6 },
  icon: { position: 'absolute', right: 15, top: 22 }
});