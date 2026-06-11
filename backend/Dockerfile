FROM node:22-slim
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci && npx prisma generate

COPY . .

RUN npm run build && npm prune --omit=dev

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
