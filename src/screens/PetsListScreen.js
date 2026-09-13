import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { usePets } from '../hooks/usePets';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function PetsListScreen() {
  const { query, createMutation, deleteMutation } = usePets();
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');

  const handleAddPet = () => {
    if(nome && especie) {
      createMutation.mutate({ nome, especie });
      setNome(''); setEspecie('');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <TextInput placeholder="Nome do Pet" value={nome} onChangeText={setNome} style={styles.input} placeholderTextColor={colors.textLight} />
        <TextInput placeholder="Espécie (Ex: Tarântula)" value={especie} onChangeText={setEspecie} style={styles.input} placeholderTextColor={colors.textLight} />
        <TouchableOpacity style={styles.btnCreate} onPress={handleAddPet} disabled={createMutation.isPending}>
          <Ionicons name="add" size={24} color={colors.surface} />
        </TouchableOpacity>
      </View>

      {query.isLoading ? (
        <ActivityIndicator size="large" color={colors.secondary} style={{ marginTop: 40 }} />
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
              <TouchableOpacity onPress={() => deleteMutation.mutate(item.id)} style={styles.btnDelete}>
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: colors.background },
  form: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20 },
  input: { backgroundColor: colors.surface, width: '40%', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#EEE' },
  btnCreate: { backgroundColor: colors.secondary, width: '15%', borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  petCard: { backgroundColor: colors.surface, padding: 20, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, elevation: 3 },
  petName: { fontSize: 18, fontWeight: 'bold', color: colors.primary },
  petSpecies: { fontSize: 14, color: colors.textLight, marginTop: 4 },
  btnDelete: { padding: 10, backgroundColor: '#FFF0F0', borderRadius: 8 }
});