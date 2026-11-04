# 🐾 Clyvo SmartCare

Aplicativo mobile de apoio à gestão clínica veterinária. O Clyvo conecta a experiência mobile à API Java/Spring Boot do projeto, permitindo autenticação, cadastro de pacientes, consulta de veterinários e organização de agendamentos.

## Evolução da integração mobile + backend

Na versão **1.2.0**, o aplicativo foi adaptado aos contratos existentes da API Java. Em vez de alterar o backend para acomodar rotas e payloads do mobile, o front-end passou a respeitar os endpoints, DTOs, validações, autenticação JWT, permissões e respostas HATEOAS já definidos pelo servidor.

### Contratos utilizados

| Recurso | Contrato da API |
|---|---|
| Autenticação | `POST /auth/login` com `username` e `password` |
| Pets | `/pet` (singular), CRUD REST |
| Veterinários | `GET /veterinario` |
| Agendamentos | `/agendamento` (singular) |
| Cancelamento | `PATCH /agendamento/{id}/cancelar` |

### Payload de pet

A API exige nome com 3 a 50 caracteres, espécie e idade (inteiro maior ou igual a zero). Raça, cor e peso são opcionais; quando informado, o peso precisa ser maior que zero.

```json
{
  "nome": "Luna",
  "especie": "Cachorro",
  "raca": "Golden Retriever",
  "cor": "Dourado",
  "idade": 3,
  "peso": 24.5
}
```

### Payload de agendamento

A API exige data/hora futura, ID de um pet existente e ID de um veterinário existente. O status é definido pelo backend como `AGENDADO`.

```json
{
  "dataHora": "2026-11-10T14:30:00",
  "idPet": 1,
  "idVeterinario": 1,
  "motivo": "Consulta de rotina"
}
```

A API usa os estados `AGENDADO`, `REALIZADO` e `CANCELADO`. O aplicativo cancela pelo endpoint de ação disponibilizado pelo servidor; não envia DELETE para agendamentos.

### Autenticação e permissões

O aplicativo autentica na API com `/auth/login`, recebe o token JWT e o guarda com `expo-secure-store` (Android Keystore / iOS Keychain). O token é enviado automaticamente no cabeçalho `Authorization: Bearer`. Uma resposta HTTP 401 encerra a sessão local para solicitar novo login.

**Não inclua tokens, senhas ou credenciais no código, no README, em variáveis `EXPO_PUBLIC_*` ou no GitHub.** O login usa as credenciais fornecidas pelo responsável pelo backend.

O painel mobile desta versão requer perfil **ADMIN**, pois o fluxo principal gerencia pets e consulta veterinários. O aplicativo confirma essa permissão consultando `GET /pet` após o login. O backend também permite ao perfil `VETERINARIO` operar agendamentos e consultas, mas não permite que esse perfil acesse pets ou a lista de veterinários; por isso, o fluxo mobile completo não é liberado para esse perfil.

### Respostas HATEOAS e paginação

Listagens do Spring retornam modelos paginados com dados em `_embedded`, além de metadados e links. O mobile normaliza a coleção embutida e solicita até 100 registros por página na primeira versão. Para bases maiores, implemente paginação incremental.

## Funcionalidades mobile

- Login integrado ao JWT da API Java.
- Persistência segura da sessão no dispositivo.
- Cadastro, consulta, edição e exclusão de pets conforme o DTO Java.
- Consulta de veterinários para seleção no agendamento.
- Criação e listagem de agendamentos.
- Cancelamento de agendamento via PATCH.
- Lembretes locais de consultas futuras.
- Ficha cadastral do pet.
- Smart Collar em modo de simulação; não representa telemetria real.
- Tela Sobre o App com versão e hash do build.

## Tecnologias

- React Native
- Expo SDK 58
- React Navigation
- Spring Boot REST API
- JWT Bearer Authentication
- Expo SecureStore
- TanStack Query
- Axios
- Expo Notifications
- React Native Reanimated

## Arquitetura

```text
src/
├── api/          # Axios, JWT e normalização HATEOAS
├── components/   # componentes reutilizáveis
├── hooks/        # autenticação e operações de dados
├── routes/       # navegação
├── screens/      # telas da aplicação
├── services/     # armazenamento seguro e notificações
└── theme/        # identidade visual e cores
```

As telas cuidam da apresentação. Hooks encapsulam consultas e mutações com TanStack Query. O cliente Axios centraliza URL, autenticação e tratamento de erros. O serviço de sessão usa SecureStore para persistir o JWT.

## Configuração do ambiente

### Pré-requisitos

- Node.js 22.13.x ou superior.
- npm e Git.
- Android Studio com Android SDK e um emulador configurado, ou aparelho Android.
- Conta Expo/EAS para gerar o APK.
- Acesso às credenciais válidas de perfil ADMIN da API Java.
- Acesso ao projeto Firebase para distribuição do APK pelo App Distribution.

### 1. Clonar e usar a branch de desenvolvimento

```bash
git clone https://github.com/ChrisDeSousaFreitas/clyvo-care-2sem.git
cd clyvo-care-2sem
git checkout develop
git pull origin develop
```

### 2. Instalar dependências

```bash
npm install
npx expo install --fix
npx expo-doctor
```

### 3. Configurar a URL da API

Copie `.env.example` para `.env` e confirme a URL base do backend:

```env
EXPO_PUBLIC_API_URL=https://java-challenge-fiap-2026.onrender.com
```

Use a URL raiz, sem acrescentar `/pet`, `/agendamento` ou `/auth/login`. O arquivo `.env` é local e não deve ser enviado ao Git.

### 4. Iniciar o aplicativo

```bash
npx expo start -c
```

Entre com usuário e senha de perfil ADMIN fornecidos pelo responsável pelo backend. O token JWT é emitido pela API; não cole um token fixo no aplicativo.

### 5. Validar os fluxos

1. Entrar com usuário ADMIN autorizado.
2. Consultar pacientes.
3. Criar um pet preenchendo nome, espécie e idade.
4. Editar e excluir um pet de teste.
5. Consultar a lista de veterinários.
6. Criar um agendamento futuro selecionando pet e veterinário.
7. Confirmar o registro na lista.
8. Cancelar um agendamento de teste.
9. Validar lembrete local em build nativo Android.
10. Conferir o comportamento de logout e sessão expirada.

## Notificações locais

Ao salvar um agendamento futuro, o aplicativo solicita permissão e programa um lembrete para 30 minutos antes. Se faltarem menos de 30 minutos, o aviso é programado para o horário do compromisso. O lembrete é local no dispositivo e não substitui notificações remotas enviadas pelo servidor.

Formato aceito no formulário: `AAAA-MM-DD HH:mm`. O aplicativo converte para o formato ISO LocalDateTime esperado pelo backend.

## Build Android e Firebase App Distribution

O perfil `preview` em `eas.json` gera um APK instalável.

```bash
npm install -g eas-cli
eas login
eas init
eas build:configure
eas build --platform android --profile preview
```

Configure o `projectId` retornado pelo EAS em `app.config.js` dentro de `extra.eas`. Confirme o applicationId Android no Firebase Console antes de gerar a versão de distribuição.

Depois do build:
1. Baixe o APK gerado.
2. Instale e valide em um Android.
3. Abra o Firebase Console e selecione o projeto Clyvo.
4. Acesse App Distribution.
5. Cadastre o e-mail institucional do professor como tester.
6. Envie o APK e distribua o release.
7. Confirme o recebimento do convite e a instalação.

## 🤖 Módulo de Inteligência Artificial (Sprint 4 - IoT & IA)
O sistema da **Clyvo Vet** conta agora com um motor de inteligência artificial voltado para o apoio à decisão clínica e triagem preventiva de pets.

### Como funciona:
1. O tutor ou veterinário envia os dados do pet e os sintomas recentes via API.
2. O endpoint `/api/ia/analisar-saude` processa as informações e retorna recomendações personalizadas e nível de urgência.

### Endpoints da IA:
* **POST** `/api/ia/analisar-saude`
  * *Payload de exemplo:*
    ```json
    {
      "nome": "Thor",
      "especie": "Cachorro",
      "sintomas": "Apatia e falta de apetite"
    }
    ```
    
### Assistente local para demonstração

A tela **Clyvo IA** possui um modo de demonstração independente do endpoint de IA descrito acima. As respostas vêm de uma base de conhecimento local incluída no aplicativo, sem chamadas externas, sem chave de API e sem conexão com o backend. É uma simulação determinística para testar a interface e gravar o fluxo; não é um modelo generativo nem realiza diagnóstico veterinário. Consulte `docs/DEMO-IA-LOCAL.md`.

## Versão e rastreabilidade

Versão atual: **1.2.1**.

A tela Sobre apresenta a versão e o hash de referência do build. Gere o APK a partir do commit que será entregue e confira se o hash exibido corresponde ao código publicado.

## Resultado final da entrega — Sprint 4

A entrega do Clyvo SmartCare foi concluída com sucesso. Durante a etapa final, os problemas identificados no desenvolvimento foram corrigidos, as implementações que ainda estavam pendentes foram finalizadas e o aplicativo foi testado novamente.

**O resultado final está funcionando corretamente**, com os fluxos e funcionalidades implementados disponíveis para demonstração. A compilação Android também foi concluída com sucesso.

### Conquistas da entrega

- [x] Aplicativo iniciado com sucesso pelo Expo.
- [x] Aplicativo executado e conferido em dispositivo Android.
- [x] Compilação Android concluída com sucesso.
- [x] Problemas identificados durante o desenvolvimento corrigidos.
- [x] Implementações que estavam pendentes finalizadas.
- [x] Funcionalidades do aplicativo verificadas após as correções.
- [x] Estrutura mobile e integração com a API organizadas conforme os contratos documentados neste README.
- [x] Vídeo final de demonstração gravado e publicado.

## Integrantes

| Integrante | RM |
|---|---:|
| Pedro Fonseca | 562521 |
| Matheus Enrico | 562532 |
| Bruno Zanateli | 563736 |
| Rodrigo Tiezzi | 562975 |

## Vídeo de entrega

[Assistir à demonstração final do Clyvo SmartCare no YouTube](https://youtu.be/rtHe7-CPdi0)


---

**Clyvo SmartCare** — cuidado conectado para pets.
