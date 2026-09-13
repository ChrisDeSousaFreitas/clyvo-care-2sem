import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';
import { useAgendamentos } from '../hooks/useAgendamentos';

export default function AgendamentoScreen({ navigation }) {
  const { query, createMutation, deleteMutation } = useAgendamentos();
  const [tipo, setTipo] = useState('');
  const [data, setData] = useState('');

  const handleAgendar = () => {
    if (!tipo.trim() || !data.trim()) {
      alert('Atenção: Preencha qual é o procedimento e a data do agendamento.');
      return;
    }

    createMutation.mutate(
      { tipo, data, status: 'pendente' },
      {
        onSuccess: () => {
          setTipo('');
          setData('');
        },
        onError: (error) => {
          console.error("Erro no Agendamento:", error);
          alert('Erro na API: O aplicativo não conseguiu salvar. Verifique se o seu backend Java está rodando e se o IP no hook está correto.');
        }
      }
    );
  };

  const handleExcluir = (id) => {
    deleteMutation.mutate(id, {
      onError: (error) => {
        console.error("Erro ao excluir:", error);
        alert('Erro ao excluir: Falha na comunicação com o servidor.');
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color={colors.primary} />
      </TouchableOpacity>

      <Text style={styles.title}>Histórico Clínico</Text>

      <View style={styles.form}>
        <TextInput 
          placeholder="Ex: Vacina Raiva" 
          value={tipo} 
          onChangeText={setTipo} 
          style={styles.input} 
          placeholderTextColor={colors.textLight} 
        />
        <TextInput 
          placeholder="Ex: 15 Out, 14:00" 
          value={data} 
          onChangeText={setData} 
          style={styles.inputData} 
          placeholderTextColor={colors.textLight} 
        />
        <TouchableOpacity style={styles.btnAdd} onPress={handleAgendar} disabled={createMutation.isPending}>
          {createMutation.isPending ? (
            <ActivityIndicator size="small" color={colors.surface} />
          ) : (
            <Ionicons name="add" size={24} color={colors.surface} />
          )}
        </TouchableOpacity>
      </View>

      {query.isLoading ? (
        <ActivityIndicator size="large" color={colors.secondary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={query.data || []}
          keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30, marginTop: 10 }}
          renderItem={({ item, index }) => {
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
                  </View>
                  <TouchableOpacity onPress={() => handleExcluir(item.id)} disabled={deleteMutation.isPending}>
                    <Ionicons name="trash-outline" size={22} color={colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 25, backgroundColor: colors.background },
  backButton: { marginTop: 30, marginBottom: 10, padding: 10, alignSelf: 'flex-start', backgroundColor: colors.surface, borderRadius: 50, elevation: 2 },
  title: { fontSize: 28, fontWeight: '900', color: colors.primary, marginBottom: 15 },
  form: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  input: { flex: 2, backgroundColor: colors.surface, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#EEE', color: colors.text },
  inputData: { flex: 1.5, backgroundColor: colors.surface, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#EEE', color: colors.text },
  btnAdd: { backgroundColor: colors.secondary, padding: 12, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  timelineRow: { flexDirection: 'row' },
  nodeColumn: { alignItems: 'center', width: 30 },
  node: { width: 16, height: 16, borderRadius: 8, zIndex: 10, elevation: 3 },
  line: { width: 2, flex: 1, backgroundColor: '#D1D5DB', marginVertical: -4 },
  card: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: 18, borderRadius: 16, marginBottom: 25, marginLeft: 15, elevation: 3 },
  cardHighlight: { borderColor: colors.accent, borderWidth: 1 },
  date: { fontSize: 13, color: colors.textLight, fontWeight: 'bold', textTransform: 'uppercase' },
  type: { fontSize: 18, color: colors.primary, fontWeight: '700', marginTop: 4 }
});