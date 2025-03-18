FROM node:18.19.0
WORKDIR /usr/src/app

# Copier les fichiers de configuration et installer les dépendances
COPY tsconfig.json ./
COPY package*.json ./
RUN npm install -g typescript && npm install

COPY src ./src
RUN npm run build-ts

RUN mkdir -p /usr/src/app/logs
VOLUME /usr/src/app/logs

ENV NODE_ENV=production
ENV NODE_TARGET=container

CMD [ "node", "dist/main.js" ]