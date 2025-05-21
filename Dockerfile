
ARG NODE_VERSION=23.1.0

FROM node:${NODE_VERSION}-alpine AS development


WORKDIR /usr/src/app

COPY package.json ./

RUN npm i -g corepack@latest
RUN corepack enable && corepack prepare



COPY pnpm-lock.yaml  ./


RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build 


FROM node:${NODE_VERSION}-alpine  AS  production 


ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}


WORKDIR /usr/src/app 

COPY package.json ./

RUN npm i -g corepack@latest
RUN corepack enable && corepack prepare

RUN pnpm install

COPY . .

COPY --from=development /usr/src/app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/main.js"]