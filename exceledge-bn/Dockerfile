FROM node:18-alpine AS builder

WORKDIR /exceledge-bn
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci 
RUN npx prisma generate

# Build application
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /exceledge-bn

COPY --from=builder /exceledge-bn/node_modules ./node_modules
COPY --from=builder /exceledge-bn/package*.json ./
COPY --from=builder /exceledge-bn/prisma ./prisma
COPY --from=builder /exceledge-bn/openapi.yaml ./build/openapi.yaml
COPY --from=builder /exceledge-bn/build ./build
RUN addgroup -g 1001 -S nodejs && \
    adduser -S -u 1001 -G nodejs nodejs
USER nodejs

EXPOSE 8800

CMD ["sh", "-c", "npx prisma migrate deploy && node build/src/server.js"]