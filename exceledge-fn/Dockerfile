# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /exceledge-fn

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:1.25-alpine

COPY --from=builder /exceledge-fn/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]