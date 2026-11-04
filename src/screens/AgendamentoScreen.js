import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAgendamentos } from '../hooks/useAgendamentos';
import { usePets } from '../hooks/usePets';
import { useVeterinarios } from '../hooks/useVeterinarios';
import { getApiErrorMessage } from '../api/axiosConfig';
import { scheduleAppointmentReminder, cancelAppointmentReminders } from '../services/notifications';

function normalizeDateTime(value) {
  const trimmed = value.trim().replace(' ', 'T');
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(trimmed)) return `${trimmed}:00`;
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(trimmed)) return trimmed;
  return null;
}

function formatStatus(status) {
  if (status === 'REALIZADO') return 'Realizado';
  if (status === 'CANCELADO') return 'Cancelado';
  return 'Agendado';
}

export default function AgendamentoScreen({ navigation }) {
  const { query, createMutation, cancelMutation } = useAgendamentos();
  const petsQuery = usePets().query;
  const veterinariosQuery = useVeterinarios().query;

  const [motivo, setMotivo] = useState('');
  const [dataHora, setDataHora] = useState('');
  const [selectedPet, setSelectedPet] = useState(null);
  const [selectedVet, setSelectedVet] = useState(null);
  const [pickerType, setPickerType] = useState(null);

  const pickerItems = useMemo(
    () => pickerType === 'pet' ? (petsQuery.data || []) : (veterinariosQuery.data || []),
    [pickerType, petsQuery.data, veterinariosQuery.data]
  );

  const handleAgendar = () => {
    const normalizedDate = normalizeDateTime(dataHora);
    if (!motivo.trim() || !normalizedDate || !selectedPet?.id || !selectedVet?.id) {
      Alert.alert(
        'Dados incompletos',
        'Informe o motivo, a data e hora, selecione um pet e um veterinário.'
      );
      return;
    }

    const parsedDate = new Date(normalizedDate);
    if (Number.isNaN(parsedDate.getTime()) || parsedDate.getTime() <= Date.now()) {
      Alert.alert('Data inválida', 'O agendamento precisa ter uma data e hora futuras válidas.');
      return;
    }

    const payload = {
      dataHora: normalizedDate,
      idPet: Number(selectedPet.id),
      idVeterinario: Number(selectedVet.id),
      motivo: motivo.trim(),
    };

    createMutation.mutate(payload, {
      onSuccess: async (response) => {
        const saved = response?.data || response;
        setMotivo('');
        setDataHora('');
        try {
          await scheduleAppointmentReminder({
            id: saved?.id,
            motivo: payload.motivo,
            dataHora: payload.dataHora,
          });
          Alert.alert('Agendamento criado', 'A API confirmou o agendamento e o lembrete local foi programado.');
        } catch (error) {
          Alert.alert('Agendamento criado', `O backend salvou o agendamento, mas o lembrete não foi programado: ${error.message}`);
        }
      },
      onError: (error) => Alert.alert('Erro ao criar agendamento', getApiErrorMessage(error)),
    });
  };

  const handleCancel = (item) => {
    Alert.alert('Cancelar agendamento', 'Deseja cancelar este compromisso?', [
      { text: 'Manter', style: 'cancel' },
      {
        text: 'Cancelar agendamento',
        style: 'destructive',
        onPress: () => cancelMutation.mutate(item.id, {
          onSuccess: () => cancelAppointmentReminders(item.id).catch((error) => console.warn(error)),
          onError: (error) => Alert.alert('Não foi possível cancelar', getApiErrorMessage(error)),
        }),
      },
    ]);
  };

  const renderAppointment = ({ item }) => {
    const isCancelled = item.status === 'CANCELADO';
    const isDone = item.status === 'REALIZADO';
    return (
      <View style={styles.card}>
        <View style={[styles.statusBar, { backgroundColor: isCancelled ? colors.danger : isDone ? colors.secondary : colors.accent }]} />
        <View style={styles.cardContent}>
          <View style={styles.cardTop}>
            <Text style={styles.date}>{String(item.dataHora || '').replace('T', ' ')}</Text>
            <Text style={[styles.status, isCancelled && styles.cancelledStatus]}>{formatStatus(item.status)}</Text>
          </View>
          <Text style={styles.type}>{item.motivo || 'Consulta veterinária'}</Text>
          <Text style={styles.meta}>Pet #{item.idPet} · Veterinário #{item.idVeterinario}</Text>
        </View>
        {!isCancelled && !isDone ? (
          <TouchableOpacity onPress={() => handleCancel(item)} disabled={cancelMutation.isPending} style={styles.deleteButton} accessibilityRole="button" accessibilityLabel="Cancelar agendamento">
            <Ionicons name="close-circle-outline" size={22} color={colors.danger} />
          </TouchableOpacity>
        ) : null}
      </View>
    );
  };

  const renderPickerItem = ({ item }) => (
    <TouchableOpacity
      style={styles.pickerItem}
      onPress={() => {
        if (pickerType === 'pet') setSelectedPet(item);
        else setSelectedVet(item);
        setPickerType(null);
      }}
    >
      <View style={styles.pickerAvatar}>
        <Ionicons name={pickerType === 'pet' ? 'paw' : 'medical'} size={19} color={colors.secondary} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.pickerName}>{item.nome}</Text>
        <Text style={styles.pickerMeta}>{pickerType === 'pet' ? item.especie : item.area}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.eyebrow}>GESTÃO DE CONSULTAS</Text>
      <Text style={styles.title}>Agenda clínica</Text>
      <Text style={styles.subtitle}>Agendamentos enviados diretamente para a API Clyvo.</Text>

      <View style={styles.form}>
        <Text style={styles.formTitle}>Novo agendamento</Text>
        <TextInput placeholder="Motivo (ex.: Consulta de rotina)" value={motivo} onChangeText={setMotivo} style={styles.input} placeholderTextColor={colors.textLight} />
        <TextInput placeholder="AAAA-MM-DD HH:mm" value={dataHora} onChangeText={setDataHora} style={styles.input} placeholderTextColor={colors.textLight} autoCapitalize="none" />
        <View style={styles.selectionRow}>
          <TouchableOpacity style={styles.selectionButton} onPress={() => setPickerType('pet')}>
            <Ionicons name="paw-outline" size={17} color={colors.secondary} />
            <Text style={styles.selectionText} numberOfLines={1}>{selectedPet?.nome || 'Selecionar pet'}</Text>
            <Ionicons name="chevron-down" size={15} color={colors.textLight} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectionButton} onPress={() => setPickerType('vet')}>
            <Ionicons name="medical-outline" size={17} color={colors.secondary} />
            <Text style={styles.selectionText} numberOfLines={1}>{selectedVet?.nome || 'Veterinário'}</Text>
            <Ionicons name="chevron-down" size={15} color={colors.textLight} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.btnAdd} onPress={handleAgendar} disabled={createMutation.isPending}>
          {createMutation.isPending ? <ActivityIndicator color="#FFFFFF" /> : <Ionicons name="calendar-outline" size={19} color="#FFFFFF" />}
          <Text style={styles.btnAddText}>Confirmar agendamento</Text>
        </TouchableOpacity>
        {(petsQuery.isError || veterinariosQuery.isError) ? (
          <Text style={styles.warningText}>Não foi possível carregar pets ou veterinários. Confira as permissões ADMIN do usuário.</Text>
        ) : null}
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Compromissos</Text>
        <Text style={styles.count}>{query.data?.length || 0}</Text>
      </View>

      {query.isLoading ? (
        <ActivityIndicator size="large" color={colors.secondary} style={{ marginTop: 35 }} />
      ) : query.isError ? (
        <View style={styles.feedback}>
          <Ionicons name="cloud-offline-outline" size={30} color={colors.textLight} />
          <Text style={styles.feedbackText}>{getApiErrorMessage(query.error, 'Não foi possível carregar a agenda.')}</Text>
          <TouchableOpacity onPress={() => query.refetch()} style={styles.retryButton}><Text style={styles.retryText}>Tentar novamente</Text></TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={query.data || []}
          keyExtractor={(item, index) => String(item.id ?? index)}
          renderItem={renderAppointment}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 28, paddingTop: 8, flexGrow: 1 }}
          ListEmptyComponent={<View style={styles.emptyState}><Ionicons name="calendar-outline" size={34} color={colors.secondary} /><Text style={styles.emptyTitle}>Nenhum compromisso</Text><Text style={styles.emptyText}>Crie um agendamento usando o formulário acima.</Text></View>}
        />
      )}

      <Modal visible={Boolean(pickerType)} transparent animationType="slide" onRequestClose={() => setPickerType(null)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{pickerType === 'pet' ? 'Escolha um pet' : 'Escolha um veterinário'}</Text>
              <TouchableOpacity onPress={() => setPickerType(null)}><Ionicons name="close" size={24} color={colors.primary} /></TouchableOpacity>
            </View>
            {pickerItems.length ? (
              <FlatList data={pickerItems} keyExtractor={(item, index) => String(item.id ?? index)} renderItem={renderPickerItem} />
            ) : (
              <Text style={styles.emptyPicker}>Nenhum registro disponível para seleção.</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, paddingTop: 50, backgroundColor: colors.background },
  backButton: { padding: 10, alignSelf: 'flex-start', backgroundColor: colors.surface, borderRadius: 13, marginBottom: 14, elevation: 2 },
  eyebrow: { color: colors.secondary, fontSize: 10, fontWeight: '900', letterSpacing: 1.6 },
  title: { fontSize: 28, fontWeight: '900', color: colors.primary, marginTop: 5 },
  subtitle: { color: colors.textLight, fontSize: 12, lineHeight: 18, marginTop: 5, marginBottom: 14 },
  form: { backgroundColor: colors.surface, padding: 15, borderRadius: 18, marginBottom: 18, elevation: 2 },
  formTitle: { color: colors.primary, fontSize: 15, fontWeight: '900', marginBottom: 10 },
  input: { backgroundColor: colors.background, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 11, borderWidth: 1, borderColor: '#E4EAF0', color: colors.text, fontSize: 12, marginBottom: 9 },
  selectionRow: { flexDirection: 'row', gap: 8 },
  selectionButton: { flex: 1, minWidth: 0, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors.background, borderWidth: 1, borderColor: '#E4EAF0', paddingHorizontal: 9, paddingVertical: 12, borderRadius: 11 },
  selectionText: { flex: 1, color: colors.primary, fontSize: 10, fontWeight: '700' },
  btnAdd: { backgroundColor: colors.secondary, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 13, borderRadius: 11, marginTop: 10 },
  btnAddText: { color: '#FFFFFF', fontWeight: '800', fontSize: 12 },
  warningText: { color: colors.danger, fontSize: 10, lineHeight: 15, marginTop: 9 },
  listHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { color: colors.primary, fontWeight: '900', fontSize: 16, flex: 1 },
  count: { color: colors.secondary, fontSize: 12, fontWeight: '900', backgroundColor: colors.surface, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: 15, marginBottom: 10, elevation: 2, overflow: 'hidden' },
  statusBar: { width: 4, alignSelf: 'stretch' },
  cardContent: { flex: 1, padding: 13 },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6 },
  date: { fontSize: 10, color: colors.textLight, fontWeight: '700', flex: 1 },
  status: { fontSize: 9, color: colors.secondary, fontWeight: '900', textTransform: 'uppercase' },
  cancelledStatus: { color: colors.danger },
  type: { fontSize: 15, color: colors.primary, fontWeight: '800', marginTop: 5 },
  meta: { fontSize: 10, color: colors.textLight, marginTop: 4 },
  deleteButton: { padding: 12 },
  feedback: { alignItems: 'center', padding: 25, backgroundColor: colors.surface, borderRadius: 18, marginTop: 18 },
  feedbackText: { color: colors.textLight, marginTop: 10, textAlign: 'center', fontSize: 12 },
  retryButton: { marginTop: 13, backgroundColor: colors.secondary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#FFFFFF', fontWeight: '700' },
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 26, marginTop: 15, backgroundColor: colors.surface, borderRadius: 18 },
  emptyTitle: { color: colors.primary, fontSize: 15, fontWeight: '800', marginTop: 10 },
  emptyText: { color: colors.textLight, textAlign: 'center', fontSize: 11, marginTop: 5, lineHeight: 17 },
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(8,20,32,0.45)' },
  modalSheet: { maxHeight: '75%', backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  modalTitle: { color: colors.primary, fontSize: 18, fontWeight: '900' },
  pickerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E9EEF1', gap: 10 },
  pickerAvatar: { width: 38, height: 38, borderRadius: 12, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  pickerName: { color: colors.primary, fontSize: 14, fontWeight: '800' },
  pickerMeta: { color: colors.textLight, fontSize: 11, marginTop: 3 },
  emptyPicker: { color: colors.textLight, paddingVertical: 25, textAlign: 'center' },
});
