import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { usePets } from '../hooks/usePets';
import { colors } from '../theme/colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getApiErrorMessage } from '../api/axiosConfig';
import Skeleton from '../components/Skeleton';

const speciesOptions = [
  { name: 'Cachorro', icon: 'dog' },
  { name: 'Gato', icon: 'cat' },
  { name: 'Exótico', icon: 'spider' },
  { name: 'Pássaro', icon: 'bird' },
];

export default function PetsListScreen({ navigation }) {
  const { query, createMutation, deleteMutation, updateMutation } = usePets();
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('Cachorro');
  const [idade, setIdade] = useState('0');
  const [raca, setRaca] = useState('');
  const [cor, setCor] = useState('');
  const [peso, setPeso] = useState('');
  const [editandoId, setEditandoId] = useState(null);

  const resetForm = () => {
    setNome('');
    setEspecie('Cachorro');
    setIdade('0');
    setRaca('');
    setCor('');
    setPeso('');
    setEditandoId(null);
  };

  const handleSavePet = () => {
    const petName = nome.trim();
    const age = Number(idade);
    const weight = peso.trim() ? Number(peso.replace(',', '.')) : null;

    if (petName.length < 3) {
      Alert.alert('Nome inválido', 'O nome do pet precisa ter pelo menos 3 caracteres.');
      return;
    }
    if (!idade.trim() || !Number.isInteger(age) || age < 0) {
      Alert.alert('Idade inválida', 'Informe a idade em anos. O valor zero é permitido.');
      return;
    }
    if (weight !== null && (!Number.isFinite(weight) || weight <= 0)) {
      Alert.alert('Peso inválido', 'Informe um peso maior que zero ou deixe o campo vazio.');
      return;
    }

    const payload = {
      nome: petName,
      especie,
      idade: age,
      raca: raca.trim() || null,
      cor: cor.trim() || null,
      peso: weight,
    };

    const mutation = editandoId ? updateMutation : createMutation;
    mutation.mutate(
      editandoId ? { id: editandoId, ...payload } : payload,
      {
        onSuccess: resetForm,
        onError: (error) => Alert.alert('Erro ao salvar pet', getApiErrorMessage(error)),
      }
    );
  };

  const iniciarEdicao = (pet) => {
    setNome(pet.nome || '');
    setEspecie(pet.especie || 'Cachorro');
    setIdade(String(pet.idade ?? 0));
    setRaca(pet.raca || '');
    setCor(pet.cor || '');
    setPeso(pet.peso == null ? '' : String(pet.peso));
    setEditandoId(pet.id);
  };

  const confirmarExclusao = (pet) => {
    Alert.alert('Excluir pet', `Tem certeza de que deseja remover ${pet.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => deleteMutation.mutate(pet.id, {
          onError: (error) => Alert.alert('Erro ao excluir pet', getApiErrorMessage(error)),
        }),
      },
    ]);
  };

  const renderPet = ({ item }) => (
    <View style={styles.petCard}>
      <TouchableOpacity
        style={styles.petInfo}
        onPress={() => navigation.navigate('PetProfile', { pet: item })}
        activeOpacity={0.8}
      >
        <View style={styles.petAvatar}>
          <MaterialCommunityIcons
            name={speciesOptions.find((option) => option.name === item.especie)?.icon || 'paw'}
            size={25}
            color={colors.secondary}
          />
        </View>
        <View style={styles.petCopy}>
          <Text style={styles.petName}>{item.nome}</Text>
          <Text style={styles.petSpecies}>{item.especie} · {item.idade ?? 0} ano(s)</Text>
          <Text style={styles.hologramText}>Abrir ficha clínica</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => iniciarEdicao(item)} style={styles.actionButton} accessibilityRole="button" accessibilityLabel={`Editar ${item.nome}`}>
          <Ionicons name="pencil-outline" size={19} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmarExclusao(item)} style={[styles.actionButton, styles.deleteButton]} accessibilityRole="button" accessibilityLabel={`Excluir ${item.nome}`}>
          <Ionicons name="trash-outline" size={19} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const saving = createMutation.isPending || updateMutation.isPending;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.eyebrow}>GESTÃO DE PACIENTES</Text>
      <Text style={styles.title}>Pets cadastrados</Text>
      <Text style={styles.subtitle}>Os campos seguem as validações exigidas pela API veterinária.</Text>

      <ScrollView style={styles.formScroll} nestedScrollEnabled showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>{editandoId ? 'Editar paciente' : 'Cadastrar paciente'}</Text>
          <TextInput placeholder="Nome (mínimo 3 caracteres)" value={nome} onChangeText={setNome} style={styles.input} placeholderTextColor={colors.textLight} />
          <View style={styles.fieldRow}>
            <TextInput placeholder="Idade (anos)" value={idade} onChangeText={setIdade} keyboardType="number-pad" style={[styles.input, styles.halfInput]} placeholderTextColor={colors.textLight} />
            <TextInput placeholder="Peso (kg)" value={peso} onChangeText={setPeso} keyboardType="decimal-pad" style={[styles.input, styles.halfInput]} placeholderTextColor={colors.textLight} />
          </View>
          <View style={styles.fieldRow}>
            <TextInput placeholder="Raça (opcional)" value={raca} onChangeText={setRaca} style={[styles.input, styles.halfInput]} placeholderTextColor={colors.textLight} />
            <TextInput placeholder="Cor (opcional)" value={cor} onChangeText={setCor} style={[styles.input, styles.halfInput]} placeholderTextColor={colors.textLight} />
          </View>

          <Text style={styles.fieldLabel}>Espécie</Text>
          <View style={styles.speciesSelector}>
            {speciesOptions.map((option) => {
              const selected = especie === option.name;
              return (
                <TouchableOpacity key={option.name} onPress={() => setEspecie(option.name)} style={[styles.speciesBtn, selected && styles.speciesBtnActive]} accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={option.name}>
                  <MaterialCommunityIcons name={option.icon} size={23} color={selected ? '#FFFFFF' : colors.textLight} />
                  <Text style={[styles.speciesLabel, selected && styles.speciesLabelActive]}>{option.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSavePet} disabled={saving}>
            {saving ? <ActivityIndicator color="#FFFFFF" /> : <Ionicons name={editandoId ? 'checkmark' : 'add'} size={20} color="#FFFFFF" />}
            <Text style={styles.saveButtonText}>{editandoId ? 'Salvar alterações' : 'Cadastrar pet'}</Text>
          </TouchableOpacity>
          {editandoId ? <TouchableOpacity onPress={resetForm} style={styles.cancelEdit}><Text style={styles.cancelEditText}>Cancelar edição</Text></TouchableOpacity> : null}
        </View>
      </ScrollView>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Pacientes registrados</Text>
        <Text style={styles.count}>{query.data?.length || 0}</Text>
      </View>

      {query.isLoading ? (
        <View style={{ marginTop: 10 }}>
          <Skeleton width="100%" height={92} style={{ marginBottom: 12, borderRadius: 17 }} />
          <Skeleton width="100%" height={92} style={{ marginBottom: 12, borderRadius: 17 }} />
        </View>
      ) : query.isError ? (
        <View style={styles.feedback}>
          <Ionicons name="cloud-offline-outline" size={32} color={colors.textLight} />
          <Text style={styles.feedbackText}>{getApiErrorMessage(query.error, 'Não foi possível carregar os pets.')}</Text>
          <TouchableOpacity onPress={() => query.refetch()} style={styles.retryButton}><Text style={styles.retryText}>Tentar novamente</Text></TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={query.data || []}
          keyExtractor={(item, index) => String(item.id ?? index)}
          renderItem={renderPet}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30, flexGrow: 1 }}
          ListEmptyComponent={<View style={styles.emptyState}><Ionicons name="paw-outline" size={34} color={colors.secondary} /><Text style={styles.emptyTitle}>Nenhum paciente cadastrado</Text><Text style={styles.emptyText}>Use o formulário acima para cadastrar o primeiro pet.</Text></View>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, paddingTop: 50, backgroundColor: colors.background },
  backButton: { padding: 10, alignSelf: 'flex-start', backgroundColor: colors.surface, borderRadius: 13, marginBottom: 14, elevation: 2 },
  eyebrow: { color: colors.secondary, fontSize: 10, fontWeight: '900', letterSpacing: 1.6 },
  title: { fontSize: 28, fontWeight: '900', color: colors.primary, marginTop: 5 },
  subtitle: { color: colors.textLight, fontSize: 12, lineHeight: 18, marginTop: 5, marginBottom: 13 },
  formScroll: { maxHeight: 330, flexGrow: 0 },
  formContainer: { backgroundColor: colors.surface, padding: 15, borderRadius: 18, marginBottom: 15, elevation: 2 },
  formTitle: { color: colors.primary, fontSize: 15, fontWeight: '800', marginBottom: 11 },
  input: { backgroundColor: colors.background, paddingHorizontal: 12, paddingVertical: 11, marginBottom: 9, borderRadius: 11, borderWidth: 1, borderColor: '#E4EAF0', fontSize: 13, color: colors.text },
  fieldRow: { flexDirection: 'row', gap: 8 },
  halfInput: { flex: 1, minWidth: 0 },
  fieldLabel: { color: colors.primary, fontSize: 11, fontWeight: '800', marginBottom: 7, marginTop: 1 },
  speciesSelector: { flexDirection: 'row', gap: 6 },
  speciesBtn: { flex: 1, minWidth: 0, paddingVertical: 8, borderRadius: 10, backgroundColor: colors.background, alignItems: 'center', borderWidth: 1, borderColor: '#E4EAF0' },
  speciesBtnActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  speciesLabel: { color: colors.textLight, fontSize: 8, fontWeight: '700', marginTop: 4 },
  speciesLabelActive: { color: '#FFFFFF' },
  saveButton: { backgroundColor: colors.secondary, flexDirection: 'row', gap: 8, justifyContent: 'center', alignItems: 'center', padding: 13, borderRadius: 11, marginTop: 12 },
  saveButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  cancelEdit: { alignSelf: 'center', paddingTop: 9 },
  cancelEditText: { color: colors.danger, fontSize: 11, fontWeight: '700' },
  listHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 3 },
  sectionTitle: { color: colors.primary, fontSize: 16, fontWeight: '900', flex: 1 },
  count: { color: colors.secondary, fontSize: 12, fontWeight: '900', backgroundColor: colors.surface, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  petCard: { backgroundColor: colors.surface, padding: 13, borderRadius: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 10, elevation: 2 },
  petInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  petAvatar: { width: 46, height: 46, borderRadius: 14, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  petCopy: { flex: 1 },
  petName: { fontSize: 15, fontWeight: '800', color: colors.primary },
  petSpecies: { fontSize: 11, color: colors.textLight, marginTop: 3 },
  hologramText: { color: colors.secondary, fontSize: 10, fontWeight: '700', marginTop: 4 },
  actionButtons: { flexDirection: 'row', gap: 6, marginLeft: 7 },
  actionButton: { padding: 8, backgroundColor: colors.background, borderRadius: 10 },
  deleteButton: { backgroundColor: '#FFF0F0' },
  feedback: { alignItems: 'center', padding: 25, backgroundColor: colors.surface, borderRadius: 18 },
  feedbackText: { color: colors.textLight, marginTop: 10, textAlign: 'center', fontSize: 12 },
  retryButton: { marginTop: 13, backgroundColor: colors.secondary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#FFFFFF', fontWeight: '700' },
  emptyState: { alignItems: 'center', padding: 25, marginTop: 12, backgroundColor: colors.surface, borderRadius: 18 },
  emptyTitle: { color: colors.primary, fontSize: 14, fontWeight: '800', marginTop: 10 },
  emptyText: { color: colors.textLight, fontSize: 11, textAlign: 'center', marginTop: 5, lineHeight: 17 },
});
