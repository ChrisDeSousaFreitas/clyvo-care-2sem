import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if (!email || !senha || !nome) {
      alert('Preencha os campos obrigatórios.');
      return;
    }
    setLoading(true);
    try { 
      await register(email, senha); 
    } catch (error) { 
      alert('Erro ao criar conta. Tente uma senha com 6+ caracteres.'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Junte-se à Clyvo</Text>
          <Text style={styles.subtitle}>Crie sua conta e comece a monitorar a saúde dos seus pets.</Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome do Tutor *</Text>
          <TextInput placeholder="Como devemos te chamar?" onChangeText={setNome} style={styles.input} placeholderTextColor={colors.textLight} />
          
          <Text style={styles.label}>Telefone (Opcional)</Text>
          <TextInput placeholder="(11) 90000-0000" onChangeText={setTelefone} style={styles.input} keyboardType="phone-pad" placeholderTextColor={colors.textLight} />

          <Text style={styles.label}>E-mail de Acesso *</Text>
          <TextInput placeholder="seu@email.com" onChangeText={setEmail} style={styles.input} autoCapitalize="none" keyboardType="email-address" placeholderTextColor={colors.textLight} />
          
          <Text style={styles.label}>Senha Segura *</Text>
          <TextInput placeholder="Mínimo 6 caracteres" onChangeText={setSenha} style={styles.input} secureTextEntry placeholderTextColor={colors.textLight} />
        </View>
        
        <TouchableOpacity style={styles.btnPrimary} onPress={handleCadastro} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Finalizar Cadastro</Text>}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 25, backgroundColor: colors.background, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 10, backgroundColor: colors.surface, borderRadius: 50, shadowColor: '#000', shadowOpacity: 0.1, elevation: 2 },
  header: { marginTop: 60, marginBottom: 30 },
  title: { fontSize: 32, fontWeight: '900', color: colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 16, color: colors.textLight, lineHeight: 22 },
  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: colors.secondary, marginBottom: 6, marginLeft: 4 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: '#E0E0E0', padding: 15, marginBottom: 18, borderRadius: 12, fontSize: 16, color: colors.text },
  btnPrimary: { backgroundColor: colors.accent, padding: 18, borderRadius: 12, alignItems: 'center', shadowColor: colors.accent, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4, marginTop: 10 },
  btnText: { color: colors.surface, fontSize: 16, fontWeight: 'bold' }
});