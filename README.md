ℹ️ Informações do projeto
.
Este é um aplicativo móvel nativo e multiplataforma..
.

Plataforma: Aplicativo nativo para iOS e Android, com opção de exportar para web
Framework: Expo Router + React Native

🧩 Como posso editar este código?

Há várias maneiras de editar seu aplicativo móvel nativo.
1. Usando seu editor de código preferido

Se quiser trabalhar localmente com seu próprio editor

Se você é iniciante em programação e não sabe qual editor usar, recomendamos o Cursor.
Se já tem familiaridade com terminais, pode usar o Claude Code.

O único requisito é ter Node.js e Bun instalados.

Instalar Node.js com nvm

Instalar Bun

🧭 Passos:
# Passo 1: Clone o repositório usando a URL do projeto.
git clone <YOUR_GIT_URL>

# Passo 2: Vá para o diretório do projeto.
cd <YOUR_PROJECT_NAME>

# Passo 3: Instale as dependências necessárias.
bun i

# Passo 4: Inicie a visualização web instantânea do app com recarregamento automático.
bun run start-web

# Passo 5: Inicie o preview no iOS
# Opção A (recomendada):
bun run start  # depois pressione "i" no terminal para abrir o simulador do iOS
# Opção B (se for suportada):
bun run start -- --ios

3. Editar arquivos diretamente no GitHub

Vá até o arquivo que deseja editar.

Clique no ícone do lápis (“Edit”).

Faça as mudanças e confirme o commit.

🛠️ Tecnologias usadas neste projeto

Este projeto foi construído com as tecnologias móveis multiplataforma mais populares:

React Native – framework criado pela Meta (usado no Instagram, Airbnb, etc.)

Expo – extensão do React Native usada por Discord, Shopify, Coinbase, Tesla, Starlink e outros

Expo Router – sistema de rotas baseado em arquivos, com suporte para web e SSR

TypeScript – JavaScript com tipagem segura

React Query – gerenciamento de estado do servidor

Lucide React Native – biblioteca de ícones

📱 Como posso testar o app?
1. No celular (recomendado)
 ou o Expo Go

Android: Baixe o Expo Go na Play Store

Depois rode:

bun run start

e escaneie o QR Code.

2. No navegador

Execute:

bun start-web


Isso abrirá uma visualização no navegador (alguns recursos nativos podem não funcionar).

3. Simulador iOS / Emulador Android

Se tiver XCode ou Android Studio instalados, pode testar com:

# iOS
bun run start -- --ios

# Android
bun run start -- --android

🚀 Como publicar o projeto
Publicar na App Store (iOS)

Instale o EAS CLI:

bun i -g @expo/eas-cli


Configure o projeto:

eas build:configure


Faça o build:

eas build --platform ios


Envie para a App Store:

eas submit --platform ios

Publicar na Google Play (Android)

Faça o build:

eas build --platform android


Envie para a Google Play:

eas submit --platform android

Publicar como site

Faça o build para web:

eas build --platform web


Publique com EAS Hosting:

eas hosting:configure
eas hosting:deploy


Alternativas de hospedagem:

Vercel – deploy direto do GitHub

Netlify – integração automática com repositórios

✨ Funcionalidades do app

Compatível com iOS, Android e Web

Navegação baseada em arquivos (Expo Router)

Abas de navegação personalizáveis

Telas modais (sobreposições e diálogos)

Suporte a TypeScript

Armazenamento local (Async Storage)

Ícones vetoriais (Lucide React Native)

📂 Estrutura do projeto
├── app/                    # Telas do aplicativo
│   ├── (tabs)/            # Abas de navegação
│   │   ├── _layout.tsx
│   │   └── index.tsx
│   ├── _layout.tsx
│   ├── modal.tsx
│   └── +not-found.tsx
├── assets/                # Imagens e ícones
├── constants/             # Constantes e configurações
├── app.json               # Configuração do Expo
├── package.json           # Dependências e scripts
└── tsconfig.json          # Configuração do TypeScript

🧱 Builds de Desenvolvimento Personalizados

Necessários para recursos nativos avançados, como:

Autenticação nativa (Face ID, Google Sign In, etc.)

Compras dentro do app

Recursos de plataforma específicos (widgets, tarefas em segundo plano)

bun i -g @expo/eas-cli
eas build:configure
eas build --profile development --platform ios
eas build --profile development --platform android
bun start --dev-client

💾 Recursos avançados
Banco de dados

Supabase

Firebase

API própria

Autenticação

AuthSession, Supabase Auth, Firebase Auth (funcionam no Expo Go)

Apple Sign In e Google Sign In (requer build nativo)

Notificações Push

Expo Notifications

Firebase Cloud Messaging

Pagamentos

Stripe, PayPal (web)

RevenueCat ou Expo In-App Purchases (apps nativos)

Superwall e Adapty (testes e otimização de paywall)

🌐 Domínio personalizado

Para deploys web, é possível usar:

EAS Hosting, Vercel ou Netlify

Em apps móveis, configure o deep linking no app.json.

🧰 Solução de problemas
App não carrega no dispositivo?

Verifique se o celular e o PC estão na mesma rede Wi-Fi

Use modo túnel:

bun start -- --tunnel


Veja se o firewall não está bloqueando.

Build falhou?

Limpe o cache:

bunx expo start --clear


Reinstale dependências:

rm -rf node_modules && bun install


Consulte o guia de solução de erros do Expo


Seu app Rork está pronto para produção e pode ser publicado na App Store, Google Play ou na web.

Quer que eu formate essa tradução em um arquivo README.pt-BR.md para você colocar no GitHub?
