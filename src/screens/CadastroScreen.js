import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';

export default function CadastroScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { register } = useAuth();

  const handleCadastro = async () => {
    try {
      await register(email, senha);
    } catch (error) {
      alert('Erro ao criar conta.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="E-mail" onChangeText={setEmail} style={styles.input} autoCapitalize="none" />
      <TextInput placeholder="Senha" onChangeText={setSenha} style={styles.input} secureTextEntry />
      <Button title="Cadastrar" onPress={handleCadastro} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: { borderWidth: 1, padding: 10, marginBottom: 15, borderRadius: 5 }
});