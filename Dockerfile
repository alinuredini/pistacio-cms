FROM node:22-alpine AS base
RUN apk add --no-cache build-base gcc autoconf automake zlib-dev libpng-dev nasm bash vips-dev git
WORKDIR /opt/cms

FROM base AS deps
COPY package*.json ./
RUN npm ci --omit=dev --include=optional

FROM base AS build
COPY package*.json ./
RUN npm ci --include=dev --include=optional
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM node:22-alpine AS runtime
RUN apk add --no-cache vips-dev
ENV NODE_ENV=production
WORKDIR /opt/cms
COPY --from=deps /opt/cms/node_modules ./node_modules
COPY --from=build /opt/cms/build ./build
COPY --from=build /opt/cms/dist ./dist
COPY --from=build /opt/cms/config ./config
COPY --from=build /opt/cms/database ./database
COPY --from=build /opt/cms/public ./public
COPY --from=build /opt/cms/src ./src
COPY --from=build /opt/cms/package.json ./
COPY --from=build /opt/cms/tsconfig.json ./
EXPOSE 1337
CMD ["npm", "run", "start"]
