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
} from 'react-native';
import { usePets } from '../hooks/usePets';
import { colors } from '../theme/colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
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
  const [editandoId, setEditandoId] = useState(null);

  const resetForm = () => {
    setNome('');
    setEspecie('Cachorro');
    setEditandoId(null);
  };

  const handleSavePet = () => {
    const petName = nome.trim();
    if (!petName) {
      Alert.alert('Nome obrigatório', 'Informe o nome do seu pet para continuar.');
      return;
    }

    const payload = { nome: petName, especie };
    const mutation = editandoId ? updateMutation : createMutation;
    mutation.mutate(
      editandoId ? { id: editandoId, ...payload } : payload,
      { onSuccess: resetForm }
    );
  };

  const iniciarEdicao = (pet) => {
    setNome(pet.nome || '');
    setEspecie(pet.especie || 'Cachorro');
    setEditandoId(pet.id);
  };

  const confirmarExclusao = (pet) => {
    Alert.alert(
      'Excluir pet',
      `Tem certeza de que deseja remover ${pet.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => deleteMutation.mutate(pet.id),
        },
      ]
    );
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
          <Text style={styles.petSpecies}>{item.especie}</Text>
          <Text style={styles.hologramText}>Abrir perfil</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => iniciarEdicao(item)}
          style={styles.actionButton}
          accessibilityRole="button"
          accessibilityLabel={`Editar ${item.nome}`}
        >
          <Ionicons name="pencil-outline" size={19} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => confirmarExclusao(item)}
          style={[styles.actionButton, styles.deleteButton]}
          accessibilityRole="button"
          accessibilityLabel={`Excluir ${item.nome}`}
        >
          <Ionicons name="trash-outline" size={19} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.eyebrow}>SUA FAMÍLIA</Text>
      <Text style={styles.title}>Meus pets</Text>
      <Text style={styles.subtitle}>Mantenha os perfis dos seus companheiros sempre organizados.</Text>

      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>{editandoId ? 'Editar perfil' : 'Adicionar novo pet'}</Text>
        <View style={styles.inputRow}>
          <TextInput
            placeholder="Nome do pet"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
            placeholderTextColor={colors.textLight}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={[styles.btnCreate, editandoId && styles.btnUpdate]}
            onPress={handleSavePet}
            disabled={createMutation.isPending || updateMutation.isPending}
            accessibilityRole="button"
            accessibilityLabel={editandoId ? 'Salvar edição' : 'Adicionar pet'}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Ionicons name={editandoId ? 'checkmark' : 'add'} size={25} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.speciesSelector}>
          {speciesOptions.map((option) => {
            const selected = especie === option.name;
            return (
              <TouchableOpacity
                key={option.name}
                onPress={() => setEspecie(option.name)}
                style={[styles.speciesBtn, selected && styles.speciesBtnActive]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={option.name}
              >
                <MaterialCommunityIcons
                  name={option.icon}
                  size={25}
                  color={selected ? '#FFFFFF' : colors.textLight}
                />
                <Text style={[styles.speciesLabel, selected && styles.speciesLabelActive]}>
                  {option.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {editandoId ? (
          <TouchableOpacity onPress={resetForm} style={styles.cancelEdit}>
            <Text style={styles.cancelEditText}>Cancelar edição</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>Perfis cadastrados</Text>
        <Text style={styles.count}>{Array.isArray(query.data) ? query.data.length : 0}</Text>
      </View>

      {query.isLoading ? (
        <View style={{ marginTop: 10 }}>
          <Skeleton width="100%" height={92} style={{ marginBottom: 12, borderRadius: 17 }} />
          <Skeleton width="100%" height={92} style={{ marginBottom: 12, borderRadius: 17 }} />
        </View>
      ) : query.isError ? (
        <View style={styles.feedback}>
          <Ionicons name="cloud-offline-outline" size={32} color={colors.textLight} />
          <Text style={styles.feedbackText}>Não foi possível carregar os pets.</Text>
          <TouchableOpacity onPress={() => query.refetch()} style={styles.retryButton}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={query.data || []}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderPet}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30, flexGrow: 1 }}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="paw-outline" size={34} color={colors.secondary} />
              <Text style={styles.emptyTitle}>Nenhum pet por aqui ainda</Text>
              <Text style={styles.emptyText}>Cadastre seu primeiro companheiro usando o formulário acima.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 22, paddingTop: 50, backgroundColor: colors.background },
  backButton: { padding: 10, alignSelf: 'flex-start', backgroundColor: colors.surface, borderRadius: 13, marginBottom: 17, elevation: 2 },
  eyebrow: { color: colors.secondary, fontSize: 10, fontWeight: '900', letterSpacing: 1.6 },
  title: { fontSize: 29, fontWeight: '900', color: colors.primary, marginTop: 5 },
  subtitle: { color: colors.textLight, fontSize: 13, lineHeight: 20, marginTop: 5, marginBottom: 20 },
  formContainer: { backgroundColor: colors.surface, padding: 16, borderRadius: 18, marginBottom: 22, elevation: 2 },
  formTitle: { color: colors.primary, fontSize: 15, fontWeight: '800', marginBottom: 12 },
  inputRow: { flexDirection: 'row', gap: 9, marginBottom: 12 },
  input: { backgroundColor: colors.background, flex: 1, paddingHorizontal: 14, paddingVertical: 13, borderRadius: 12, borderWidth: 1, borderColor: '#E4EAF0', fontSize: 15, color: colors.text },
  btnCreate: { backgroundColor: colors.secondary, width: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  btnUpdate: { backgroundColor: colors.accent },
  speciesSelector: { flexDirection: 'row', gap: 7 },
  speciesBtn: { flex: 1, minWidth: 0, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.background, alignItems: 'center', borderWidth: 1, borderColor: '#E4EAF0' },
  speciesBtnActive: { backgroundColor: colors.secondary, borderColor: colors.secondary },
  speciesLabel: { color: colors.textLight, fontSize: 9, fontWeight: '700', marginTop: 5 },
  speciesLabelActive: { color: '#FFFFFF' },
  cancelEdit: { alignSelf: 'center', paddingTop: 12 },
  cancelEditText: { color: colors.danger, fontSize: 12, fontWeight: '700' },
  listHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { color: colors.primary, fontSize: 17, fontWeight: '900', flex: 1 },
  count: { color: colors.secondary, fontSize: 12, fontWeight: '900', backgroundColor: colors.surface, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  petCard: { backgroundColor: colors.surface, padding: 15, borderRadius: 17, flexDirection: 'row', alignItems: 'center', marginBottom: 11, elevation: 2 },
  petInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  petAvatar: { width: 48, height: 48, borderRadius: 15, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  petCopy: { flex: 1 },
  petName: { fontSize: 16, fontWeight: '800', color: colors.primary },
  petSpecies: { fontSize: 12, color: colors.textLight, marginTop: 3 },
  hologramText: { color: colors.secondary, fontSize: 11, fontWeight: '700', marginTop: 5 },
  actionButtons: { flexDirection: 'row', gap: 7, marginLeft: 8 },
  actionButton: { padding: 9, backgroundColor: colors.background, borderRadius: 10 },
  deleteButton: { backgroundColor: '#FFF0F0' },
  feedback: { alignItems: 'center', padding: 28, backgroundColor: colors.surface, borderRadius: 18 },
  feedbackText: { color: colors.textLight, marginTop: 10 },
  retryButton: { marginTop: 14, backgroundColor: colors.secondary, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  retryText: { color: '#FFFFFF', fontWeight: '700' },
  emptyState: { alignItems: 'center', padding: 28, marginTop: 15, backgroundColor: colors.surface, borderRadius: 18 },
  emptyTitle: { color: colors.primary, fontSize: 15, fontWeight: '800', marginTop: 12 },
  emptyText: { color: colors.textLight, textAlign: 'center', fontSize: 12, lineHeight: 19, marginTop: 5 },
});
