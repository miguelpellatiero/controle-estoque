# Controle de Estoque (Next.js + Prisma + Supabase)
Este projeto já está preparado para deploy online sem precisar instalar Node.js no seu computador.

## O que foi ajustado para produção
- Build de deploy configurado para:
  - sincronizar banco (`prisma db push`)
  - popular dados iniciais (`prisma db seed`)
  - gerar build do Next.js
- Seed corrigido para funcionar no primeiro deploy.
- Arquivo `.env.example` criado com todas as variáveis obrigatórias.

## Deploy online (recomendado: Vercel)
1. Envie o código para seu repositório no GitHub.
2. Acesse a Vercel e clique em **New Project**.
3. Importe o repositório `controle-estoque`.
4. Em **Environment Variables**, adicione os valores do `.env.example`:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
5. Faça o deploy.

O arquivo `vercel.json` já força o comando de build correto no deploy.

## Primeiro acesso
- URL do sistema: a URL gerada pela Vercel.
- Usuário inicial: `admin@demo.com`
- Senha inicial: `admin123`

## Importante após publicar
No primeiro login, altere a senha do usuário admin.
