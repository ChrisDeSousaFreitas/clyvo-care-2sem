import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { answerFromLocalKnowledge } from '../services/localAiAgent';

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    role: 'assistant',
    text: 'Olá! Sou o assistente do Clyvo. Posso ajudar com informações básicas sobre o aplicativo, pets, agendamentos e Smart Collar. O que você gostaria de saber?',
  },
];

const SUGGESTIONS = [
  'O que é o Clyvo?',
  'Como funciona a agenda?',
  'O que é o Smart Collar?',
];

export default function AssistantScreen({ navigation }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const canSend = useMemo(() => draft.trim().length > 0 && !isTyping, [draft, isTyping]);

  const sendMessage = (value = draft) => {
    const text = value.trim();
    if (!text || isTyping) return;

    const userMessage = { id: `user-${Date.now()}`, role: 'user', text };
    setMessages((current) => [...current, userMessage]);
    setDraft('');
    setIsTyping(true);

    // Resposta determinística: consulta somente a base de conhecimento empacotada no app.
    const response = answerFromLocalKnowledge(text);
    setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: `assistant-${Date.now()}`, role: 'assistant', text: response },
      ]);
      setIsTyping(false);
    }, 650);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Ionicons name="sparkles" size={21} color="#FFFFFF" />
        </View>
        <View style={styles.headerCopy}>
          <Text style={styles.headerTitle}>Clyvo IA</Text>
          <View style={styles.statusRow}>
            <View style={styles.statusDot} />
            <Text style={styles.headerSubtitle}>Assistente disponível</Text>
          </View>
        </View>
        <View style={styles.localBadge}>
          <Text style={styles.localBadgeText}>LOCAL</Text>
        </View>
      </View>

      <View style={styles.contextCard}>
        <Ionicons name="shield-checkmark-outline" size={17} color={colors.secondary} />
        <Text style={styles.contextText}>
          Respostas baseadas exclusivamente nas informações locais do aplicativo.
        </Text>
      </View>

      <ScrollView
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.dateLabel}>ASSISTENTE CLYVO</Text>
        {messages.map((message) => {
          const isUser = message.role === 'user';
          return (
            <View key={message.id} style={[styles.messageRow, isUser && styles.userMessageRow]}>
              {!isUser && (
                <View style={styles.messageAvatar}>
                  <Ionicons name="sparkles" size={14} color={colors.secondary} />
                </View>
              )}
              <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
                <Text style={[styles.messageText, isUser && styles.userMessageText]}>
                  {message.text}
                </Text>
              </View>
            </View>
          );
        })}

        {isTyping && (
          <View style={styles.messageRow}>
            <View style={styles.messageAvatar}>
              <Ionicons name="sparkles" size={14} color={colors.secondary} />
            </View>
            <View style={[styles.bubble, styles.assistantBubble]}>
              <Text style={styles.typingText}>Consultando informações locais...</Text>
            </View>
          </View>
        )}

        {messages.length === 1 && (
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsTitle}>PERGUNTAS SUGERIDAS</Text>
            {SUGGESTIONS.map((suggestion) => (
              <TouchableOpacity
                key={suggestion}
                style={styles.suggestion}
                onPress={() => sendMessage(suggestion)}
              >
                <Text style={styles.suggestionText}>{suggestion}</Text>
                <Ionicons name="arrow-up" size={15} color={colors.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.composerWrap}>
        <View style={styles.composer}>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Pergunte ao Clyvo..."
            placeholderTextColor={colors.textLight}
            style={styles.input}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={() => sendMessage()}
          />
          <TouchableOpacity
            style={[styles.sendButton, !canSend && styles.sendButtonDisabled]}
            onPress={() => sendMessage()}
            disabled={!canSend}
            accessibilityLabel="Enviar mensagem"
          >
            <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.disclaimer}>Demonstração local · Não substitui orientação veterinária</Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 54, paddingBottom: 15, paddingHorizontal: 17, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: '#E7ECEF' },
  backButton: { padding: 8, marginRight: 8 },
  avatar: { width: 39, height: 39, borderRadius: 14, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  headerCopy: { flex: 1 },
  headerTitle: { color: colors.primary, fontSize: 17, fontWeight: '900' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  statusDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#36A875', marginRight: 6 },
  headerSubtitle: { color: colors.textLight, fontSize: 11 },
  localBadge: { paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, backgroundColor: '#E8F4F5' },
  localBadgeText: { color: colors.secondary, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  contextCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginTop: 13, padding: 11, borderRadius: 12, backgroundColor: '#EAF3F4', gap: 8 },
  contextText: { flex: 1, color: '#45616A', fontSize: 11, lineHeight: 16 },
  chat: { flex: 1 },
  chatContent: { padding: 17, paddingBottom: 24 },
  dateLabel: { alignSelf: 'center', color: colors.textLight, fontSize: 9, fontWeight: '900', letterSpacing: 1.4, marginVertical: 13 },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 13, maxWidth: '91%' },
  userMessageRow: { alignSelf: 'flex-end', justifyContent: 'flex-end' },
  messageAvatar: { width: 27, height: 27, borderRadius: 10, backgroundColor: '#E4F1F3', alignItems: 'center', justifyContent: 'center', marginRight: 7, marginBottom: 2 },
  bubble: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: 17 },
  assistantBubble: { backgroundColor: colors.surface, borderBottomLeftRadius: 5, borderWidth: 1, borderColor: '#E8ECEF' },
  userBubble: { backgroundColor: colors.primary, borderBottomRightRadius: 5 },
  messageText: { color: colors.text, fontSize: 13, lineHeight: 20 },
  userMessageText: { color: '#FFFFFF' },
  typingText: { color: colors.textLight, fontSize: 12, fontStyle: 'italic' },
  suggestions: { marginTop: 12, marginLeft: 34 },
  suggestionsTitle: { color: colors.textLight, fontSize: 9, fontWeight: '900', letterSpacing: 1.2, marginBottom: 9 },
  suggestion: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.surface, borderRadius: 12, borderWidth: 1, borderColor: '#DCE7EA', paddingHorizontal: 13, paddingVertical: 12, marginBottom: 8 },
  suggestionText: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  composerWrap: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 13, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: '#E7ECEF' },
  composer: { flexDirection: 'row', alignItems: 'flex-end', borderRadius: 17, backgroundColor: colors.background, borderWidth: 1, borderColor: '#DCE5E9', padding: 6 },
  input: { flex: 1, maxHeight: 95, minHeight: 42, color: colors.text, fontSize: 13, paddingHorizontal: 10, paddingTop: 11, paddingBottom: 8 },
  sendButton: { width: 39, height: 39, borderRadius: 13, backgroundColor: colors.secondary, alignItems: 'center', justifyContent: 'center' },
  sendButtonDisabled: { opacity: 0.4 },
  disclaimer: { color: colors.textLight, textAlign: 'center', fontSize: 9, marginTop: 8 },
});
