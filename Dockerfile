#Base

FROM node:24.14.1-alpine AS base
WORKDIR /app

ARG NEXT_PUBLIC_PUBLIC_KEY=null
ARG NEXT_PUBLIC_URL_ENDPOINT=null
ENV NEXT_PUBLIC_PUBLIC_KEY=$NEXT_PUBLIC_PUBLIC_KEY
ENV NEXT_PUBLIC_URL_ENDPOINT=$NEXT_PUBLIC_URL_ENDPOINT

#Dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json ./

RUN npm ci

# Builder
FROM base AS builder 

COPY --from=deps /app/node_modules ./node_modules

COPY . .

RUN npm run build

FROM base AS runner
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/next-config-js/output
CMD ["node", "server.js"]
