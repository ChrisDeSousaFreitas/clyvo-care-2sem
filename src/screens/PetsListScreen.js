import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { usePets } from '../hooks/usePets';

export default function PetsListScreen() {
  const { query, createMutation, deleteMutation } = usePets();
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');

  const handleAddPet = () => {
    createMutation.mutate({ nome, especie });
    setNome('');
    setEspecie('');
  };

  if (query.isLoading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <TextInput placeholder="Nome do Pet" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput placeholder="Espécie (Cachorro, Aranha...)" value={especie} onChangeText={setEspecie} style={styles.input} />
      <Button title="Cadastrar Pet" onPress={handleAddPet} disabled={createMutation.isPending} />

      <FlatList
        data={query.data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.nome} ({item.especie})</Text>
            <Button title="Excluir" color="red" onPress={() => deleteMutation.mutate(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  card: { padding: 15, borderWidth: 1, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }
});