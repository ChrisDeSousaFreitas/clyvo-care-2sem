import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../theme/colors';

export default function CadastroScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    setLoading(true);
    try { 
      await register(email, senha); 
    } catch (error) { 
      alert('Erro ao criar conta. Tente uma senha mais forte.'); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>NOVA</Text>
        <Text style={styles.logoSub}>CONTA</Text>
      </View>

      <TextInput 
        placeholder="E-mail" 
        onChangeText={setEmail} 
        style={styles.input} 
        autoCapitalize="none" 
        placeholderTextColor={colors.textLight} 
      />
      <TextInput 
        placeholder="Senha (mín. 6 caracteres)" 
        onChangeText={setSenha} 
        style={styles.input} 
        secureTextEntry 
        placeholderTextColor={colors.textLight} 
      />
      
      {/* Botão Principal: Agora é o de Cadastrar */}
      <TouchableOpacity style={styles.btnPrimary} onPress={handleCadastro} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Cadastrar</Text>}
      </TouchableOpacity>
      
      {/* Botão Secundário: Agora serve para voltar ao Login */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.btnSecondary}>
        <Text style={styles.btnTextSecondary}>Já tenho uma conta. Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: colors.background },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  logoText: { fontSize: 42, fontWeight: '900', color: colors.secondary, letterSpacing: 2 },
  logoSub: { fontSize: 32, fontWeight: '800', color: colors.primary, letterSpacing: 4, marginTop: -10 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: '#E0E0E0', padding: 16, marginBottom: 15, borderRadius: 12, fontSize: 16, color: colors.text, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  btnPrimary: { backgroundColor: colors.primary, padding: 18, borderRadius: 12, alignItems: 'center', shadowColor: colors.primary, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  btnText: { color: colors.surface, fontSize: 16, fontWeight: 'bold' },
  btnSecondary: { marginTop: 15, padding: 15, alignItems: 'center' },
  btnTextSecondary: { color: colors.secondary, fontSize: 16, fontWeight: '600' }
});