# Demonstração do Clyvo IA (base local)

A tela **Clyvo IA** usa o serviço `src/services/localAiAgent.js`. Ele compara palavras-chave com uma pequena base de conhecimento empacotada no aplicativo e retorna respostas previamente definidas.

- Não chama serviços externos.
- Não utiliza API de IA, chave, token ou conexão com backend.
- Não aprende, não consulta a internet e não realiza diagnóstico.
- O pequeno atraso de resposta é apenas visual, para dar ritmo à conversa.
- Os dados e respostas são demonstrativos; não representam prontuários reais.

## Como testar

1. Na tela de login, toque em **Entrar em modo demonstração**.
2. No painel, abra **Clyvo IA**.
3. Experimente: “O que é o Clyvo?”, “Como funciona a agenda?” e “O que é o Smart Collar?”.
4. Faça uma pergunta fora da base para conferir a resposta de fallback.
5. Use **Sair da conta** para voltar à tela de login.

O modo demonstração é independente da autenticação JWT e não altera nem grava dados no backend.
