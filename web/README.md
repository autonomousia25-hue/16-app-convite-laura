# Convite Digital — Aniversário da Laura

Convite digital interativo com confirmação de presença (RSVP), integrado ao Google Sheets e a um bot do Telegram via n8n. Feito para o 1º aninho da Laura (08/08).

## Funcionalidades

- Convite em tela cheia com visual de app (sem barra de navegador, safe-area para notch, sem bounce de scroll)
- Confirmação de presença (nome, adultos, crianças) com trava contra confirmação duplicada no mesmo aparelho (localStorage)
- Ingresso digital com QR Code (aponta para a localização do evento), acessível a qualquer momento após confirmar
- Botão de localização direto para o Google Maps
- Cada confirmação grava automaticamente uma linha na planilha do Google Sheets
- Aba "Dashboard" na planilha com totais automáticos (famílias, adultos, crianças, total geral) e gráfico de pizza
- Notificação automática no grupo do Telegram a cada nova confirmação (via webhook do n8n)
- Comandos no grupo do Telegram: `status` (totais atuais) e `lista` (nomes de quem confirmou)
- Resumo diário agendado automaticamente no grupo (09h)

## Stack

- Next.js 16 (App Router, Turbopack) + React 19 + Tailwind CSS 4
- `react-hook-form` + `zod` para o formulário de RSVP
- `qrcode.react` para o ingresso com QR Code
- `googleapis` (service account) para escrever no Google Sheets
- n8n (self-hosted) + Telegram Bot API para as notificações

## Variáveis de ambiente

Crie um `web/.env.local` (nunca commitado — já está no `.gitignore`) com:

```
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY=
GOOGLE_SHEETS_SPREADSHEET_ID=
N8N_RSVP_WEBHOOK_URL=
```

- `GOOGLE_SERVICE_ACCOUNT_EMAIL` / `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`: credenciais de uma service account do Google Cloud com a Google Sheets API habilitada. A planilha precisa ser compartilhada com o e-mail dessa service account (permissão de Editor).
- `GOOGLE_SHEETS_SPREADSHEET_ID`: ID da planilha (o trecho entre `/d/` e `/edit` na URL).
- `N8N_RSVP_WEBHOOK_URL`: URL do webhook do workflow n8n que notifica o grupo do Telegram. Opcional — se ausente, o app funciona normalmente, só não dispara a notificação.

As mesmas variáveis precisam estar configuradas em **Vercel → Project Settings → Environment Variables** (Production e Preview) para funcionar em produção.

A chave JSON da service account (se você tiver o arquivo baixado) deve ficar em `web/chaves-google/` — essa pasta também está no `.gitignore`.

## Rodando localmente

```bash
pnpm install
pnpm dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Deploy

Push para `master` dispara deploy automático na Vercel (projeto já linkado via GitHub).

## Integração n8n / Telegram

O workflow **"Convite Laura - RSVP Telegram"** no n8n tem três gatilhos:

1. **Webhook** (`/webhook/convite-laura-rsvp`) — chamado pelo endpoint `/api/rsvp` a cada confirmação salva, envia "🎉 Nova confirmação!" pro grupo.
2. **Telegram Trigger** — escuta mensagens no grupo; responde a `status` (totais) e `lista` (nomes dos confirmados). O bot está com o modo de privacidade **desativado**, então reconhece essas palavras sem precisar de `/` na frente.
3. **Schedule Trigger** — todo dia às 09h, envia um resumo automático dos totais pro grupo.

**⚠️ Backlog / ação pendente:** o workflow deve ficar ativo só até o dia do evento (08/08) e ser **desativado no dia seguinte** (09/08), para não continuar mandando o resumo diário depois da festa.
