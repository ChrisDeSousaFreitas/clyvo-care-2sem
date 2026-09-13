import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, senha);
    } catch (error) {
      alert('Erro ao fazer login. Verifique as credenciais.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clyvo SmartCare</Text>
      <TextInput placeholder="E-mail" onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Senha" onChangeText={setSenha} style={styles.input} secureTextEntry />
      <Button title="Entrar" onPress={handleLogin} />
      <Button title="Criar Conta" onPress={() => navigation.navigate('Cadastro')} color="gray" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 }
});