# Mercado ON — Compre e venda no seu bairro

PWA para anúncios locais (marmitas, doces, roupas, beleza, serviços) com Firebase (Firestore + Storage).

## 📁 Estrutura

```
mercado-on/
├── index.html              ← app principal
├── manifest.json            ← manifesto do PWA
├── sw.js                     ← service worker (cache offline)
├── firebase.json             ← config do Firebase Hosting
├── .firebaserc                ← qual projeto Firebase usar
├── firestore.rules            ← regras de segurança do Firestore
├── storage.rules              ← regras de segurança do Storage
├── icons/                     ← ícones do app (placeholders — troque pela logo real)
└── .github/workflows/
    └── firebase-deploy.yml    ← deploy automático ao dar push na main
```

## 1️⃣ Antes de tudo: preencher as credenciais do Firebase

Abra `index.html`, procure por `firebaseConfig` (perto da linha 48) e troque os valores
`SUA_API_KEY`, `SEU_PROJETO`, `SEU_ID`, `SEU_APP_ID` pelos dados reais do seu
projeto no Firebase Console (Configurações do projeto → Seus apps → app Web).

Troque também `SEU-PROJETO-AQUI` em:
- `.firebaserc`
- `.github/workflows/firebase-deploy.yml` (campo `projectId`)

E o `https://SEU-PROJETO.web.app` nas tags `og:url` dentro do `<head>` do `index.html`.

## 2️⃣ Subir para o GitHub

```bash
cd mercado-on
git init
git add .
git commit -m "Primeira versão do Mercado ON"
git branch -M main
git remote add origin https://github.com/alfastore-apolo/mercado-on.git
git push -u origin main
```

Se o repositório `mercado-on` ainda não existe no GitHub, crie primeiro em
https://github.com/new (sem adicionar README/gitignore, pra não conflitar).

## 3️⃣ Configurar o Firebase Hosting

Instale a CLI do Firebase (se ainda não tiver):

```bash
npm install -g firebase-tools
firebase login
```

Dentro da pasta do projeto:

```bash
firebase init firestore
firebase init storage
firebase init hosting
```

Quando perguntar:
- **Use an existing project** → selecione o projeto que você criou no console
- **What do you want to use as your public directory?** → digite `.` (ponto)
- **Configure as a single-page app?** → **Yes**
- **Set up automatic builds and deploys with GitHub?** → pode dizer **No** (já temos o workflow pronto manualmente)

Isso pode sobrescrever `firebase.json` e `.firebaserc` — confira se ficaram parecidos com os que já estão aqui (ajuste se precisar).

Depois, suba as regras e o app:

```bash
firebase deploy
```

Isso já publica o site em `https://SEU-PROJETO.web.app`.

## 4️⃣ Deploy automático via GitHub Actions (a cada push)

1. Gere uma **service account** do Firebase:
   ```bash
   firebase init hosting:github
   ```
   Esse comando cria automaticamente o secret `FIREBASE_SERVICE_ACCOUNT_SEU_PROJETO` no seu repositório GitHub e um workflow. Se preferir usar o workflow que já está em `.github/workflows/firebase-deploy.yml`, copie o **valor do secret gerado** e crie manualmente no GitHub:
   - Vá no repositório → **Settings → Secrets and variables → Actions → New repository secret**
   - Nome: `FIREBASE_SERVICE_ACCOUNT`
   - Valor: cole o JSON da service account

2. A partir do próximo `git push` na branch `main`, o deploy roda automaticamente.

## 5️⃣ Gerar o app Android/iOS com o PWABuilder

1. Acesse **https://www.pwabuilder.com**
2. Cole a URL do seu site publicado (`https://SEU-PROJETO.web.app`)
3. Clique em **Start**
4. O PWABuilder vai analisar o manifest e o service worker automaticamente (já estão prontos aqui)
5. Corrija qualquer aviso amarelo, se aparecer (geralmente sobre ícones — já estão com todos os tamanhos)
6. Clique em **Package for Stores**
7. Escolha **Android** (gera `.aab`/`.apk` via Bubblewrap) e/ou **iOS** / **Windows**, conforme precisar
8. Baixe o pacote gerado

## 🎨 Troque os ícones placeholder

Os ícones em `icons/` são provisórios (fundo verde com "M" branco). Quando tiver a logo
definitiva, gere o conjunto completo em **https://realfavicongenerator.net** ou
**https://www.pwabuilder.com/imageGenerator** e substitua os arquivos mantendo os mesmos nomes.

## 🔒 Sobre as regras de segurança

As regras em `firestore.rules` e `storage.rules` estão liberadas para leitura pública e
escrita com validação mínima — suficiente para colocar no ar rápido, mas revise antes de
divulgar amplamente (ex: exigir autenticação para publicar anúncio, moderação, limite de
anúncios por usuário, etc.).
