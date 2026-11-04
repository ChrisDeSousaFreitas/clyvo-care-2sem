import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { getApiErrorMessage } from '../api/axiosConfig';
import { colors } from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert('Dados incompletos', 'Informe o usuário e a senha fornecidos pelo administrador do backend.');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
    } catch (error) {
      Alert.alert('Não foi possível entrar', getApiErrorMessage(error, error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Ionicons name="paw" size={46} color={colors.secondary} />
        </View>
        <Text style={styles.eyebrow}>GESTÃO CLÍNICA VETERINÁRIA</Text>
        <Text style={styles.brand}>CLYVO</Text>
        <Text style={styles.subtitle}>Cuidado inteligente, conectado e organizado.</Text>
      </View>

      <View style={styles.sheet}>
        <Text style={styles.title}>Acesse seu painel</Text>
        <Text style={styles.description}>
          Entre com as credenciais cadastradas na API Clyvo.
        </Text>

        <Text style={styles.label}>Usuário</Text>
        <TextInput
          placeholder="Seu usuário"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
          placeholderTextColor={colors.textLight}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType="username"
          returnKeyType="next"
        />

        <Text style={styles.label}>Senha</Text>
        <TextInput
          placeholder="Sua senha"
          value={password}
          onChangeText={setPassword}
          style={styles.input}
          placeholderTextColor={colors.textLight}
          secureTextEntry
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text style={styles.buttonText}>Entrar no sistema</Text>
              <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.securityNote}>
          <Ionicons name="shield-checkmark-outline" size={17} color={colors.secondary} />
          <Text style={styles.securityText}>Sessão autenticada pela API e armazenada com segurança no dispositivo.</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, justifyContent: 'center' },
  hero: { alignItems: 'center', paddingHorizontal: 28, paddingTop: 35, paddingBottom: 34 },
  logo: { width: 82, height: 82, borderRadius: 27, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 22, elevation: 8 },
  eyebrow: { color: '#B8DCE2', fontSize: 10, fontWeight: '900', letterSpacing: 1.7 },
  brand: { color: '#FFFFFF', fontSize: 42, fontWeight: '900', letterSpacing: 4, marginTop: 7 },
  subtitle: { color: '#D7E5EA', fontSize: 13, marginTop: 8, textAlign: 'center' },
  sheet: { backgroundColor: colors.surface, marginHorizontal: 18, padding: 25, borderRadius: 25, elevation: 12 },
  title: { color: colors.primary, fontSize: 23, fontWeight: '900' },
  description: { color: colors.textLight, fontSize: 13, lineHeight: 19, marginTop: 6, marginBottom: 22 },
  label: { color: colors.primary, fontSize: 12, fontWeight: '800', marginBottom: 7, marginLeft: 2 },
  input: { backgroundColor: colors.background, borderWidth: 1, borderColor: '#E1E9EE', paddingHorizontal: 15, paddingVertical: 14, marginBottom: 16, borderRadius: 13, fontSize: 15, color: colors.text },
  button: { backgroundColor: colors.secondary, padding: 16, borderRadius: 13, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10, marginTop: 5 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  securityNote: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18 },
  securityText: { flex: 1, color: colors.textLight, fontSize: 10, lineHeight: 15 },
});
