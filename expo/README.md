📱 Sistema de Gerenciamento de Tarefas — Aplicativo Multiplataforma

Um aplicativo nativo moderno para iOS, Android e Web, construído com tecnologias móveis de ponta como Expo + React Native + TypeScript.

ℹ️ Informações do Projeto

Este é um aplicativo:

📱 Nativo multiplataforma (iOS, Android, Web)

⚛️ Construído com Expo Router + React Native

🧩 Como editar este projeto
1. Editando localmente com seu editor favorito

Recomendado:

👉 Para iniciantes: Cursor

👉 Para usuários avançados: Claude Code

👉 Requisitos: Node.js + Bun instalados

Instale:

Node.js via nvm

Bun: https://bun.sh

🧭 Passos para rodar o projeto
# 1. Clone o repositório
git clone <YOUR_GIT_URL>

# 2. Acesse o diretório
cd <YOUR_PROJECT_NAME>

# 3. Instale dependências
bun i

# 4. Rodar versão web
bun run start-web

# 5. Rodar no iOS
bun run start     # depois aperte "i" no terminal

3. Editar diretamente pelo GitHub

Abra o arquivo

Clique no ✏️ Edit

Faça alterações

Confirme o commit

🛠️ Tecnologias utilizadas
Tecnologia	Descrição
React Native	Framework criado pela Meta (Instagram, Airbnb etc.)
Expo	Toolkit usado por Discord, Tesla, Coinbase
Expo Router	Rotas baseadas em arquivos, com suporte Web
TypeScript	Tipagem segura
React Query	Estado do servidor
Lucide RN	Ícones vetoriais modernos
📱 Como testar o app
1. No celular (recomendado)

Baixe o Expo Go:

Android → Play Store

Execute:

bun run start


Escaneie o QR Code.

2. Testar no navegador
bun run start-web

3. Simulador iOS / Android
# iOS
bun run start -- --ios

# Android
bun run start -- --android

🚀 Como publicar o projeto
iOS – App Store
bun i -g @expo/eas-cli
eas build:configure
eas build --platform ios
eas submit --platform ios

Android – Google Play
eas build --platform android
eas submit --platform android

Deploy Web
eas build --platform web
eas hosting:configure
eas hosting:deploy


Outras opções:

Vercel

Netlify

✨ Funcionalidades do App

✔️ App nativo para iOS, Android e Web

✔️ Navegação baseada em arquivos (Expo Router)

✔️ Abas, modais e navegação moderna

✔️ Armazenamento local (Async Storage)

✔️ Ícones vetoriais de alta qualidade

✔️ TypeScript em todo o código

📂 Estrutura do Projeto
├── app/                    # Telas do aplicativo
│   ├── (tabs)/            
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   ├── _layout.tsx
│   ├── modal.tsx
│   └── +not-found.tsx
├── assets/                # Imagens e ícones
├── constants/             # Configurações
├── app.json               # Config do Expo
├── package.json           
└── tsconfig.json          

🧱 Builds de Desenvolvimento Personalizados

Necessários para:

Face ID / Touch ID

Google / Apple Sign In

In-App Purchases

bun i -g @expo/eas-cli
eas build:configure
eas build --profile development --platform ios
eas build --profile development --platform android

💾 Recursos Avançados
Banco de Dados

Supabase

Firebase

API própria

Autenticação

Supabase Auth

Firebase Auth

Apple / Google Sign In (build nativo)

Notificações Push

Expo Notifications

Firebase Cloud Messaging

Pagamentos

Stripe / Paypal / RevenueCat

🌐 Domínio Personalizado (Web)

Opções:

EAS Hosting

Vercel

Netlify

🧰 Solução de Problemas
App não carrega?

Verifique Wi-Fi

Use túnel:

bun start -- --tunnel


Desative firewall

Build falhou?
bunx expo start --clear
rm -rf node_modules && bun install

📸 Diagrama de Casos de Uso
<img width="1536" height="1024" alt="CASOS_DE_USOS" src="https://github.com/user-attachments/assets/0993432d-a212-4adf-9e1a-721b35772c83" />


📸 Diagrama de Classes!
<img width="1536" height="1024" alt="ChatGPT Image 8 de dez  de 2025, 20_02_25" src="https://github.com/user-attachments/assets/b7ac858e-10da-47c2-b3b3-bb3138a04b9e" />
