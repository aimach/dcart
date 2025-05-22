FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Étape 2 : serveur "serve"
FROM node:22 AS production

WORKDIR /app
RUN npm install -g serve

# Copie le dossier "dist" généré par Vite dans "/app/build"
COPY --from=build /app/dist ./build

EXPOSE 3000

CMD ["serve", "-s", "build"]
