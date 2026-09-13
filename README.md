# 🐾 Clyvo SmartCare

> Aplicativo móvel para monitoramento avançado da saúde de pets, integrando gestão de dados clínicos com telemetria simulada via IoT (Internet das Coisas).

O **Clyvo SmartCare** é um aplicativo móvel voltado para o monitoramento avançado da saúde de pets, integrando gestão de dados clínicos com telemetria simulada via IoT (Internet das Coisas).

O objetivo do projeto é oferecer aos tutores uma ferramenta robusta, com design premium e intuitivo, garantindo total controle sobre o bem-estar de seus animais — sejam eles **cães, gatos ou exóticos**.

---

## 👥 Integrantes

| **Integrante**         | **RM** |
| ---------------------- | -----: |
| Bruno Andrade Zanateli | 563736 |
| Christian S. Freitas   | 566098 |
| Pedro Pereira Biasolli | 562521 |
| Rodrigo Tiezzi         | 562975 |
| Matheus Enrico Souza   | 562532 |

---

## 🛠️ Tecnologias e Arquitetura

O projeto foi construído utilizando um ecossistema moderno para garantir **performance e escalabilidade**.

* **Framework Principal:** React Native com Expo (SDK 56+).
* **Navegação:** React Navigation (Stack puro).
* **Animações:** React Native Reanimated.
* **Estilização e UI:** Componentização customizada com suporte nativo a Dark Mode.
* **Integrações (Em andamento):** Firebase para Autenticação e TanStack Query para consumo da API.

---

# 🛤️ A Jornada de Desenvolvimento

O desenvolvimento do Clyvo SmartCare passou por fases intensas de reestruturação arquitetural e refinamento visual.

Abaixo, detalhamos os obstáculos enfrentados e as vitórias alcançadas.

---

## 🐛 Os Desafios e Erros (Troubleshooting)

### 1. O Conflito de Rotas e Tipagens

No início, o projeto utilizava o `expo-router`, mas a estrutura automática gerou conflitos severos de ambiente, quebrando a compilação com erros de arquivos ausentes (como `expo-env.d.ts` e `tsconfig.base`).

#### ✅ A Solução

Foi necessário realizar uma limpeza profunda:

* Deletando `node_modules`;
* Limpando o cache do empacotador;
* Removendo o `expo-router`;
* Convertendo a configuração rígida do TypeScript para um `jsconfig.json` mais flexível.

Assumimos o controle manual das rotas migrando para o **React Navigation puro**.

---

### 2. Perda de Dependências Visuais

Durante a limpeza arquitetural, o módulo de ícones (`@expo/vector-icons`) foi perdido, gerando quebras instantâneas na renderização da interface.

#### ✅ A Solução

Foi realizada a reinstalação direcionada do pacote e a reinicialização forçada do Metro Bundler para remapear os componentes.

---

### 3. Falhas de Navegação no Roteamento

Enfrentamos a exceção:

```text
"The action 'GO_BACK' was not handled"
```

O aplicativo abria a tela de Cadastro primeiro e impedia o usuário de retornar ao Login.

#### ✅ A Solução

Refatoração do arquivo `AppRoutes.js` para:

* Forçar o `initialRouteName` no Login;
* Substituir comandos relativos de voltar (`goBack`) por rotas absolutas (`navigate('Login')`);
* Blindar a navegação.

---

# 🎨 Os Acertos e a Evolução da Interface

Com a base estrutural estabilizada, o foco virou **100% para a Experiência do Usuário (UX) e Interface (UI)**.

O aplicativo foi moldado seguindo a identidade visual oficial da marca:

* 🔵 **Azul Marinho:** primária;
* 🟢 **Verde-Água/Teal:** secundária;
* 🟠 **Laranja:** acentuação.

---

## 🔐 Diferenciação Crítica de Telas

Para evitar penalizações acadêmicas por **"telas duplicadas"**, a tela de Login ganhou um formato moderno em **Bottom Sheet** (cartão flutuante sobre fundo escuro), enquanto o Cadastro foi transformado em uma tela clara e expansiva de **Onboarding**, provando domínio sobre layouts complexos.

---

## 🐶 Seletor Visual de Espécies

Remoção de campos de digitação cansativos para a escolha da espécie do pet, substituídos por **botões interativos com ícones vetoriais**.

---

# ✨ Funcionalidades em Destaque

A aplicação foi enriquecida com mecânicas visuais que normalmente são vistas apenas em aplicativos de **altíssimo padrão no mercado**.

---

## 💀 Efeito Skeleton Loading

Em vez da tradicional e monótona "bolinha girando", implementamos blocos cinzas animados que pulsam enquanto os dados dos pets carregam, elevando a percepção de velocidade do app.

---

## 🩺 Timeline Médica Vertical

A tela de agendamentos foi construída como uma **linha do tempo contínua**, conectando consultas concluídas e pendentes por nós e linhas, facilitando a leitura do histórico clínico.

---

## 🐾 Simulador IoT (Smart Collar)

O módulo de coleira inteligente possui uma **animação nativa de pulsação (batimentos cardíacos)**.

Inserimos um botão interativo que simula um **pico de estresse**, acelerando a animação imediatamente e trocando a interface para vermelho de alerta.

---

## 🌙 Dark Mode Dinâmico

A paleta de cores inteira foi reescrita com o suporte da API `Appearance`.

O aplicativo lê a preferência do sistema operacional do usuário e transita suavemente entre o **modo claro** e o **modo escuro** sem quebrar o contraste da identidade visual.

---

# 🎥 Vídeo de Apresentação

> **Vídeo demonstrativo do projeto — requisito da entrega**

🔗 **Link do vídeo no YouTube:**
**[https://youtu.be/qDrsjHCcp94]**

---

# 🚀 Como Executar o Projeto

## 1. Clone o repositório

Clone o repositório e acesse a pasta raiz.

---

## 2. Instale as dependências

Execute:

```bash
npm install
```

---

## 3. Inicie o servidor do Expo

Inicie o servidor do Expo limpando o cache para garantir que todas as configurações de rotas e cores sejam lidas corretamente:

```bash
npx expo start -c
```

---

## 4. Execute no seu celular

Escaneie o **QR Code** gerado no terminal usando o aplicativo **Expo Go** no seu celular físico.

---

# 🐾 Clyvo SmartCare

O **Clyvo SmartCare** busca oferecer aos tutores uma ferramenta robusta, premium e intuitiva para o acompanhamento do bem-estar de seus animais, integrando **gestão clínica**, **telemetria simulada via IoT**, **animações**, **UX moderna** e **Dark Mode dinâmico** em uma única aplicação.
