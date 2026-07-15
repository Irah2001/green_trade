FROM node:25-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=http://green-trade.local
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile

COPY packages/frontend ./packages/frontend
COPY packages/shared ./packages/shared

WORKDIR /app/packages/frontend
RUN pnpm build

FROM node:25-alpine AS production

RUN npm install -g pnpm

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

ARG NEXT_PUBLIC_API_URL=http://green-trade.local
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

COPY --chown=nodejs:nodejs package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY --chown=nodejs:nodejs packages/frontend/package.json ./packages/frontend/
COPY --chown=nodejs:nodejs packages/shared/package.json ./packages/shared/

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder --chown=nodejs:nodejs /app/packages/frontend/.next ./packages/frontend/.next
COPY --from=builder --chown=nodejs:nodejs /app/packages/frontend/public ./packages/frontend/public
COPY --from=builder --chown=nodejs:nodejs /app/packages/shared ./packages/shared


USER nodejs

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

WORKDIR /app/packages/frontend

CMD ["pnpm", "exec", "next", "start", "-H", "0.0.0.0", "-p", "3000"]