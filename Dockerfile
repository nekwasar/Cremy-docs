# ========================================
# Stage 1: Base
# ========================================
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat wget

# ========================================
# Stage 2: Dependencies
# ========================================
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps --ignore-scripts

# ========================================
# Stage 3: Development
# ========================================
FROM deps AS development
ENV NODE_ENV=development
COPY . .
CMD ["npm", "run", "dev"]

# ========================================
# Stage 4: Builder
# ========================================
FROM deps AS builder
COPY . .
RUN npm run build

# ========================================
# Stage 5: Production Runner
# ========================================
FROM base AS production
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.js ./next.config.js

RUN mkdir -p /app/.next/cache /tmp && \
    chown -R nodejs:nodejs /app /tmp

USER nodejs
EXPOSE 3000
CMD ["npm", "start"]
