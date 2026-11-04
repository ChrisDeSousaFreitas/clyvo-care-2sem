import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAgendamentos } from '../hooks/useAgendamentos';
import {
  scheduleAppointmentReminder,
  cancelAppointmentReminders,
} from '../services/notifications';

export default function AgendamentoScreen({ navigation }) {
  const { query, createMutation, deleteMutation } = useAgendamentos();
  const [tipo, setTipo] = useState('');
  const [data, setData] = useState('');

  const handleAgendar = () => {
    if (!tipo.trim() || !data.trim()) {
      Alert.alert('Dados incompletos', 'Informe o procedimento e a data do agendamento.');
      return;
    }

    createMutation.mutate(
      { tipo: tipo.trim(), data: data.trim(), status: 'pendente' },
      {
        onSuccess: async (response) => {
          const savedAppointment = response?.data || response;
          setTipo('');
          setData('');

          try {
            await scheduleAppointmentReminder({
              id: savedAppointment?.id,
              tipo: tipo.trim(),
              data: data.trim(),
            });
            Alert.alert(
              'Agendamento salvo',
              'Tudo certo! Você receberá um lembrete local antes do horário marcado.'
            );
          } catch (error) {
            Alert.alert(
              'Agendamento salvo',
              `O agendamento foi salvo, mas o lembrete não pôde ser programado. ${error.message}`
            );
          }
        },
      }
    );
  };

  const handleExcluir = (id) => {
    deleteMutation.mutate(id, {
      onSuccess: () => cancelAppointmentReminders(id).catch((error) => {
        console.warn('Não foi possível cancelar o lembrete:', error);
      }),
    });
  };

  const renderAppointment = ({ item, index }) => {
    const isDone = item.status === 'concluido';
    const isLast = index === (query.data?.length || 0) - 1;

    return (
      <View style={styles.timelineRow}>
        <View style={styles.nodeColumn}>
          <View style={[styles.node, { backgroundColor: isDone ? colors.secondary : colors.accent }]} />
          {!isLast && <View style={styles.line} />}
        </View>
        <View style={[styles.card, !isDone && styles.cardHighlight]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.date}>{item.data}</Text>
            <Text style={styles.type}>{item.tipo}</Text>
            <Text style={styles.status}>{isDone ? 'Concluído' : 'Pendente'}</Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`Excluir agendamento de ${item.tipo}`}
            onPress={() => handleExcluir(item.id)}
            disabled={deleteMutation.isPending}
            style={styles.deleteButton}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.eyebrow}>CUIDADO CONTÍNUO</Text>
      <Text style={styles.title}>Agenda de saúde</Text>
      <Text style={styles.subtitle}>Organize consultas e procedimentos do seu pet.</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Procedimento (ex.: Vacina)"
          value={tipo}
          onChangeText={setTipo}
          style={styles.input}
          placeholderTextColor={colors.textLight}
        />
        <TextInput
          placeholder="AAAA-MM-DD HH:mm"
          value={data}
          onChangeText={setData}
          style={styles.inputData}
          placeholderTextColor={colors.textLight}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.btnAdd}
          onPress={handleAgendar}
          disabled={createMutation.isPending}
          accessibilityRole="button"
          accessibilityLabel="Salvar agendamento"
        >
          {createMutation.isPending ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Ionicons name="add" size={24} color={colors.surface} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Próximos cuidados</Text>

      {query.isLoading ? (
        <ActivityIndicator size="large" color={colors.secondary} style={{ marginTop: 40 }} />
      ) : query.isError ? (
        <View style={styles.feedback}>
          <Ionicons name="cloud-offline-outline" size={30} color={colors.textLight} />
          <Text style={styles.feedbackText}>Não foi possível carregar a agenda.</Text>
          <TouchableOpacity onPress={() => query.refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={query.data || []}
          keyExtractor={(item) => String(item.id ?? `${item.tipo}-${item.data}`)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30, paddingTop: 12, flexGrow: 1 }}
          renderItem={renderAppointment}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={34} color={colors.secondary} />
              <Text style={styles.emptyTitle}>Sua agenda está livre</Text>
              <Text style={styles.emptyText}>Adicione uma consulta para receber um lembrete.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 52, backgroundColor: colors.background },
  backButton: {
    padding: 10,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 13,
    marginBottom: 18,
    elevation: 2,
  },
  eyebrow: { color: colors.secondary, fontSize: 11, fontWeight: '900', letterSpacing: 1.6 },
  title: { fontSize: 29, fontWeight: '900', color: colors.primary, marginTop: 5 },
  subtitle: { fontSize: 14, color: colors.textLight, marginTop: 6, marginBottom: 22 },
  form: { flexDirection: 'row', gap: 8, marginBottom: 25 },
  input: {
    flex: 1.5,
    minWidth: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4EAF0',
    color: colors.text,
    fontSize: 13,
  },
  inputData: {
    flex: 1.35,
    minWidth: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4EAF0',
    color: colors.text,
    fontSize: 12,
  },
  btnAdd: {
    width: 48,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: { color: colors.primary, fontWeight: '800', fontSize: 17, marginBottom: 4 },
  timelineRow: { flexDirection: 'row', minHeight: 94 },
  nodeColumn: { alignItems: 'center', width: 28 },
  node: { width: 13, height: 13, borderRadius: 7, zIndex: 1, marginTop: 22 },
  line: { width: 2, flex: 1, backgroundColor: '#D1DCE5', marginVertical: -2 },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 17,
    borderRadius: 16,
    marginBottom: 13,
    marginLeft: 10,
    elevation: 2,
  },
  cardHighlight: { borderColor: colors.accent, borderWidth: 1 },
  date: { fontSize: 12, color: colors.textLight, fontWeight: '700' },
  type: { fontSize: 17, color: colors.primary, fontWeight: '800', marginTop: 5 },
  status: { fontSize: 11, color: colors.secondary, fontWeight: '700', marginTop: 4 },
  deleteButton: { padding: 8, marginLeft: 8 },
  feedback: { alignItems: 'center', padding: 28, marginTop: 25, backgroundColor: colors.surface, borderRadius: 18 },
  feedbackText: { color: colors.textLight, marginTop: 10, textAlign: 'center' },
  retryButton: { marginTop: 14, backgroundColor: colors.secondary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#FFFFFF', fontWeight: '700' },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 30, marginTop: 25, backgroundColor: colors.surface, borderRadius: 18 },
  emptyTitle: { color: colors.primary, fontSize: 16, fontWeight: '800', marginTop: 12 },
  emptyText: { color: colors.textLight, textAlign: 'center', marginTop: 5, lineHeight: 20 },
});
