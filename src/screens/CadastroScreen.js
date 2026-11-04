import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    const normalizedEmail = email.trim();
    if (!nome.trim() || !normalizedEmail || !senha) {
      Alert.alert('Dados incompletos', 'Preencha nome, e-mail e senha para continuar.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      Alert.alert('E-mail inválido', 'Confira o endereço de e-mail informado.');
      return;
    }

    if (senha.length < 6) {
      Alert.alert('Senha muito curta', 'Use uma senha com pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await register(normalizedEmail, senha, nome);
    } catch (error) {
      const messages = {
        'auth/email-already-in-use': 'Este e-mail já possui uma conta.',
        'auth/invalid-email': 'O endereço de e-mail é inválido.',
        'auth/weak-password': 'Escolha uma senha mais forte.',
      };
      Alert.alert('Não foi possível criar a conta', messages[error.code] || 'Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Login')}>
          <Ionicons name="arrow-back" size={23} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.eyebrow}>COMECE POR AQUI</Text>
          <Text style={styles.title}>Junte-se à Clyvo</Text>
          <Text style={styles.subtitle}>
            Crie sua conta e organize os cuidados de saúde dos seus companheiros.
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nome do tutor</Text>
          <TextInput
            placeholder="Como devemos te chamar?"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
            placeholderTextColor={colors.textLight}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={styles.label}>E-mail de acesso</Text>
          <TextInput
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholderTextColor={colors.textLight}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            returnKeyType="next"
          />

          <Text style={styles.label}>Senha segura</Text>
          <TextInput
            placeholder="Mínimo de 6 caracteres"
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
            placeholderTextColor={colors.textLight}
            secureTextEntry
            returnKeyType="done"
          />
        </View>

        <TouchableOpacity style={styles.btnPrimary} onPress={handleCadastro} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.btnText}>Criar minha conta</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.btnSecondary}>
          <Text style={styles.btnTextSecondary}>Já tenho uma conta. Fazer login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 25, paddingTop: 65, paddingBottom: 35, backgroundColor: colors.background, justifyContent: 'center' },
  backButton: { position: 'absolute', top: 48, left: 22, zIndex: 10, padding: 10, backgroundColor: colors.surface, borderRadius: 13, elevation: 2 },
  header: { marginTop: 55, marginBottom: 28 },
  eyebrow: { color: colors.secondary, fontSize: 10, fontWeight: '900', letterSpacing: 1.5, marginBottom: 8 },
  title: { fontSize: 31, fontWeight: '900', color: colors.primary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: colors.textLight, lineHeight: 21 },
  formGroup: { marginBottom: 18 },
  label: { fontSize: 12, fontWeight: '800', color: colors.primary, marginBottom: 7, marginLeft: 3 },
  input: { backgroundColor: colors.surface, borderWidth: 1, borderColor: '#E0E7ED', padding: 15, marginBottom: 17, borderRadius: 13, fontSize: 15, color: colors.text },
  btnPrimary: { backgroundColor: colors.accent, padding: 17, borderRadius: 13, alignItems: 'center', elevation: 3, marginTop: 5 },
  btnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  btnSecondary: { marginTop: 18, padding: 13, alignItems: 'center' },
  btnTextSecondary: { color: colors.secondary, fontSize: 13, fontWeight: '700' },
});
