# 1. ESTÁGIO DE DEPENDÊNCIAS
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copia arquivos de dependência
COPY package.json package-lock.json* pnpm-lock.yaml* ./

# Instala dependências de forma limpa
RUN \
  if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm i --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  else npm install; \
  fi

# 2. ESTÁGIO DE CONSTRUÇÃO (BUILD)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Desativa telemetria do Next.js na build para maior privacidade/velocidade
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Executa a compilação
RUN \
  if [ -f pnpm-lock.yaml ]; then npm install -g pnpm && pnpm run build; \
  else npm run build; \
  fi

# 3. ESTÁGIO DE EXECUÇÃO (RUNNER)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Porta exposta do contêiner
ENV PORT=3000
EXPOSE 3000

# Cria usuário não-root por segurança
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copia os arquivos públicos e de build standalone gerados pelo Next.js
COPY --from=builder /app/public ./public

# Define permissões corretas para cache do Next.js
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copia os arquivos do standalone build (arquivos do servidor e node_modules reduzidos)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Executa o servidor stand-alone do Next.js
CMD ["node", "server.js"]
