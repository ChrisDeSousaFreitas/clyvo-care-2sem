import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { usePets } from '../hooks/usePets';
import { colors } from '../theme/colors';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Skeleton from '../components/Skeleton';

export default function PetsListScreen() {
  // ATENÇÃO: Certifique-se de que seu usePets() exporta a updateMutation
  const { query, createMutation, deleteMutation, updateMutation } = usePets();
  
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('Cachorro');
  const [editandoId, setEditandoId] = useState(null); // Estado para controlar edição

  const especiesOptions = [
    { nome: 'Cachorro', icon: 'dog' },
    { nome: 'Gato', icon: 'cat' },
    { nome: 'Exótico', icon: 'spider' },
    { nome: 'Pássaro', icon: 'bird' }
  ];

  const handleSavePet = () => {
    if (nome && especie) {
      if (editandoId) {
        updateMutation.mutate({ id: editandoId, nome, especie });
      } else {
        createMutation.mutate({ nome, especie });
      }
      resetForm();
    }
  };

  const iniciarEdicao = (pet) => {
    setNome(pet.nome);
    setEspecie(pet.especie);
    setEditandoId(pet.id);
  };

  const resetForm = () => {
    setNome('');
    setEspecie('Cachorro');
    setEditandoId(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <View style={styles.inputRow}>
          <TextInput 
            placeholder="Nome do Pet" 
            value={nome} 
            onChangeText={setNome} 
            style={styles.input} 
            placeholderTextColor={colors.textLight} 
          />
          <TouchableOpacity 
            style={[styles.btnCreate, editandoId && { backgroundColor: colors.accent }]} 
            onPress={handleSavePet} 
            disabled={createMutation?.isPending || updateMutation?.isPending}
          >
            <Ionicons name={editandoId ? "checkmark" : "add"} size={28} color={colors.surface} />
          </TouchableOpacity>
        </View>

        <View style={styles.speciesSelector}>
          {especiesOptions.map((opt) => {
            const isSelected = especie === opt.nome;
            return (
              <TouchableOpacity 
                key={opt.nome} 
                onPress={() => setEspecie(opt.nome)}
                style={[styles.speciesBtn, isSelected && styles.speciesBtnActive]}
              >
                <MaterialCommunityIcons name={opt.icon} size={28} color={isSelected ? colors.surface : colors.textLight} />
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {query.isLoading ? (
        <View style={{ marginTop: 10 }}>
          <Skeleton width="100%" height={80} style={{ marginBottom: 12, borderRadius: 16 }} />
          <Skeleton width="100%" height={80} style={{ marginBottom: 12, borderRadius: 16 }} />
        </View>
      ) : (
        <FlatList
          data={query.data}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <View style={styles.petCard}>
              <View style={styles.petInfo}>
                <Text style={styles.petName}>{item.nome}</Text>
                <Text style={styles.petSpecies}>{item.especie}</Text>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity onPress={() => iniciarEdicao(item)} style={styles.btnEdit}>
                  <Ionicons name="pencil-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteMutation.mutate(item.id)} style={styles.btnDelete}>
                  <Ionicons name="trash-outline" size={20} color={colors.danger} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background, paddingTop: 50 },
  formContainer: { marginBottom: 25 },
  inputRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  input: { backgroundColor: colors.surface, flex: 1, marginRight: 15, padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#EEE', fontSize: 16, color: colors.text, elevation: 2 },
  btnCreate: { backgroundColor: colors.secondary, width: 60, borderRadius: 12, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  speciesSelector: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  speciesBtn: { padding: 12, borderRadius: 12, backgroundColor: colors.surface, width: '22%', alignItems: 'center', borderWidth: 1, borderColor: '#EEE', elevation: 1 },
  speciesBtnActive: { backgroundColor: colors.secondary, borderColor: colors.secondary, elevation: 5 },
  petCard: { backgroundColor: colors.surface, padding: 20, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, elevation: 3 },
  petInfo: { flex: 1 },
  petName: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  petSpecies: { fontSize: 14, color: colors.textLight, marginTop: 4 },
  actionButtons: { flexDirection: 'row', gap: 10 },
  btnEdit: { padding: 10, backgroundColor: '#E2E8F0', borderRadius: 10 },
  btnDelete: { padding: 10, backgroundColor: '#FFF0F0', borderRadius: 10 }
});