FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN npx nest build

FROM base AS runner
WORKDIR /app

COPY --from=builder /app/dist ./dist
# Si la app tiene archivos estáticos o carpetas públicas, las copiamos también
COPY --from=builder /app/static ./static

EXPOSE 6060
CMD ["node", "dist/src/main"]
