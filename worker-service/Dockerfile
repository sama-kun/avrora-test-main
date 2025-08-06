# Stage 1: Build
FROM node:18 as build

WORKDIR /app

# Install NestJS CLI
RUN npm install --global @nestjs/cli

# Install dependencies
COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY package.json yarn.lock ./
RUN yarn install --production

# Install TypeScript and ts-node
RUN yarn add typescript ts-node tsconfig-paths

# Copy build
COPY --from=build /app/dist /app/dist


COPY tsconfig.json ./
COPY ormconfig.ts ./


# Start
CMD sh -c "yarn migration:run && yarn start:prod"