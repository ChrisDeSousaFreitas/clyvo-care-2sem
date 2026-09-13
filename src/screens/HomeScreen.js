import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function HomeScreen({ navigation }) {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Clyvo Care</Text>
      <Button title="Gerenciar Pets" onPress={() => navigation.navigate('Pets')} />
      <Button title="Agendamentos Clínicos" onPress={() => navigation.navigate('Agendamentos')} />
      <Button title="Monitoramento Smart Collar" onPress={() => navigation.navigate('Collar')} />
      <Button title="Sair (Logout)" onPress={logout} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, padding: 20, justifyContent: 'center', gap: 15 }, title: { fontSize: 20, textAlign: 'center' } });