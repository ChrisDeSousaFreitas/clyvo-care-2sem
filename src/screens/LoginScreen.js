import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try { await login(email, senha); } 
    catch (error) { alert('Falha no acesso. Verifique seus dados.'); }
    finally { setLoading(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      
      <View style={styles.topSection}>
        <View style={styles.iconBackground}>
          <Ionicons name="paw" size={60} color={colors.secondary} />
        </View>
        <Text style={styles.welcomeText}>Bem-vindo ao</Text>
        <Text style={styles.brandText}>CLYVO CARE</Text>
      </View>

      <View style={styles.bottomSheet}>
        <Text style={styles.sheetTitle}>Acesse sua conta</Text>
        
        <TextInput 
          placeholder="Seu E-mail" 
          onChangeText={setEmail} 
          style={styles.input} 
          autoCapitalize="none" 
          placeholderTextColor={colors.textLight} 
        />
        <TextInput 
          placeholder="Sua Senha" 
          onChangeText={setSenha} 
          style={styles.input} 
          secureTextEntry 
          placeholderTextColor={colors.textLight} 
        />
        
        <TouchableOpacity style={styles.btnPrimary} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Entrar no Sistema</Text>}
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => navigation.navigate('Cadastro')} style={styles.btnSecondary}>
          <Text style={styles.btnTextSecondary}>Novo por aqui? <Text style={styles.highlightText}>Crie sua conta</Text></Text>
        </TouchableOpacity>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  
  topSection: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 20 },
  iconBackground: { backgroundColor: colors.surface, padding: 20, borderRadius: 30, marginBottom: 20, shadowColor: colors.secondary, shadowOpacity: 0.5, shadowRadius: 15, elevation: 10 },
  welcomeText: { fontSize: 18, color: colors.surface, opacity: 0.8, marginBottom: 5 },
  brandText: { fontSize: 36, fontWeight: '900', color: colors.surface, letterSpacing: 2 },
  
  bottomSheet: { 
    backgroundColor: colors.surface, 
    borderTopLeftRadius: 40, 
    borderTopRightRadius: 40, 
    padding: 30, 
    paddingTop: 40,
    paddingBottom: 50,
    shadowColor: '#000', 
    shadowOpacity: 0.2, 
    shadowRadius: 20, 
    elevation: 20 
  },
  sheetTitle: { fontSize: 22, fontWeight: 'bold', color: colors.primary, marginBottom: 25 },
  input: { backgroundColor: colors.background, borderWidth: 1, borderColor: '#EEE', padding: 16, marginBottom: 15, borderRadius: 12, fontSize: 16, color: colors.text },
  btnPrimary: { backgroundColor: colors.secondary, padding: 18, borderRadius: 12, alignItems: 'center', marginTop: 10, shadowColor: colors.secondary, shadowOpacity: 0.4, shadowRadius: 8, elevation: 5 },
  btnText: { color: colors.surface, fontSize: 16, fontWeight: 'bold' },
  btnSecondary: { marginTop: 20, alignItems: 'center' },
  btnTextSecondary: { color: colors.textLight, fontSize: 15 },
  highlightText: { color: colors.accent, fontWeight: 'bold' }
});