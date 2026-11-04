# 🐾 Clyvo SmartCare

Aplicativo mobile para apoiar tutores no acompanhamento da saúde dos pets, reunindo cadastro, organização de cuidados, histórico de agendamentos e uma experiência de monitoramento Smart Collar.

## Visão geral

O Clyvo SmartCare foi desenvolvido em React Native com Expo. A aplicação possui autenticação Firebase, telas de gestão de pets, agenda de cuidados e uma área de demonstração da coleira inteligente.

### Funcionalidades

- Cadastro e login de tutores com Firebase Authentication.
- Cadastro, consulta, edição e exclusão de pets por meio da API REST.
- Agenda de consultas e procedimentos.
- Lembretes locais para agendamentos futuros.
- Tela de perfil do pet.
- Área Smart Collar para visualização do conceito de telemetria.
- Tema claro/escuro baseado na preferência do sistema.
- Tela **Sobre o App**, com versão e hash do commit usado no build.

> **Importante:** o Smart Collar disponível nesta versão é uma demonstração de interface. A telemetria real depende da integração IoT/backend correspondente. Os dados de saúde que ainda não vêm de uma fonte real não devem ser apresentados como medições clínicas.

## Tecnologias

- React Native 0.86
- Expo SDK 57
- React Navigation
- Firebase Authentication
- TanStack Query
- Axios
- Expo Notifications
- React Native Reanimated

## Arquitetura

```text
src/
├── api/          # configuração e cliente HTTP
├── components/   # componentes reutilizáveis
├── hooks/        # autenticação e operações de dados
├── routes/       # navegação
├── screens/      # telas da aplicação
├── services/     # Firebase e notificações
└── theme/        # identidade visual e cores
```

As telas ficam responsáveis pela apresentação e interação. Hooks concentram o acesso aos dados via TanStack Query, enquanto os serviços isolam integrações externas, como Firebase e notificações locais.

## Configuração do ambiente

### Pré-requisitos

- Node.js LTS compatível com Expo SDK 57 (Node 22.13 ou superior).
- npm.
- Git.
- Expo Go para testar a interface e funcionalidades compatíveis.
- Android Studio/emulador ou um aparelho Android para validar a versão nativa.
- Conta Expo/EAS para gerar o APK.
- Acesso ao projeto Firebase para distribuir o aplicativo.

### 1. Clonar o repositório

```bash
git clone https://github.com/ChrisDeSousaFreitas/clyvo-care-2sem.git
cd clyvo-care-2sem
git checkout develop
```

### 2. Instalar dependências

```bash
npm install
npx expo install --fix
```

### 3. Configurar a API backend

Copie `.env.example` para `.env` e substitua o valor de `EXPO_PUBLIC_API_URL` pela URL pública real do backend Java.

Exemplo:

```env
EXPO_PUBLIC_API_URL=https://seu-backend-publicado
```

A API deve disponibilizar os endpoints usados pela aplicação, incluindo `/pets` e `/agendamentos`. **Não use a URL do repositório GitHub como URL da API.** Sem essa configuração, as operações de dados serão interrompidas com uma mensagem explícita.

O arquivo `.env` é local e não deve ser enviado ao Git.

### 4. Iniciar o aplicativo

```bash
npx expo start -c
```

Escaneie o QR Code com o Expo Go para validar as telas compatíveis. Para validar notificações e a versão final distribuída, gere e teste um build nativo.

## Notificações locais

Ao salvar um agendamento com data futura, o aplicativo solicita permissão e programa um lembrete relacionado à consulta. O aviso é programado para 30 minutos antes; se o horário estiver a menos de 30 minutos, o lembrete ocorre no horário do agendamento. Ao tocar na notificação, o aplicativo abre a agenda.

Formato obrigatório da data no formulário:

```text
AAAA-MM-DD HH:mm
Exemplo: 2026-11-10 14:30
```

A permissão precisa ser concedida no aparelho. A funcionalidade deve ser validada em build nativo e demonstrada no vídeo.

## Build Android para distribuição

O arquivo `eas.json` contém o perfil `preview`, configurado para gerar APK instalável.

1. Instale/atualize a CLI: `npm install -g eas-cli`.
2. Entre na conta: `eas login`.
3. Configure o projeto EAS: `eas build:configure`.
4. Gere o APK: `eas build --platform android --profile preview`.
5. Baixe o APK gerado e valide a instalação em um aparelho Android.
6. Envie o APK para o Firebase App Distribution e cadastre o e-mail institucional do professor como tester.

O identificador Android do aplicativo precisa corresponder ao aplicativo Android cadastrado no Firebase. Confirme esse identificador no console Firebase antes do primeiro build.

## Publicação e rastreabilidade

A tela **Sobre o App** mostra a versão e o hash de referência informado pelo EAS Build. Para a avaliação, publique o APK gerado a partir do mesmo commit que será entregue no GitHub e confirme que o hash exibido na tela corresponde ao commit publicado.

Versão atual do projeto: **1.1.0**.

## Entrega da Sprint 4 — checklist

- [ ] Todas as telas e fluxos testados em aparelho/emulador.
- [ ] API backend configurada e CRUD validado.
- [ ] Lembrete local recebido e abertura da agenda validada.
- [ ] Build APK gerado e instalado.
- [ ] APK publicado no Firebase App Distribution.
- [ ] E-mail institucional do professor cadastrado como tester.
- [ ] Tela Sobre o App validada com o hash do build.
- [ ] Vídeo contínuo gravado, mostrando fluxos reais, notificações e a versão publicada.
- [ ] README revisado e links finais adicionados.
- [ ] Entrega realizada pelo repositório oficial do GitHub Classroom, conforme orientação da disciplina.

## Vídeo

Vídeo demonstrativo anterior: https://youtu.be/qDrsjHCcp94

**Vídeo da entrega final da Sprint 4:** adicionar aqui o link não listado após a gravação.

## Identidade do projeto

**Clyvo SmartCare** — cuidado conectado para pets.
